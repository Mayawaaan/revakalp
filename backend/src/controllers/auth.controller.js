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
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.resetOTP = hashedOTP;
    user.otpExpire = expiresAt.getTime();
    user.otpAttempts = 0;

    await user.save({ validateBeforeSave: false });

    const firstName = (user.fullName || "").trim().split(/\s+/)[0] || "there";
    const clientBaseUrl = (
      process.env.CLIENT_URL ||
      (process.env.CORS_ORIGIN || "").split(",")[0] ||
      "http://localhost:5173"
    )
      .trim()
      .replace(/\/+$/, "");
    const resetUrl = `${clientBaseUrl}/reset-password`;
    const expiryTimeFormatted = expiresAt.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });

    const message = [
      `Hi ${firstName},`,
      "",
      "We heard you needed a hand getting back into your Revakalp account — no worries at all, it happens to all of us!",
      "",
      `Here is your 6-digit verification code to reset your password:`,
      "",
      `    ${otp}`,
      "",
      `This code is valid for the next 10 minutes (until ${expiryTimeFormatted} IST).`,
      "",
      "How to finish resetting your password:",
      `1. Head back to the password reset page: ${resetUrl}`,
      "2. Enter the 6-digit code above.",
      "3. Pick a new password (at least 8 characters, with at least one letter and one number) and confirm it.",
      "",
      "Didn't ask to reset your password?",
      "If you didn't request this, you can safely ignore this email. Your account is still secure, your current password hasn't changed, and this code will expire on its own. Just remember never to share this code with anyone — our team will never ask you for it.",
      "",
      "If you need any help at all, simply reply to this email or reach out to us at contact@revakalp.com.",
      "",
      "Warmly,",
      "The Team at Revakalp",
      "Weaving Life Into Time",
      "231-231, Shop No. 2, Dhanwantri Nagar, Rajendra Nagar, Indore, MP – 452012",
    ].join("\n");

    const html = `
      <div style="background-color: #EFE6D5; padding: 32px 16px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1A1718;">
        <div style="max-width: 540px; margin: 0 auto; background-color: #F7F1E5; border: 1px solid #D4AF63; border-radius: 2px; overflow: hidden; box-shadow: 0 14px 36px -20px rgba(43, 14, 23, 0.35);">
          
          <!-- Brand Header -->
          <div style="background-color: #2B0E17; padding: 26px 32px; text-align: center; border-bottom: 1px solid #D4AF63;">
            <p style="font-family: Georgia, 'Times New Roman', serif; font-size: 24px; letter-spacing: 0.22em; color: #F1D889; margin: 0; font-weight: normal;">
              REVAKALP
            </p>
            <p style="font-size: 10px; letter-spacing: 0.28em; text-transform: uppercase; color: #F7F1E5; opacity: 0.8; margin: 6px 0 0;">
              Weaving Life Into Time · Indore
            </p>
          </div>

          <!-- Body -->
          <div style="padding: 32px 32px 28px;">
            <p style="font-family: Georgia, 'Times New Roman', serif; font-size: 22px; color: #38131E; margin: 0 0 14px;">
              Hi ${firstName},
            </p>

            <p style="font-size: 14px; line-height: 1.7; color: #1A1718; margin: 0 0 18px;">
              We heard you needed a hand getting back into your Revakalp account — no worries at all, it happens to the best of us! Here is your verification code so you can set a fresh password right away:
            </p>

            <!-- OTP Box -->
            <div style="background-color: #2B0E17; border: 1px solid #D4AF63; border-radius: 2px; padding: 22px 20px; text-align: center; margin: 24px 0;">
              <p style="font-size: 10px; letter-spacing: 0.24em; text-transform: uppercase; color: #F7F1E5; opacity: 0.75; margin: 0 0 8px;">
                Your 6-Digit Verification Code
              </p>
              <div style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 700; letter-spacing: 0.32em; color: #F1D889; margin: 4px 0 10px;">
                ${otp}
              </div>
              <p style="font-size: 11px; color: #F7F1E5; opacity: 0.8; margin: 0;">
                Valid for <strong>10 minutes</strong> (until ${expiryTimeFormatted} IST)
              </p>
            </div>

            <!-- Step-by-Step Guide -->
            <div style="background-color: #FBF7EE; border: 1px solid rgba(56, 19, 30, 0.14); border-radius: 2px; padding: 18px 20px; margin: 0 0 22px;">
              <p style="font-family: Georgia, 'Times New Roman', serif; font-size: 16px; color: #38131E; margin: 0 0 10px; font-weight: bold;">
                How to reset your password:
              </p>
              <ol style="font-size: 13px; line-height: 1.7; color: #1A1718; margin: 0; padding-left: 18px;">
                <li style="margin-bottom: 6px;">Return to the password reset screen in your browser.</li>
                <li style="margin-bottom: 6px;">Enter the <strong>6-digit code</strong> above.</li>
                <li>Choose a new password with at least <strong>8 characters</strong> (including at least one letter and one number) and confirm it.</li>
              </ol>
              <div style="margin-top: 16px; text-align: center;">
                <a href="${resetUrl}" style="display: inline-block; background-color: #38131E; color: #F7F1E5; text-decoration: none; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; padding: 12px 24px; border: 1px solid #D4AF63; border-radius: 2px;">
                  Open Password Reset Page
                </a>
              </div>
            </div>

            <!-- Friendly Security Note -->
            <div style="border-top: 1px solid rgba(56, 19, 30, 0.12); padding-top: 18px; margin-bottom: 22px;">
              <p style="font-size: 13px; font-weight: 600; color: #38131E; margin: 0 0 6px;">
                Didn&rsquo;t request this reset?
              </p>
              <p style="font-size: 12.5px; line-height: 1.65; color: #5C4E52; margin: 0;">
                If you didn&rsquo;t ask to reset your password, you don&rsquo;t need to do a thing. Your account is safe, your current password still works, and this code will expire automatically. Please keep this code private — our team will never ask you for your OTP.
              </p>
            </div>

            <p style="font-size: 13.5px; line-height: 1.65; color: #1A1718; margin: 0 0 6px;">
              Need a hand? Just reply to this email and we&rsquo;ll be happy to help.
            </p>
            <p style="font-family: Georgia, 'Times New Roman', serif; font-size: 16px; color: #38131E; margin: 14px 0 0;">
              Warmly,<br />
              <strong>The Team at Revakalp</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #EFE6D5; border-top: 1px solid rgba(56, 19, 30, 0.12); padding: 18px 32px; text-align: center; font-size: 11px; line-height: 1.6; color: #5C4E52;">
            <p style="margin: 0 0 4px; color: #38131E; font-weight: 600;">
              REVAKALP · Indore Store &amp; Online Boutique
            </p>
            <p style="margin: 0;">
              231-231, Shop No. 2, Dhanwantri Nagar, Rajendra Nagar, Indore, Madhya Pradesh – 452012
            </p>
          </div>

        </div>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Here is your Revakalp password reset code",
        message,
        html,
      });
    } catch (mailError) {
      user.resetOTP = undefined;
      user.otpExpire = undefined;
      user.otpAttempts = 0;
      await user.save({ validateBeforeSave: false });
      console.error("Forgot password SMTP error:", mailError?.message || mailError);
      return res.status(503).json({
        message:
          "Unable to send verification email right now. Please try again in a moment.",
      });
    }

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
    const otp = String(req.body?.otp || "").replace(/\s+/g, "");
    const password = req.body?.password;
    const confirmPassword = req.body?.confirmPassword;

    const user = await User.findOne({ email });

    if (!user || !user.resetOTP || !user.otpExpire) {
      return res.status(400).json({
        message: "No active OTP found for this email. Please request a new OTP.",
      });
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
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new OTP." });
    }

    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");

    if (!timingSafeEqualHex(user.resetOTP, hashedOTP)) {
      user.otpAttempts = (user.otpAttempts || 0) + 1;
      await user.save({ validateBeforeSave: false });
      return res.status(400).json({ message: "Invalid 6-digit OTP. Please check and try again." });
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

    await user.save({ validateBeforeSave: false });

    const firstName = (user.fullName || "").trim().split(/\s+/)[0] || "there";
    const updatedAtFormatted = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    });

    sendEmail({
      email: user.email,
      subject: "Your Revakalp password has been updated",
      message: [
        `Hi ${firstName},`,
        "",
        `Just a quick note to let you know that your Revakalp account password was successfully updated on ${updatedAtFormatted} IST.`,
        "",
        "For your security, we've also signed out any older active sessions across your devices so you can sign in fresh with your new password.",
        "",
        "If you made this change, you're all set — no further action is needed!",
        "",
        "If you didn't change your password, please reset it again right away and reply to this email or contact us at contact@revakalp.com so our team can secure your account immediately.",
        "",
        "Warmly,",
        "The Team at Revakalp",
        "Weaving Life Into Time · Indore",
      ].join("\n"),
      html: `
        <div style="background-color: #EFE6D5; padding: 32px 16px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1A1718;">
          <div style="max-width: 540px; margin: 0 auto; background-color: #F7F1E5; border: 1px solid #D4AF63; border-radius: 2px; overflow: hidden;">
            <div style="background-color: #2B0E17; padding: 24px 32px; text-align: center; border-bottom: 1px solid #D4AF63;">
              <p style="font-family: Georgia, 'Times New Roman', serif; font-size: 22px; letter-spacing: 0.22em; color: #F1D889; margin: 0;">
                REVAKALP
              </p>
              <p style="font-size: 10px; letter-spacing: 0.26em; text-transform: uppercase; color: #F7F1E5; opacity: 0.8; margin: 6px 0 0;">
                Weaving Life Into Time · Indore
              </p>
            </div>
            <div style="padding: 30px 32px;">
              <p style="font-family: Georgia, 'Times New Roman', serif; font-size: 22px; color: #38131E; margin: 0 0 14px;">
                Hi ${firstName},
              </p>
              <p style="font-size: 14px; line-height: 1.7; color: #1A1718; margin: 0 0 16px;">
                Just a quick note to let you know that your Revakalp password was updated on <strong>${updatedAtFormatted} IST</strong>.
              </p>
              <p style="font-size: 14px; line-height: 1.7; color: #1A1718; margin: 0 0 18px;">
                For your peace of mind, we&rsquo;ve also signed out any older sessions on other devices so you can sign in fresh with your new password.
              </p>
              <div style="background-color: #FBF7EE; border: 1px solid rgba(56, 19, 30, 0.14); border-radius: 2px; padding: 16px 18px; margin-bottom: 20px;">
                <p style="font-size: 12.5px; line-height: 1.65; color: #5C4E52; margin: 0;">
                  <strong style="color: #38131E;">Wasn&rsquo;t you?</strong> If you didn&rsquo;t make this change, please reply to this email or write to us at <a href="mailto:contact@revakalp.com" style="color: #38131E;">contact@revakalp.com</a> right away so we can help protect your account.
                </p>
              </div>
              <p style="font-family: Georgia, 'Times New Roman', serif; font-size: 16px; color: #38131E; margin: 0;">
                Warmly,<br />
                <strong>The Team at Revakalp</strong>
              </p>
            </div>
          </div>
        </div>
      `,
    }).catch((err) => {
      console.error("Password reset confirmation email skipped:", err?.message || err);
    });

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
