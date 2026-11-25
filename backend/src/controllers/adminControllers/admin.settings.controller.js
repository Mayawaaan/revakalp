import Settings, { VALID_THEME_SCHEMES } from "../../models/settings.model.js";
import { writePublishedTheme } from "../../lib/publishedThemeStore.js";

const ALLOWED_THEME_SCHEMES = new Set(VALID_THEME_SCHEMES);
const ALLOWED_THEME_MODES = new Set(["light", "dark"]);

// Get settings (single document, always returns one)
export const getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    writePublishedTheme({
      themeScheme: settings.themeScheme,
      themeMode: settings.themeMode,
    });
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
      "demoPaymentMode",
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
      "themeScheme",
      "themeMode",
    ];

    if (
      req.body.themeScheme !== undefined &&
      !ALLOWED_THEME_SCHEMES.has(req.body.themeScheme)
    ) {
      return res.status(400).json({ message: "Invalid themeScheme value" });
    }
    if (
      req.body.themeMode !== undefined &&
      !ALLOWED_THEME_MODES.has(req.body.themeMode)
    ) {
      return res.status(400).json({ message: "Invalid themeMode value" });
    }

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

    writePublishedTheme({
      themeScheme: settings.themeScheme,
      themeMode: settings.themeMode,
    });

    res.status(200).json({
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("Error in updateSettings:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
