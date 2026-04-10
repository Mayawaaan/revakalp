import { apiFetch } from "../../hooks/useApiHelper";

export const createProductSlice = (set, get) => ({
  collections: [],
  sareeTypes: [],
  kurtaTypes: [],
  suitTypes: [],
  products: [],
  loading: false,
  error: null,

  /* ================= FETCH PRODUCTS ================= */
  fetchProducts: async (filters = {}) => {
    set({ loading: true, error: null });

    const { category, subCategory } = filters;

    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (subCategory) params.append("subCategory", subCategory);

    const query = params.toString();
    const url = query ? `/api/products?${query}` : `/api/products`;

    try {
      const [
        productsRes,
        collectionsRes,
        sareeTypesRes,
        kurtaTypesRes,
        suitTypesRes,
      ] = await Promise.all([
        apiFetch(url),
        apiFetch("/api/collections"),
        apiFetch("/api/types/saree"),
        apiFetch("/api/types/kurta"),
        apiFetch("/api/types/suit"),
      ]);

      // ✅ robust normalization
      const products =
        Array.isArray(productsRes)
          ? productsRes
          : productsRes?.products ||
            productsRes?.data ||
            [];

      const collections =
        Array.isArray(collectionsRes)
          ? collectionsRes
          : collectionsRes?.collections || [];

      const sareeTypes =
        Array.isArray(sareeTypesRes)
          ? sareeTypesRes
          : sareeTypesRes?.types || [];

      const kurtaTypes =
        Array.isArray(kurtaTypesRes)
          ? kurtaTypesRes
          : kurtaTypesRes?.types || [];

      const suitTypes =
        Array.isArray(suitTypesRes)
          ? suitTypesRes
          : suitTypesRes?.types || [];

      set({
        products,
        collections,
        sareeTypes,
        kurtaTypes,
        suitTypes,
        loading: false,
      });

    } catch (error) {
      console.error("Fetch products error:", error);

      set({
        error: error.message || "Failed to fetch products",
        loading: false,
      });
    }
  },

  /* ================= GET BY ID ================= */
  getProductById: (id) => {
    return get().products.find(
      (p) => p?._id === id || p?.id === id
    );
  },

  /* ================= FILTER BY CATEGORY ================= */
  getProductsByCategory: (category) => {
    if (!category) return [];

    return get().products.filter(
      (p) =>
        p?.category?.toLowerCase() ===
        category.toLowerCase()
    );
  },

  /* ================= FILTER BY TYPE ================= */
  getProductsByType: (type) => {
    if (!type) return [];

    return get().products.filter(
      (p) =>
        p?.type?.toLowerCase() === type.toLowerCase()
    );
  },

  /* ================= SEARCH ================= */
  searchProducts: (query) => {
    if (!query) return get().products;

    const q = query.toLowerCase();

    return get().products.filter((p) =>
      p?.name?.toLowerCase().includes(q) ||
      p?.description?.toLowerCase().includes(q) ||
      p?.category?.toLowerCase().includes(q) ||
      p?.subCategory?.toLowerCase().includes(q)
    );
  },
});