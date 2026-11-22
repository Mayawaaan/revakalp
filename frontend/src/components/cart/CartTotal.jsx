import React from "react";
import { AlertCircle } from "lucide-react";
import useStore from "../../store/store";

const CartTotal = ({ productError, city }) => {
  const {
    cart,
    getCartSubtotal,
    getCartItemsDiscount,
    getCartTotal,
    discountPercentage,
    settings,
  } = useStore();

  const {
    currencySymbol = "₹",
    freeShippingThreshold = 500,
    deliveryFee: DELIVERY_FEE = 50,
  } = settings || {};

  const subtotal = getCartSubtotal();
  const itemsDiscount = getCartItemsDiscount();
  const total = getCartTotal();

  // Delivery fee logic (Free delivery for Indore or if threshold met)
  const isIndore = city?.toLowerCase().trim() === "indore";
  const deliveryFee =
    total >= freeShippingThreshold || isIndore ? 0 : DELIVERY_FEE;

  // Coupon discount amount
  const subtotalAfterItemDiscounts = subtotal - itemsDiscount;
  const couponDiscountAmount = Math.floor(
    (subtotalAfterItemDiscounts * discountPercentage) / 100
  );

  return (
    <div className="w-full space-y-5 text-[#1A1718]">
      {/* CART ITEMS */}
      <div>
        <h3 className="font-serif text-xl text-[#38131E] mb-3">Bag Summary</h3>
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {cart.map((item) => {
            const hasDiscount =
              item.discountedPrice && item.discountedPrice < item.price;
            const unitPrice = hasDiscount ? item.discountedPrice : item.price;
            const img = Array.isArray(item.image) ? item.image[0] : item.image;

            return (
              <div
                key={`${item._id}-${item.size}`}
                className={`flex justify-between items-center gap-3 p-2.5 rounded-xl border ${
                  productError === item._id
                    ? "bg-red-50 border-red-400"
                    : "bg-[#F7F1E5]/50 border-[#38131E]/10"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {img && (
                    <img
                      src={img}
                      alt={item.name}
                      className="w-12 h-14 object-cover rounded-lg shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#38131E] truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-[#1A1718]/65">
                      {item.size && item.size !== "NO_SIZE" ? `${item.size} · ` : ""}
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {hasDiscount && (
                    <p className="text-[11px] line-through text-[#1A1718]/45">
                      {currencySymbol}
                      {(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  )}
                  <p className="text-sm font-semibold text-[#38131E]">
                    {currencySymbol}
                    {(unitPrice * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>

                {productError === item._id && (
                  <div className="flex items-center gap-1 text-red-700 text-xs shrink-0">
                    <AlertCircle size={14} />
                    <span>Unavailable</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CART TOTALS */}
      <div className="space-y-3 pt-4 border-t border-[#38131E]/15 text-sm">
        <div className="flex justify-between">
          <span className="text-[#1A1718]/75">Subtotal</span>
          <span className="font-medium text-[#38131E]">
            {currencySymbol}
            {subtotal.toLocaleString("en-IN")}.00
          </span>
        </div>

        {itemsDiscount > 0 && (
          <div className="flex justify-between text-emerald-700">
            <span>Product Discount</span>
            <span>
              − {currencySymbol}
              {itemsDiscount.toLocaleString("en-IN")}.00
            </span>
          </div>
        )}

        {discountPercentage > 0 && (
          <div className="flex justify-between text-emerald-700">
            <span>Coupon Discount ({discountPercentage}%)</span>
            <span>
              − {currencySymbol}
              {couponDiscountAmount.toLocaleString("en-IN")}.00
            </span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-[#1A1718]/75">Shipping Fee</span>
          <span>
            {deliveryFee === 0 ? (
              <span className="text-emerald-700 font-medium">Free</span>
            ) : (
              `${currencySymbol}${deliveryFee}.00`
            )}
          </span>
        </div>

        <div className="flex justify-between items-baseline pt-3 border-t border-[#38131E]/15 text-base sm:text-lg font-semibold text-[#38131E]">
          <span>Estimated Total</span>
          <span>
            {currencySymbol}
            {(total + deliveryFee).toLocaleString("en-IN")}.00
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
