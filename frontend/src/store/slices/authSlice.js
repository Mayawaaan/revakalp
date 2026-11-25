import { setToken, clearToken, getToken } from "../../utils/token";
import {
  cancelProactiveRefresh,
  isTokenExpired,
  refreshSessionToken,
  registerTokenListener,
  scheduleProactiveRefresh,
} from "../../utils/authRefresh";

let initAuthPromise = null;
let tokenListenerRegistered = false;

export const createAuthSlice = (set) => {
  if (!tokenListenerRegistered) {
    tokenListenerRegistered = true;
    registerTokenListener((newToken) => {
      if (newToken) {
        set({ token: newToken });
      }
    });
  }

  return {
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
        scheduleProactiveRefresh(token);
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
      cancelProactiveRefresh();

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
    // ✅ INIT AUTH (deduplicated + proactive silent refresh)
    // =========================
    initAuth: async (axiosInstance) => {
      if (initAuthPromise) return initAuthPromise;

      initAuthPromise = (async () => {
        try {
          const token = getToken();

          if (token) {
            try {
              const res = await axiosInstance.get("/api/auth/check");
              scheduleProactiveRefresh(getToken() || token);
              set({ user: res.data, token: getToken() || token, authReady: true });
              return;
            } catch (err) {
              const status = err.response?.status;
              if (status && status !== 401) {
                // Non-401 HTTP/transient server error — keep current non-expired session intact
                if (!isTokenExpired(token)) {
                  scheduleProactiveRefresh(token);
                }
                set({ authReady: true });
                return;
              }
              if (!status) {
                // Network offline — do not wipe valid local session on temporary disconnect
                set({ authReady: true });
                return;
              }
            }
          }

          // No valid access token or 401 — attempt unified silent refresh
          try {
            const newToken = await refreshSessionToken();
            const userRes = await axiosInstance.get("/api/auth/check", {
              headers: { Authorization: `Bearer ${newToken}` },
            });
            set({ user: userRes.data, token: newToken, authReady: true });
          } catch (refreshError) {
            if (refreshError?.isAuthFailure !== false) {
              clearToken();
              cancelProactiveRefresh();
              set({ user: null, token: null, authReady: true });
            } else {
              // Transient network error — keep state without forced logout
              set({ authReady: true });
            }
          }
        } catch {
          clearToken();
          cancelProactiveRefresh();
          set({ user: null, token: null, authReady: true });
        } finally {
          initAuthPromise = null;
        }
      })();

      return initAuthPromise;
    },
  };
};