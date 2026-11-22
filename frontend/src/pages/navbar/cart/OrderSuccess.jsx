import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import EditorialButton from "../../../components/ui/EditorialButton";
import { trackEvent } from "../../../utils/analytics";

const OrderSuccess = () => {
  const { state } = useLocation();
  const order = state?.order || null;

  useEffect(() => {
    if (order?._id || order?.orderNumber) {
      trackEvent("purchase", {
        orderId: order.orderNumber || order._id,
        value: order.total,
        currency: order.currency || "INR",
        itemCount: order.items?.length || 0,
      });
    }
  }, [order]);

  return (
    <div className="min-h-[75vh] bg-[#F7F1E5] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="rk-surface-card p-8 sm:p-14 max-w-lg w-full">
        <p className="text-[11px] uppercase tracking-[0.26em] text-[#38131E]/65 mb-3">
          {order?.orderNumber ? `Order ${order.orderNumber}` : "Order Update"}
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#38131E] mb-4">
          {order?.status === "PendingPayment"
            ? "Waiting for payment confirmation"
            : "Thank you, your order is confirmed"}
        </h1>
        <p className="text-sm text-[#1A1718]/75 mb-8 leading-relaxed">
          {order
            ? `Status: ${order.status}${
                order.total !== undefined
                  ? ` · Total: ₹${Number(order.total).toLocaleString("en-IN")}`
                  : ""
              }.`
            : "You can follow your order and delivery updates anytime in My Orders."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <EditorialButton
            to={order?._id ? `/track/${order._id}` : "/orders"}
            variant="primary"
          >
            {order?._id ? "Track Your Order" : "See My Orders"}
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
