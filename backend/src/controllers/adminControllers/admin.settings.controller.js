import Settings from "../../models/settings.model.js";

// Get settings (single document, always returns one)
export const getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.status(200).json(settings);
  } catch (error) {
    console.error("Error in getSettings:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update settings
export const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    const allowedFields = [
      "storeName",
      "supportEmail",
      "currency",
      "currencySymbol",
      "freeShippingThreshold",
      "deliveryFee",
      "codEnabled",
      "stripeEnabled",
      "razorpayEnabled",
      "upiEnabled",
      "stripeKey",
      "razorpayKey",
      "emailNotifications",
      "admin2FA",
      "maintenanceMode",
      "storeDescription",
      "phone",
      "address",
      "legalEntityName",
      "gstin",
      "grievanceOfficerName",
      "grievanceOfficerDesignation",
      "grievanceOfficerEmail",
      "grievanceOfficerPhone",
      "countryOfOriginDefault",
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (updates.currency) {
      const symbolMap = {
        INR: "₹",
        USD: "$",
        EUR: "€",
      };
      updates.currencySymbol = symbolMap[updates.currency] || "₹";
    }

    Object.assign(settings, updates);
    await settings.save();

    res.status(200).json({
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("Error in updateSettings:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
