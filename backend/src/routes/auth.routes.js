import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/signup", upload.single("profilePic"), signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshAccessToken);         // 🔄 Token refresh
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp-reset", resetPassword);

router.put(
  "/update-profile",
  protectRoute,
  upload.single("profilePic"),
  (req, res, next) => {
    if (!req.body.fullName && !req.file) {
      return res.status(400).json({ message: "Nothing to update" });
    }
    next();
  },
  updateProfile
);

router.get("/check", protectRoute, checkAuth);

export default router;