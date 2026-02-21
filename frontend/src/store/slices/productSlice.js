export const createProductSlice = (set, get) => ({
  collections: [],
  sareeTypes: [],
  kurtaTypes: [],
  suitTypes: [],
  products: [],
  loading: false,
  error: null,
  fetchProducts: async (filters = {}) => {
    set({ loading: true, error: null });

    const { category, subCategory } = filters;
    const params = new URLSearchParams();
    if (category) {
      params.append("category", category);
    }
    if (subCategory) {
      params.append("subCategory", subCategory);
    }

    try {
      const [
        productsRes,
        collectionsRes,
        sareeTypesRes,
        kurtaTypesRes,
        suitTypesRes,
      ] = await Promise.all([
        fetch(`/api/products?${params.toString()}`),
        fetch("/api/collections"),
        fetch("/api/types/saree"),
        fetch("/api/types/kurta"),
        fetch("/api/types/suit"),
      ]);

      const products = await productsRes.json();
      const collections = await collectionsRes.json();
      const sareeTypes = await sareeTypesRes.json();
      const kurtaTypes = await kurtaTypesRes.json();
      const suitTypes = await suitTypesRes.json();

      set({
        collections,
        sareeTypes,
        kurtaTypes,
        suitTypes,
        products: products || [],
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  getProductById: (id) => {
    // return get().products.find(product => product._id === id);
    return get().products.find(product => product._id === id || product.id === id);
  },
  getProductsByCategory: (category) => {
    return get().products.filter(product => product.category.toLowerCase() === category.toLowerCase());
  },
  getProductsByType: (type) => {
    return get().products.filter(product => product.type.toLowerCase() === type.toLowerCase());
  },
  searchProducts: (query) => {
    const lowercaseQuery = query.toLowerCase();
    return get().products.filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery) ||
      product.subCategory.toLowerCase().includes(lowercaseQuery)
    );
  }
});
