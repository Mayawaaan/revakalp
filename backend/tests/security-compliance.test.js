import test, { describe } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";

import {
  SAFE_USER_PROJECTION,
  generateSecureOtp,
  isValidEmail,
  normalizeEmail,
  parseAllowedOrigins,
  timingSafeEqualHex,
  validatePasswordStrength,
} from "../src/lib/security.js";
import { protectAdminRoute } from "../src/middlewares/admin.middleware.js";
import { submitGrievance } from "../src/controllers/compliance.controller.js";
import Grievance from "../src/models/grievance.model.js";

function createMockRes() {
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
  return res;
}

describe("Security helper utilities", () => {
  test("normalizeEmail and isValidEmail trim, lowercase, and validate formats", () => {
    assert.equal(normalizeEmail("  Customer@Revakalp.COM "), "customer@revakalp.com");
    assert.equal(isValidEmail("customer@revakalp.com"), true);
    assert.equal(isValidEmail("bad-email"), false);
    assert.equal(isValidEmail("missing@tld"), false);
    assert.equal(isValidEmail(""), false);
  });

  test("validatePasswordStrength requires >= 8 chars with letter and digit", () => {
    assert.equal(validatePasswordStrength("Abc12").valid, false);
    assert.equal(validatePasswordStrength("onlyletters").valid, false);
    assert.equal(validatePasswordStrength("12345678").valid, false);
    assert.equal(validatePasswordStrength("Revakalp2026").valid, true);
  });

  test("generateSecureOtp produces 6-digit numeric strings", () => {
    for (let i = 0; i < 10; i++) {
      const otp = generateSecureOtp();
      assert.match(otp, /^\d{6}$/);
      assert.ok(Number(otp) >= 100000 && Number(otp) <= 999999);
    }
  });

  test("timingSafeEqualHex verifies equal digests and rejects tampered or mismatched lengths", () => {
    const hash = crypto.createHash("sha256").update("123456").digest("hex");
    assert.equal(timingSafeEqualHex(hash, hash), true);
    assert.equal(
      timingSafeEqualHex(hash, `${hash.slice(0, -1)}${hash.endsWith("0") ? "1" : "0"}`),
      false
    );
    assert.equal(timingSafeEqualHex(hash, hash.slice(0, -2)), false);
    assert.equal(timingSafeEqualHex("", hash), false);
  });

  test("parseAllowedOrigins splits comma-separated origins cleanly", () => {
    assert.deepEqual(
      parseAllowedOrigins(" https://revakalp.com , , http://localhost:5173 "),
      ["https://revakalp.com", "http://localhost:5173"]
    );
    assert.deepEqual(parseAllowedOrigins(""), []);
  });

  test("SAFE_USER_PROJECTION excludes sensitive credentials and OTP fields", () => {
    for (const field of ["password", "refreshTokens", "resetOTP", "otpExpire", "otpAttempts"]) {
      assert.ok(SAFE_USER_PROJECTION.includes(`-${field}`), `Expected -${field} in projection`);
    }
  });
});

describe("Admin authorization middleware", () => {
  test("returns 401 when unauthenticated, 403 for standard user, and calls next for admin", () => {
    let nextCalled = false;
    const resUnauth = createMockRes();
    protectAdminRoute({}, resUnauth, () => {
      nextCalled = true;
    });
    assert.equal(resUnauth.statusCode, 401);
    assert.equal(nextCalled, false);

    const resUser = createMockRes();
    protectAdminRoute({ user: { role: "user" } }, resUser, () => {
      nextCalled = true;
    });
    assert.equal(resUser.statusCode, 403);
    assert.equal(nextCalled, false);

    const resAdmin = createMockRes();
    protectAdminRoute({ user: { role: "admin" } }, resAdmin, () => {
      nextCalled = true;
    });
    assert.equal(nextCalled, true);
  });
});

describe("Grievance redressal controller compliance", () => {
  test("rejects missing required fields or invalid email with 400", async () => {
    const resMissing = createMockRes();
    await submitGrievance({ body: { fullName: "Asha" } }, resMissing);
    assert.equal(resMissing.statusCode, 400);
    assert.equal(resMissing.body.success, false);

    const resInvalidEmail = createMockRes();
    await submitGrievance(
      {
        body: {
          fullName: "Asha",
          email: "invalid-email",
          subject: "Order help",
          description: "Need tracking update",
        },
      },
      resInvalidEmail
    );
    assert.equal(resInvalidEmail.statusCode, 400);
    assert.equal(resInvalidEmail.body.success, false);
  });

  test("logs grievance and returns GRV-YYYYMMDD-XXXX ticket with 48h/30d statutory SLAs", async (t) => {
    const saved = [];
    t.mock.method(Grievance, "create", async (payload) => {
      saved.push(payload);
      return { ...payload };
    });

    const res = createMockRes();
    await submitGrievance(
      {
        body: {
          fullName: "Priya Sharma",
          email: "Priya@Example.com ",
          phone: "9876543210",
          orderNumber: "ORD-12345",
          category: "return_refund",
          subject: "Return pickup inquiry",
          description: "Requesting status update for saree return.",
        },
      },
      res
    );

    assert.equal(res.statusCode, 201);
    assert.equal(res.body.success, true);
    assert.match(res.body.ticketId, /^GRV-\d{8}-[0-9A-F]{4}$/);
    assert.equal(res.body.sla.acknowledgmentHours, 48);
    assert.equal(res.body.sla.resolutionDays, 30);
    assert.equal(saved.length, 1);
    assert.equal(saved[0].email, "priya@example.com");
  });
});
