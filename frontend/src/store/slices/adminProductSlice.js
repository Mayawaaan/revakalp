export const createAdminProductSlice = (set, get) => ({
    adminProducts: [],
    adminProductLoading: false,
    adminProductError: null,

    fetchAdminProducts: async () => {
        set({ adminProductLoading: true, adminProductError: null });
        try {
            const response = await fetch('/api/admin/products', {
                headers: {
                    'Authorization': `Bearer ${get().token}` // Assuming token is in the auth slice
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch admin products');
            }
            const products = await response.json();
            set({ adminProducts: products, adminProductLoading: false });
        } catch (error) {
            set({ adminProductError: error.message, adminProductLoading: false });
        }
    },

    addAdminProduct: async (productData) => {
        set({ adminProductLoading: true, adminProductError: null });
        try {
            const response = await fetch('/api/admin/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${get().token}`
                },
                body: JSON.stringify(productData)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add product');
            }
            const newProduct = await response.json();
            set((state) => ({
                adminProducts: [...state.adminProducts, newProduct],
                adminProductLoading: false
            }));
            return newProduct;
        } catch (error) {
            set({ adminProductError: error.message, adminProductLoading: false });
            throw error;
        }
    },

    updateAdminProduct: async (productId, productData) => {
        set({ adminProductLoading: true, adminProductError: null });
        try {
            const response = await fetch(`/api/admin/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${get().token}`
                },
                body: JSON.stringify(productData)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update product');
            }
            const updatedProduct = await response.json();
            set((state) => ({
                adminProducts: state.adminProducts.map((product) =>
                    product._id === productId ? updatedProduct : product
                ),
                adminProductLoading: false
            }));
            return updatedProduct;
        } catch (error) {
            set({ adminProductError: error.message, adminProductLoading: false });
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