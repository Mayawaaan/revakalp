import { apiFetch } from "../../hooks/useApiHelper";

export const createPaymentSlice = (set) => ({
  paymentLoading: false,
  paymentError: null,

  createRazorpayOrder: async ({
    shippingAddress,
    paymentMethod = "razorpay",
    notes = "",
  }) => {
    try {
      set({ paymentLoading: true, paymentError: null });

      const data = await apiFetch("/api/payment/create-order", {
        method: "POST",
        body: JSON.stringify({
          shippingAddress,
          paymentMethod,
          notes,
        }),
      });

      return data;
    } catch (error) {
      set({ paymentError: error.message });
      throw error;
    } finally {
      set({ paymentLoading: false });
    }
  },

  verifyRazorpayPayment: async (paymentData) => {
    try {
      set({ paymentLoading: true, paymentError: null });

      return await apiFetch("/api/payment/verify-payment", {
        method: "POST",
        body: JSON.stringify(paymentData),
      });
    } catch (error) {
      set({ paymentError: error.message });
      throw error;
    } finally {
      set({ paymentLoading: false });
    }
  },

  cancelPendingPayment: async ({ internalOrderId, gatewayOrderId }) => {
    try {
      set({ paymentLoading: true, paymentError: null });

      return await apiFetch("/api/payment/cancel-order", {
        method: "POST",
        body: JSON.stringify({ internalOrderId, gatewayOrderId }),
      });
    } catch (error) {
      set({ paymentError: error.message });
      throw error;
    } finally {
      set({ paymentLoading: false });
    }
  },
});
