import React, { useState } from "react";
import useStore from "../../../store/store";
import CartTotal from "../../../components/cart/CartTotal";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

const Cart = () => {
  const {
    currency,
    cart,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    applyCoupon,
    discountPercentage,
    removeCoupon,
    showToast,
  } = useStore();

  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      showToast("Please enter a coupon code", "error");
      return;
    }

    try {
      await applyCoupon(couponCode.trim());
      showToast("Coupon applied successfully", "success");
    } catch (error) {
      showToast(error.message || "Invalid coupon code", "error");
    }
  };

  return (
    <section className="relative min-h-screen pt-28 pb-24 bg-gradient-to-br from-[#fffafc] via-[#fff1f4] to-[#ffe6ee] overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -top-40 left-20 w-[500px] h-[500px] bg-pink-200 rounded-full blur-3xl opacity-40" />
      <div className="absolute -bottom-40 right-20 w-[600px] h-[600px] bg-rose-300 rounded-full blur-3xl opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="uppercase tracking-[0.3em] text-xs text-pink-600 mb-3">
            Secure Checkout
          </p>
          <h1 className="font-serif text-3xl md:text-5xl text-pink-900">
            Your Shopping Bag
          </h1>
          <p className="mt-4 text-sm md:text-base text-pink-700 max-w-xl mx-auto">
            Review your selected pieces before placing your order.
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

        {/* Cart Items */}
        <div className="w-full bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl divide-y divide-pink-100">
          {cart.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-pink-600 text-lg">Your cart is empty</p>
              <button
                onClick={() => navigate("/shop")}
                className="mt-5 bg-pink-700 text-white px-6 py-2 rounded-full hover:bg-pink-800 transition-colors"
                >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const image = Array.isArray(item.image)
                ? item.image[0]
                : item.image;
              const hasDiscount =
              item.discountedPrice && item.discountedPrice < item.price;
              
              return (
                <div
                key={`${item._id}-${item.size}`}
                className="flex flex-col sm:flex-row gap-4 p-4 md:p-6 items-center"
                >
                  {image && (
                    <img
                      src={image}
                      alt={item.name || "Product"}
                      className="w-24 h-28 sm:w-28 sm:h-32 object-cover rounded-lg shadow-md"
                      />
                  )}

                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-serif text-lg text-pink-900">
                      {item.name || "Product"}
                    </h3>
                    <div className="flex items-center justify-center sm:justify-start gap-3 mt-1">
                      <p
                        className={`text-pink-700 text-sm ${
                          hasDiscount ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {currency}
                        {item.price}
                      </p>
                      {hasDiscount && (
                        <p className="text-green-600 font-semibold text-sm">
                          {currency}
                          {item.discountedPrice}
                        </p>
                      )}
                      {item.discount > 0 && (
                        <p className="text-xs text-white bg-red-500 px-1.5 py-0.5 rounded-md">
                          -{item.discount}%
                        </p>
                      )}
                    </div>
                    <p className="text-pink-700 text-sm mt-1">
                      Size: {item.size}
                    </p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-3">
                    <button
                      disabled={item.quantity <= 1}
                      onClick={() => decrementQuantity(item._id, item.size)}
                      className="w-8 h-8 border rounded-full disabled:opacity-40 hover:bg-pink-50 transition"
                    >
                      -
                    </button>

                    <span className="w-8 text-center">{item.quantity}</span>

                    <button
                      onClick={() => incrementQuantity(item._id, item.size)}
                      className="w-8 h-8 border rounded-full hover:bg-pink-50 transition"
                      >
                      +
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item._id, item.size)}
                    className="text-pink-600 hover:text-red-500 transition ml-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Summary */}
        <div className="w-full lg:w-[450px] lg:flex-shrink-0">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-6 md:p-8">
            <CartTotal />

            {/* Coupon */}
            <div className="mt-8">
              <p className="text-pink-700 mb-3 text-sm font-medium">Have a promo code?</p>

              {discountPercentage > 0 ? (
                <div className="flex justify-between items-center bg-green-50 px-4 py-3 rounded-xl">
                  <p className="text-green-700 text-sm">Coupon Applied!</p>
                  <button
                    onClick={removeCoupon}
                    className="text-red-500 text-xs font-semibold"
                    >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 bg-[#fff1f4] px-4 py-3 text-sm rounded-lg outline-none focus:ring-2 focus:ring-pink-300"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-[#c9487c] hover:bg-[#b53f6c] transition text-white px-6 py-3 text-sm font-semibold rounded-lg"
                    >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Checkout */}
            <button
              disabled={cart.length === 0}
              onClick={() => navigate("/place-order")}
              className={`w-full mt-8 py-4 rounded-full text-white font-semibold shadow-lg transition-all duration-300 ${
                cart.length === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#c9487c] to-[#b53f6c] hover:scale-[1.03] hover:shadow-2xl"
              }`}
            >
              Proceed to Secure Checkout
            </button>

            <p className="text-center text-xs text-pink-700 mt-5">
              100% secure payments • Easy returns • Trusted by thousands
            </p>
                </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
