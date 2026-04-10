export const createAuthSlice = (set) => ({
  user: null,
  token: localStorage.getItem("token") || null,

  /* ================= LOGIN ================= */
  login: (data) => {
    // 🔥 IMPORTANT: backend must send { user, token }
    const { user, token } = data;

    if (token) {
      localStorage.setItem("token", token);
    }

    set({
      user: user || data,
      token: token || null,
    });
  },

  /* ================= LOGOUT ================= */
  logout: () => {
    localStorage.removeItem("token");

    set({
      user: null,
      token: null,
    });
  },

  /* ================= UPDATE PROFILE ================= */
  updateProfile: (data) =>
    set((state) => ({
      user: { ...state.user, ...data },
    })),
});