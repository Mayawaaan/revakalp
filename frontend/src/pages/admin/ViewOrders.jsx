import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance"; 
import {
  Package,
  User,
  Eye,
  Loader2
} from "lucide-react";
import useStore from "../../store/store";

const STATUS_OPTIONS = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled"
];

const statusBadge = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Processing":
      return "bg-blue-100 text-blue-800";
    case "Shipped":
      return "bg-indigo-100 text-indigo-800";
    case "Delivered":
      return "bg-green-100 text-green-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const ViewOrders = () => {
  const { showToast } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/orders");
      setOrders(res.data || []);
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to fetch orders",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);

    // Optimistic UI
    setOrders((prev) =>
      prev.map((o) =>
        o._id === orderId ? { ...o, status } : o
      )
    );

    try {
      await axios.put(`/api/admin/orders/${orderId}/status`, { status });
      showToast("Order status updated", "success");
    } catch {
      showToast("Failed to update order status", "error");
      fetchOrders(); // rollback
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section className="space-y-8">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Orders
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and track customer purchases
          </p>
        </div>

        <div className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm shadow">
          <Package size={16} />
          {orders.length} Orders
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20 text-gray-500">
            <Loader2 className="animate-spin mr-2" />
            Loading orders…
          </div>
        )}

        {!loading && (
          <div className="overflow-x-auto">
            <div className="hidden md:block">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 text-left font-medium text-gray-500">
                      Order
                    </th>
                    <th className="px-6 py-4 text-left font-medium text-gray-500">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left font-medium text-gray-500">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left font-medium text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right font-medium text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 transition"
                    >
                      {/* Order ID */}
                      <td className="px-6 py-4 font-medium text-gray-900">
                        #{order._id.slice(-6)}
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-4 flex items-center gap-2 text-gray-700">
                        <User size={16} className="text-gray-400" />
                        {order.userId?.fullName || "Guest"}
                      </td>

                      {/* Total */}
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        ₹{Number(order.total).toFixed(2)}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>

                          <select
                            value={order.status}
                            disabled={updatingId === order._id}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            className="text-xs border rounded-md px-2 py-1 bg-white focus:outline-none"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <button
                          className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}

                  {!orders.length && (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-16 text-gray-500"
                      >
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="md:hidden">
              {orders.map((order) => (
                <div key={order._id} className="border-t p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">#{order._id.slice(-6)}</p>
                      <p className="text-sm text-gray-700 flex items-center gap-2 mt-1">
                        <User size={14} className="text-gray-400" />
                        {order.userId?.fullName || "Guest"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{Number(order.total).toFixed(2)}</p>
                      <button className="mt-1 inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                        <Eye size={14} />
                        View
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge(order.status)}`}>
                        {order.status}
                      </span>
                      <select
                        value={order.status}
                        disabled={updatingId === order._id}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="text-xs border rounded-md px-2 py-1 bg-white focus:outline-none"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              {!orders.length && (
                <div className="text-center py-16 text-gray-500">
                  No orders found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ViewOrders;
