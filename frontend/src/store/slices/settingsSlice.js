import { apiFetch } from "../../hooks/useApiHelper";

const defaultSettings = {
  storeName: "Revakalp",
  supportEmail: "contact@revakalp.com",
  currency: "INR",
  currencySymbol: "₹",
  freeShippingThreshold: 500,
  deliveryFee: 50,
  codEnabled: true,
  stripeEnabled: false,
  razorpayEnabled: false,
  upiEnabled: false,
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

  /* ================= PUBLIC SETTINGS ================= */
  fetchPublicSettings: async () => {
    try {
      const data = await apiFetch("/api/settings");

      set({
        settings: data || defaultSettings,
      });

      return data;

    } catch (error) {
      console.error("Failed to fetch public settings:", error);

      set({
        settings: defaultSettings,
      });

      return defaultSettings;
    }
  },

  /* ================= ADMIN SETTINGS ================= */
  fetchSettings: async () => {
    set({ settingsLoading: true });

    try {
      const data = await apiFetch("/api/admin/settings");

      set({
        settings: data || defaultSettings,
        settingsLoading: false,
      });

      return data;

    } catch (error) {
      console.error("Failed to fetch settings:", error);

      set({ settingsLoading: false });

      return get().settings;
    }
  },

  /* ================= UPDATE SETTINGS ================= */
  updateSettings: async (updates) => {
    try {
      const data = await apiFetch("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify(updates),
      });

      set({
        settings: data.settings || data,
      });

      // refresh public cache
      await get().fetchPublicSettings();

      return data.settings || data;

    } catch (error) {
      console.error("Failed to update settings:", error);
      throw error;
    }
  },
});