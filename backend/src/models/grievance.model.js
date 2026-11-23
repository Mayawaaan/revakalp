import mongoose from "mongoose";

const grievanceSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
      maxlength: 30,
    },
    orderNumber: {
      type: String,
      trim: true,
      default: "",
      maxlength: 64,
    },
    category: {
      type: String,
      enum: [
        "order_delivery",
        "return_refund",
        "payment_billing",
        "product_quality",
        "privacy_dpdpa",
        "other",
      ],
      default: "other",
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
    status: {
      type: String,
      enum: ["open", "acknowledged", "in_progress", "resolved"],
      default: "open",
    },
    adminNote: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },
    acknowledgedAt: {
      type: Date,
      default: Date.now,
    },
    resolvedAt: {
      type: Date,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

const Grievance = mongoose.model("Grievance", grievanceSchema);

export default Grievance;
