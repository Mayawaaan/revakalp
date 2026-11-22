import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PackageCheck,
  Truck,
  Clock,
  XCircle,
  RefreshCw,
  Download,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import useStore from "../../store/store";
import PageHero from "../../components/globalComponents/PageHero";
import EmptyState from "../../components/ui/EmptyState";
import EditorialButton from "../../components/ui/EditorialButton";

const STATUS_BADGE = {
  Processing: "bg-amber-50 text-amber-800 border-amber-200",
  Placed: "bg-amber-50 text-amber-800 border-amber-200",
  Confirmed: "bg-sky-50 text-sky-800 border-sky-200",
  Preparing: "bg-orange-50 text-orange-800 border-orange-200",
  Shipped: "bg-indigo-50 text-indigo-800 border-indigo-200",
  "Out for Delivery": "bg-purple-50 text-purple-800 border-purple-200",
  Delivered: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Cancelled: "bg-red-50 text-red-800 border-red-200",
  Returned: "bg-stone-100 text-stone-700 border-stone-300",
};

const getStatusIcon = (status) => {
  if (status === "Delivered") return PackageCheck;
  if (status === "Shipped" || status === "Out for Delivery") return Truck;
  if (status === "Cancelled" || status === "Returned") return XCircle;
  return Clock;
};

const Orders = () => {
  const {
    orders,
    currency,
    orderLoading,
    fetchOrders,
    reorderItems,
    downloadInvoice,
    showToast,
  } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleDownloadInvoice = async (orderId) => {
    try {
      await downloadInvoice(orderId);
    } catch {
      showToast("Failed to download invoice", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F1E5]">
      <PageHero
        label="My Account"
        title="My Orders"
        subtitle={
          orders?.length
            ? `${orders.length} order${orders.length === 1 ? "" : "s"} recorded in your history`
            : "Track orders, download invoices, or reorder past pieces."
        }
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {orderLoading ? (
          <div className="rk-surface-card p-16 text-center">
            <Loader2 className="w-10 h-10 text-[#38131E] animate-spin mx-auto mb-3" />
            <p className="text-sm text-[#1A1718]/70">Fetching your orders…</p>
          </div>
        ) : !orders || orders.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No Orders Yet"
            description="Once you place an order, its status, items, and invoice will appear here."
            actionLabel="Start Shopping"
            actionTo="/shop"
          />
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusLabel = order.status || "Placed";
              const badgeCls =
                STATUS_BADGE[statusLabel] || "bg-[#F7F1E5] text-[#38131E] border-[#38131E]/20";
              const StatusIcon = getStatusIcon(statusLabel);

              return (
                <article key={order._id} className="rk-surface-card overflow-hidden">
                  {/* Header */}
                  <div className="bg-[#38131E]/5 px-5 sm:px-7 py-4 border-b border-[#38131E]/10 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-6 sm:gap-8">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#38131E]/60 font-semibold">
                          Order ID
                        </p>
                        <p className="text-sm font-mono font-semibold text-[#38131E]">
                          #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#38131E]/60 font-semibold">
                          Placed On
                        </p>
                        <p className="text-sm font-medium text-[#1A1718]">
                          {new Date(order.createdAt || order.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#38131E]/60 font-semibold">
                          Total
                        </p>
                        <p className="text-sm font-semibold text-[#38131E]">
                          {currency}
                          {Number(order.total || 0).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] text-xs font-semibold border ${badgeCls}`}
                    >
                      <StatusIcon size={14} />
                      {statusLabel}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-[#38131E]/10 px-5 sm:px-7">
                    {(order.items || []).map((item, idx) => {
                      const img = Array.isArray(item.image) ? item.image[0] : item.image;
                      const qty = item.quantity || item.qty || 1;
                      return (
                        <div key={item._id || idx} className="py-4 flex items-center gap-4">
                          {img && (
                            <img
                              src={img}
                              alt={item.name}
                              className="w-16 h-20 object-cover rounded-[2px] shrink-0 border border-[#38131E]/12"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-serif text-lg text-[#38131E] truncate">
                              {item.name}
                            </h3>
                            <div className="mt-1 flex flex-wrap gap-2 text-xs text-[#1A1718]/70">
                              <span>
                                {currency}
                                {item.price}
                              </span>
                              {item.size && item.size !== "NO_SIZE" && (
                                <span>· Size {item.size}</span>
                              )}
                              <span>· Qty {qty}</span>
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-[#38131E] shrink-0">
                            {currency}
                            {(item.price * qty).toLocaleString("en-IN")}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="px-5 sm:px-7 py-4 bg-[#F7F1E5]/50 border-t border-[#38131E]/10 flex flex-wrap justify-end gap-3">
                    <EditorialButton
                      variant="primary"
                      onClick={() => navigate(`/track/${order._id}`)}
                    >
                      <Truck size={14} /> Track Order
                    </EditorialButton>

                    <EditorialButton
                      variant="secondary"
                      onClick={() => handleDownloadInvoice(order._id)}
                    >
                      <Download size={14} /> Invoice
                    </EditorialButton>

                    <EditorialButton
                      variant="secondary"
                      onClick={async () => {
                        try {
                          await reorderItems(order._id);
                          navigate("/cart");
                        } catch (err) {
                          showToast(err?.message || "Reorder failed", "error");
                        }
                      }}
                    >
                      <RefreshCw size={14} /> Reorder
                    </EditorialButton>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
