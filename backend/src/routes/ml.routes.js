import express from "express";
import {
  getStatus,
  analyzeSingleText,
  analyzeBatchTexts,
  reanalyzeReviews,
} from "../controllers/ml.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { protectAdminRoute } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.get("/status", getStatus);
router.post("/analyze", protectRoute, analyzeSingleText);
router.post("/analyze-batch", protectRoute, protectAdminRoute, analyzeBatchTexts);
router.post("/reanalyze-reviews", protectRoute, protectAdminRoute, reanalyzeReviews);

export default router;
