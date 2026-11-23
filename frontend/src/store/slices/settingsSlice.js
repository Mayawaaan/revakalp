import { apiFetch } from "../../hooks/useApiHelper";

const THEME_SCHEME_STORAGE_KEY = "rk-theme-scheme";
const THEME_MODE_STORAGE_KEY = "rk-theme-mode";

const syncThemeStorage = (themeScheme, themeMode) => {
  if (typeof window === "undefined") return;
  try {
    if (themeScheme) {
      window.localStorage.setItem(THEME_SCHEME_STORAGE_KEY, themeScheme);
    }
    if (themeMode === "light" || themeMode === "dark") {
      window.localStorage.setItem(THEME_MODE_STORAGE_KEY, themeMode);
    }
  } catch {
    // ignore storage access issues
  }
};

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
  themeScheme: null,
  themeMode: null,
};

let publicSettingsRetryCount = 0;
let publicSettingsRetryTimer = null;

export const createSettingsSlice = (set, get) => ({
  settings: defaultSettings,
  currency: defaultSettings.currencySymbol, // Expose currency symbol directly for components
  settingsLoading: false,
  settingsHydrated: false,
  activeCampaigns: [],

  /* ================= ACTIVE STOREFRONT CAMPAIGNS & ADS ================= */
  fetchActiveCampaigns: async () => {
    try {
      const data = await apiFetch("/api/cms/active");
      const list = Array.isArray(data) ? data : [];
      set({ activeCampaigns: list });
      return list;
    } catch {
      return get().activeCampaigns || [];
    }
  },

  trackCampaign: async (campaignId, type = "impression") => {
    if (!campaignId) return;
    try {
      await apiFetch(`/api/cms/${campaignId}/track`, {
        method: "POST",
        body: JSON.stringify({ type }),
      });
    } catch {
      // Non-blocking campaign telemetry
    }
  },

  /* ================= PUBLIC SETTINGS ================= */
  fetchPublicSettings: async () => {
    try {
      let data = null;
      if (typeof window !== "undefined" && window.__RK_SETTINGS_PROMISE__) {
        const bootPromise = window.__RK_SETTINGS_PROMISE__;
        window.__RK_SETTINGS_PROMISE__ = null;
        data = await bootPromise;
      }

      if (!data) {
        data = await apiFetch("/api/settings", { cache: "no-store" });
      }

      if (data && typeof data === "object") {
        const current = get().settings || defaultSettings;
        const merged = data.partial
          ? {
              ...current,
              themeScheme: data.themeScheme || current.themeScheme,
              themeMode: data.themeMode || current.themeMode,
            }
          : data;

        const hasPublishedTheme = Boolean(merged.themeScheme);
        if (hasPublishedTheme) {
          syncThemeStorage(merged.themeScheme, merged.themeMode);
          publicSettingsRetryCount = 0;
          if (publicSettingsRetryTimer) {
            clearTimeout(publicSettingsRetryTimer);
            publicSettingsRetryTimer = null;
          }
        }

        set({
          settings: merged,
          currency: merged.currencySymbol || current.currencySymbol || "₹",
          settingsHydrated: hasPublishedTheme,
        });

        return merged;
      }

      throw new Error("Empty settings response");
    } catch (error) {
      console.error("Failed to fetch public settings:", error);

      // Never overwrite settings with a fallback theme; retry transiently instead
      if (typeof window !== "undefined" && publicSettingsRetryCount < 2 && !get().settingsHydrated) {
        const delayMs = publicSettingsRetryCount === 0 ? 1500 : 3500;
        publicSettingsRetryCount += 1;
        if (publicSettingsRetryTimer) clearTimeout(publicSettingsRetryTimer);
        publicSettingsRetryTimer = setTimeout(() => {
          get().fetchPublicSettings();
        }, delayMs);
      }

      return get().settings;
    }
  },

  /* ================= ADMIN SETTINGS ================= */
  fetchSettings: async () => {
    set({ settingsLoading: true });

    try {
      const data = await apiFetch("/api/admin/settings", { cache: "no-store" });
      const resolved = data || get().settings || defaultSettings;
      if (resolved.themeScheme) {
        syncThemeStorage(resolved.themeScheme, resolved.themeMode);
      }

      set({
        settings: resolved,
        currency: resolved.currencySymbol || "₹",
        settingsLoading: false,
        settingsHydrated: Boolean(resolved.themeScheme),
      });

      return resolved;
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

      const updated = data.settings || data;
      if (updated?.themeScheme) {
        syncThemeStorage(updated.themeScheme, updated.themeMode);
      }

      set({
        settings: updated,
        currency: updated?.currencySymbol || get().currency || "₹",
        settingsHydrated: Boolean(updated?.themeScheme),
      });

      return updated;
    } catch (error) {
      console.error("Failed to update settings:", error);
      throw error;
    }
  },
});
