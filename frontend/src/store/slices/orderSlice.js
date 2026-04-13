import { apiFetch } from "../../hooks/useApiHelper";

export const createOrderSlice = (set, get) => ({
  orders: [],
  orderLoading: false,
  currentOrder: null,

  /* ================= FETCH ORDERS ================= */
  fetchOrders: async () => {
    set({ orderLoading: true });

    try {
      const data = await apiFetch("/api/orders");

      set({
        orders: Array.isArray(data) ? data : data.orders || [],
        orderLoading: false,
      });

      return data;
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      set({ orderLoading: false });
      return [];
    }
  },

  /* ================= PLACE ORDER ================= */
  placeOrder: async (orderData) => {
    try {
      const data = await apiFetch("/api/orders/place", {
        method: "POST",
        body: JSON.stringify(orderData),
      });

      set((state) => ({
        orders: [data, ...state.orders],
        currentOrder: data,
      }));

      // ✅ Clear cart safely
      if (get().clearCart) {
        await get().clearCart();
      }

      return data;
    } catch (error) {
      console.error("Failed to place order:", error);
      throw error;
    }
  },

  /* ================= GET ORDER BY ID ================= */
  getOrderById: async (orderId) => {
    return await apiFetch(`/api/orders/${orderId}`);
  },

  /* ================= TRACK ORDER ================= */
  trackOrder: async (orderId) => {
    return await apiFetch(`/api/orders/${orderId}/track`);
  },

  /* ================= REORDER ================= */
  reorderItems: async (orderId) => {
    return await apiFetch(`/api/orders/reorder/${orderId}`, {
      method: "POST",
    });
  },

  /* ================= DOWNLOAD INVOICE ================= */
  downloadInvoice: async (orderId) => {
  try {
    const blob = await apiFetch(`/api/orders/${orderId}/invoice`, {
      method: "GET",
      isBlob: true, // 👈 you need to support this in apiFetch
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${orderId}.pdf`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error("Invoice download failed:", error);
    throw error;
  }
},

  /* ================= LEGACY SUPPORT ================= */
  addOrder: (order) =>
    set((state) => ({
      orders: [...state.orders, order],
    })),
});