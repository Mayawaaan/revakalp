import crypto from "crypto";
import Order from "../../models/order.model.js";
import Product from "../../models/product.model.js";
import InventoryMovement from "../../models/inventoryMovement.model.js";
import { isValidOrderTransition } from "../order.controller.js";
import { releaseReservationById } from "../../services/inventory.service.js";

const VALID_STATUSES = [
  "PendingPayment",
  "Processing",
  "Confirmed",
  "Preparing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
  "Returned",
];

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate("userId", "fullName email")
      .populate("items.productId", "name image");
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error in getAllOrders:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "fullName email")
      .populate("items.productId", "name image");

    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.status(200).json(order);
  } catch (error) {
    console.error("Error in getOrderById:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note, trackingNumber, carrier } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
      });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!isValidOrderTransition(order.status, status)) {
      return res.status(400).json({
        message: `Transition from ${order.status} to ${status} is not allowed`,
      });
    }

    if (status === "Cancelled") {
      for (const token of order.reservationIds || []) {
        await releaseReservationById(token, "released", "Order cancelled by admin");
      }
    }

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (carrier) order.carrier = carrier;

    order.statusHistory = [
      ...(order.statusHistory || []),
      {
        status,
        timestamp: new Date(),
        note: note || `Status changed to ${status}`,
        actor: String(req.user?._id || "admin"),
      },
    ];

    await order.save();

    const updated = await Order.findById(id)
      .populate("userId", "fullName email")
      .populate("items.productId", "name image");

    return res.status(200).json(updated);
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Separates financial return/refund from inventory restocking: stock increases ONLY
 * when admin records inspectionStatus === 'approved_restock' and order was not yet restocked.
 */
export const recordReturnDecision = async (req, res) => {
  try {
    const { id } = req.params;
    const { decision, reason = "" } = req.body;

    if (!["approved_restock", "approved_damaged", "rejected"].includes(decision)) {
      return res.status(400).json({ message: "Invalid return inspection decision" });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const alreadyRestocked = Boolean(order.returnRequest?.restocked);

    if (decision === "approved_restock" && !alreadyRestocked) {
      for (const item of order.items || []) {
        const qty = Math.max(1, Number(item.quantity) || 1);
        const updated = await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: qty } },
          { new: true }
        );
        if (updated) {
          await InventoryMovement.create({
            productId: updated._id,
            productCode: updated.code || "",
            type: "return_restock",
            quantityDeltaOnHand: qty,
            quantityDeltaReserved: 0,
            channel: "admin",
            referenceId: order.orderNumber || String(order._id),
            actorId: String(req.user?._id || "admin"),
            reason: reason || "Return inspection passed for resale",
            idempotencyKey: `ret:${order._id}:${updated._id}`,
          }).catch(() => {});
        }
      }
      order.returnRequest = {
        requested: true,
        reason: reason || order.returnRequest?.reason || "",
        inspectionStatus: "approved_restock",
        inspectedBy: String(req.user?._id || "admin"),
        inspectedAt: new Date(),
        restocked: true,
      };
      order.status = "Returned";
    } else if (decision === "approved_damaged") {
      for (const item of order.items || []) {
        await InventoryMovement.create({
          productId: item.productId,
          type: "damage_writeoff",
          quantityDeltaOnHand: 0,
          quantityDeltaReserved: 0,
          channel: "admin",
          referenceId: order.orderNumber || String(order._id),
          actorId: String(req.user?._id || "admin"),
          reason: reason || "Returned piece marked damaged; not restocked",
          idempotencyKey: `dmg:${order._id}:${item.productId}:${crypto.randomBytes(3).toString("hex")}`,
        }).catch(() => {});
      }
      order.returnRequest = {
        requested: true,
        reason: reason || order.returnRequest?.reason || "",
        inspectionStatus: "approved_damaged",
        inspectedBy: String(req.user?._id || "admin"),
        inspectedAt: new Date(),
        restocked: false,
      };
      order.status = "Returned";
    } else {
      order.returnRequest = {
        requested: true,
        reason: reason || order.returnRequest?.reason || "",
        inspectionStatus: "rejected",
        inspectedBy: String(req.user?._id || "admin"),
        inspectedAt: new Date(),
        restocked: alreadyRestocked,
      };
    }

    order.statusHistory.push({
      status: order.status,
      timestamp: new Date(),
      note: `Return inspection: ${decision}${reason ? ` (${reason})` : ""}`,
      actor: String(req.user?._id || "admin"),
    });

    await order.save();
    return res.status(200).json(order);
  } catch (error) {
    console.error("recordReturnDecision error:", error);
    return res.status(500).json({ message: "Failed to process return decision" });
  }
};
