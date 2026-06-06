import { setToken, clearToken, getToken } from "../../utils/token";

const API_BASE = import.meta.env.VITE_API_URL;

export const createAuthSlice = (set, get) => ({
  user: null,
  token: getToken(),
  authReady: false,

  // ✅ mark app ready
  setAuthReady: (val) => set({ authReady: val }),

  // =========================
  // ✅ LOGIN
  // =========================
  login: ({ user, token }) => {
    if (token) {
      setToken(token);
    }

    set({
      user,
      token: token || null,
      authReady: true,
    });
  },

  // =========================
  // ✅ LOGOUT
  // =========================
  logout: () => {
    clearToken();

    set({
      user: null,
      token: null,
      authReady: true,
    });
  },

  // =========================
  // ✅ UPDATE PROFILE
  // =========================
  updateProfile: (data) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : data,
    })),

  // =========================
  // ✅ SYNC TOKEN
  // =========================
  syncToken: () => {
    const token = getToken();
    set({ token: token || null });
  },

  // =========================
  // ✅ INIT AUTH
  // On app load:
  //   1. If we have an access token → verify it
  //   2. If no access token but cookie might exist → attempt silent refresh
  //   3. If both fail → logged out
  // =========================
  initAuth: async (axiosInstance) => {
    try {
      const token = getToken();

      if (token) {
        // Try to verify existing access token
        try {
          const res = await axiosInstance.get("/api/auth/check");
          set({ user: res.data, token, authReady: true });
          return;
        } catch (err) {
          // Access token invalid/expired — fall through to refresh
          if (err.response?.status !== 401) throw err;
        }
      }

      // No valid access token — try silent refresh via httpOnly cookie
      try {
        const refreshRes = await fetch(`${API_BASE}/api/auth/refresh`, {
          method: "POST",
          credentials: "include",    // 🍪 send cookie
        });

        if (!refreshRes.ok) throw new Error("No session");

        const { token: newToken } = await refreshRes.json();
        setToken(newToken);

        // Now get user profile
        const userRes = await axiosInstance.get("/api/auth/check", {
          headers: { Authorization: `Bearer ${newToken}` },
        });

        set({ user: userRes.data, token: newToken, authReady: true });

      } catch {
        // Truly no session (cookie expired after 4 days, or never existed)
        clearToken();
        set({ user: null, token: null, authReady: true });
      }

    } catch (error) {
      clearToken();
      set({ user: null, token: null, authReady: true });
    }
  },
});