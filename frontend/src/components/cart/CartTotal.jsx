import React from "react";
import useStore from "../../store/store";
import Title from "../globalComponents/Title";
import { AlertCircle } from "lucide-react";

const CartTotal = ({ productError, city }) => {
  const {
    cart,
    getCartSubtotal,
    getCartItemsDiscount,
    getCartTotal,
    discountPercentage,
    settings, // Get settings from the store
  } = useStore();

  const {
    currencySymbol,
    freeShippingThreshold,
    deliveryFee: DELIVERY_FEE,
  } = settings;

  const subtotal = getCartSubtotal();
  const itemsDiscount = getCartItemsDiscount();
  const total = getCartTotal();

  // Delivery fee logic (Free delivery for Indore or if threshold met)
  const isIndore = city?.toLowerCase().trim() === "indore";
  const deliveryFee = (total >= freeShippingThreshold || isIndore) ? 0 : DELIVERY_FEE;

  // Coupon discount amount
  const subtotalAfterItemDiscounts = subtotal - itemsDiscount;
  const couponDiscountAmount = Math.floor(
    (subtotalAfterItemDiscounts * discountPercentage) / 100
  );
  const totalAfterCouponDiscount = subtotalAfterItemDiscounts - couponDiscountAmount;



  return (
    <div className="w-full">
      {/* CART ITEMS */}
      <div className="text-2xl">
        <Title text1="CART" text2="ITEMS" />
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {cart.map((item) => {
          const hasDiscount =
            item.discountedPrice && item.discountedPrice < item.price;
          const price = hasDiscount ? item.discountedPrice : item.price;

          return (
            <div
              key={`${item._id}-${item.size}`}
              className={`flex justify-between items-center p-2 rounded-lg ${
                productError === item._id
                  ? "bg-red-100 border border-red-500"
                  : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <img
                  src={Array.isArray(item.image) ? item.image[0] : item.image}

                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md"
                />

                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
              </div>

              <div className="flex flex-col items-end">
                {hasDiscount && (
                  <p className="text-xs line-through text-gray-500">
                    {currencySymbol}
                    {item.price * item.quantity}.00
                  </p>
                )}
                <p>
                  {currencySymbol}
                  {price * item.quantity}.00
                </p>
              </div>

              {productError === item._id && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle size={16} />
                  <p className="text-xs">Item unavailable</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CART TOTALS */}
      <div className="text-2xl mt-8">
        <Title text1="CART" text2="TOTALS" />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>
            {currencySymbol}
            {subtotal}.00
          </p>
        </div>

        <hr />

        {itemsDiscount > 0 && (
          <>
            <div className="flex justify-between text-green-600">
              <p>Product Discount</p>
              <p>
                - {currencySymbol}
                {itemsDiscount}.00
              </p>
            </div>
            <hr />
          </>
        )}

        {discountPercentage > 0 && (
          <>
            <div className="flex justify-between text-green-600">
              <p>Coupon Discount ({discountPercentage}%)</p>
              <p>
                - {currencySymbol}
                {couponDiscountAmount}.00
              </p>
            </div>
            <hr />
          </>
        )}

        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>
            {deliveryFee === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              `${currencySymbol}${deliveryFee}.00`
            )}
          </p>
        </div>

        <hr />

        <div className="flex justify-between font-semibold text-lg">
          <p>Total</p>
          <p>
            {currencySymbol}
            {total + deliveryFee}.00

          </p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
