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
    // Get or create settings document
    let settings = await Settings.findOne();
    
    if (!settings) {
      // Create default settings if none exist
      settings = await Settings.create({});
    }

    // Update fields from request body
    const allowedFields = [
      "storeName",
      "supportEmail",
      "currency",
      "currencySymbol",
      "freeShippingThreshold",
      "deliveryFee",
      "codEnabled",
      "stripeEnabled",
      "emailNotifications",
      "admin2FA",
      "maintenanceMode",
      "storeDescription",
      "phone",
      "address",
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Auto-set currency symbol based on currency
    if (updates.currency) {
      const symbolMap = {
        INR: "₹",
        USD: "$",
        EUR: "€",
      };
      updates.currencySymbol = symbolMap[updates.currency] || "₹";
    }

    // Update settings
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
