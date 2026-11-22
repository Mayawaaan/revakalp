import express from "express";
import { createOrder, verifyPayment, handleWebhook } from "../controllers/payment.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create-order", protectRoute, createOrder);
router.post("/verify-payment", protectRoute, verifyPayment);
router.post("/webhook", handleWebhook);

export default router;
