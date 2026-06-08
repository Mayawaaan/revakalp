import React, { useEffect, useState } from "react";
import Title from "../../../components/globalComponents/Title";
import CartTotal from "../../../components/cart/CartTotal";
import { useNavigate } from "react-router-dom";
import useStore from "../../../store/store";
import { Loader2 } from "lucide-react";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
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

  // ✅ ADD THESE
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
    country: "",
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
    if (!couponInput) {
      showToast("Please enter a coupon code.", "error");
      return;
    }
    try {
      await applyCoupon(couponInput);
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

  const onSubmitHandler = async () => {
    setProductError(null);
    // Validate required fields
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


// const options = {
//   key: settings?.razorpayKey || import.meta.env.VITE_RAZORPAY_KEY,
//   amount: order.amount,
//   currency: order.currency,
//   order_id: order.id,
//   name: "REVAKALP",

//   method: {
//   upi: method === "upi",
//   card: method === "razorpay",
//   netbanking: method === "razorpay",
//   wallet: false,
//   paylater: false,
// },


// //   handler: async (response) => {
// //     const data = await verifyRazorpayPayment({
// //   razorpay_order_id: response.razorpay_order_id,
// //   razorpay_payment_id: response.razorpay_payment_id,
// //   razorpay_signature: response.razorpay_signature,
// // });

// // if (!data.success) {
// //   showToast("Payment verification failed", "error");
// //   return;
// // }


// //     await placeOrder({
// //       ...orderDetails,
// //       paymentId: response.razorpay_payment_id,
// //     });

// //     showToast("Order placed successfully!", "success");
// //     navigate("/orders");
// //   },
// handler: async (response) => {
//   try {
//     setPlacing(true); // ✅ ADD HERE (after payment success)

//     const data = await verifyRazorpayPayment({
//       razorpay_order_id: response.razorpay_order_id,
//       razorpay_payment_id: response.razorpay_payment_id,
//       razorpay_signature: response.razorpay_signature,
//     });

//     if (!data.success) {
//       showToast("Payment verification failed", "error");
//       setPlacing(false);
//       return;
//     }

//     await placeOrder({
//       ...orderDetails,
//       paymentId: response.razorpay_payment_id,
//     });

//     showToast("Order placed successfully!", "success");
//     navigate("/orders");
//   } catch (err) {
//     showToast("Failed to place order after payment", "error");
//   } finally {
//     setPlacing(false); // ✅ STOP loader
//   }
// },

//   prefill: {
//     name: `${formData.firstName} ${formData.lastName}`,
//     email: formData.email,
//     contact: formData.phone,
//   },
// };
const options = {
  key: settings?.razorpayKey || import.meta.env.VITE_RAZORPAY_KEY,
  amount: order.amount,
  currency: order.currency,
  order_id: order.id,
  name: settings.storeName,

  method:
    method === "upi"
      ? { upi: true }
      : { card: true, netbanking: true },

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
        setPlacing(false);
        return;
      }

      await placeOrder({
        ...orderDetails,
        paymentId: response.razorpay_payment_id,
        paymentMethod: method, // "upi" or "razorpay"
      });

      showToast("Order placed successfully!", "success");
      navigate("/orders");
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
      } finally {
        setPlacing(false);
      }
    }
  };

  return (
    <section className="bg-[#FFF1F4] min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Delivery Form */}
              <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10">
  <Title text1={"DELIVERY"} text2={"INFORMATION"} />

  <div className="mt-12 space-y-8">

    {/* Name */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="relative">
        <input
          onChange={onChangeHandler}
          name="firstName"
          value={formData.firstName}
          required
          className="peer input-floating"
        />
        <label className="label-floating">First Name</label>
      </div>

      <div className="relative">
        <input
          onChange={onChangeHandler}
          name="lastName"
          value={formData.lastName}
          required
          className="peer input-floating"
        />
        <label className="label-floating">Last Name</label>
      </div>
    </div>

    {/* Email */}
    <div className="relative">
      <input
        onChange={onChangeHandler}
        name="email"
        value={formData.email}
        required
        className="peer input-floating"
      />
      <label className="label-floating">Email Address</label>
    </div>

    {/* Street */}
    <div className="relative">
      <input
        onChange={onChangeHandler}
        name="street"
        value={formData.street}
        required
        className="peer input-floating"
      />
      <label className="label-floating">Street Address</label>
    </div>

    {/* City / State */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="relative">
        <input
          onChange={onChangeHandler}
          name="city"
          value={formData.city}
          required
          className="peer input-floating"
        />
        <label className="label-floating">City</label>
      </div>

      <div className="relative">
        <input
          onChange={onChangeHandler}
          name="state"
          value={formData.state}
          required
          className="peer input-floating"
        />
        <label className="label-floating">State</label>
      </div>
    </div>

    {/* Zip / Country */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="relative">
        <input
          onChange={onChangeHandler}
          name="zipcode"
          value={formData.zipcode}
          required
          className="peer input-floating"
        />
        <label className="label-floating">Zip Code</label>
      </div>

      <div className="relative">
        <input
          onChange={onChangeHandler}
          name="country"
          value={formData.country}
          required
          className="peer input-floating"
        />
        <label className="label-floating">Country</label>
      </div>
    </div>

    {/* Phone */}
    <div className="relative">
      <input
        onChange={onChangeHandler}
        name="phone"
        value={formData.phone}
        required
        className="peer input-floating"
      />
      <label className="label-floating">Phone Number</label>
    </div>

  </div>
</div>

        {/* Summary & Payment */}
        <div className="space-y-10">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            {/* Coupon Section */}
            <div className="mb-6">
              <Title text1={"COUPON"} text2={"DISCOUNT"} />
              {!couponCode ? (
                <div className="flex items-center gap-2 mt-4">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter coupon code"
                    className="input flex-grow"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="py-2 px-4 bg-gradient-to-r from-[#c9487c] to-[#9c2756] text-white rounded-lg shadow-md hover:scale-105 transition"
                  >
                    Apply
                  </button>
                </div>
              ) : (
                <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg flex justify-between items-center">
                  <p className="text-green-700 font-semibold">
                    Coupon Applied:{" "}
                    <span className="font-bold">{couponCode}</span>
                  </p>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
            <CartTotal productError={productError} city={formData.city} />
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">
            <Title text1={"PAYMENT"} text2={"METHOD"} />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {[
                { key: "cod", label: "Cash on Delivery" },
                {
                  key: "razorpay",
                  label: "Razorpay",
                  img: "./razorpay.svg",
                },
                {
    key: "upi",
    label: "UPI",
    img: "./upi.png", // optional
  },
              ].map((item) => (
                <div
                  key={item.key}
                  onClick={() => setMethod(item.key)}
                  className={`border rounded-xl p-4 flex items-center justify-center cursor-pointer transition ${
                    method === item.key
                      ? "border-[#c9487c] bg-[#FFF1F4]"
                      : "border-gray-200"
                  }`}
                >
                  {item.img ? (
                    <img src={item.img} className="h-10" />
                  ) : (
                    <p className="text-pink-700 font-medium">
                      Cash on Delivery
                    </p>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={onSubmitHandler}
              disabled={placing || !cart || cart.length === 0}
              className="w-full mt-10 py-4 bg-gradient-to-r from-[#c9487c] to-[#9c2756] text-white rounded-full text-lg shadow-xl hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {placing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Placing Order...
                </>
              ) : (
                "Place Order"
              )}
            </button>

            <p className="text-center text-sm text-pink-600 mt-4">
              Secure checkout • Easy returns • Trusted payments
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlaceOrder;

