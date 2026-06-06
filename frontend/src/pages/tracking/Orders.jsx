import React, { useEffect } from "react";
import useStore from "../../store/store";
import { useNavigate } from "react-router-dom";
import {
  PackageCheck,
  Truck,
  Clock,
  XCircle,
  RefreshCw,
  Download,
  ArrowLeft,
  Loader2
} from "lucide-react";

const Orders = () => {
  const {
    orders,
    currency,
    orderLoading,
    fetchOrders,
    reorderItems,
    downloadInvoice,
    showToast
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

  /* ================= LOADING ================= */
  if (orderLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto text-pink-600" size={42} />
          <p className="mt-4 text-pink-700">Fetching your orders…</p>
        </div>
      </section>
    );
  }

  /* ================= EMPTY ================= */
  if (!orders || orders.length === 0) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center bg-pink-50 text-center">
        <h2 className="text-3xl font-serif text-pink-900">No Orders Yet</h2>
        <p className="text-pink-600 mt-3">
          Once you purchase something, it’ll appear here.
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="mt-6 bg-pink-700 text-white px-8 py-3 rounded-full"
        >
          Start Shopping
        </button>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#fffafc] via-[#fff1f4] to-[#ffe6ee] py-24">
      <div className="max-w-6xl mx-auto px-6">

        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-pink-700 mb-10"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <h1 className="text-4xl font-serif text-center text-pink-900 mb-16">
          My Orders
        </h1>

        <div className="space-y-16">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white/70 backdrop-blur-xl rounded-3xl border border-pink-100 shadow-2xl overflow-hidden"
            >
              {/* ===== HEADER ===== */}
              <div className="p-8 flex flex-wrap gap-6 justify-between border-b">
                <div>
                  <p className="text-xs text-pink-500">Order ID</p>
                  <p className="font-medium">{order._id}</p>
                </div>

                <div>
                  <p className="text-xs text-pink-500">Placed On</p>
                  <p>
                    {new Date(order.createdAt || order.date).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-pink-500">Total</p>
                  <p className="font-semibold text-pink-800">
                    {currency}{order.total}
                  </p>
                </div>
              </div>

              {/* ===== ITEMS ===== */}
              <div className="px-8 divide-y">
                {order.items.map((item, idx) => (
                  <div
                    key={item._id || idx}
                    className="flex items-center gap-6 py-6"
                  >
                    <img
                      src={Array.isArray(item.image) ? item.image[0] : item.image}
                      alt={item.name}
                      className="w-20 h-24 rounded-xl object-cover"
                    />

                    <div className="flex-1">
                      <h4 className="text-pink-900 font-medium">
                        {item.name}
                      </h4>
                      <p className="text-sm text-pink-600">
                        {currency}{item.price}{item.size && item.size !== "NO_SIZE" ? ` • Size ${item.size}` : ""} • Qty{" "}
                        {item.quantity || item.qty}
                      </p>
                    </div>

                    <p className="font-medium text-pink-800">
                      {currency}
                      {item.price * (item.quantity || item.qty)}
                    </p>
                  </div>
                ))}
              </div>

              {/* ===== STATUS ===== */}
              <div className="px-8 py-6 flex items-center gap-4 border-t">
                {order.status === "Placed" && (
                  <Clock className="text-yellow-500" />
                )}
                {order.status === "Shipped" && (
                  <Truck className="text-blue-500" />
                )}
                {order.status === "Delivered" && (
                  <PackageCheck className="text-green-600" />
                )}
                {order.status === "Cancelled" && (
                  <XCircle className="text-red-500" />
                )}

                <p className="font-medium text-pink-900">{order.status}</p>
              </div>

              {/* ===== ACTIONS ===== */}
              <div className="px-8 py-6 flex flex-wrap gap-4 justify-end bg-pink-50">
                <button
                  onClick={() => navigate(`/track/${order._id}`)}
                  className="bg-pink-700 text-white px-6 py-3 rounded-full"
                >
                  Track Order
                </button>

                <button
                  onClick={() => handleDownloadInvoice(order._id)}
                  className="border border-pink-300 px-6 py-3 rounded-full flex items-center gap-2"
                >
                  <Download size={18} /> Invoice
                </button>

                {order.status === "Delivered" && (
                  <button className="border border-pink-300 px-6 py-3 rounded-full">
                    Return / Exchange
                  </button>
                )}

                <button
                  onClick={async () => {
                    try {
                      await reorderItems(order._id);
                      navigate("/cart");
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  className="border border-pink-300 px-6 py-3 rounded-full flex items-center gap-2"
                >
                  <RefreshCw size={18} /> Reorder
                </button>
              </div>

              {/* ===== REFUND ===== */}
              {order.refund && (
                <p className="px-8 pb-6 text-sm text-green-700">
                  Refund of {currency}{order.refund.amount} processed on{" "}
                  {order.refund.date}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Orders;
