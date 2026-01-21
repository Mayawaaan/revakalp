import express from "express";
import { getPublicSettings } from "../controllers/settings.controller.js";

const router = express.Router();

// Public settings route (no auth required)
router.get("/", getPublicSettings);

export default router;
