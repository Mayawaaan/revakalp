import { apiFetch } from "../../hooks/useApiHelper";

export const createAdminTypeSlice = (set, get) => ({
  /* =========================
     STATE
  ========================= */
  adminTypes: [],
  adminTypeLoading: false,
  adminTypeError: null,

  /* =========================
     FETCH ALL TYPES
  ========================= */
  fetchAdminTypes: async () => {
    set({ adminTypeLoading: true, adminTypeError: null });

    try {
      const data = await apiFetch("/api/admin/types");

      set({
        adminTypes: Array.isArray(data)
          ? data
          : data.types || [],
        adminTypeLoading: false,
      });
    } catch (error) {
      set({
        adminTypeError: error.message,
        adminTypeLoading: false,
      });
    }
  },

  /* =========================
     CREATE TYPE
  ========================= */
  addAdminType: async (formData) => {
    set({ adminTypeLoading: true, adminTypeError: null });

    try {
      const newType = await apiFetch("/api/admin/types", {
        method: "POST",
        body: formData,
      });

      set((state) => ({
        adminTypes: [...state.adminTypes, newType],
        adminTypeLoading: false,
      }));

      return newType;
    } catch (error) {
      set({
        adminTypeError: error.message,
        adminTypeLoading: false,
      });
      throw error;
    }
  },

  /* =========================
     UPDATE TYPE
  ========================= */
  updateAdminType: async (typeId, formData) => {
    set({ adminTypeLoading: true, adminTypeError: null });

    try {
      const updatedType = await apiFetch(
        `/api/admin/types/${typeId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      set((state) => ({
        adminTypes: state.adminTypes.map((t) =>
          t._id === typeId ? updatedType : t
        ),
        adminTypeLoading: false,
      }));

      return updatedType;
    } catch (error) {
      set({
        adminTypeError: error.message,
        adminTypeLoading: false,
      });
      throw error;
    }
  },

  /* =========================
     DELETE TYPE
  ========================= */
  deleteAdminType: async (typeId) => {
    set({ adminTypeLoading: true, adminTypeError: null });

    try {
      await apiFetch(`/api/admin/types/${typeId}`, {
        method: "DELETE",
      });

      set((state) => ({
        adminTypes: state.adminTypes.filter(
          (t) => t._id !== typeId
        ),
        adminTypeLoading: false,
      }));
    } catch (error) {
      set({
        adminTypeError: error.message,
        adminTypeLoading: false,
      });
      throw error;
    }
  },
});