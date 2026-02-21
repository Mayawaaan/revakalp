import {
  createReview,
  getReviewsForProduct,
  deleteReview,
} from "../controllers/review.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { protectAdminRoute } from "../middlewares/admin.middleware.js";

import express from "express";

const router = express.Router();

router.post("/", protectRoute, createReview);
router.get("/:productId", getReviewsForProduct);
router.delete("/:id", protectRoute, protectAdminRoute, deleteReview);

export default router;
