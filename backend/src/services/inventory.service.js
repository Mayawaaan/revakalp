import crypto from "crypto";
import Product from "../models/product.model.js";
import StockReservation from "../models/stockReservation.model.js";
import InventoryMovement from "../models/inventoryMovement.model.js";

const RESERVATION_TTL_MS = 15 * 60 * 1000;

export function getAvailableStock(product) {
  const onHand = Math.max(0, Number(product?.stock) || 0);
  const reserved = Math.max(0, Number(product?.reserved) || 0);
  return Math.max(0, onHand - reserved);
}

/**
 * Releases expired active reservations idempotently so held last-piece items
 * become available again when payment is abandoned.
 */
export async function releaseExpiredReservations(productId = null) {
  const filter = {
    state: "active",
    expiresAt: { $lt: new Date() },
  };
  if (productId) filter.productId = productId;

  const expired = await StockReservation.find(filter);
  for (const resv of expired) {
    await releaseReservationById(resv.reservationToken, "expired", "Reservation TTL expired");
  }
  return expired.length;
}

/**
 * Atomically reserves one or more line items using conditional updates
 * (`stock - reserved >= qty`). Rolls back earlier lines if any item lacks stock.
 */
export async function reserveOrderItemsAtomic({
  lineItems,
  userId,
  orderId = null,
  channel = "web",
}) {
  const createdReservations = [];

  try {
    for (const line of lineItems) {
      await releaseExpiredReservations(line.productId);

      const qty = Math.max(1, Number(line.quantity) || 1);
      const updated = await Product.findOneAndUpdate(
        {
          _id: line.productId,
          $expr: {
            $gte: [
              { $subtract: ["$stock", { $ifNull: ["$reserved", 0] }] },
              qty,
            ],
          },
        },
        { $inc: { reserved: qty } },
        { new: true }
      );

      if (!updated) {
        const err = new Error(`"${line.name || "Selected piece"}" is no longer available in requested quantity.`);
        err.code = "OUT_OF_STOCK";
        err.productId = line.productId;
        throw err;
      }

      const reservationToken = `rsv_${crypto.randomBytes(10).toString("hex")}`;
      const expiresAt = new Date(Date.now() + RESERVATION_TTL_MS);

      const reservation = await StockReservation.create({
        reservationToken,
        productId: line.productId,
        userId,
        orderId,
        size: line.size || "NO_SIZE",
        quantity: qty,
        channel,
        state: "active",
        expiresAt,
      });

      await InventoryMovement.create({
        productId: line.productId,
        productCode: updated.code || "",
        type: "reserve",
        quantityDeltaOnHand: 0,
        quantityDeltaReserved: qty,
        channel,
        referenceId: reservationToken,
        actorId: String(userId || ""),
        reason: "Checkout stock hold",
        idempotencyKey: `reserve:${reservationToken}`,
      });

      createdReservations.push(reservation);
    }

    return createdReservations;
  } catch (error) {
    for (const r of createdReservations) {
      await releaseReservationById(r.reservationToken, "released", "Rolled back failed multi-line hold");
    }
    throw error;
  }
}

/**
 * Commits an active reservation idempotently: decrements both `stock` and `reserved`
 * exactly once regardless of retries or duplicate webhook/callback delivery.
 */
export async function commitReservationByToken(
  reservationToken,
  { channel = "web", orderId = "", actorId = "system" } = {}
) {
  const resv = await StockReservation.findOneAndUpdate(
    { reservationToken, state: "active" },
    { $set: { state: "committed", orderId: orderId || undefined } },
    { new: true }
  );

  if (!resv) {
    return { alreadyTerminal: true };
  }

  const qty = Math.max(1, Number(resv.quantity) || 1);
  const updated = await Product.findOneAndUpdate(
    { _id: resv.productId, stock: { $gte: qty }, reserved: { $gte: qty } },
    { $inc: { stock: -qty, reserved: -qty } },
    { new: true }
  );

  await InventoryMovement.findOneAndUpdate(
    { idempotencyKey: `commit:${reservationToken}` },
    {
      $setOnInsert: {
        productId: resv.productId,
        productCode: updated?.code || "",
        type: channel === "pos" ? "commit_pos" : "commit_web",
        quantityDeltaOnHand: -qty,
        quantityDeltaReserved: -qty,
        channel,
        referenceId: String(orderId || reservationToken),
        actorId: String(actorId),
        reason: "Order stock commit",
        idempotencyKey: `commit:${reservationToken}`,
      },
    },
    { upsert: true }
  );

  return { alreadyTerminal: false, reservation: resv, product: updated };
}

export async function releaseReservationById(
  reservationToken,
  targetState = "released",
  reason = "Reservation released"
) {
  const resv = await StockReservation.findOneAndUpdate(
    { reservationToken, state: "active" },
    { $set: { state: targetState === "expired" ? "expired" : "released" } },
    { new: true }
  );

  if (!resv) return { alreadyTerminal: true };

  const qty = Math.max(1, Number(resv.quantity) || 1);
  const updated = await Product.findOneAndUpdate(
    { _id: resv.productId, reserved: { $gte: qty } },
    { $inc: { reserved: -qty } },
    { new: true }
  );

  await InventoryMovement.findOneAndUpdate(
    { idempotencyKey: `release:${reservationToken}` },
    {
      $setOnInsert: {
        productId: resv.productId,
        productCode: updated?.code || "",
        type: "release",
        quantityDeltaOnHand: 0,
        quantityDeltaReserved: -qty,
        channel: resv.channel || "web",
        referenceId: reservationToken,
        actorId: "system",
        reason,
        idempotencyKey: `release:${reservationToken}`,
      },
    },
    { upsert: true }
  );

  return { alreadyTerminal: false, reservation: resv };
}

/**
 * Boutique POS direct atomic decrement sharing central stock pool with web orders.
 */
export async function recordPosSaleAtomic({
  productId,
  quantity = 1,
  actorId,
  referenceId,
  reason = "Physical boutique sale",
  idempotencyKey,
}) {
  await releaseExpiredReservations(productId);
  const qty = Math.max(1, Number(quantity) || 1);

  if (idempotencyKey) {
    const existing = await InventoryMovement.findOne({ idempotencyKey });
    if (existing) {
      const current = await Product.findById(productId);
      return { duplicate: true, product: current, movement: existing };
    }
  }

  const updated = await Product.findOneAndUpdate(
    {
      _id: productId,
      $expr: {
        $gte: [
          { $subtract: ["$stock", { $ifNull: ["$reserved", 0] }] },
          qty,
        ],
      },
    },
    { $inc: { stock: -qty } },
    { new: true }
  );

  if (!updated) {
    const err = new Error("Insufficient available stock (units may be reserved or sold out).");
    err.code = "OUT_OF_STOCK";
    throw err;
  }

  const movement = await InventoryMovement.create({
    productId,
    productCode: updated.code || "",
    type: "commit_pos",
    quantityDeltaOnHand: -qty,
    quantityDeltaReserved: 0,
    channel: "pos",
    referenceId: referenceId || `POS-${Date.now()}`,
    actorId: String(actorId || "staff"),
    reason,
    idempotencyKey: idempotencyKey || `pos:${productId}:${Date.now()}:${crypto.randomBytes(4).toString("hex")}`,
  });

  return { duplicate: false, product: updated, movement };
}
