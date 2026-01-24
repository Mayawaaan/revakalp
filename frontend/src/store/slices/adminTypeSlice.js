export const createAdminTypeSlice = (set, get) => ({
  /* =========================
     STATE
  ========================= */
  adminTypes: [],
  adminTypeLoading: false,
  adminTypeError: null,

  /* =========================
     HELPERS
  ========================= */
  getAuthHeaders: () => {
    const token = get().token;
    return token
      ? {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        }
      : {
          Accept: "application/json",
        };
  },

  handleApiError: async (response) => {
    let message = "Something went wrong";

    try {
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        message = data?.message || message;
      } else {
        message = response.statusText || message;
      }
    } catch {
      message = response.statusText || message;
    }

    throw new Error(message);
  },

  /* =========================
     FETCH ALL TYPES
  ========================= */
  fetchAdminTypes: async () => {
    set({ adminTypeLoading: true, adminTypeError: null });

    try {
      const res = await fetch("/api/admin/types", {
        headers: get().getAuthHeaders(),
      });

      if (!res.ok) {
        await get().handleApiError(res);
      }

      const types = await res.json();

      set({
        adminTypes: Array.isArray(types) ? types : [],
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
     NOTE: formData MUST include:
     - name
     - slug (manual)
     - category
     - image
  ========================= */
  addAdminType: async (formData) => {
    set({ adminTypeLoading: true, adminTypeError: null });

    try {
      const res = await fetch("/api/admin/types", {
        method: "POST",
        headers: get().getAuthHeaders(), // never set Content-Type for FormData
        body: formData,
      });

      if (!res.ok) {
        await get().handleApiError(res);
      }

      const newType = await res.json();

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
     NOTE: formData MAY include:
     - name
     - slug (manual)
     - category
     - image OR existingImage
  ========================= */
  updateAdminType: async (typeId, formData) => {
    set({ adminTypeLoading: true, adminTypeError: null });

    try {
      const res = await fetch(`/api/admin/types/${typeId}`, {
        method: "PUT",
        headers: get().getAuthHeaders(),
        body: formData,
      });

      if (!res.ok) {
        await get().handleApiError(res);
      }

      const updatedType = await res.json();

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
      const res = await fetch(`/api/admin/types/${typeId}`, {
        method: "DELETE",
        headers: get().getAuthHeaders(),
      });

      if (!res.ok) {
        await get().handleApiError(res);
      }

      set((state) => ({
        adminTypes: state.adminTypes.filter((t) => t._id !== typeId),
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
