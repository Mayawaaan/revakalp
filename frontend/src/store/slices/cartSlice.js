import axios from 'axios';

export const createCartSlice = (set, get) => ({
    cart: [],
    couponCode: '',
    discountPercentage: 0,
    
    // Currency and delivery fee now come from settings (functions to avoid initialization issues)
    getCurrency: () => {
        try {
            const settings = get().settings;
            return (settings && settings.currencySymbol) ? settings.currencySymbol : '₹';
        } catch {
            return '₹';
        }
    },
    getBaseDeliveryFee: () => {
        try {
            const settings = get().settings;
            return (settings && typeof settings.deliveryFee !== 'undefined') ? settings.deliveryFee : 50;
        } catch {
            return 50;
        }
    },
    getFreeShippingThreshold: () => {
        try {
            const settings = get().settings;
            return (settings && typeof settings.freeShippingThreshold !== 'undefined') ? settings.freeShippingThreshold : 500;
        } catch {
            return 500;
        }
    },
    // Legacy getters for backward compatibility (wrapped in try-catch)
    get currency() {
        try {
            const settings = get().settings;
            return (settings && settings.currencySymbol) ? settings.currencySymbol : '₹';
        } catch {
            return '₹';
        }
    },
    get delivery_fee() {
        try {
            const settings = get().settings;
            return (settings && typeof settings.deliveryFee !== 'undefined') ? settings.deliveryFee : 50;
        } catch {
            return 50;
        }
    },
    get freeShippingThreshold() {
        try {
            const settings = get().settings;
            return (settings && typeof settings.freeShippingThreshold !== 'undefined') ? settings.freeShippingThreshold : 500;
        } catch {
            return 500;
        }
    },
    addToCart: (product, size) => {
        if (!product || !size) return;

        set((state) => {
            const existingProduct = state.cart.find((p) => p._id === product._id && p.size === size);
            if (existingProduct) {
                return {
                    cart: state.cart.map((p) =>
                        (p._id === product._id && p.size === size) ? {
                            ...p,
                            quantity: p.quantity + 1
                        } : p
                    ),
                };
            } else {
                return {
                    cart: [...state.cart, {
                        ...product,
                        quantity: 1,
                        size: size
                    }]
                };
            }
        });
    },
    removeFromCart: (productId, size) => {
        set((state) => ({
            cart: state.cart.filter((p) => !(p._id === productId && p.size === size)),
        }));
    },
    incrementQuantity: (productId, size) => {
        set((state) => ({
            cart: state.cart.map((p) =>
                (p._id === productId && p.size === size) ? {
                    ...p,
                    quantity: p.quantity + 1
                } : p
            ),
        }));
    },
    decrementQuantity: (productId, size) => {
        set((state) => ({
            cart: state.cart
                .map((p) =>
                    (p._id === productId && p.size === size) ? {
                        ...p,
                        quantity: p.quantity - 1
                    } : p
                )
                .filter((p) => p.quantity > 0),
        }));
    },
    applyCoupon: async (code) => {
        try {
            const res = await axios.post('/api/coupons/verify', { code });
            const { discountPercentage } = res.data;
            set({
                couponCode: code,
                discountPercentage: discountPercentage
            });
        } catch (error) {
            console.error('Failed to apply coupon:', error);
            // Optionally, show a toast message to the user
            throw error.response.data;
        }
    },
    removeCoupon: () => {
        set({
            couponCode: '',
            discountPercentage: 0
        });
    },
    getCartSubtotal: () => {
        const cart = get().cart;
        if (!cart || cart.length === 0) return 0;
        return cart.reduce((total, item) => {
            const price = item.price || 0;
            const quantity = item.quantity || 0;
            return total + price * quantity;
        }, 0);
    },
    getCartTotal: () => {
        const subtotal = get().getCartSubtotal();
        const discount = (subtotal * get().discountPercentage) / 100;
        const freeShippingThreshold = get().getFreeShippingThreshold();
        const deliveryFee = subtotal >= freeShippingThreshold ? 0 : get().getBaseDeliveryFee();
        return subtotal - discount + deliveryFee;
    },
    getDeliveryFee: () => {
        const subtotal = get().getCartSubtotal();
        const freeShippingThreshold = get().getFreeShippingThreshold();
        return subtotal >= freeShippingThreshold ? 0 : get().getBaseDeliveryFee();
    },
    clearCart: () => set({
        cart: [],
        couponCode: '',
        discountPercentage: 0
    }),
});