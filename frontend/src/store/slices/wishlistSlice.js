
export const createWishlistSlice = (set, get) => ({
  wishlist: [],
  addToWishlist: (productId) => {
    const product = get().products.find(
      (p) => (p._id || p.id) === productId
    );
    if (!product) return;

    set((state) => {
      const existingProduct = state.wishlist.find(
        (p) => (p._id || p.id) === productId
      );
      if (!existingProduct) {
        return { wishlist: [...state.wishlist, product] };
      }
      return state;
    });
  },
  removeFromWishlist: (productId) => {
    set((state) => ({
      wishlist: state.wishlist.filter(
        (p) => (p._id || p.id) !== productId
      ),
    }));
  },
});
