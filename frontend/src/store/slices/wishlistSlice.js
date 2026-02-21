import axios from 'axios';

export const createWishlistSlice = (set) => ({
  wishlist: null,
  wishlistLoading: false,

  fetchWishlist: async () => {
    set({ wishlistLoading: true });
    try {
      const res = await axios.get('/api/wishlist');
      set({ wishlist: res.data, wishlistLoading: false });
      return res.data;
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      set({ wishlistLoading: false });
      // If the user is not logged in, the request might fail.
      // In that case, we can set the wishlist to an empty state.
      if (error.response && error.response.status === 401) {
        set({ wishlist: { items: [] } });
      }
      return null;
    }
  },

  addToWishlist: async (productId) => {
    try {
      const res = await axios.post(`/api/wishlist/add/${productId}`);
      set({ wishlist: res.data });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      // Optionally show a toast message
    }
  },

  removeFromWishlist: async (productId) => {
    try {
      const res = await axios.delete(`/api/wishlist/remove/${productId}`);
      set({ wishlist: res.data });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      // Optionally show a toast message
    }
  },
});