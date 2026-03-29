import { apiFetch } from "../../hooks/useApiHelper";

export const createAdminProductSlice = (set, get) => ({
  adminProducts: [],
  adminProductLoading: false,
  adminProductError: null,

  // ✅ FETCH PRODUCTS
  fetchAdminProducts: async () => {
    set({ adminProductLoading: true, adminProductError: null });

    try {
      const data = await apiFetch("/api/admin/products");

      set({
        adminProducts: Array.isArray(data)
          ? data
          : data.products || [],
        adminProductLoading: false,
      });

    } catch (error) {
      set({
        adminProductError: error.message,
        adminProductLoading: false,
      });
    }
  },

  // ✅ ADD PRODUCT (FormData + TOKEN FIXED)
  addAdminProduct: async (productData) => {
    set({ adminProductLoading: true, adminProductError: null });

    try {
      const formData = new FormData();

      Object.entries(productData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => formData.append(key, v));
        } else {
          formData.append(key, value);
        }
      });

      const newProduct = await apiFetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });

      set((state) => ({
        adminProducts: [newProduct, ...state.adminProducts],
        adminProductLoading: false,
      }));

      return newProduct;

    } catch (error) {
      set({
        adminProductError: error.message,
        adminProductLoading: false,
      });
      throw error;
    }
  },

  // ✅ UPDATE PRODUCT
  updateAdminProduct: async (product, productData) => {
    set({ adminProductLoading: true, adminProductError: null });

    try {
      const formData = new FormData();

      Object.entries(productData).forEach(([key, value]) => {
        if (key === "images" && Array.isArray(value)) {
          value.forEach((file) => {
            formData.append("images", file);
          });
        } else if (Array.isArray(value)) {
          value.forEach((v) => formData.append(key, v));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const updatedProduct = await apiFetch(
        `/api/admin/products/${product._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      set((state) => ({
        adminProducts: state.adminProducts.map((p) =>
          p._id === updatedProduct._id ? updatedProduct : p
        ),
        adminProductLoading: false,
      }));

      return updatedProduct;

    } catch (error) {
      set({
        adminProductError: error.message,
        adminProductLoading: false,
      });
      throw error;
    }
  },

  // ✅ DELETE SINGLE
  deleteAdminProduct: async (productId) => {
    set({ adminProductLoading: true, adminProductError: null });

    try {
      await apiFetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      set((state) => ({
        adminProducts: state.adminProducts.filter(
          (p) => p._id !== productId
        ),
        adminProductLoading: false,
      }));

    } catch (error) {
      set({
        adminProductError: error.message,
        adminProductLoading: false,
      });
      throw error;
    }
  },

  // ✅ DELETE ALL
  deleteAllAdminProducts: async () => {
    set({ adminProductLoading: true, adminProductError: null });

    try {
      await apiFetch(`/api/admin/products`, {
        method: "DELETE",
      });

      set({
        adminProducts: [],
        adminProductLoading: false,
      });

    } catch (error) {
      set({
        adminProductError: error.message,
        adminProductLoading: false,
      });
      throw error;
    }
  },
});