import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // OTP Reset Protection
    resetOTP: {
      type: String,
    },
    otpExpire: {
      type: Date,
    },
    otpAttempts: {
      type: Number,
      default: 0,
    },

    // DPDPA 2023 Consent Metadata
    consentAcceptedAt: {
      type: Date,
    },
    consentVersion: {
      type: String,
      default: "",
    },

    // Refresh Tokens (hashed)
    refreshTokens: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
