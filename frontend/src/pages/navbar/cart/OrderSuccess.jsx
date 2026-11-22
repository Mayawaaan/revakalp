import React from "react";
import { CheckCircle } from "lucide-react";
import EditorialButton from "../../../components/ui/EditorialButton";

const OrderSuccess = () => {
  return (
    <div className="min-h-[75vh] bg-[#F7F1E5] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="rk-surface-card p-8 sm:p-14 max-w-lg w-full">
        <div className="w-16 h-16 rounded-full bg-[#38131E] text-[#F1D889] flex items-center justify-center mx-auto mb-6 border border-[#D4AF63]">
          <CheckCircle className="w-8 h-8" />
        </div>
        <p className="text-[11px] uppercase tracking-[0.26em] text-[#38131E]/65 mb-2">
          Order Confirmed
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#38131E] mb-4">
          Order Placed Successfully
        </h1>
        <p className="text-sm text-[#1A1718]/75 mb-8 leading-relaxed">
          Thank you for shopping with Revakalp. Your order has been recorded and can be
          tracked anytime from your account.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <EditorialButton to="/orders" variant="primary">
            View Orders
          </EditorialButton>
          <EditorialButton to="/shop" variant="secondary">
            Continue Shopping
          </EditorialButton>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
