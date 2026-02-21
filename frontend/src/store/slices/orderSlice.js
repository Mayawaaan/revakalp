export const createOrderSlice = (set, get) => ({
  orders: [],
  orderLoading: false,
  currentOrder: null,

  /* ================= FETCH ORDERS ================= */
  fetchOrders: async () => {
    set({ orderLoading: true });

    try {
      const res = await fetch("/api/orders", {
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch orders");

      set({
        orders: data,
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
      const res = await fetch("/api/orders/place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to place order");

      set((state) => ({
        orders: [data, ...state.orders],
        currentOrder: data,
      }));

      // ✅ Clear cart after successful order
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
    const res = await fetch(`/api/orders/${orderId}`, {
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch order");

    return data;
  },

  /* ================= TRACK ORDER ================= */
  trackOrder: async (orderId) => {
    const res = await fetch(`/api/orders/${orderId}/track`, {
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to track order");

    return data;
  },

  /* ================= REORDER ITEMS ================= */
  reorderItems: async (orderId) => {
    const res = await fetch(`/api/orders/reorder/${orderId}`, {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to reorder items");

    return data;
  },

  /* ================= DOWNLOAD INVOICE ================= */
  downloadInvoice: async (orderId) => {
    const res = await fetch(`/api/orders/${orderId}/invoice`, {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to download invoice");

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${orderId}.pdf`;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  /* ================= LEGACY SUPPORT ================= */
  addOrder: (order) =>
    set((state) => ({
      orders: [...state.orders, order],
    })),
});
