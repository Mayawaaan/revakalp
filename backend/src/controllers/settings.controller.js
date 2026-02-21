import Settings from "../models/settings.model.js";

// Public endpoint to get settings (no auth required)
export const getPublicSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
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
      emailNotifications: settings.emailNotifications,
      stripeKey: settings.stripeKey,
      razorpayKey: settings.razorpayKey,
      storeDescription: settings.storeDescription,
      phone: settings.phone,
      address: settings.address,
      maintenanceMode: settings.maintenanceMode,
    });
  } catch (error) {
    console.error("Error in getPublicSettings:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
