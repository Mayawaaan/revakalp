import { getToken } from "../../utils/token";

export const createPaymentSlice = (set, get) => ({
  paymentLoading: false,
  paymentError: null,

  createRazorpayOrder: async ({ amount, currency = "INR" }) => {
    try {
      set({ paymentLoading: true, paymentError: null });

      const token = getToken();
      console.log("Token:", token);
      if (!token) throw new Error("Unauthorized");
      console.log("Token:", token);

      const res = await fetch(`/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: Math.round(amount),
          currency,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create Razorpay order");
      }

      const data = await res.json();
      return data.order;
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

      const token = getToken();
      console.log("Token:", token);
      if (!token) throw new Error("Unauthorized");

      const res = await fetch(`/api/payment/verify-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Payment verification failed");
      }

      return await res.json();
    } catch (error) {
      set({ paymentError: error.message });
      throw error;
    } finally {
      set({ paymentLoading: false });
    }
  },
});
