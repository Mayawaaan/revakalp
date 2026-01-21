import React, { useState } from "react";
import useStore from "../../../store/store";
import CartTotal from "../../../components/cart/CartTotal";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

const Cart = () => {
  const {
    products,
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
    try {
      await applyCoupon(couponCode);
      showToast("Coupon applied successfully", "success");
    } catch (error) {
      showToast(error.message || "Invalid coupon code", "error");
    }
  };

  return (
    <section className="relative min-h-screen pt-28 pb-24 bg-gradient-to-br from-[#fffafc] via-[#fff1f4] to-[#ffe6ee] overflow-hidden">

      {/* Background flow */}
      <div className="absolute -top-40 left-20 w-[500px] h-[500px] bg-pink-200 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute -bottom-40 right-20 w-[600px] h-[600px] bg-rose-300 rounded-full blur-3xl opacity-30"></div>

      <div className="relative max-w-6xl mx-auto px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="uppercase tracking-[0.35em] text-xs text-pink-600 mb-4">
            Secure Checkout
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-pink-900">
            Your Shopping Bag
          </h1>
          <p className="mt-5 text-pink-700">
            Review your selected pieces before placing your order.
          </p>
        </div>

        {/* Cart Items */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl divide-y">
          {cart.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-pink-600 text-lg">Your cart is empty</p>
              <button
                onClick={() => navigate("/shop")}
                className="mt-4 bg-pink-700 text-white px-6 py-2 rounded-full"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item, index) => {
              // Use item properties directly (they're stored when added to cart)
              const image = Array.isArray(item.image) ? item.image[0] : item.image;
              const itemPrice = item.price || 0;

              return (
                <div
                  key={`${item._id}-${item.size}` || index}
                  className="flex flex-col sm:flex-row gap-8 p-8 items-center"
                >
                  {image && (
                    <img
                      src={image}
                      className="w-28 h-32 object-cover rounded-xl shadow"
                      alt={item.name || "Product"}
                    />
                  )}

                  <div className="flex-1">
                    <h3 className="font-serif text-xl text-pink-900">
                      {item.name || "Product"}
                    </h3>
                    <p className="text-pink-700 mt-1">
                      {currency}{itemPrice}
                    </p>
                    <p className="text-pink-700 mt-1">
                        Size: {item.size}
                    </p>
                  </div>

                <div className="flex items-center gap-4">
                  <button onClick={() => decrementQuantity(item._id, item.size)} className="px-3 py-1 border rounded-full">-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => incrementQuantity(item._id, item.size)} className="px-3 py-1 border rounded-full">+</button>
                </div>


                  <button
                    onClick={() => removeFromCart(item._id, item.size)}
                    className="text-pink-700 hover:text-red-500 transition"
                  >
                    <Trash2 />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Summary */}
        <div className="flex flex-col lg:flex-row justify-end gap-12 mt-20">

          <div className="w-full lg:w-[420px] bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-10">
            <CartTotal />

            {/* Coupon */}
            <div className="mt-10">
              <p className="text-pink-700 mb-4">Have a promo code?</p>

              {discountPercentage > 0 ? (
                <div className="flex justify-between items-center bg-green-50 px-6 py-4 rounded-xl">
                  <p className="text-green-700">Coupon Applied</p>
                  <button
                    onClick={removeCoupon}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-4">
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-[#fff1f4] px-6 py-4 rounded-full outline-none"
                    placeholder="Enter promo code"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-[#c9487c] hover:bg-[#9c2756] transition text-white px-8 py-4 rounded-full"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            <button
              disabled={cart.length === 0}
              onClick={() => navigate("/place-order")}
              className={`w-full mt-12 py-5 rounded-full text-white text-lg shadow-xl transition ${
                cart.length === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#c9487c] to-[#9c2756] hover:scale-[1.02]"
              }`}
            >
              Proceed to Secure Checkout
            </button>

            <p className="text-center text-sm text-pink-700 mt-6">
              100% secure payments • Easy returns • Trusted by thousands
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Cart;

