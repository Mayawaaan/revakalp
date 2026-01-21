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
  const { orders, currency, orderLoading, fetchOrders, reorderItems, downloadInvoice, showToast } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleDownloadInvoice = async (orderId) => {
    try {
      await downloadInvoice(orderId);
    } catch (error) {
      showToast("Failed to download invoice", "error");
    }
  };

  if (orderLoading) {
    return (
      <section className="min-h-screen pt-28 bg-[#fff1f4] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-pink-600 mx-auto mb-4" />
          <p className="text-pink-600">Loading your orders...</p>
        </div>
      </section>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <section className="min-h-screen pt-28 bg-[#fff1f4] text-center">
        <h2 className="text-2xl text-pink-800">No orders yet</h2>
        <p className="text-pink-600 mt-3">Your purchases will appear here.</p>
        <button
          onClick={() => navigate("/shop")}
          className="mt-6 bg-pink-700 text-white px-8 py-3 rounded-full"
        >
          Shop Now
        </button>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-24 pb-24 bg-gradient-to-br from-[#fffafc] via-[#fff1f4] to-[#ffe6ee]">
      <div className="max-w-6xl mx-auto px-8">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-pink-700 mb-8"
        >
          <ArrowLeft /> Back
        </button>

        <h1 className="font-serif text-4xl text-pink-900 text-center mb-16">
          My Orders
        </h1>

        <div className="space-y-16">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-10"
            >
              {/* Order Header */}
              <div className="flex justify-between flex-wrap gap-6 mb-10">
                <div>
                  <p className="text-pink-600 text-sm">Order ID</p>
                  <p className="font-medium">{order._id || order.id}</p>
                </div>
                <div>
                  <p className="text-pink-600 text-sm">Placed on</p>
                  <p>{new Date(order.createdAt || order.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-pink-600 text-sm">Total</p>
                  <p className="font-semibold text-pink-800">
                    {currency}{order.total}
                  </p>
                </div>
              </div>

              {/* Delivery Timeline */}
              <div className="flex items-center gap-6 mb-10">
                <div className={`h-2 flex-1 rounded-full ${order.status !== "Placed" ? "bg-green-500" : "bg-pink-200"}`} />
                <div className={`h-2 flex-1 rounded-full ${order.status === "Delivered" ? "bg-green-500" : "bg-pink-200"}`} />
              </div>

              {/* Items */}
              {order.items.map((item, idx) => (
                <div
                  key={item._id || item.productId?._id || idx}
                  className="flex gap-6 items-center py-6 border-t"
                >
                  <img
                    src={Array.isArray(item.image) ? item.image[0] : item.image}
                    className="w-20 h-24 rounded-xl object-cover"
                    alt={item.name}
                  />

                  <div className="flex-1">
                    <h4 className="text-pink-900">{item.name}</h4>
                    <p className="text-sm text-pink-600">
                      {currency}{item.price} • Size {item.size} • Qty {item.quantity || item.qty}
                    </p>
                  </div>

                  <p className="text-pink-800 font-medium">
                    {currency}{item.price * (item.quantity || item.qty)}
                  </p>
                </div>
              ))}

              {/* Refund */}
              {order.refund && (
                <p className="mt-6 text-sm text-green-700">
                  Refund of {currency}{order.refund.amount} processed on {order.refund.date}
                </p>
              )}

              {/* Status & Actions */}
              <div className="mt-10 flex flex-wrap gap-6 items-center">
                <div className="flex items-center gap-3">
                  {order.status === "Placed" && <Clock className="text-yellow-500" />}
                  {order.status === "Shipped" && <Truck className="text-blue-500" />}
                  {order.status === "Delivered" && <PackageCheck className="text-green-600" />}
                  {order.status === "Cancelled" && <XCircle className="text-red-500" />}
                  <p className="font-medium text-pink-900">{order.status}</p>
                </div>

                <div className="flex gap-4 ml-auto flex-wrap">
                  <button
                    onClick={() => navigate(`/track/${order._id || order.id}`)}
                    className="bg-pink-700 text-white px-6 py-3 rounded-full"
                  >
                    Track
                  </button>

                  <button
                    onClick={() => handleDownloadInvoice(order._id)}
                    className="border border-pink-300 px-6 py-3 rounded-full flex items-center gap-2"
                  >
                    <Download /> Invoice
                  </button>

                  {order.status === "Delivered" && (
                    <button className="border border-pink-300 px-6 py-3 rounded-full">
                      Return / Exchange
                    </button>
                  )}

                  <button
                    onClick={async () => {
                      try {
                        await reorderItems(order._id || order.id);
                        navigate("/cart");
                      } catch (error) {
                        console.error("Failed to reorder:", error);
                      }
                    }}
                    className="border border-pink-300 px-6 py-3 rounded-full flex items-center gap-2"
                  >
                    <RefreshCw /> Re-order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Orders;
