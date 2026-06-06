import { generateAccessToken, generateRefreshToken, uploadImageToCloudinary } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sendEmail } from "../lib/sendEmail.js";

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

/** Hash a refresh token before storing in DB (so a DB leak doesn't expose live tokens) */
const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

/** Cookie options — httpOnly so JS can't read it */
const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 4 * 24 * 60 * 60 * 1000, // 4 days in ms
};

/** Issue both tokens, store hashed refresh in DB, set cookie */
const issueTokens = async (user, res) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  const hashedRefresh = hashToken(refreshToken);

  // Keep up to 5 refresh tokens (one per device / session)
  user.refreshTokens = [...(user.refreshTokens || []), hashedRefresh].slice(-5);
  await user.save({ validateBeforeSave: false });

  // Send refresh token as httpOnly cookie
  res.cookie("refreshToken", refreshToken, COOKIE_OPTS);

  return accessToken;
};


// =========================
// ✅ SIGNUP
// =========================
export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePic = "";
    if (req.file) {
      profilePic = await uploadImageToCloudinary(req.file);
      fs.unlinkSync(req.file.path);
    }

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      profilePic,
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
      token: accessToken,       // ← access token (short-lived)
    });

  } catch (error) {
    console.log("Signup error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// =========================
// ✅ LOGIN
// =========================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

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
      token: accessToken,       // ← access token (short-lived)
    });

  } catch (error) {
    console.log("Login error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// =========================
// ✅ REFRESH TOKEN
// =========================
export const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    // Verify signature + expiry
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

    // Check it exists in DB (prevents reuse after logout)
    const tokenIndex = user.refreshTokens.indexOf(hashedIncoming);
    if (tokenIndex === -1) {
      // Token was already used or revoked — wipe all tokens (possible theft)
      user.refreshTokens = [];
      await user.save({ validateBeforeSave: false });
      res.clearCookie("refreshToken");
      return res.status(401).json({ message: "Refresh token reuse detected. Please log in again." });
    }

    // ── ROTATION: remove old, issue new ──
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
// ✅ LOGOUT
// =========================
export const logout = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (incomingRefreshToken) {
      // Remove only THIS device's refresh token from DB
      try {
        const decoded = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.userId);
        if (user) {
          const hashed = hashToken(incomingRefreshToken);
          user.refreshTokens = user.refreshTokens.filter((t) => t !== hashed);
          await user.save({ validateBeforeSave: false });
        }
      } catch {
        // Token already expired — that's fine, just clear cookie
      }
    }

    res.clearCookie("refreshToken", COOKIE_OPTS);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Logout error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// =========================
// ✅ UPDATE PROFILE
// =========================
export const updateProfile = async (req, res) => {
  try {
    const { fullName } = req.body;
    const userId = req.user._id;

    let profilePic = req.user.profilePic;

    if (req.file) {
      profilePic = await uploadImageToCloudinary(req.file, "profiles");
      fs.unlinkSync(req.file.path);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, profilePic },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);

  } catch (error) {
    console.log("Update profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// =========================
// ✅ CHECK AUTH
// =========================
export const checkAuth = (req, res) => {
  res.status(200).json(req.user);
};


// =========================
// ✅ FORGOT PASSWORD
// =========================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 🔐 Hash OTP
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    user.resetOTP = hashedOTP;
    user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 min

    await user.save({ validateBeforeSave: false });

    const message = `Your OTP for password reset is: ${otp}\n\nValid for 10 minutes.`;

    await sendEmail({
      email: user.email,
      subject: "Password Reset OTP",
      message,
    });

    res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });

  } catch (error) {
    console.log("Forgot password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// =========================
// ✅ RESET PASSWORD
// =========================
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password, confirmPassword } = req.body;

    const user = await User.findOne({ email });

    // ❌ No user or no OTP data
    if (!user || !user.resetOTP || !user.otpExpire) {
      return res.status(400).json({ message: "Invalid request" });
    }

    // 🔐 Hash entered OTP
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    // ❌ OTP mismatch
    if (user.resetOTP !== hashedOTP) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ❌ OTP expired
    if (user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // ❌ Password mismatch
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // ✅ Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetOTP = undefined;
    user.otpExpire = undefined;
    user.refreshTokens = []; // Revoke all sessions on password reset

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });

  } catch (error) {
    console.log("Reset password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};