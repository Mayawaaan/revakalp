import {
  generateAccessToken,
  generateRefreshToken,
  uploadImageToCloudinary,
} from "../lib/utils.js";
import {
  SAFE_USER_PROJECTION,
  generateSecureOtp,
  isValidEmail,
  normalizeEmail,
  timingSafeEqualHex,
  validatePasswordStrength,
} from "../lib/security.js";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Wishlist from "../models/wishlist.model.js";
import Review from "../models/review.model.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sendEmail } from "../lib/sendEmail.js";

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 4 * 24 * 60 * 60 * 1000,
};

const CLEAR_COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

const cleanupTempFile = (file) => {
  if (file?.path && fs.existsSync(file.path)) {
    try {
      fs.unlinkSync(file.path);
    } catch {
      // Ignore cleanup failure for temp files
    }
  }
};

const issueTokens = async (user, res) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  const hashedRefresh = hashToken(refreshToken);

  user.refreshTokens = [...(user.refreshTokens || []), hashedRefresh].slice(-5);
  await user.save({ validateBeforeSave: false });

  res.cookie("refreshToken", refreshToken, COOKIE_OPTS);

  return accessToken;
};

// =========================
// SIGNUP
// =========================
export const signup = async (req, res) => {
  try {
    const fullName = String(req.body?.fullName || "").trim();
    const email = normalizeEmail(req.body?.email);
    const password = req.body?.password;
    const consentAccepted =
      req.body?.consentAccepted === true || req.body?.consentAccepted === "true";
    const consentVersion = String(req.body?.consentVersion || "2025-dpdpa-v1").trim();

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    const strength = validatePasswordStrength(password);
    if (!strength.valid) {
      return res.status(400).json({ message: strength.message });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePic = "";
    if (req.file) {
      profilePic = await uploadImageToCloudinary(req.file);
    }

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      profilePic,
      ...(consentAccepted
        ? { consentAcceptedAt: new Date(), consentVersion }
        : {}),
    });

    const accessToken = await issueTokens(user, res);

    res.status(201).json({
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        role: user.role,
      },
      token: accessToken,
    });
  } catch (error) {
    console.log("Signup error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    cleanupTempFile(req.file);
  }
};

// =========================
// LOGIN
// =========================
export const login = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || "");

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = await issueTokens(user, res);

    res.status(200).json({
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        role: user.role,
      },
      token: accessToken,
    });
  } catch (error) {
    console.log("Login error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// =========================
// REFRESH TOKEN
// =========================
export const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    let decoded;
    try {
      decoded = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ message: "Refresh token expired or invalid" });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const hashedIncoming = hashToken(incomingRefreshToken);

    const tokenIndex = user.refreshTokens.indexOf(hashedIncoming);
    if (tokenIndex === -1) {
      user.refreshTokens = [];
      await user.save({ validateBeforeSave: false });
      res.clearCookie("refreshToken", CLEAR_COOKIE_OPTS);
      return res
        .status(401)
        .json({ message: "Refresh token reuse detected. Please log in again." });
    }

    user.refreshTokens.splice(tokenIndex, 1);

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);
    const hashedNew = hashToken(newRefreshToken);

    user.refreshTokens = [...user.refreshTokens, hashedNew].slice(-5);
    await user.save({ validateBeforeSave: false });

    res.cookie("refreshToken", newRefreshToken, COOKIE_OPTS);

    return res.status(200).json({ token: newAccessToken });
  } catch (error) {
    console.log("Refresh token error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// =========================
// LOGOUT
// =========================
export const logout = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (incomingRefreshToken) {
      try {
        const decoded = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userId);
        if (user) {
          const hashed = hashToken(incomingRefreshToken);
          user.refreshTokens = user.refreshTokens.filter((t) => t !== hashed);
          await user.save({ validateBeforeSave: false });
        }
      } catch {
        // Ignore invalid/expired token while clearing cookie
      }
    }

    res.clearCookie("refreshToken", CLEAR_COOKIE_OPTS);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Logout error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// =========================
// UPDATE PROFILE
// =========================
export const updateProfile = async (req, res) => {
  try {
    const fullName = String(req.body?.fullName || req.user.fullName || "").trim();
    const userId = req.user._id;

    if (!fullName) {
      return res.status(400).json({ message: "Full name is required" });
    }

    let profilePic = req.user.profilePic;
    if (req.file) {
      profilePic = await uploadImageToCloudinary(req.file, "profiles");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, profilePic },
      { new: true }
    ).select(SAFE_USER_PROJECTION);

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Update profile error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    cleanupTempFile(req.file);
  }
};

// =========================
// CHECK AUTH
// =========================
export const checkAuth = (req, res) => {
  res.status(200).json(req.user);
};

// =========================
// FORGOT PASSWORD
// =========================
export const forgotPassword = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const genericMsg =
      "If an account exists for this email, a reset OTP has been sent.";

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        success: true,
        message: genericMsg,
      });
    }

    const otp = generateSecureOtp();
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    user.resetOTP = hashedOTP;
    user.otpExpire = Date.now() + 10 * 60 * 1000;
    user.otpAttempts = 0;

    await user.save({ validateBeforeSave: false });

    const message = `Your OTP for password reset is: ${otp}\n\nValid for 10 minutes.`;

    await sendEmail({
      email: user.email,
      subject: "Password Reset OTP",
      message,
    });

    return res.status(200).json({
      success: true,
      message: genericMsg,
    });
  } catch (error) {
    console.log("Forgot password error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// =========================
// RESET PASSWORD
// =========================
export const resetPassword = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const otp = String(req.body?.otp || "").trim();
    const password = req.body?.password;
    const confirmPassword = req.body?.confirmPassword;

    const user = await User.findOne({ email });

    if (!user || !user.resetOTP || !user.otpExpire) {
      return res.status(400).json({ message: "Invalid request" });
    }

    if ((user.otpAttempts || 0) >= 5) {
      user.resetOTP = undefined;
      user.otpExpire = undefined;
      user.otpAttempts = 0;
      await user.save({ validateBeforeSave: false });
      return res
        .status(429)
        .json({ message: "Too many invalid OTP attempts. Request a new OTP." });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    if (!timingSafeEqualHex(user.resetOTP, hashedOTP)) {
      user.otpAttempts = (user.otpAttempts || 0) + 1;
      await user.save({ validateBeforeSave: false });
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const strength = validatePasswordStrength(password);
    if (!strength.valid) {
      return res.status(400).json({ message: strength.message });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetOTP = undefined;
    user.otpExpire = undefined;
    user.otpAttempts = 0;
    user.refreshTokens = [];

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.log("Reset password error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// =========================
// DPDPA 2023 DATA EXPORT (Right to Access)
// =========================
export const exportMyData = async (req, res) => {
  try {
    const userId = req.user._id;
    const [profile, orders, wishlist, cart, reviews] = await Promise.all([
      User.findById(userId).select(SAFE_USER_PROJECTION).lean(),
      Order.find({ userId }).sort({ createdAt: -1 }).lean(),
      Wishlist.findOne({ user: userId }).lean(),
      Cart.findOne({ userId }).lean(),
      Review.find({ userId }).sort({ createdAt: -1 }).lean(),
    ]);

    return res.status(200).json({
      exportedAt: new Date().toISOString(),
      legalBasis: "DPDPA 2023 Section 11 (Right to Access)",
      data: {
        profile,
        orders,
        wishlist,
        cart,
        reviews,
      },
    });
  } catch (error) {
    console.error("Data export error:", error.message);
    return res.status(500).json({ message: "Failed to export personal data" });
  }
};

// =========================
// DPDPA 2023 ACCOUNT ERASURE (Right to Erasure)
// =========================
export const deleteMyAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    const password = String(req.body?.password || "");

    if (!password) {
      return res
        .status(400)
        .json({ message: "Password confirmation is required to delete your account" });
    }

    const fullUser = await User.findById(userId);
    if (!fullUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, fullUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    if (fullUser.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return res.status(400).json({
          message: "Cannot delete the last administrator account",
        });
      }
    }

    await Promise.all([
      Cart.deleteOne({ userId }),
      Wishlist.deleteOne({ user: userId }),
      Review.deleteMany({ userId }),
      Order.updateMany(
        {
          userId,
          status: { $in: ["Delivered", "Cancelled", "Returned"] },
        },
        {
          $set: {
            notes: "[REDACTED UPON USER ERASURE REQUEST]",
            "shippingAddress.street": "REDACTED",
            "shippingAddress.phone": "REDACTED",
            "shippingAddress.zip": "REDACTED",
          },
        }
      ),
    ]);

    await User.findByIdAndDelete(userId);
    res.clearCookie("refreshToken", CLEAR_COOKIE_OPTS);

    return res.status(200).json({
      success: true,
      message: "Account and personal data deleted cleanly",
    });
  } catch (error) {
    console.error("Account deletion error:", error.message);
    return res.status(500).json({ message: "Failed to delete account" });
  }
};
