import { getToken } from "../../utils/token";
export const createAdminProductSlice = (set, get) => ({
    adminProducts: [],
    adminProductLoading: false,
    adminProductError: null,

    // fetchAdminProducts: async () => {
    //     set({ adminProductLoading: true, adminProductError: null });
    //     try {
    //         const response = await fetch('/api/admin/products', {
    //             headers: {
    //                 'Authorization': `Bearer ${get().token}` // Assuming token is in the auth slice
    //             }
    //         });
    //         if (!response.ok) {
    //             throw new Error('Failed to fetch admin products');
    //         }
    //         const products = await response.json();
    //         set({ adminProducts: products, adminProductLoading: false });
    //     } catch (error) {
    //         set({ adminProductError: error.message, adminProductLoading: false });
    //     }
    // },
    fetchAdminProducts: async () => {
    set({ adminProductLoading: true, adminProductError: null });
    const token = getToken(); // ✅ pulled separately
    if (!token) {
      set({
        adminProductError: "Authentication token missing",
        adminProductLoading: false,
      });
      return;
    }
    try {
      const response = await fetch("/api/admin/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch admin products");
      }
      const products = await response.json();
      set({
        adminProducts: products,
        adminProductLoading: false,
      });
    } catch (error) {
      set({
        adminProductError: error.message,
        adminProductLoading: false,
      });
    }
  },

    // addAdminProduct: async (productData) => {
    //     set({ adminProductLoading: true, adminProductError: null });
    //     try {
    //         const response = await fetch('/api/admin/products', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${get().token}`
    //             },
    //             body: JSON.stringify(productData)
    //         });
    //         if (!response.ok) {
    //             const errorData = await response.json();
    //             throw new Error(errorData.message || 'Failed to add product');
    //         }
    //         const newProduct = await response.json();
    //         set((state) => ({
    //             adminProducts: [...state.adminProducts, newProduct],
    //             adminProductLoading: false
    //         }));
    //         return newProduct;
    //     } catch (error) {
    //         set({ adminProductError: error.message, adminProductLoading: false });
    //         throw error;
    //     }
    // },
    // 1. Using FormData to handle file uploads
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

      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to create product");

      const newProduct = await res.json();

      set((state) => ({
        adminProducts: [newProduct, ...state.adminProducts],
        adminProductLoading: false,
      }));

      return newProduct;
    } catch (err) {
      set({
        adminProductError: err.message,
        adminProductLoading: false,
      });
      throw err;
    }
  },

    // updateAdminProduct: async (product, productData) => {
    //     set({ adminProductLoading: true, adminProductError: null });
    //     try {
    //         const response = await fetch(`/api/admin/products/${product._id}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${get().token}`
    //             },
    //             body: JSON.stringify(productData)
    //         });
    //         if (!response.ok) {
    //             const errorData = await response.json();
    //             throw new Error(errorData.message || 'Failed to update product');
    //         }
    //         const updatedProduct = await response.json();
    //         set((state) => ({
    //             adminProducts: state.adminProducts.map((product) =>
    //                 product._id === product._id ? updatedProduct : product
    //             ),
    //             adminProductLoading: false
    //         }));
    //         return updatedProduct;
    //     } catch (error) {
    //         set({ adminProductError: error.message, adminProductLoading: false });
    //         throw error;
    //     }
    // },
// updateAdminProduct: async (product, productData) => {
//   set({ adminProductLoading: true, adminProductError: null });

//   try {
//     const response = await fetch(`/api/admin/products/${product._id}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${get().token}`
//       },
//       body: JSON.stringify(productData)
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Failed to update product');
//     }

//     const updatedProduct = await response.json();

//     set((state) => ({
//       adminProducts: state.adminProducts.map((p) =>
//         p._id === updatedProduct._id ? updatedProduct : p
//       ),
//       adminProductLoading: false
//     }));
    
//     return updatedProduct;
//   } catch (error) {
//     set({ adminProductError: error.message, adminProductLoading: false });
//     throw error;
//   }
// },
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

    const res = await fetch(`/api/admin/products/${product._id}`, {
      method: "PUT",
      body: formData,
      credentials: "include",
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to update product");
    }

    const updatedProduct = await res.json();

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

    deleteAdminProduct: async (productId) => {
        set({ adminProductLoading: true, adminProductError: null });
        try {
            const response = await fetch(`/api/admin/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${get().token}`
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete product');
            }
            set((state) => ({
                adminProducts: state.adminProducts.filter((product) => product._id !== productId),
                adminProductLoading: false
            }));
        } catch (error) {
            set({ adminProductError: error.message, adminProductLoading: false });
            throw error;
        }
    }
});