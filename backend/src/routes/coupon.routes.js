import express from 'express';
import {
  verifyCoupon,
} from '../controllers/coupon.controller.js';

const router = express.Router();

router.post('/verify', verifyCoupon);

export default router;