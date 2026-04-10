import { apiFetch } from "../../hooks/useApiHelper";

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
    if (!category) return;

    set({ typeLoading: true, typeError: null });

    try {
      const data = await apiFetch(`/api/types/${category}`);

      const types = Array.isArray(data)
        ? data
        : data?.types || [];

      if (category === "saree") {
        set({ sareeTypes: types });
      } else if (category === "suit") {
        set({ suitTypes: types });
      } else if (category === "kurta") {
        set({ kurtaTypes: types });
      }

      set({ typeLoading: false });

    } catch (error) {
      console.error("Type fetch error:", error);

      set({
        typeError: error.message,
        typeLoading: false,
      });
    }
  },
});