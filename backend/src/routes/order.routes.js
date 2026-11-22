import express from "express";
import {
  getUserOrders,
  getOrderById,
  placeOrder,
  reorderItems,
  adminGetAllOrders,
  adminUpdateOrderStatus,
  trackOrder,
  getInvoice,
} from "../controllers/order.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { protectAdminRoute } from "../middlewares/admin.middleware.js";

const router = express.Router();

// Admin routes first so /:orderId never shadows /all
router.get("/all", protectRoute, protectAdminRoute, adminGetAllOrders);
router.put("/status/:orderId", protectRoute, protectAdminRoute, adminUpdateOrderStatus);

// User routes
router.get("/", protectRoute, getUserOrders);
router.post("/place", protectRoute, placeOrder);
router.post("/reorder/:orderId", protectRoute, reorderItems);
router.get("/:orderId/track", protectRoute, trackOrder);
router.get("/:orderId/invoice", protectRoute, getInvoice);
router.get("/:orderId", protectRoute, getOrderById);

export default router;
