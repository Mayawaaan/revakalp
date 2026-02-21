const normalizeCart = (cart) =>
  cart.items
    .filter((i) => i.productId)
    .map((i) => ({
    _id: i.productId._id ,
    name: i.productId.name,
    price: i.productId.price,
    discount: i.productId.discount,
    discountedPrice: i.productId.discountedPrice,
    image: i.productId.image || i.productId.images?.[0],
    size: i.size,
    quantity: i.quantity,
  }));

export const createCartSlice = (set, get) => ({
  cart: [],
  couponCode: "",
  discountPercentage: 0,

  /* ================= FETCH CART ================= */
  fetchCart: async () => {
    const res = await fetch("/api/cart", {
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch cart");

    set({
      cart: normalizeCart(data),
      couponCode: data.couponCode || "",
      discountPercentage: data.discountPercentage || 0,
    });
  },

  /* ================= ADD TO CART ================= */
  addToCart: async (productId, size) => {
    if (!productId || !size) {
      throw new Error("Product ID and size are required");
    }

    const res = await fetch("/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ productId, size }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to add to cart");

    set({
      cart: normalizeCart(data),
      couponCode: data.couponCode || "",
      discountPercentage: data.discountPercentage || 0,
    });
  },

  /* ================= UPDATE QUANTITY ================= */
  incrementQuantity: async (productId, size) => {
    const item = get().cart.find(
      (p) => p._id === productId && p.size === size
    );
    if (!item) return;

    const res = await fetch("/api/cart/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        productId,
        size,
        quantity: item.quantity + 1,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update cart");

    set({ cart: normalizeCart(data) });
  },

  decrementQuantity: async (productId, size) => {
    const item = get().cart.find(
      (p) => p._id === productId && p.size === size
    );
    if (!item) return;

    const res = await fetch("/api/cart/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        productId,
        size,
        quantity: item.quantity - 1,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update cart");

    set({ cart: normalizeCart(data) });
  },

  /* ================= REMOVE ITEM ================= */
  removeFromCart: async (productId, size) => {
    const res = await fetch("/api/cart/remove", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ productId, size }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to remove item");

    set({ cart: normalizeCart(data) });
  },

  /* ================= CLEAR CART ================= */
  clearCart: async () => {
    const res = await fetch("/api/cart/clear", {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to clear cart");

    set({ cart: [], couponCode: "", discountPercentage: 0 });
  },

  /* ================= COUPON ================= */
  applyCoupon: async (code) => {
    const res = await fetch("/api/cart/coupon/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ code }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Invalid coupon");

    set({
      cart: normalizeCart(data),
      couponCode: data.couponCode,
      discountPercentage: data.discountPercentage,
    });
  },

  removeCoupon: async () => {
    const res = await fetch("/api/cart/coupon/remove", {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to remove coupon");

    set({
      cart: normalizeCart(data),
      couponCode: "",
      discountPercentage: 0,
    });
  },

  /* ================= TOTALS ================= */
  getCartSubtotal: () =>
    get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0),

  getCartItemsDiscount: () =>
    get().cart.reduce((totalDiscount, item) => {
      const price = item.price;
      const discountedPrice = item.discountedPrice;
      if (discountedPrice && discountedPrice < price) {
        return totalDiscount + (price - discountedPrice) * item.quantity;
      }
      return totalDiscount;
    }, 0),

  getCartTotal: () => {
    const subtotal = get().getCartSubtotal();
    const itemsDiscount = get().getCartItemsDiscount();
    const subtotalAfterItemDiscounts = subtotal - itemsDiscount;
    const couponDiscount =
      (subtotalAfterItemDiscounts * get().discountPercentage) / 100;
    return subtotalAfterItemDiscounts - couponDiscount;
  },
});
