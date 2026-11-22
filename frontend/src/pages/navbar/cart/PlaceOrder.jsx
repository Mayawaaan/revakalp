import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Banknote } from "lucide-react";
import useStore from "../../../store/store";
import CartTotal from "../../../components/cart/CartTotal";
import PageHero from "../../../components/globalComponents/PageHero";
import EditorialButton from "../../../components/ui/EditorialButton";
import { trackEvent } from "../../../utils/analytics";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const navigate = useNavigate();

  const {
    showToast,
    cart,
    placeOrder,
    fetchCart,
    fetchOrders,
    settings,
    applyCoupon,
    removeCoupon,
    couponCode,
    createRazorpayOrder,
    verifyRazorpayPayment,
  } = useStore();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "India",
    phone: "",
  });

  const [placing, setPlacing] = useState(false);
  const [productError, setProductError] = useState(null);
  const [couponInput, setCouponInput] = useState("");
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      showToast("Please enter a coupon code.", "error");
      return;
    }
    try {
      await applyCoupon(couponInput.trim());
      showToast("Coupon applied successfully!", "success");
      setCouponInput("");
    } catch (error) {
      showToast(error.message || "Invalid coupon code.", "error");
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      await removeCoupon();
      showToast("Coupon removed.", "success");
    } catch (error) {
      showToast(error.message || "Failed to remove coupon.", "error");
    }
  };

  useEffect(() => {
    loadRazorpayScript();
    if (cart?.length > 0) {
      trackEvent("begin_checkout", { itemCount: cart.length });
    }
  }, [cart?.length]);

  const onSubmitHandler = async (e) => {
    e?.preventDefault();
    setProductError(null);
    trackEvent("add_payment_info", { paymentMethod: method });

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.street ||
      !formData.city ||
      !formData.state ||
      !formData.zipcode ||
      !formData.country ||
      !formData.phone
    ) {
      showToast("Please fill all required fields", "error");
      return;
    }

    if (!cart || cart.length === 0) {
      showToast("Your cart is empty", "error");
      return;
    }

    if (!acceptedPolicies) {
      showToast(
        "Please accept our Terms, Returns, and Privacy Policy before placing your order",
        "error"
      );
      return;
    }

    setPlacing(true);

    const shippingAddress = {
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zip: formData.zipcode,
      country: formData.country,
      phone: formData.phone,
    };

    const orderDetails = {
      shippingAddress,
      paymentMethod: method,
      notes: `Customer: ${formData.firstName} ${formData.lastName}, Email: ${formData.email}`,
    };

    if (method === "cod") {
      if (!settings?.codEnabled) {
        showToast("Cash on Delivery is currently disabled", "error");
        setPlacing(false);
        return;
      }
      try {
        const confirmed = await placeOrder(orderDetails);
        showToast("Order placed successfully!", "success");
        navigate("/order-success", { state: { order: confirmed } });
      } catch (error) {
        if (error.productId) {
          setProductError(error.productId);
        }
        showToast(
          error.message || "Failed to place order. Please try again.",
          "error"
        );
      } finally {
        setPlacing(false);
      }
    } else if (method === "razorpay" || method === "upi") {
      if (!settings?.razorpayEnabled) {
        showToast("Online payment is currently disabled", "error");
        setPlacing(false);
        return;
      }
      try {
        const res = await loadRazorpayScript();
        if (!res) {
          showToast("Razorpay SDK failed to load. Are you online?", "error");
          setPlacing(false);
          return;
        }

        // Server calculates authoritative price, reserves stock, and creates internal pending order
        const checkoutSession = await createRazorpayOrder({
          shippingAddress,
          paymentMethod: method,
          notes: orderDetails.notes,
        });

        const gatewayOrder = checkoutSession.order;
        const internalOrderId = checkoutSession.internalOrderId;

        const options = {
          key: settings?.razorpayKey || import.meta.env.VITE_RAZORPAY_KEY,
          amount: gatewayOrder.amount,
          currency: gatewayOrder.currency,
          order_id: gatewayOrder.id,
          name: settings?.storeName || "REVAKALP",
          method:
            method === "upi"
              ? { upi: true }
              : { card: true, netbanking: true },
          modal: {
            ondismiss: () => setPlacing(false),
          },
          handler: async (response) => {
            try {
              setPlacing(true);
              const data = await verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                internalOrderId,
              });

              if (!data.success) {
                showToast("Payment verification failed", "error");
                return;
              }

              await Promise.all([fetchCart?.(), fetchOrders?.()]);
              showToast("Payment verified and order confirmed!", "success");
              navigate("/order-success", { state: { order: data.order } });
            } catch (err) {
              showToast(
                err?.message || "Payment verification failed. Contact support if debited.",
                "error"
              );
            } finally {
              setPlacing(false);
            }
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone,
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (error) {
        if (error.productId) {
          setProductError(error.productId);
        }
        showToast(
          error?.message || "Unable to initiate Razorpay payment. Please try again.",
          "error"
        );
        setPlacing(false);
      }
    }
  };

  return (
    <div className="bg-[#F7F1E5] min-h-screen">
      <PageHero
        label="Checkout"
        title="Delivery & Payment"
        subtitle="Tell us where to deliver and pick how you'd like to pay."
      />

      <form
        onSubmit={onSubmitHandler}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* Delivery Form */}
        <div className="lg:col-span-7 rk-surface-card p-4 sm:p-10 space-y-5 sm:space-y-6">
          <div className="pb-4 border-b border-[#38131E]/10">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#38131E]">
              Where should we send your order?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="relative">
              <input
                id="firstName"
                onChange={onChangeHandler}
                name="firstName"
                value={formData.firstName}
                required
                className="peer input-floating"
              />
              <label htmlFor="firstName" className="label-floating">
                First Name *
              </label>
            </div>

            <div className="relative">
              <input
                id="lastName"
                onChange={onChangeHandler}
                name="lastName"
                value={formData.lastName}
                required
                className="peer input-floating"
              />
              <label htmlFor="lastName" className="label-floating">
                Last Name *
              </label>
            </div>
          </div>

          <div className="relative">
            <input
              id="email"
              type="email"
              onChange={onChangeHandler}
              name="email"
              value={formData.email}
              required
              className="peer input-floating"
            />
            <label htmlFor="email" className="label-floating">
              Email Address *
            </label>
          </div>

          <div className="relative">
            <input
              id="street"
              onChange={onChangeHandler}
              name="street"
              value={formData.street}
              required
              className="peer input-floating"
            />
            <label htmlFor="street" className="label-floating">
              Street Address *
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="relative">
              <input
                id="city"
                onChange={onChangeHandler}
                name="city"
                value={formData.city}
                required
                className="peer input-floating"
              />
              <label htmlFor="city" className="label-floating">
                City *
              </label>
            </div>

            <div className="relative">
              <input
                id="state"
                onChange={onChangeHandler}
                name="state"
                value={formData.state}
                required
                className="peer input-floating"
              />
              <label htmlFor="state" className="label-floating">
                State *
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="relative">
              <input
                id="zipcode"
                onChange={onChangeHandler}
                name="zipcode"
                value={formData.zipcode}
                required
                className="peer input-floating"
              />
              <label htmlFor="zipcode" className="label-floating">
                PIN / Zip Code *
              </label>
            </div>

            <div className="relative">
              <input
                id="country"
                onChange={onChangeHandler}
                name="country"
                value={formData.country}
                required
                className="peer input-floating"
              />
              <label htmlFor="country" className="label-floating">
                Country *
              </label>
            </div>
          </div>

          <div className="relative">
            <input
              id="phone"
              type="tel"
              onChange={onChangeHandler}
              name="phone"
              value={formData.phone}
              required
              className="peer input-floating"
            />
            <label htmlFor="phone" className="label-floating">
              Phone Number *
            </label>
          </div>
        </div>

        {/* Summary & Payment */}
        <div className="lg:col-span-5 space-y-5 sm:space-y-6">
          <div className="rk-surface-card p-4 sm:p-8 space-y-5 sm:space-y-6">
            {/* Coupon Section */}
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#38131E]/65 font-semibold mb-3">
                Coupon Discount
              </p>
              {!couponCode ? (
                <div className="flex flex-col min-[360px]:flex-row items-stretch min-[360px]:items-center gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter coupon code"
                    aria-label="Coupon code"
                    className="flex-1 min-w-0 min-h-[44px] px-4 py-2 rounded-[2px] border border-[#38131E]/20 bg-white text-sm text-[#1A1718] focus:outline-none focus:ring-1 focus:ring-[#D4AF63]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="min-h-[44px] px-5 rounded-[2px] bg-[#38131E] text-[#F7F1E5] text-xs uppercase tracking-wider font-semibold hover:bg-[#2B0E17] transition-colors cursor-pointer shrink-0"
                  >
                    Apply
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[2px] flex justify-between items-center text-sm">
                  <p className="text-emerald-800 font-medium">
                    Applied: <span className="font-bold">{couponCode}</span>
                  </p>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-red-700 hover:underline text-xs font-semibold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <CartTotal productError={productError} city={formData.city} />
          </div>

          <div className="rk-surface-card p-4 sm:p-8 space-y-5">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl text-[#38131E]">
                How would you like to pay?
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3" role="radiogroup" aria-label="Payment method">
              {[
                { key: "cod", label: "Cash on Delivery" },
                { key: "razorpay", label: "Razorpay", img: "/razorpay.svg" },
                { key: "upi", label: "UPI", img: "/upi.png" },
              ].map((item) => {
                const selected = method === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setMethod(item.key)}
                    className={`min-h-[54px] sm:min-h-[58px] rounded-[2px] border p-2 sm:p-3 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      selected
                        ? "border-[#38131E] bg-[#38131E]/6 ring-1 ring-[#D4AF63]"
                        : "border-[#38131E]/18 bg-white hover:border-[#38131E]/40"
                    }`}
                  >
                    {item.img ? (
                      <img src={item.img} alt={item.label} className="h-5 sm:h-7 max-w-full object-contain" />
                    ) : (
                      <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-semibold text-[#38131E]">
                        <Banknote className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> COD
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <label className="flex items-start gap-2.5 text-xs text-[#1A1718]/80 leading-relaxed cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={acceptedPolicies}
                onChange={(e) => setAcceptedPolicies(e.target.checked)}
                required
                className="mt-0.5 w-4 h-4 accent-[#38131E] shrink-0 cursor-pointer"
              />
              <span>
                I accept the{" "}
                <Link to="/terms-conditions" className="text-[#38131E] font-semibold underline">
                  Terms &amp; Conditions
                </Link>
                ,{" "}
                <Link to="/returns-exchanges" className="text-[#38131E] font-semibold underline">
                  7-Day Returns Policy
                </Link>{" "}
                (continuous unboxing video required), and{" "}
                <Link to="/privacy-policy" className="text-[#38131E] font-semibold underline">
                  Privacy Policy
                </Link>
                . Online payments are processed securely via Razorpay.
              </span>
            </label>

            <EditorialButton
              type="submit"
              variant="primary"
              disabled={placing || !cart || cart.length === 0}
              className="w-full"
            >
              {placing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Processing…</span>
                </>
              ) : (
                "Place Order"
              )}
            </EditorialButton>

            <p className="text-center text-xs text-[#1A1718]/65">
              Your order total is always confirmed securely at checkout.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;
