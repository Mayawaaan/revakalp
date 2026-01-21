import React, { useState } from "react";
import Title from "../../../components/globalComponents/Title";
import CartTotal from "../../../components/cart/CartTotal";
import { useNavigate } from "react-router-dom";
import useStore from "../../../store/store";
import { Loader2 } from "lucide-react";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const navigate = useNavigate();
  const { 
    showToast, 
    clearCart, 
    cart, 
    getCartSubtotal, 
    discountPercentage,
    getDeliveryFee,
    placeOrder,
    settings
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

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async () => {
    setProductError(null);
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.street || !formData.city || !formData.state || 
        !formData.zipcode || !formData.country || !formData.phone) {
      showToast("Please fill all required fields", "error");
      return;
    }

    if (!cart || cart.length === 0) {
      showToast("Your cart is empty", "error");
      return;
    }

    // Check COD availability
    if (method === "cod" && !settings?.codEnabled) {
      showToast("Cash on Delivery is currently disabled", "error");
      return;
    }

    setPlacing(true);
    try {
      const shippingAddress = {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zipcode,
        country: formData.country,
        phone: formData.phone,
      };

      await placeOrder({
        shippingAddress,
        paymentMethod: method,
        notes: `Customer: ${formData.firstName} ${formData.lastName}, Email: ${formData.email}`,
      });

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
  };

  return (
    <section className="bg-[#FFF1F4] min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* Delivery Form */}
        <div className="bg-white rounded-3xl shadow-lg p-10">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <input onChange={onChangeHandler} name="firstName" value={formData.firstName} placeholder="First Name" className="input" />
            <input onChange={onChangeHandler} name="lastName" value={formData.lastName} placeholder="Last Name" className="input" />
          </div>

          <input onChange={onChangeHandler} name="email" value={formData.email} placeholder="Email Address" className="input mt-4" />
          <input onChange={onChangeHandler} name="street" value={formData.street} placeholder="Street Address" className="input mt-4" />

          <div className="grid grid-cols-2 gap-4 mt-4">
            <input onChange={onChangeHandler} name="city" value={formData.city} placeholder="City" className="input" />
            <input onChange={onChangeHandler} name="state" value={formData.state} placeholder="State" className="input" />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <input onChange={onChangeHandler} name="zipcode" value={formData.zipcode} placeholder="Zip Code" className="input" />
            <input onChange={onChangeHandler} name="country" value={formData.country} placeholder="Country" className="input" />
          </div>

          <input onChange={onChangeHandler} name="phone" value={formData.phone} placeholder="Phone Number" className="input mt-4" />
        </div>

        {/* Summary & Payment */}
        <div className="space-y-10">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <CartTotal productError={productError} />
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">
            <Title text1={"PAYMENT"} text2={"METHOD"} />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {[
                { key: "cod", label: "Cash on Delivery" },
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
                    <img src={item.img} className="h-6" />
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

