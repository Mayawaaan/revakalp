import Settings from "../models/settings.model.js";
import {
  readPublishedTheme,
  writePublishedTheme,
} from "../lib/publishedThemeStore.js";

// Public endpoint to get settings (no auth required)
export const getPublicSettings = async (req, res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");

  try {
    const settings = await Settings.getSettings();
    const published = writePublishedTheme({
      themeScheme: settings.themeScheme,
      themeMode: settings.themeMode,
    });

    // Return only public settings (exclude sensitive data like admin2FA)
    res.status(200).json({
      storeName: settings.storeName,
      supportEmail: settings.supportEmail,
      currency: settings.currency,
      currencySymbol: settings.currencySymbol,
      freeShippingThreshold: settings.freeShippingThreshold,
      deliveryFee: settings.deliveryFee,
      codEnabled: settings.codEnabled,
      stripeEnabled: settings.stripeEnabled,
      razorpayEnabled: settings.razorpayEnabled,
      upiEnabled: settings.upiEnabled,
      demoPaymentMode: settings.demoPaymentMode !== false,
      emailNotifications: settings.emailNotifications,
      stripeKey: settings.stripeKey,
      razorpayKey: settings.razorpayKey,
      storeDescription: settings.storeDescription,
      phone: settings.phone,
      address: settings.address,
      maintenanceMode: settings.maintenanceMode,
      legalEntityName: settings.legalEntityName,
      gstin: settings.gstin,
      grievanceOfficerName: settings.grievanceOfficerName,
      grievanceOfficerDesignation: settings.grievanceOfficerDesignation,
      grievanceOfficerEmail: settings.grievanceOfficerEmail,
      grievanceOfficerPhone: settings.grievanceOfficerPhone,
      countryOfOriginDefault: settings.countryOfOriginDefault,
      themeScheme: published?.themeScheme || settings.themeScheme,
      themeMode: published?.themeMode || settings.themeMode || "light",
    });
  } catch (error) {
    console.error("Error in getPublicSettings:", error.message);
    const cached = readPublishedTheme();
    if (cached) {
      return res.status(200).json({
        themeScheme: cached.themeScheme,
        themeMode: cached.themeMode,
        partial: true,
      });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
