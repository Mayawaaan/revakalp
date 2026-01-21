export const createAdminCollectionSlice = (set, get) => ({
    adminCollections: [],
    adminCollectionLoading: false,
    adminCollectionError: null,

    fetchAdminCollections: async () => {
        set({ adminCollectionLoading: true, adminCollectionError: null });
        try {
            const response = await fetch('/api/admin/collections', {
                headers: {
                    'Authorization': `Bearer ${get().token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch admin collections');
            }
            const collections = await response.json();
            set({ adminCollections: collections, adminCollectionLoading: false });
        } catch (error) {
            set({ adminCollectionError: error.message, adminCollectionLoading: false });
        }
    },

    addAdminCollection: async (collectionData) => {
        set({ adminCollectionLoading: true, adminCollectionError: null });
        try {
            const response = await fetch('/api/admin/collections', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${get().token}`
                },
                body: JSON.stringify(collectionData)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add collection');
            }
            const newCollection = await response.json();
            set((state) => ({
                adminCollections: [...state.adminCollections, newCollection],
                adminCollectionLoading: false
            }));
            return newCollection;
        } catch (error) {
            set({ adminCollectionError: error.message, adminCollectionLoading: false });
            throw error;
        }
    },

    updateAdminCollection: async (collectionId, collectionData) => {
        set({ adminCollectionLoading: true, adminCollectionError: null });
        try {
            const response = await fetch(`/api/admin/collections/${collectionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${get().token}`
                },
                body: JSON.stringify(collectionData)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update collection');
            }
            const updatedCollection = await response.json();
            set((state) => ({
                adminCollections: state.adminCollections.map((collection) =>
                    collection._id === collectionId ? updatedCollection : collection
                ),
                adminCollectionLoading: false
            }));
            return updatedCollection;
        } catch (error) {
            set({ adminCollectionError: error.message, adminCollectionLoading: false });
            throw error;
        }
    },

    deleteAdminCollection: async (collectionId) => {
        set({ adminCollectionLoading: true, adminCollectionError: null });
        try {
            const response = await fetch(`/api/admin/collections/${collectionId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${get().token}`
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete collection');
            }
            set((state) => ({
                adminCollections: state.adminCollections.filter((collection) => collection._id !== collectionId),
                adminCollectionLoading: false
            }));
        } catch (error) {
            set({ adminCollectionError: error.message, adminCollectionLoading: false });
            throw error;
        }
    }
});
