import mongoose from "mongoose";
import CmsCampaign from "../../models/cmsCampaign.model.js";

export const getActiveCampaigns = async (req, res) => {
  try {
    const now = new Date();
    const campaigns = await CmsCampaign.find({
      $and: [
        {
          $or: [
            { status: "published" },
            { status: "scheduled", startsAt: { $lte: now } },
          ],
        },
        {
          $or: [
            { startsAt: null },
            { startsAt: { $lte: now } },
            { startsAt: { $exists: false } },
          ],
        },
        {
          $or: [
            { endsAt: null },
            { endsAt: { $gte: now } },
            { endsAt: { $exists: false } },
          ],
        },
      ],
    })
      .sort({ priority: -1, updatedAt: -1 })
      .lean();

    return res.status(200).json(campaigns);
  } catch (error) {
    console.error("getActiveCampaigns error:", error);
    return res.status(500).json({ message: "Failed to load active campaigns" });
  }
};

export const getAllCampaignsAdmin = async (req, res) => {
  try {
    const campaigns = await CmsCampaign.find({})
      .sort({ priority: -1, updatedAt: -1 })
      .lean();
    return res.status(200).json(campaigns);
  } catch (error) {
    console.error("getAllCampaignsAdmin error:", error);
    return res.status(500).json({ message: "Failed to fetch CMS campaigns" });
  }
};

export const createCampaign = async (req, res) => {
  try {
    const {
      slot,
      campaignType = "campaign",
      badgeText = "",
      title,
      subtitle,
      ctaLabel,
      destinationRoute,
      couponCode = "",
      desktopImage,
      mobileImage,
      altText,
      assetOrigin,
      status = "draft",
      priority = 10,
      startsAt,
      endsAt,
    } = req.body;

    if (!slot || !title) {
      return res.status(400).json({ message: "Slot and title are required" });
    }

    const created = await CmsCampaign.create({
      slot,
      campaignType,
      badgeText,
      title,
      subtitle,
      ctaLabel,
      destinationRoute,
      couponCode,
      desktopImage,
      mobileImage,
      altText,
      assetOrigin,
      status,
      priority: Number.isFinite(Number(priority)) ? Number(priority) : 10,
      startsAt: startsAt || undefined,
      endsAt: endsAt || undefined,
    });

    return res.status(201).json(created);
  } catch (error) {
    console.error("createCampaign error:", error);
    return res.status(500).json({ message: "Failed to create campaign" });
  }
};

export const updateCampaign = async (req, res) => {
  try {
    const existing = await CmsCampaign.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    const stringFields = [
      "slot",
      "campaignType",
      "badgeText",
      "title",
      "subtitle",
      "ctaLabel",
      "destinationRoute",
      "couponCode",
      "desktopImage",
      "mobileImage",
      "altText",
      "assetOrigin",
      "status",
    ];
    for (const key of stringFields) {
      if (req.body[key] !== undefined) {
        existing[key] = req.body[key];
      }
    }
    if (req.body.priority !== undefined) {
      const p = Number(req.body.priority);
      if (Number.isFinite(p)) existing.priority = p;
    }
    if (req.body.startsAt !== undefined) {
      existing.startsAt = req.body.startsAt || null;
    }
    if (req.body.endsAt !== undefined) {
      existing.endsAt = req.body.endsAt || null;
    }

    existing.version = (existing.version || 1) + 1;
    await existing.save();

    return res.status(200).json(existing);
  } catch (error) {
    console.error("updateCampaign error:", error);
    return res.status(500).json({ message: "Failed to update campaign" });
  }
};

export const deleteCampaign = async (req, res) => {
  try {
    const deleted = await CmsCampaign.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    return res.status(200).json({ message: "Campaign deleted" });
  } catch (error) {
    console.error("deleteCampaign error:", error);
    return res.status(500).json({ message: "Failed to delete campaign" });
  }
};

export const trackCampaignEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid campaign id" });
    }
    if (type !== "impression" && type !== "click") {
      return res.status(400).json({ message: "Invalid tracking event type" });
    }

    const incField = type === "click" ? { clicks: 1 } : { impressions: 1 };
    await CmsCampaign.findByIdAndUpdate(id, { $inc: incField });
    return res.status(204).end();
  } catch (error) {
    console.error("trackCampaignEvent error:", error);
    return res.status(500).json({ message: "Failed to track event" });
  }
};
