import mongoose from "mongoose";

const webhookEventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    provider: {
      type: String,
      default: "razorpay",
    },
    eventType: {
      type: String,
      required: true,
    },
    gatewayOrderId: { type: String, default: "" },
    gatewayPaymentId: { type: String, default: "" },
    status: {
      type: String,
      enum: ["processed", "ignored", "failed"],
      default: "processed",
    },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

const WebhookEvent = mongoose.model("WebhookEvent", webhookEventSchema);
export default WebhookEvent;
