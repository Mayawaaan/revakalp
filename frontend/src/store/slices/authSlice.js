import { setToken, clearToken, getToken } from "../../utils/token";

export const createAuthSlice = (set, get) => ({
  user: null,
  token: getToken(), // safe getter
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
      authReady: true, // app is still ready, just logged out
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
  // ✅ SYNC TOKEN (IMPORTANT)
  // =========================
  syncToken: () => {
    const token = getToken();

    set({
      token: token || null,
    });
  },

  // =========================
  // ✅ INIT AUTH (🔥 MOST IMPORTANT)
  // =========================
  initAuth: async (axiosInstance) => {
    try {
      const token = getToken();

      // ❌ No token → skip API
      if (!token) {
        set({
          user: null,
          token: null,
          authReady: true,
        });
        return;
      }

      // ✅ verify token via backend
      const res = await axiosInstance.get("/api/auth/check");

      set({
        user: res.data,
        token,
        authReady: true,
      });

    } catch (error) {
      // ❌ Token invalid/expired → cleanup
      clearToken();

      set({
        user: null,
        token: null,
        authReady: true,
      });
    }
  },
});