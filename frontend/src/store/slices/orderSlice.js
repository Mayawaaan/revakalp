import axios from 'axios';

export const createOrderSlice = (set, get) => ({
    orders: [],
    orderLoading: false,
    currentOrder: null,

    fetchOrders: async () => {
        set({
            orderLoading: true
        });
        try {
            const res = await axios.get('/api/orders');
            set({
                orders: res.data,
                orderLoading: false
            });
            return res.data;
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            set({
                orderLoading: false
            });
            return [];
        }
    },

    placeOrder: async (orderData) => {
        try {
            const res = await axios.post('/api/orders/place', orderData);
            const newOrder = res.data;
            set((state) => ({
                orders: [newOrder, ...state.orders],
                currentOrder: newOrder
            }));
            // Clear cart after successful order
            get().clearCart();
            return newOrder;
        } catch (error) {
            console.error('Failed to place order:', error);
            if (error.response && error.response.data) {
                throw error.response.data;
            }
            throw error;
        }
    },

    getOrderById: async (orderId) => {
        try {
            const res = await axios.get(`/api/orders/${orderId}`);
            return res.data;
        } catch (error) {
            console.error('Failed to fetch order:', error);
            throw error;
        }
    },

    trackOrder: async (orderId) => {
        try {
            const res = await axios.get(`/api/orders/${orderId}/track`);
            return res.data;
        } catch (error) {
            console.error('Failed to track order:', error);
            throw error;
        }
    },

    reorderItems: async (orderId) => {
        try {
            const res = await axios.post(`/api/orders/reorder/${orderId}`);
            // Refresh cart if needed
            return res.data;
        } catch (error) {
            console.error('Failed to reorder:', error);
            throw error;
        }
    },

    downloadInvoice: async (orderId) => {
        try {
            const res = await axios.get(`/api/orders/${orderId}/invoice`, {
                responseType: 'blob',
            });
            const blob = new Blob([res.data], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `invoice-${orderId}.pdf`;
            link.click();
            window.URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Failed to download invoice:', error);
            throw error;
        }
    },

    // Legacy support
    addOrder: (order) => set((state) => ({
        orders: [...state.orders, order]
    })),
});