import { apiFetch } from "../../hooks/useApiHelper";

export const createWishlistSlice = (set, get) => ({
  wishlist: { items: [] },
  wishlistLoading: false,

  /* ================= FETCH ================= */
  fetchWishlist: async () => {
    set({ wishlistLoading: true });

    try {
      const data = await apiFetch("/api/wishlist");

      set({
        wishlist: data || { items: [] },
        wishlistLoading: false,
      });

      return data;

    } catch (error) {
      console.error("Failed to fetch wishlist:", error);

      // handle unauthenticated user
      if (error.message.toLowerCase().includes("unauthorized")) {
        set({ wishlist: { items: [] } });
      }

      set({ wishlistLoading: false });
      return null;
    }
  },

  /* ================= ADD ================= */
  addToWishlist: async (productId) => {
    try {
      const data = await apiFetch(`/api/wishlist/add/${productId}`, {
        method: "POST",
      });

      set({ wishlist: data });

      get().showToast?.("Added to wishlist", "success");

    } catch (error) {
      console.error("Error adding to wishlist:", error);
      get().showToast?.(error.message, "error");
    }
  },

  /* ================= REMOVE ================= */
  removeFromWishlist: async (productId) => {
    try {
      const data = await apiFetch(`/api/wishlist/remove/${productId}`, {
        method: "DELETE",
      });

      set({ wishlist: data });

      get().showToast?.("Removed from wishlist", "info");

    } catch (error) {
      console.error("Error removing from wishlist:", error);
      get().showToast?.(error.message, "error");
    }
  },
});