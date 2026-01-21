import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist
} from '../controllers/wishlist.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All wishlist routes require authentication
router.get('/', protectRoute, getWishlist);
router.post('/add/:productId', protectRoute, addToWishlist);
router.delete('/remove/:productId', protectRoute, removeFromWishlist);
router.delete('/clear', protectRoute, clearWishlist);

export default router;
