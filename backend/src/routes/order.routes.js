import express from 'express';
import {
  getUserOrders,
  getOrderById,
  placeOrder,
  reorderItems,
  adminGetAllOrders,
  adminUpdateOrderStatus,
  trackOrder,
  getInvoice
} from '../controllers/order.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { protectAdminRoute } from '../middlewares/admin.middleware.js';

const router = express.Router();

// User routes
router.get('/', protectRoute, getUserOrders);
router.post('/place', protectRoute, placeOrder);
router.get('/:orderId', protectRoute, getOrderById);
router.get('/:orderId/track', protectRoute, trackOrder); // Public tracking endpoint
router.get('/:orderId/invoice', protectRoute, getInvoice);
router.post('/reorder/:orderId', protectRoute, reorderItems);

// Admin routes
router.get('/all', protectRoute, protectAdminRoute, adminGetAllOrders);
router.put('/status/:orderId', protectRoute, protectAdminRoute, adminUpdateOrderStatus);

export default router;
