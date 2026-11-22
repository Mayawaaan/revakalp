import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Banknote } from "lucide-react";
import useStore from "../../../store/store";
import CartTotal from "../../../components/cart/CartTotal";
import PageHero from "../../../components/globalComponents/PageHero";
import EditorialButton from "../../../components/ui/EditorialButton";

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
    settings,
    applyCoupon,
    removeCoupon,
    couponCode,
    getCartTotal,
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
  }, []);

  const onSubmitHandler = async (e) => {
    e?.preventDefault();
    setProductError(null);

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
        await placeOrder(orderDetails);
        showToast("Order placed successfully!", "success");
        navigate("/orders");
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

        const order = await createRazorpayOrder({
          amount: getCartTotal(),
          currency: "INR",
        });

        const options = {
          key: settings?.razorpayKey || import.meta.env.VITE_RAZORPAY_KEY,
          amount: order.amount,
          currency: order.currency,
          order_id: order.id,
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
              });

              if (!data.success) {
                showToast("Payment verification failed", "error");
                return;
              }

              await placeOrder({
                ...orderDetails,
                paymentId: response.razorpay_payment_id,
                paymentMethod: method,
              });

              showToast("Order placed successfully!", "success");
              navigate("/orders");
            } catch (err) {
              showToast(
                err?.message || "Payment verification or order placement failed",
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
        console.error("Razorpay Error:", error);
        showToast("Something went wrong with Razorpay. Please try again.", "error");
        setPlacing(false);
      }
    }
  };

  return (
    <div className="bg-[#F7F1E5] min-h-screen">
      <PageHero
        label="Checkout"
        title="Delivery & Payment"
        subtitle="Complete your shipping details and choose a verified payment option."
      />

      <form
        onSubmit={onSubmitHandler}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* Delivery Form */}
        <div className="lg:col-span-7 rk-surface-card p-6 sm:p-10 space-y-6">
          <div className="pb-4 border-b border-[#38131E]/10">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[#38131E]/65 mb-1">
              Step 1
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#38131E]">
              Delivery Information
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
        <div className="lg:col-span-5 space-y-6">
          <div className="rk-surface-card p-6 sm:p-8 space-y-6">
            {/* Coupon Section */}
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#38131E]/65 font-semibold mb-3">
                Coupon Discount
              </p>
              {!couponCode ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter coupon code"
                    aria-label="Coupon code"
                    className="flex-1 min-h-[44px] px-4 py-2 rounded-xl border border-[#38131E]/20 bg-white text-sm text-[#1A1718] focus:outline-none focus:ring-2 focus:ring-[#D4AF63]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="min-h-[44px] px-5 rounded-xl bg-[#38131E] text-[#F7F1E5] text-xs uppercase tracking-wider font-semibold hover:bg-[#2B0E17] transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex justify-between items-center text-sm">
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

          <div className="rk-surface-card p-6 sm:p-8 space-y-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#38131E]/65 mb-1">
                Step 2
              </p>
              <h2 className="font-serif text-2xl text-[#38131E]">
                Payment Method
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="radiogroup" aria-label="Payment method">
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
                    className={`min-h-[58px] rounded-2xl border p-3 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      selected
                        ? "border-[#38131E] bg-[#38131E]/6 ring-2 ring-[#D4AF63]/60"
                        : "border-[#38131E]/15 bg-white hover:border-[#38131E]/40"
                    }`}
                  >
                    {item.img ? (
                      <img src={item.img} alt={item.label} className="h-7 object-contain" />
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#38131E]">
                        <Banknote className="w-4 h-4" /> COD
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

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
              Totals and payment verification are confirmed by our server.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;
