import { apiFetch } from "../../hooks/useApiHelper";

const normalizeCart = (cart) =>
  (cart.items || [])
    .filter((i) => i.productId)
    .map((i) => ({
      _id: i.productId._id,
      name: i.productId.name || "",
      price: i.productId.price || 0,
      discount: i.productId.discount || 0,
      discountedPrice: i.productId.discountedPrice || i.productId.price,
      image: i.productId.image || i.productId.images?.[0] || "",
      size: i.size,
      quantity: i.quantity || 1,
    }));

export const createCartSlice = (set, get) => ({
  cart: [],
  couponCode: "",
  discountPercentage: 0,

  /* ================= FETCH CART ================= */
  fetchCart: async () => {
    try {
      const data = await apiFetch("/api/cart");

      set({
        cart: normalizeCart(data),
        couponCode: data.couponCode || "",
        discountPercentage: data.discountPercentage || 0,
      });
    } catch (error) {
      console.error("Fetch cart error:", error);
    }
  },

  /* ================= ADD TO CART ================= */
  addToCart: async (productId, size) => {
    if (!productId || !size) {
      throw new Error("Product ID and size are required");
    }

    const data = await apiFetch("/api/cart/add", {
      method: "POST",
      body: JSON.stringify({ productId, size }),
    });

    set({
      cart: normalizeCart(data),
      couponCode: data.couponCode || "",
      discountPercentage: data.discountPercentage || 0,
    });
  },

  /* ================= UPDATE ================= */
  incrementQuantity: async (productId, size) => {
    const item = get().cart.find(
      (p) => p._id === productId && p.size === size
    );
    if (!item) return;

    const data = await apiFetch("/api/cart/update", {
      method: "PUT",
      body: JSON.stringify({
        productId,
        size,
        quantity: item.quantity + 1,
      }),
    });

    set({ cart: normalizeCart(data) });
  },

  decrementQuantity: async (productId, size) => {
    const item = get().cart.find(
      (p) => p._id === productId && p.size === size
    );
    if (!item) return;

    const data = await apiFetch("/api/cart/update", {
      method: "PUT",
      body: JSON.stringify({
        productId,
        size,
        quantity: item.quantity - 1,
      }),
    });

    set({ cart: normalizeCart(data) });
  },

  /* ================= REMOVE ================= */
  removeFromCart: async (productId, size) => {
    const data = await apiFetch("/api/cart/remove", {
      method: "DELETE",
      body: JSON.stringify({ productId, size }),
    });

    set({ cart: normalizeCart(data) });
  },

  /* ================= CLEAR ================= */
  clearCart: async () => {
    await apiFetch("/api/cart/clear", {
      method: "DELETE",
    });

    set({
      cart: [],
      couponCode: "",
      discountPercentage: 0,
    });
  },

  /* ================= COUPON ================= */
  applyCoupon: async (code) => {
    const data = await apiFetch("/api/cart/coupon/apply", {
      method: "POST",
      body: JSON.stringify({ code }),
    });

    set({
      cart: normalizeCart(data),
      couponCode: data.couponCode || "",
      discountPercentage: data.discountPercentage || 0,
    });
  },

  removeCoupon: async () => {
    const data = await apiFetch("/api/cart/coupon/remove", {
      method: "DELETE",
    });

    set({
      cart: normalizeCart(data),
      couponCode: "",
      discountPercentage: 0,
    });
  },

  /* ================= TOTALS ================= */
  getCartSubtotal: () =>
    get().cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ),

  getCartItemsDiscount: () =>
    get().cart.reduce((total, item) => {
      const price = item.price;
      const discounted = item.discountedPrice;

      if (discounted && discounted < price) {
        return total + (price - discounted) * item.quantity;
      }

      return total;
    }, 0),

  getCartTotal: () => {
    const subtotal = get().getCartSubtotal();
    const itemDiscount = get().getCartItemsDiscount();

    const afterDiscount = subtotal - itemDiscount;

    const couponDiscount =
      (afterDiscount * get().discountPercentage) / 100;

    return afterDiscount - couponDiscount;
  },
});