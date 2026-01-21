import axios from "axios";

const defaultSettings = {
  storeName: "Revakalp",
  supportEmail: "contact@revakalp.com",
  currency: "INR",
  currencySymbol: "₹",
  freeShippingThreshold: 500,
  deliveryFee: 50,
  codEnabled: true,
  stripeEnabled: false,
  emailNotifications: true,
  admin2FA: false,
  maintenanceMode: false,
  storeDescription: "",
  phone: "",
  address: "",
};

export const createSettingsSlice = (set, get) => ({
  settings: defaultSettings,
  settingsLoading: false,
  
  // Fetch public settings (for all users)
  fetchPublicSettings: async () => {
    try {
      const res = await axios.get("/api/settings");
      set({ settings: res.data });
      return res.data;
    } catch (error) {
      console.error("Failed to fetch public settings:", error);
      // Use defaults on error
      set({ settings: defaultSettings });
      return defaultSettings;
    }
  },
  
  // Fetch admin settings (requires auth)
  fetchSettings: async () => {
    set({ settingsLoading: true });
    try {
      const res = await axios.get("/api/admin/settings");
      set({ settings: res.data, settingsLoading: false });
      return res.data;
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      set({ settingsLoading: false });
      return get().settings;
    }
  },
  
  updateSettings: async (updates) => {
    try {
      const res = await axios.put("/api/admin/settings", updates);
      set({ settings: res.data.settings });
      // Also update public settings cache
      await get().fetchPublicSettings();
      return res.data.settings;
    } catch (error) {
      console.error("Failed to update settings:", error);
      throw error;
    }
  },
});
