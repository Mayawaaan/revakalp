import mongoose from "mongoose";

const cmsCampaignSchema = new mongoose.Schema(
  {
    slot: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    campaignType: {
      type: String,
      enum: ["campaign", "ad", "announcement", "popup"],
      default: "campaign",
    },
    badgeText: { type: String, default: "" },
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    ctaLabel: { type: String, default: "Explore" },
    destinationRoute: { type: String, default: "/shop" },
    couponCode: { type: String, default: "", trim: true, uppercase: true },
    desktopImage: { type: String, default: "" },
    mobileImage: { type: String, default: "" },
    altText: { type: String, default: "" },
    assetOrigin: { type: String, default: "owner_supplied" },
    status: {
      type: String,
      enum: ["draft", "in_review", "scheduled", "published", "retired"],
      default: "draft",
      index: true,
    },
    priority: { type: Number, default: 10 },
    startsAt: { type: Date },
    endsAt: { type: Date },
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const CmsCampaign = mongoose.model("CmsCampaign", cmsCampaignSchema);
export default CmsCampaign;
