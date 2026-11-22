import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle2,
  MapPin,
  ArrowLeft,
  Loader2,
  XCircle,
  PackageCheck,
  AlertCircle,
} from "lucide-react";
import useStore from "../../store/store";
import EditorialButton from "../../components/ui/EditorialButton";

const STATUS_FLOW = [
  "Processing",
  "Confirmed",
  "Preparing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { currency, trackOrder } = useStore();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) return undefined;
    let cancelled = false;
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await trackOrder(orderId);
        if (!cancelled) setOrder(data);
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.data?.message || err?.message || "Order not found");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchOrder();
    return () => {
      cancelled = true;
    };
  }, [orderId, trackOrder]);

  const statusIndex = STATUS_FLOW.includes(order?.status)
    ? STATUS_FLOW.indexOf(order.status)
    : 0;

  const statusIcon = (status, active) => {
    const cls = active ? "text-[#F1D889]" : "text-[#38131E]/40";
    switch (status) {
      case "Delivered":
        return <CheckCircle2 className={cls} />;
      case "Out for Delivery":
        return <Truck className={cls} />;
      case "Shipped":
        return <PackageCheck className={cls} />;
      case "Processing":
      case "Confirmed":
      case "Preparing":
        return <Package className={cls} />;
      default:
        return <AlertCircle className={cls} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F7F1E5]">
        <Loader2 className="animate-spin text-[#38131E]" size={40} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] bg-[#F7F1E5] py-16 px-4">
        <div className="max-w-lg mx-auto rk-surface-card p-10 text-center">
          <XCircle size={44} className="text-red-700 mx-auto mb-4" />
          <h1 className="font-serif text-2xl text-[#38131E] mb-2">Order Not Found</h1>
          <p className="text-sm text-[#1A1718]/70 mb-6">{error}</p>
          <EditorialButton onClick={() => navigate("/orders")}>
            View My Orders
          </EditorialButton>
        </div>
      </div>
    );
  }

  if (["Cancelled", "Returned"].includes(order.status)) {
    return (
      <div className="min-h-[70vh] bg-[#F7F1E5] py-12 px-4">
        <div className="max-w-3xl mx-auto rk-surface-card p-8 space-y-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#38131E] cursor-pointer"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex items-start gap-4 bg-red-50 p-6 rounded-[2px] border border-red-200">
            <XCircle className="text-red-700 shrink-0" />
            <div>
              <h2 className="font-serif text-xl text-red-900">Order {order.status}</h2>
              <p className="text-sm text-red-700 mt-1">
                {order.cancelReason || "This order is no longer active."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[#F7F1E5] py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="rk-surface-card p-4 sm:p-8 flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-semibold text-[#38131E] mb-3 cursor-pointer"
            >
              <ArrowLeft size={15} /> Back
            </button>
            <h1 className="font-serif text-xl sm:text-3xl text-[#38131E] break-all sm:break-normal">
              Order #{order.orderNumber || order.orderId}
            </h1>
            <p className="text-xs text-[#1A1718]/65 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-IN")}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#38131E]/60">
              Total
            </p>
            <p className="font-serif text-2xl sm:text-3xl font-semibold text-[#38131E]">
              {currency}
              {Number(order.total || 0).toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="rk-surface-card p-4 sm:p-8">
          <h2 className="font-serif text-2xl text-[#38131E] mb-6">Order Progress</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {STATUS_FLOW.map((status, index) => {
              const active = index <= statusIndex;
              return (
                <div key={status} className="flex flex-col items-center text-center">
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-[2px] border ${
                      active
                        ? "bg-[#38131E] border-[#D4AF63]"
                        : "bg-[#F7F1E5] border-[#38131E]/18"
                    }`}
                  >
                    {statusIcon(status, active)}
                  </div>
                  <p
                    className={`mt-2 text-xs font-medium ${
                      active ? "text-[#38131E]" : "text-[#1A1718]/45"
                    }`}
                  >
                    {status}
                  </p>
                </div>
              );
            })}
          </div>

          {order.estimatedDelivery && (
            <div className="mt-6 bg-[#EFE6D5] border border-[#D4AF63]/45 rounded-[2px] p-4 text-sm text-[#38131E]">
              <strong>Estimated Delivery:</strong>{" "}
              {new Date(order.estimatedDelivery).toLocaleDateString("en-IN")}
            </div>
          )}
        </div>

        {/* Shipping Address */}
        {order.shippingAddress && (
          <div className="rk-surface-card p-4 sm:p-8 space-y-2 text-sm text-[#1A1718]/80">
            <h2 className="font-serif text-xl sm:text-2xl text-[#38131E] mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#38131E]" /> Shipping Address
            </h2>
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.zip}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
        )}

        {/* Items */}
        <div className="rk-surface-card p-4 sm:p-8">
          <h2 className="font-serif text-xl sm:text-2xl text-[#38131E] mb-4">Items</h2>
          <div className="divide-y divide-[#38131E]/10">
            {(order.items || []).map((item, i) => (
              <div key={i} className="flex items-center gap-3.5 sm:gap-4 py-4">
                <img
                  src={Array.isArray(item.image) ? item.image[0] : item.image}
                  className="w-16 h-20 rounded-[2px] object-cover shrink-0 border border-[#38131E]/12"
                  alt={item.name}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-base sm:text-lg text-[#38131E] line-clamp-2">
                    {item.name}
                  </p>
                  <p className="text-xs text-[#1A1718]/65">
                    {item.size && item.size !== "NO_SIZE" ? `Size ${item.size} · ` : ""}
                    Qty {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-sm text-[#38131E]">
                  {currency}
                  {(item.price * item.quantity).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrackOrder;
