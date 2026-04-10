import { apiFetch } from "../../hooks/useApiHelper";

export const createReviewSlice = (set, get) => ({
  reviews: [],
  sentimentBreakdown: null,
  positivityPercentage: 0,
  status: "idle",
  error: null,

  /* ================= FETCH REVIEWS ================= */
  fetchReviews: async (productId) => {
    set({ status: "loading", error: null });

    try {
      const data = await apiFetch(`/api/reviews/${productId}`);

      set({
        status: "succeeded",
        reviews: data.reviews || [],
        sentimentBreakdown: data.sentimentBreakdown || null,
        positivityPercentage: data.positivityPercentage || 0,
      });

    } catch (error) {
      set({
        status: "failed",
        error: error.message,
      });
    }
  },

  /* ================= ADD REVIEW ================= */
  addReview: async ({ productId, rating, reviewText }) => {
    try {
      const data = await apiFetch("/api/reviews", {
        method: "POST",
        body: JSON.stringify({
          productId,
          rating,
          reviewText,
        }),
      });

      set((state) => ({
        reviews: [...state.reviews, data],
      }));

      get().showToast("Review added successfully", "success");

    } catch (error) {
      if (
        error.message ===
        "You have already reviewed this product"
      ) {
        get().showToast(
          "You have already submitted a review for this product.",
          "info"
        );
      } else {
        set({ error: error.message });
        get().showToast(error.message, "error");
      }
    }
  },
});