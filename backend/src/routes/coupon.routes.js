import express from 'express';
import {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  verifyCoupon,
} from '../controllers/coupon.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { protectAdminRoute } from '../middlewares/admin.middleware.js';

const router = express.Router();

router.route('/').post(protectRoute, protectAdminRoute, createCoupon).get(protectRoute, protectAdminRoute, getCoupons);
router
  .route('/:id')
  .get(protectRoute, protectAdminRoute, getCouponById)
  .put(protectRoute, protectAdminRoute, updateCoupon)
  .delete(protectRoute, protectAdminRoute, deleteCoupon);

router.post('/verify', verifyCoupon);

export default router;