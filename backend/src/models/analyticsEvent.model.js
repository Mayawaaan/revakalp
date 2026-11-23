import mongoose from "mongoose";
import { ALLOWED_ANALYTICS_EVENTS } from "../lib/analyticsMath.js";

/**
 * Privacy-safe, zero-PII storefront telemetry persisted only on explicit DPDPA opt-in.
 * Automatically expires records after 180 days.
 */
const analyticsEventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
    enum: Array.from(ALLOWED_ANALYTICS_EVENTS),
    index: true,
  },
  sessionId: {
    type: String,
    default: "",
    maxlength: 64,
    index: true,
  },
  itemId: {
    type: String,
    default: "",
    maxlength: 64,
  },
  category: {
    type: String,
    default: "",
    maxlength: 64,
  },
  value: {
    type: Number,
    default: 0,
    min: 0,
  },
  channel: {
    type: String,
    enum: ["web", "pos"],
    default: "web",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 180 * 24 * 60 * 60, // 180-day retention cap
  },
});

analyticsEventSchema.index({ eventName: 1, createdAt: -1 });

const AnalyticsEvent = mongoose.model("AnalyticsEvent", analyticsEventSchema);
export default AnalyticsEvent;
