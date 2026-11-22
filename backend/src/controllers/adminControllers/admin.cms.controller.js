import CmsCampaign from "../../models/cmsCampaign.model.js";

export const getActiveCampaigns = async (req, res) => {
  try {
    const now = new Date();
    const campaigns = await CmsCampaign.find({
      status: "published",
      $and: [
        { $or: [{ startsAt: null }, { startsAt: { $lte: now } }, { startsAt: { $exists: false } }] },
        { $or: [{ endsAt: null }, { endsAt: { $gte: now } }, { endsAt: { $exists: false } }] },
      ],
    })
      .sort({ updatedAt: -1 })
      .lean();

    return res.status(200).json(campaigns);
  } catch (error) {
    console.error("getActiveCampaigns error:", error);
    return res.status(500).json({ message: "Failed to load active campaigns" });
  }
};

export const getAllCampaignsAdmin = async (req, res) => {
  try {
    const campaigns = await CmsCampaign.find({}).sort({ updatedAt: -1 }).lean();
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
      title,
      subtitle,
      ctaLabel,
      destinationRoute,
      desktopImage,
      mobileImage,
      altText,
      assetOrigin,
      status = "draft",
      startsAt,
      endsAt,
    } = req.body;

    if (!slot || !title) {
      return res.status(400).json({ message: "Slot and title are required" });
    }

    const created = await CmsCampaign.create({
      slot,
      title,
      subtitle,
      ctaLabel,
      destinationRoute,
      desktopImage,
      mobileImage,
      altText,
      assetOrigin,
      status,
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

    const fields = [
      "slot",
      "title",
      "subtitle",
      "ctaLabel",
      "destinationRoute",
      "desktopImage",
      "mobileImage",
      "altText",
      "assetOrigin",
      "status",
      "startsAt",
      "endsAt",
    ];
    for (const key of fields) {
      if (req.body[key] !== undefined) {
        existing[key] = req.body[key] || undefined;
      }
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
