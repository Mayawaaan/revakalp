import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon
} from '../controllers/cart.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All cart routes require authentication
router.get('/', protectRoute, getCart);
router.post('/add', protectRoute, addToCart);
router.put('/update', protectRoute, updateCartItem);
router.delete('/remove', protectRoute, removeFromCart);
router.delete('/clear', protectRoute, clearCart);
router.post('/coupon/apply', protectRoute, applyCoupon);
router.delete('/coupon/remove', protectRoute, removeCoupon);

export default router;
