import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const OrderSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <CheckCircle className="text-green-500 w-24 h-24 mb-6" />
      <h1 className="text-3xl md:text-4xl font-serif text-gray-800 mb-4">Order Placed Successfully!</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Thank you for shopping with Revakalp. Your order has been successfully placed and is being processed. 
        You can track the status of your order in your account.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          to="/orders" 
          className="bg-[#c9487c] text-white px-8 py-3 rounded-md hover:bg-pink-800 transition-colors shadow-sm font-semibold"
        >
          VIEW ORDERS
        </Link>
        <Link 
          to="/shop" 
          className="bg-white text-[#c9487c] border border-[#c9487c] px-8 py-3 rounded-md hover:bg-pink-50 transition-colors shadow-sm font-semibold"
        >
          CONTINUE SHOPPING
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
