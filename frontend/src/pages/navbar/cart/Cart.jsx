import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Trash2, ShoppingBag, Minus, Plus } from "lucide-react";
import useStore from "../../../store/store";
import CartTotal from "../../../components/cart/CartTotal";
import PageHero from "../../../components/globalComponents/PageHero";
import EditorialButton from "../../../components/ui/EditorialButton";

const Cart = () => {
  const {
    currency,
    cart,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    applyCoupon,
    discountPercentage,
    couponCode: activeCoupon,
    removeCoupon,
    showToast,
  } = useStore();

  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const handleApplyCoupon = async (e) => {
    e?.preventDefault();
    if (!couponInput.trim()) {
      showToast("Please enter a coupon code", "error");
      return;
    }
    setApplyingCoupon(true);
    try {
      await applyCoupon(couponInput.trim());
      showToast("Coupon applied successfully", "success");
      setCouponInput("");
    } catch (error) {
      showToast(error.message || "Invalid coupon code", "error");
    } finally {
      setApplyingCoupon(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F1E5]">
      <PageHero
        label="Shopping Bag"
        title="Your Bag"
        subtitle="Take a moment to review your pieces before checking out."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
          {/* Cart Items */}
          <div>
            {cart.length === 0 ? (
              <div className="rk-surface-card p-10 sm:p-16 text-center">
                <ShoppingBag
                  size={52}
                  strokeWidth={1.2}
                  className="mx-auto mb-5 text-[#38131E]/40"
                />
                <h2 className="font-serif text-3xl text-[#38131E] mb-3">
                  Your bag is empty
                </h2>
                <p className="text-sm text-[#1A1718]/70 mb-8 max-w-md mx-auto leading-relaxed">
                  Explore our curated collection of sarees, lehengas, Indo-Western styles,
                  and printed tees.
                </p>
                <EditorialButton to="/shop" variant="primary">
                  Browse Collections
                </EditorialButton>
              </div>
            ) : (
              <div className="rk-surface-card overflow-hidden">
                <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-[#38131E]/5 border-b border-[#38131E]/10 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[#38131E]">
                    {cart.length} {cart.length === 1 ? "item" : "items"} in your bag
                  </p>
                  <Link
                    to="/shop"
                    className="text-xs uppercase tracking-[0.16em] font-semibold text-[#38131E] hover:underline"
                  >
                    + Continue Shopping
                  </Link>
                </div>

                <div className="divide-y divide-[#38131E]/10">
                  {cart.map((item) => {
                    const image = Array.isArray(item.image) ? item.image[0] : item.image;
                    const hasDiscount =
                      item.discountedPrice && item.discountedPrice < item.price;

                    return (
                      <div
                        key={`${item._id}-${item.size}`}
                        className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
                      >
                        <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
                          {image && (
                            <Link to={`/product/${item._id}`} className="shrink-0">
                              <img
                                src={image}
                                alt={item.name || "Product"}
                                className="w-20 h-24 sm:w-20 sm:h-24 object-cover rounded-[2px] border border-[#38131E]/12"
                              />
                            </Link>
                          )}

                          <div className="flex-1 min-w-0">
                            <Link to={`/product/${item._id}`}>
                              <h3 className="font-serif text-lg sm:text-xl text-[#38131E] hover:underline line-clamp-2">
                                {item.name || "Product"}
                              </h3>
                            </Link>

                            <div className="mt-1 flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-[#38131E]">
                                {currency}
                                {(hasDiscount ? item.discountedPrice : item.price).toLocaleString("en-IN")}
                              </span>
                              {hasDiscount && (
                                <span className="text-xs text-[#1A1718]/45 line-through">
                                  {currency}
                                  {item.price.toLocaleString("en-IN")}
                                </span>
                              )}
                              {item.discount > 0 && (
                                <span className="text-[10px] uppercase tracking-wider font-semibold bg-[#38131E] text-[#F1D889] px-2.5 py-0.5 rounded-[2px]">
                                  -{item.discount}%
                                </span>
                              )}
                            </div>

                            {item.size && item.size !== "NO_SIZE" && (
                              <span className="inline-block mt-2 px-3 py-0.5 rounded-[2px] bg-[#EFE6D5] border border-[#38131E]/15 text-[11px] uppercase tracking-wider font-medium text-[#38131E]">
                                Size: {item.size}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3">
                          <div className="inline-flex items-center rounded-[2px] border border-[#38131E]/22 bg-[#EFE6D5]/65">
                            <button
                              type="button"
                              aria-label={`Decrease quantity of ${item.name}`}
                              disabled={item.quantity <= 1}
                              onClick={() => decrementQuantity(item._id, item.size)}
                              className="w-10 h-10 flex items-center justify-center text-[#38131E] disabled:opacity-40 cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-[#38131E]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label={`Increase quantity of ${item.name}`}
                              onClick={() => incrementQuantity(item._id, item.size)}
                              className="w-10 h-10 flex items-center justify-center text-[#38131E] cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            aria-label={`Remove ${item.name} from bag`}
                            onClick={() => removeFromCart(item._id, item.size)}
                            className="w-10 h-10 rounded-[2px] bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-28 rk-surface-card overflow-hidden">
            <div className="bg-[#38131E] px-5 sm:px-6 py-4 text-[#F7F1E5]">
              <h2 className="font-serif text-xl">Order Summary</h2>
            </div>

            <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
              <CartTotal />

              {/* Coupon */}
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#38131E]/70 font-semibold mb-2.5">
                  Promo Code
                </p>
                {discountPercentage > 0 ? (
                  <div className="flex items-center justify-between gap-2 px-4 py-3 rounded-[2px] bg-emerald-50 border border-emerald-200 text-sm">
                    <span className="text-emerald-800 font-medium">
                      Coupon {activeCoupon ? `(${activeCoupon}) ` : ""}Applied ({discountPercentage}% off)
                    </span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs font-semibold text-red-700 hover:underline cursor-pointer shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex flex-col min-[360px]:flex-row gap-2">
                    <input
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Enter promo code"
                      aria-label="Promo code"
                      className="flex-1 min-w-0 min-h-[44px] px-4 py-2 rounded-[2px] border border-[#38131E]/20 bg-white text-sm text-[#1A1718] focus:outline-none focus:ring-1 focus:ring-[#D4AF63]"
                    />
                    <button
                      type="submit"
                      disabled={applyingCoupon}
                      className="min-h-[44px] px-5 rounded-[2px] bg-[#38131E] text-[#F7F1E5] text-xs uppercase tracking-wider font-semibold hover:bg-[#2B0E17] transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      {applyingCoupon ? "…" : "Apply"}
                    </button>
                  </form>
                )}
              </div>

              <EditorialButton
                variant="primary"
                disabled={cart.length === 0}
                onClick={() => navigate("/place-order")}
                className="w-full"
              >
                Proceed to Checkout →
              </EditorialButton>

              <p className="text-[11px] text-[#38131E]/70 text-center leading-relaxed">
                Pieces in your bag aren&apos;t held until you head to checkout.
              </p>

              <p className="text-center text-xs text-[#38131E]/75 uppercase tracking-[0.16em] pt-1">
                Safe Checkout · 7-Day Returns
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
