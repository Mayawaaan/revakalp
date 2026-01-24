export const createTypeSlice = (set, get) => ({
  /* =========================
     STATE
  ========================= */
  sareeTypes: [],
  suitTypes: [],
  kurtaTypes: [],
  typeLoading: false,
  typeError: null,

  /* =========================
     FETCH TYPES BY CATEGORY
  ========================= */
  fetchTypesByCategory: async (category) => {
    set({ typeLoading: true, typeError: null });

    try {
      const res = await fetch(`/api/types/${category}`);

      if (!res.ok) {
        throw new Error("Failed to fetch types");
      }

      const types = await res.json();

      if (category === "saree") {
        set({ sareeTypes: types });
      } else if (category === "suit") {
        set({ suitTypes: types });
      } else if (category === "kurta") {
        set({ kurtaTypes: types });
      }

      set({ typeLoading: false });
    } catch (error) {
      set({
        typeError: error.message,
        typeLoading: false,
      });
    }
  },
});
