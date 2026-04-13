import { generateToken, uploadImageToCloudinary } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import crypto from "crypto";
import { sendEmail } from "../lib/sendEmail.js";


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

    const token = generateToken(user._id);

    res.status(201).json({
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        role: user.role,
      },
      token,
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

    const token = generateToken(user._id);

    res.status(200).json({
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        role: user.role,
      },
      token,
    });

  } catch (error) {
    console.log("Login error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// =========================
// ✅ LOGOUT (CLIENT SIDE)
// =========================
export const logout = (req, res) => {
  res.status(200).json({ message: "Logout successful (clear token on frontend)" });
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