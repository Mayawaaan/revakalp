import test, { describe } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";

import Product from "../src/models/product.model.js";
import StockReservation from "../src/models/stockReservation.model.js";
import InventoryMovement from "../src/models/inventoryMovement.model.js";
import {
  getEffectiveUnitPrice,
  calculateOrderTotals,
} from "../src/services/pricing.service.js";
import {
  getAvailableStock,
  reserveOrderItemsAtomic,
  commitReservationByToken,
  releaseExpiredReservations,
  recordPosSaleAtomic,
} from "../src/services/inventory.service.js";
import {
  verifyRazorpaySignature,
  verifyWebhookSignature,
} from "../src/controllers/payment.controller.js";
import {
  ALLOWED_ORDER_TRANSITIONS,
  isValidOrderTransition,
} from "../src/controllers/order.controller.js";

/**
 * Stateful single-document atomic simulator backed by node:test mocks so
 * concurrency, rollback, TTL expiry, and idempotency paths in inventory.service.js
 * execute end-to-end without requiring a live MongoDB server.
 */
function setupAtomicInventoryMocks(t, initialProducts) {
  const products = new Map(
    initialProducts.map((p) => [String(p._id), { ...p }])
  );
  const reservations = [];
  const movements = [];

  t.mock.method(Product, "findById", async (id) => {
    const doc = products.get(String(id));
    return doc ? { ...doc } : null;
  });

  t.mock.method(Product, "findOneAndUpdate", async (filter, update) => {
    const id = String(filter._id);
    const doc = products.get(id);
    if (!doc) return null;

    // Evaluate atomic availability expression: stock - reserved >= qty
    if (filter.$expr?.$gte) {
      const qtyRequired = Number(filter.$expr.$gte[1]) || 0;
      const available = (Number(doc.stock) || 0) - (Number(doc.reserved) || 0);
      if (available < qtyRequired) return null;
    }

    if (filter.stock?.$gte !== undefined && doc.stock < filter.stock.$gte) {
      return null;
    }
    if (
      filter.reserved?.$gte !== undefined &&
      doc.reserved < filter.reserved.$gte
    ) {
      return null;
    }

    if (update.$inc) {
      for (const [field, delta] of Object.entries(update.$inc)) {
        doc[field] = (Number(doc[field]) || 0) + Number(delta);
      }
    }

    return { ...doc };
  });

  t.mock.method(StockReservation, "find", async (filter = {}) => {
    const matches = reservations.filter((r) => {
      if (filter.state && r.state !== filter.state) return false;
      if (filter.productId && String(r.productId) !== String(filter.productId)) {
        return false;
      }
      if (filter.expiresAt?.$lt && !(r.expiresAt < filter.expiresAt.$lt)) {
        return false;
      }
      return true;
    });
    return matches.map((r) => ({ ...r }));
  });

  t.mock.method(StockReservation, "create", async (payload) => {
    const record = { ...payload };
    reservations.push(record);
    return { ...record };
  });

  t.mock.method(StockReservation, "findOneAndUpdate", async (filter, update) => {
    const idx = reservations.findIndex(
      (r) =>
        (!filter.reservationToken ||
          r.reservationToken === filter.reservationToken) &&
        (!filter.state || r.state === filter.state)
    );
    if (idx === -1) return null;

    if (update.$set) {
      Object.assign(reservations[idx], update.$set);
    }
    return { ...reservations[idx] };
  });

  t.mock.method(InventoryMovement, "findOne", async (filter) => {
    const found = movements.find(
      (m) =>
        !filter.idempotencyKey || m.idempotencyKey === filter.idempotencyKey
    );
    return found ? { ...found } : null;
  });

  t.mock.method(InventoryMovement, "create", async (payload) => {
    const record = { ...payload };
    movements.push(record);
    return { ...record };
  });

  t.mock.method(
    InventoryMovement,
    "findOneAndUpdate",
    async (filter, update) => {
      const existing = movements.find(
        (m) =>
          !filter.idempotencyKey || m.idempotencyKey === filter.idempotencyKey
      );
      if (existing) return { ...existing };

      if (update.$setOnInsert) {
        const record = { ...update.$setOnInsert };
        movements.push(record);
        return { ...record };
      }
      return null;
    }
  );

  return { products, reservations, movements };
}

describe("Server-authoritative pricing & delivery rules", () => {
  test("prefers explicit discountedPrice over base price and applies coupon + Indore waiver", () => {
    const prod = {
      _id: "p1",
      name: "Maheshwari Silk Saree",
      price: 12000,
      discountedPrice: 9500,
      discount: 50, // discountedPrice takes precedence
    };
    assert.equal(getEffectiveUnitPrice(prod), 9500);

    const productMap = new Map([["p1", prod]]);
    const indoreTotals = calculateOrderTotals({
      cartItems: [{ productId: "p1", quantity: 1, size: "NO_SIZE", clientPrice: 1 }],
      productMap,
      discountPercentage: 10,
      settings: { freeShippingThreshold: 15000, deliveryFee: 250 },
      city: "Indore",
    });

    assert.equal(indoreTotals.subtotal, 9500);
    assert.equal(indoreTotals.couponDiscount, 950);
    assert.equal(indoreTotals.deliveryFee, 0);
    assert.equal(indoreTotals.total, 8550);
    assert.equal(indoreTotals.expectedAmountPaise, 855000);
    assert.equal(indoreTotals.currency, "INR");

    const nonIndoreTotals = calculateOrderTotals({
      cartItems: [{ productId: "p1", quantity: 1 }],
      productMap,
      discountPercentage: 10,
      settings: { freeShippingThreshold: 15000, deliveryFee: 250 },
      city: "Mumbai",
    });
    assert.equal(nonIndoreTotals.deliveryFee, 250);
    assert.equal(nonIndoreTotals.total, 8800);
  });

  test("applies percentage discount fallback and flags missing products", () => {
    const prod = { _id: "p2", name: "Bandhej Kurta", price: 4000, discount: 15 };
    assert.equal(getEffectiveUnitPrice(prod), 3400);

    const totals = calculateOrderTotals({
      cartItems: [
        { productId: "p2", quantity: 2 },
        { productId: "missing-id", quantity: 1 },
      ],
      productMap: new Map([["p2", prod]]),
      settings: { freeShippingThreshold: 10000, deliveryFee: 150 },
      city: "Bhopal",
    });

    assert.deepEqual(totals.missingProductIds, ["missing-id"]);
    assert.equal(totals.subtotal, 6800);
    assert.equal(totals.deliveryFee, 150);
    assert.equal(totals.total, 6950);
  });
});

describe("Razorpay constant-time signature & webhook verification", () => {
  test("verifies valid checkout HMAC-SHA256 signature and rejects tampered payloads", () => {
    const secret = "rzp_test_secret_123";
    const orderId = "order_Revakalp001";
    const paymentId = "pay_Revakalp999";
    const validSig = crypto
      .createHmac("sha256", secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    assert.equal(
      verifyRazorpaySignature({ orderId, paymentId, signature: validSig, secret }),
      true
    );
    assert.equal(
      verifyRazorpaySignature({
        orderId: "order_Tampered",
        paymentId,
        signature: validSig,
        secret,
      }),
      false
    );
    assert.equal(
      verifyRazorpaySignature({
        orderId,
        paymentId,
        signature: validSig.slice(0, -1),
        secret,
      }),
      false
    );
    assert.equal(
      verifyRazorpaySignature({ orderId, paymentId, signature: validSig, secret: "" }),
      false
    );
  });

  test("verifies raw Buffer webhook HMAC-SHA256 and rejects altered Buffer", () => {
    const secret = "whsec_revakalp_456";
    const rawBody = Buffer.from(
      JSON.stringify({ event: "payment.captured", payload: { payment: { entity: { id: "pay_1", amount: 855000 } } } }),
      "utf8"
    );
    const validSig = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

    assert.equal(verifyWebhookSignature({ rawBody, signature: validSig, secret }), true);

    const tamperedBody = Buffer.from(rawBody.toString("utf8").replace("855000", "100"), "utf8");
    assert.equal(
      verifyWebhookSignature({ rawBody: tamperedBody, signature: validSig, secret }),
      false
    );
  });
});

describe("Order lifecycle state-machine guards", () => {
  test("permits valid forward transitions and blocks invalid/backward jumps", () => {
    assert.equal(isValidOrderTransition("PendingPayment", "Confirmed"), true);
    assert.equal(isValidOrderTransition("Confirmed", "Preparing"), true);
    assert.equal(isValidOrderTransition("Delivered", "Returned"), true);
    assert.equal(isValidOrderTransition("Confirmed", "Confirmed"), true);

    assert.equal(isValidOrderTransition("Delivered", "PendingPayment"), false);
    assert.equal(isValidOrderTransition("Cancelled", "Confirmed"), false);
    assert.equal(isValidOrderTransition("Returned", "Delivered"), false);
    assert.equal(isValidOrderTransition("UnknownState", "Confirmed"), false);
    assert.ok(Array.isArray(ALLOWED_ORDER_TRANSITIONS.PendingPayment));
  });
});

describe("Quantity-one omnichannel stock concurrency & ledger safety", () => {
  test("prevents double-selling when two web checkouts and boutique POS race for 1 piece", async (t) => {
    const state = setupAtomicInventoryMocks(t, [
      { _id: "sku-single-1", code: "RK-001", name: "Bridal Zardozi Lehenga", stock: 1, reserved: 0 },
    ]);

    assert.equal(getAvailableStock(state.products.get("sku-single-1")), 1);

    const outcomes = await Promise.allSettled([
      reserveOrderItemsAtomic({
        lineItems: [{ productId: "sku-single-1", name: "Bridal Zardozi Lehenga", quantity: 1 }],
        userId: "buyer-a",
        channel: "web",
      }),
      reserveOrderItemsAtomic({
        lineItems: [{ productId: "sku-single-1", name: "Bridal Zardozi Lehenga", quantity: 1 }],
        userId: "buyer-b",
        channel: "web",
      }),
      recordPosSaleAtomic({
        productId: "sku-single-1",
        quantity: 1,
        actorId: "indore-cashier",
        idempotencyKey: "pos-race-1",
      }),
    ]);

    const succeeded = outcomes.filter((o) => o.status === "fulfilled");
    const rejected = outcomes.filter((o) => o.status === "rejected");

    assert.equal(succeeded.length, 1);
    assert.equal(rejected.length, 2);
    for (const r of rejected) {
      assert.equal(r.reason.code, "OUT_OF_STOCK");
    }

    const updatedSku = state.products.get("sku-single-1");
    assert.equal(getAvailableStock(updatedSku), 0);
    assert.ok(updatedSku.stock - updatedSku.reserved >= 0);
  });

  test("rolls back held line item if a subsequent line item in the cart is out of stock", async (t) => {
    const state = setupAtomicInventoryMocks(t, [
      { _id: "sku-a", code: "RK-A", name: "Chanderi Saree", stock: 1, reserved: 0 },
      { _id: "sku-b", code: "RK-B", name: "Paithani Silk", stock: 0, reserved: 0 },
    ]);

    await assert.rejects(
      () =>
        reserveOrderItemsAtomic({
          lineItems: [
            { productId: "sku-a", name: "Chanderi Saree", quantity: 1 },
            { productId: "sku-b", name: "Paithani Silk", quantity: 1 },
          ],
          userId: "buyer-c",
          channel: "web",
        }),
      { code: "OUT_OF_STOCK" }
    );

    const skuA = state.products.get("sku-a");
    assert.equal(skuA.stock, 1);
    assert.equal(skuA.reserved, 0);
    assert.equal(getAvailableStock(skuA), 1);
  });

  test("commits reservation idempotently once across duplicate callback and webhook delivery", async (t) => {
    const state = setupAtomicInventoryMocks(t, [
      { _id: "sku-kosa", code: "RK-K", name: "Kosa Drape", stock: 1, reserved: 0 },
    ]);

    const [reservation] = await reserveOrderItemsAtomic({
      lineItems: [{ productId: "sku-kosa", name: "Kosa Drape", quantity: 1 }],
      userId: "buyer-d",
      channel: "web",
    });

    const firstCommit = await commitReservationByToken(reservation.reservationToken, {
      channel: "web",
      orderId: "ord-100",
      actorId: "buyer-d",
    });
    const duplicateWebhookCommit = await commitReservationByToken(
      reservation.reservationToken,
      { channel: "web", orderId: "ord-100", actorId: "webhook" }
    );

    assert.equal(firstCommit.alreadyTerminal, false);
    assert.equal(duplicateWebhookCommit.alreadyTerminal, true);

    const finalProd = state.products.get("sku-kosa");
    assert.equal(finalProd.stock, 0);
    assert.equal(finalProd.reserved, 0);
    assert.equal(getAvailableStock(finalProd), 0);
  });

  test("releases expired holds on TTL timeout and deduplicates Boutique POS retries", async (t) => {
    const state = setupAtomicInventoryMocks(t, [
      { _id: "sku-pos", code: "RK-P", name: "Jodhpuri Suit", stock: 2, reserved: 1 },
    ]);
    state.reservations.push({
      reservationToken: "rsv_expired_test",
      productId: "sku-pos",
      userId: "abandoned-user",
      quantity: 1,
      channel: "web",
      state: "active",
      expiresAt: new Date(Date.now() - 60_000),
    });

    const releasedCount = await releaseExpiredReservations("sku-pos");
    assert.equal(releasedCount, 1);
    assert.equal(getAvailableStock(state.products.get("sku-pos")), 2);

    const lateCommit = await commitReservationByToken("rsv_expired_test");
    assert.equal(lateCommit.alreadyTerminal, true);

    const pos1 = await recordPosSaleAtomic({
      productId: "sku-pos",
      quantity: 1,
      actorId: "cashier-1",
      idempotencyKey: "pos-key-unique-42",
    });
    const posRetry = await recordPosSaleAtomic({
      productId: "sku-pos",
      quantity: 1,
      actorId: "cashier-1",
      idempotencyKey: "pos-key-unique-42",
    });

    assert.equal(pos1.duplicate, false);
    assert.equal(posRetry.duplicate, true);
    assert.equal(state.products.get("sku-pos").stock, 1);
  });
});
