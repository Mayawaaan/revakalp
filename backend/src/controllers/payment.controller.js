import crypto from "crypto";
import { razorpay } from "../lib/razorpay.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import Settings from "../models/settings.model.js";
import Order from "../models/order.model.js";
import Coupon from "../models/coupon.model.js";
import WebhookEvent from "../models/webhookEvent.model.js";
import { calculateOrderTotals } from "../services/pricing.service.js";
import {
  reserveOrderItemsAtomic,
  commitReservationByToken,
  releaseReservationById,
} from "../services/inventory.service.js";

/** Constant-time Razorpay checkout signature check */
export function verifyRazorpaySignature({ orderId, paymentId, signature, secret }) {
  if (!orderId || !paymentId || !signature || !secret) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  const expectedBuf = Buffer.from(expected, "utf8");
  const receivedBuf = Buffer.from(String(signature), "utf8");
  if (expectedBuf.length !== receivedBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, receivedBuf);
}

/** Constant-time Razorpay webhook signature check over raw Buffer */
export function verifyWebhookSignature({ rawBody, signature, secret }) {
  if (!rawBody || !signature || !secret) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  const expectedBuf = Buffer.from(expected, "utf8");
  const receivedBuf = Buffer.from(String(signature), "utf8");
  if (expectedBuf.length !== receivedBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, receivedBuf);
}

async function finalizePaidOrder(order, paymentId) {
  if (!order) return null;

  // Idempotent state guard
  if (order.paymentStatus === "verified_success") {
    return order;
  }

  for (const token of order.reservationIds || []) {
    await commitReservationByToken(token, {
      channel: "web",
      orderId: order._id,
      actorId: order.userId,
    });
  }

  if (order.couponCode && !order.couponCounted) {
    await Coupon.updateOne({ code: order.couponCode }, { $inc: { usedCount: 1 } });
    order.couponCounted = true;
  }

  order.paymentStatus = "verified_success";
  order.gatewayPaymentId = paymentId || order.gatewayPaymentId;
  if (order.status === "PendingPayment") {
    order.status = "Confirmed";
    order.statusHistory.push({
      status: "Confirmed",
      timestamp: new Date(),
      note: "Payment verified and inventory committed",
      actor: "gateway",
    });
  }
  await order.save();

  await Cart.findOneAndUpdate(
    { userId: order.userId },
    { items: [], couponCode: "", discountPercentage: 0 }
  );

  return order;
}

export const createOrder = async (req, res) => {
  const reservations = [];
  let createdOrder = null;

  try {
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: "Payment gateway is not configured on the server",
      });
    }

    const userId = req.user._id;
    const { shippingAddress, paymentMethod = "razorpay", notes = "" } = req.body;

    if (!shippingAddress?.street || !shippingAddress?.city || !shippingAddress?.phone) {
      return res.status(400).json({
        success: false,
        message: "Complete shipping address and phone are required",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Your cart is empty" });
    }

    const productIds = cart.items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    const settings = await Settings.getSettings();
    const totals = calculateOrderTotals({
      cartItems: cart.items,
      productMap,
      discountPercentage: cart.discountPercentage || 0,
      settings,
      city: shippingAddress.city,
    });

    if (totals.missingProductIds.length > 0 || totals.lineItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Some items in your cart are no longer available.",
      });
    }

    if (totals.expectedAmountPaise < 100) {
      return res.status(400).json({
        success: false,
        message: "Order total is below the minimum gateway amount.",
      });
    }

    // Reserve stock atomically BEFORE calling gateway
    const held = await reserveOrderItemsAtomic({
      lineItems: totals.lineItems,
      userId,
      channel: "web",
    });
    reservations.push(...held);

    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);
    const orderNumber = `ORD-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;

    createdOrder = await Order.create({
      orderNumber,
      userId,
      items: totals.lineItems.map(({ product: _p, ...rest }) => rest),
      shippingAddress,
      channel: "web",
      paymentMethod,
      paymentStatus: "initiated",
      expectedAmountPaise: totals.expectedAmountPaise,
      currency: "INR",
      couponCode: cart.couponCode || "",
      reservationIds: held.map((r) => r.reservationToken),
      subtotal: totals.subtotal,
      discount: totals.discount,
      deliveryFee: totals.deliveryFee,
      total: totals.total,
      status: "PendingPayment",
      estimatedDelivery,
      notes,
    });

    const rzpOrder = await razorpay.orders.create({
      amount: totals.expectedAmountPaise,
      currency: "INR",
      receipt: orderNumber,
      payment_capture: 1,
      notes: {
        internalOrderId: createdOrder._id.toString(),
        orderNumber,
      },
    });

    createdOrder.gatewayOrderId = rzpOrder.id;
    await createdOrder.save();

    return res.status(200).json({
      success: true,
      order: rzpOrder,
      internalOrderId: createdOrder._id,
      orderNumber,
      expectedTotal: totals.total,
    });
  } catch (error) {
    for (const r of reservations) {
      await releaseReservationById(r.reservationToken, "released", "Gateway order creation failed");
    }
    if (createdOrder) {
      await Order.findByIdAndUpdate(createdOrder._id, {
        status: "Cancelled",
        paymentStatus: "verified_failure",
      }).catch(() => {});
    }

    const statusCode = error.code === "OUT_OF_STOCK" ? 409 : 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to initiate checkout payment order",
      productId: error.productId,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      internalOrderId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification fields",
      });
    }

    const validSig = verifyRazorpaySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      secret: process.env.RAZORPAY_KEY_SECRET,
    });

    if (!validSig) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const orderQuery = { userId: req.user._id };
    if (internalOrderId) orderQuery._id = internalOrderId;
    else orderQuery.gatewayOrderId = razorpay_order_id;

    const order = await Order.findOne(orderQuery);
    if (!order || order.gatewayOrderId !== razorpay_order_id) {
      return res.status(404).json({
        success: false,
        message: "Matching pending order not found",
      });
    }

    // Confirm captured amount and status directly with Razorpay when SDK is active
    if (razorpay?.payments?.fetch) {
      const payment = await razorpay.payments.fetch(razorpay_payment_id);
      if (
        !payment ||
        payment.order_id !== razorpay_order_id ||
        Number(payment.amount) !== Number(order.expectedAmountPaise) ||
        payment.currency !== order.currency ||
        !["captured", "authorized"].includes(payment.status)
      ) {
        return res.status(400).json({
          success: false,
          message: "Gateway payment amount or capture status mismatch",
        });
      }
    }

    const confirmedOrder = await finalizePaidOrder(order, razorpay_payment_id);

    return res.status(200).json({
      success: true,
      message: "Payment verified and order confirmed",
      order: confirmedOrder,
    });
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

export const handleWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const eventId = req.headers["x-razorpay-event-id"] || `fallback_${crypto.randomBytes(8).toString("hex")}`;
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
    const rawBuffer = Buffer.isBuffer(req.body)
      ? req.body
      : Buffer.from(JSON.stringify(req.body || {}), "utf8");

    if (!verifyWebhookSignature({ rawBody: rawBuffer, signature, secret })) {
      return res.status(400).json({ success: false, message: "Invalid webhook signature" });
    }

    const payload = JSON.parse(rawBuffer.toString("utf8"));
    const eventType = payload.event || "unknown";
    const paymentEntity = payload?.payload?.payment?.entity || {};
    const gatewayOrderId = paymentEntity.order_id || "";
    const gatewayPaymentId = paymentEntity.id || "";

    // Deduplicate event IDs
    try {
      await WebhookEvent.create({
        eventId,
        provider: "razorpay",
        eventType,
        gatewayOrderId,
        gatewayPaymentId,
        status: "processed",
      });
    } catch (dupErr) {
      if (dupErr?.code === 11000) {
        return res.status(200).json({ success: true, duplicate: true });
      }
      throw dupErr;
    }

    const order = gatewayOrderId ? await Order.findOne({ gatewayOrderId }) : null;
    if (!order) {
      return res.status(200).json({ success: true, ignored: "Order not found for gatewayOrderId" });
    }

    if (eventType === "payment.captured" || eventType === "order.paid") {
      if (
        Number(paymentEntity.amount) === Number(order.expectedAmountPaise) &&
        (!paymentEntity.currency || paymentEntity.currency === order.currency)
      ) {
        await finalizePaidOrder(order, gatewayPaymentId);
      } else {
        order.notes = `${order.notes || ""}\n[WEBHOOK AMOUNT MISMATCH]`.trim();
        await order.save();
      }
    } else if (eventType === "payment.failed" && order.paymentStatus !== "verified_success") {
      for (const token of order.reservationIds || []) {
        await releaseReservationById(token, "released", "Payment failed webhook");
      }
      order.paymentStatus = "verified_failure";
      order.status = "Cancelled";
      order.statusHistory.push({
        status: "Cancelled",
        timestamp: new Date(),
        note: "Payment failed (gateway webhook)",
        actor: "webhook",
      });
      await order.save();
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return res.status(500).json({ success: false, message: "Webhook error" });
  }
};
