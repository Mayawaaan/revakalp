import express from "express";
import {
  submitGrievance,
  getPublicComplianceInfo,
} from "../controllers/compliance.controller.js";

const router = express.Router();

router.post("/grievance", submitGrievance);
router.get("/info", getPublicComplianceInfo);

export default router;
