import { setToken, clearToken, getToken } from "../../utils/token";

export const createAuthSlice = (set) => ({
  user: null,
  token: getToken() || null,
  authReady: false,

  setAuthReady: (val) => set({ authReady: val }),

  login: ({ user, token }) => {
    if (token) setToken(token);

    set({
      user,
      token,
    });
  },

  logout: () => {
    clearToken();

    set({
      user: null,
      token: null,
    });
  },

  updateProfile: (data) =>
    set((state) => ({
      user: { ...state.user, ...data },
    })),
});