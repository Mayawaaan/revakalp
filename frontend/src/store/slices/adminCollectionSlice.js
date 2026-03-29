import { apiFetch } from "../../hooks/useApiHelper";


export const createAdminCollectionSlice = (set, get) => ({
    adminCollections: [],
    adminCollectionLoading: false,
    adminCollectionError: null,

    fetchAdminCollections: async () => {
        set({ adminCollectionLoading: true, adminCollectionError: null });
        try {
            const data = await apiFetch('/api/admin/collections', {
                token: get().token
            });

            set({
                adminCollections: data,
                adminCollectionLoading: false
            });

        } catch (error) {
            set({
                adminCollectionError: error.message,
                adminCollectionLoading: false
            });
        }
    },

    addAdminCollection: async (collectionData) => {
        set({ adminCollectionLoading: true, adminCollectionError: null });

        try {
            const newCollection = await apiFetch('/api/admin/collections', {
                method: 'POST',
                token: get().token,
                body: JSON.stringify(collectionData)
            });

            set((state) => ({
                adminCollections: [...state.adminCollections, newCollection],
                adminCollectionLoading: false
            }));

            return newCollection;

        } catch (error) {
            set({
                adminCollectionError: error.message,
                adminCollectionLoading: false
            });
            throw error;
        }
    },

    updateAdminCollection: async (id, data) => {
        set({ adminCollectionLoading: true, adminCollectionError: null });

        try {
            const updated = await apiFetch(`/api/admin/collections/${id}`, {
                method: 'PUT',
                token: get().token,
                body: JSON.stringify(data)
            });

            set((state) => ({
                adminCollections: state.adminCollections.map((c) =>
                    c._id === id ? updated : c
                ),
                adminCollectionLoading: false
            }));

            return updated;

        } catch (error) {
            set({
                adminCollectionError: error.message,
                adminCollectionLoading: false
            });
            throw error;
        }
    },

    deleteAdminCollection: async (id) => {
        set({ adminCollectionLoading: true, adminCollectionError: null });

        try {
            await apiFetch(`/api/admin/collections/${id}`, {
                method: 'DELETE',
                token: get().token
            });

            set((state) => ({
                adminCollections: state.adminCollections.filter((c) => c._id !== id),
                adminCollectionLoading: false
            }));

        } catch (error) {
            set({
                adminCollectionError: error.message,
                adminCollectionLoading: false
            });
            throw error;
        }
    }
});