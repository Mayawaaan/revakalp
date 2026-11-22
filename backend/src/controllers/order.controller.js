import mongoose from "mongoose";
import crypto from "crypto";
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import Coupon from "../models/coupon.model.js";
import Settings from "../models/settings.model.js";
import { generateInvoicePDF } from "../lib/invoice.js";
import { calculateOrderTotals } from "../services/pricing.service.js";
import {
  reserveOrderItemsAtomic,
  commitReservationByToken,
  releaseReservationById,
} from "../services/inventory.service.js";

export const ALLOWED_ORDER_TRANSITIONS = {
  PendingPayment: ["Confirmed", "Cancelled"],
  Processing: ["Confirmed", "Preparing", "Cancelled"],
  Confirmed: ["Preparing", "Shipped", "Cancelled"],
  Preparing: ["Shipped", "Cancelled"],
  Shipped: ["Out for Delivery", "Delivered", "Cancelled"],
  "Out for Delivery": ["Delivered", "Cancelled"],
  Delivered: ["Returned"],
  Cancelled: [],
  Returned: [],
};

export function isValidOrderTransition(fromStatus, toStatus) {
  if (!fromStatus || !toStatus) return false;
  if (fromStatus === toStatus) return true;
  const allowed = ALLOWED_ORDER_TRANSITIONS[fromStatus] || [];
  return allowed.includes(toStatus);
}

export const getInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const query =
      req.user.role === "admin" ? { _id: orderId } : { _id: orderId, userId };

    const order = await Order.findOne(query).populate(
      "userId",
      "fullName email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${order._id}.pdf`
    );

    return generateInvoicePDF(order, res);
  } catch (error) {
    console.error("Invoice generation error:", error.message);
    return res.status(500).json({ message: "Error generating invoice" });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching order", error: error.message });
  }
};

export const placeOrder = async (req, res) => {
  const reservations = [];

  try {
    const userId = req.user._id;
    const { shippingAddress, paymentMethod, notes } = req.body;

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({
        message: "shippingAddress and paymentMethod are required",
      });
    }

    const settings = await Settings.getSettings();
    if (paymentMethod === "cod" && !settings?.codEnabled) {
      return res
        .status(400)
        .json({ message: "Cash on Delivery is currently disabled" });
    }

    // Online gateway orders must finalize via server-priced createOrder + verifyPayment
    if (paymentMethod !== "cod") {
      return res.status(400).json({
        message: "Online payments must complete server-verified gateway checkout",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const productIds = cart.items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    const totals = calculateOrderTotals({
      cartItems: cart.items,
      productMap,
      discountPercentage: cart.discountPercentage || 0,
      settings,
      city: shippingAddress.city,
    });

    if (totals.missingProductIds.length > 0) {
      cart.items = cart.items.filter(
        (item) => !totals.missingProductIds.includes(item.productId.toString())
      );
      await cart.save();
      return res.status(400).json({
        message:
          "Some items in your cart are no longer available and have been removed.",
      });
    }

    // Atomic conditional stock hold across concurrent buyers and boutique POS
    const held = await reserveOrderItemsAtomic({
      lineItems: totals.lineItems,
      userId,
      channel: "web",
    });
    reservations.push(...held);

    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);
    const orderNumber = `ORD-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;

    const order = await Order.create({
      orderNumber,
      userId,
      items: totals.lineItems.map(({ product: _p, ...rest }) => rest),
      shippingAddress,
      channel: "web",
      paymentMethod: "cod",
      paymentStatus: "cod_confirmed",
      expectedAmountPaise: totals.expectedAmountPaise,
      currency: "INR",
      couponCode: cart.couponCode || "",
      couponCounted: Boolean(cart.couponCode),
      reservationIds: held.map((r) => r.reservationToken),
      subtotal: totals.subtotal,
      discount: totals.discount,
      deliveryFee: totals.deliveryFee,
      total: totals.total,
      status: "Processing",
      estimatedDelivery,
      notes: notes || "",
      statusHistory: [
        {
          status: "Processing",
          timestamp: new Date(),
          note: "COD order confirmed and stock allocated",
          actor: String(userId),
        },
      ],
    });

    for (const r of held) {
      await commitReservationByToken(r.reservationToken, {
        channel: "web",
        orderId: order._id,
        actorId: userId,
      });
    }

    if (cart.couponCode) {
      await Coupon.updateOne({ code: cart.couponCode }, { $inc: { usedCount: 1 } });
    }

    cart.items = [];
    cart.couponCode = "";
    cart.discountPercentage = 0;
    await cart.save();

    return res.status(201).json(order);
  } catch (error) {
    for (const r of reservations) {
      await releaseReservationById(
        r.reservationToken,
        "released",
        "COD order creation failed"
      );
    }
    const code = error.code === "OUT_OF_STOCK" ? 409 : 400;
    return res.status(code).json({
      message: error.message || "Error placing order",
      productId: error.productId,
    });
  }
};

export const reorderItems = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    order.items.forEach((orderItem) => {
      const existingItem = cart.items.find(
        (item) =>
          item.productId.toString() === orderItem.productId.toString() &&
          item.size === orderItem.size
      );

      if (existingItem) {
        existingItem.quantity += orderItem.quantity;
      } else {
        cart.items.push({
          productId: orderItem.productId,
          size: orderItem.size,
          quantity: orderItem.quantity,
        });
      }
    });

    await cart.save();
    await cart.populate("items.productId");

    return res.status(200).json({ message: "Items added to cart", cart });
  } catch (error) {
    console.error("Error reordering items:", error.message);
    return res.status(500).json({ message: "Error reordering items" });
  }
};

export const adminGetAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("userId", "fullName email")
      .populate("items.productId", "name image")
      .sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error.message);
    return res.status(500).json({ message: "Error fetching orders" });
  }
};

export const adminUpdateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber, carrier, note } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!isValidOrderTransition(order.status, status)) {
      return res.status(400).json({
        message: `Invalid status transition from ${order.status} to ${status}`,
      });
    }

    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Status changed to ${status}`,
      actor: String(req.user?._id || "admin"),
    });

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (carrier) order.carrier = carrier;

    if (status === "Shipped" && !order.estimatedDelivery) {
      const estimatedDelivery = new Date();
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);
      order.estimatedDelivery = estimatedDelivery;
    }

    await order.save();
    return res.status(200).json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    return res
      .status(500)
      .json({ message: "Error updating order status", error: error.message });
  }
};

export const trackOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(orderId)
      .populate("userId", "email fullName")
      .populate("items.productId", "name image");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const ownerId = order.userId?._id || order.userId;
    const isOwner = ownerId && ownerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    return res.status(200).json({
      orderId: order._id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      trackingNumber: order.trackingNumber,
      carrier: order.carrier,
      estimatedDelivery: order.estimatedDelivery,
      statusHistory: order.statusHistory,
      shippingAddress: order.shippingAddress,
      items: order.items,
      total: order.total,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    });
  } catch (error) {
    console.error("Error tracking order:", error);
    return res
      .status(500)
      .json({ message: "Error tracking order", error: error.message });
  }
};
