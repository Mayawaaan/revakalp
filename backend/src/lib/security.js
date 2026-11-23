import crypto from "crypto";

export const SAFE_USER_PROJECTION =
  "-password -refreshTokens -resetOTP -otpExpire -otpAttempts";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value) {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  return trimmed.length <= 254 && EMAIL_RE.test(trimmed);
}

export function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

export function validatePasswordStrength(password) {
  if (typeof password !== "string") {
    return { valid: false, message: "Password is required" };
  }
  if (password.length < 8) {
    return {
      valid: false,
      message: "Password must be at least 8 characters long",
    };
  }
  if (password.length > 128) {
    return {
      valid: false,
      message: "Password must not exceed 128 characters",
    };
  }
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return {
      valid: false,
      message: "Password must include at least one letter and one number",
    };
  }
  return { valid: true };
}

export function generateSecureOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

export function timingSafeEqualHex(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (!a || a.length !== b.length) return false;
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

const DEFAULT_ALLOWED_ORIGINS = [
  "https://revakalp.vercel.app",
  "https://revakalp.com",
  "https://www.revakalp.com",
  "http://localhost:5173",
  "https://localhost:5173",
  "http://127.0.0.1:5173",
];

const VERCEL_PREVIEW_RE = /^https:\/\/revakalp(?:-[a-z0-9-]+)?\.vercel\.app$/i;

export function normalizeOrigin(value) {
  return String(value || "")
    .trim()
    .replace(/^['"]+|['"]+$/g, "")
    .replace(/\/+$/, "");
}

export function parseAllowedOrigins(...rawSources) {
  const combined = [
    ...DEFAULT_ALLOWED_ORIGINS,
    ...rawSources.flatMap((raw) => String(raw || "").split(",")),
  ]
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);

  return Array.from(new Set(combined));
}

export function isAllowedOrigin(origin, allowedOrigins = []) {
  const normalized = normalizeOrigin(origin);
  if (!normalized) return false;
  if (allowedOrigins.includes(normalized)) return true;
  if (VERCEL_PREVIEW_RE.test(normalized)) return true;
  return false;
}
