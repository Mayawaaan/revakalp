import { getToken } from "../../utils/token";

export const createReviewSlice = (set, get) => ({
  reviews: [],
  sentimentBreakdown: null,
  positivityPercentage: 0,
  status: "idle",
  error: null,

  // ----------------------------
  // FETCH REVIEWS (GET)
  // ----------------------------
  fetchReviews: async (productId) => {
    set({ status: "loading", error: null });

    try {
      const res = await fetch(
        `http://localhost:5000/api/reviews/${productId}`
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch reviews");
      }

      const { reviews, sentimentBreakdown, positivityPercentage } =
        await res.json();

      set({
        status: "succeeded",
        reviews,
        sentimentBreakdown,
        positivityPercentage,
      });
    } catch (error) {
      set({
        status: "failed",
        error: error.message,
      });
    }
  },

  // ----------------------------
  // ADD REVIEW (POST – AUTH)
  // ----------------------------
  addReview: async ({ productId, rating, reviewText }) => {
    try {
      const token = getToken();
      if (!token) throw new Error("Authentication token missing");

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          rating,
          reviewText,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to add review");
      }

      console.log("Review added successfully");

      const data = await res.json();

      set((state) => ({
        reviews: [...state.reviews, data],
      }));
    } catch (error) {
      if (error.message === "You have already reviewed this product") {
        get().showToast("You have already submitted a review for this product.", "info");
      } else {
        set({ error: error.message });
      }
    }
  },
});
