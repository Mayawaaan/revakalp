import mongoose from "mongoose";

const cmsCampaignSchema = new mongoose.Schema(
  {
    slot: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    ctaLabel: { type: String, default: "Explore" },
    destinationRoute: { type: String, default: "/shop" },
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
    startsAt: { type: Date },
    endsAt: { type: Date },
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const CmsCampaign = mongoose.model("CmsCampaign", cmsCampaignSchema);
export default CmsCampaign;
