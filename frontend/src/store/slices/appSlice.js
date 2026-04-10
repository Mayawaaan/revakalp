export const createAppSlice = (set, get) => ({
  /* =========================
     SEARCH STATE
  ========================= */
  showSearch: false,
  search: "",

  setShowSearch: (show) =>
    set({ showSearch: Boolean(show) }),

  setSearch: (search) =>
    set({ search: search || "" }),

  /* =========================
     TOAST STATE
  ========================= */
  toast: {
    message: "",
    type: "", // success | error | info
  },

  showToast: (message, type = "info") => {
    set({
      toast: {
        message: message || "",
        type: type || "info",
      },
    });

    // ✅ Auto-hide after 3 seconds
    setTimeout(() => {
      // prevent overriding newer toast
      const current = get().toast;
      if (current.message === message) {
        set({
          toast: { message: "", type: "" },
        });
      }
    }, 3000);
  },

  hideToast: () =>
    set({
      toast: { message: "", type: "" },
    }),
});