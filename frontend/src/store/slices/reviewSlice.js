import { apiFetch } from "../../hooks/useApiHelper";

function computeSentimentMetrics(reviews = []) {
  const sentimentBreakdown = {
    positive: 0,
    neutral: 0,
    negative: 0,
  };

  for (const r of reviews) {
    if (r?.sentiment && sentimentBreakdown[r.sentiment] !== undefined) {
      sentimentBreakdown[r.sentiment]++;
    }
  }

  const total = reviews.length;
  const positivityPercentage =
    total > 0
      ? Math.round(
          ((sentimentBreakdown.positive + 0.5 * sentimentBreakdown.neutral) /
            total) *
            100
        )
      : 0;

  return { sentimentBreakdown, positivityPercentage };
}

export const createReviewSlice = (set, get) => ({
  reviews: [],
  sentimentBreakdown: null,
  positivityPercentage: 0,
  averageConfidence: 0,
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
        averageConfidence: data.averageConfidence || 0,
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

      set((state) => {
        const nextReviews = [data, ...(state.reviews || [])];
        const metrics = computeSentimentMetrics(nextReviews);
        return {
          reviews: nextReviews,
          ...metrics,
        };
      });

      get().showToast("Review added successfully", "success");
      return true;
    } catch (error) {
      if (error.message === "You have already reviewed this product") {
        get().showToast(
          "You have already submitted a review for this product.",
          "info"
        );
      } else {
        set({ error: error.message });
        get().showToast(error.message, "error");
      }
      return false;
    }
  },
});
