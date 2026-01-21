import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Package,
  User,
  Eye
} from "lucide-react";
import useStore from "../../store/store";

const ViewOrders = () => {
  const { showToast } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/orders");
      setOrders(res.data);
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
    try {
      await axios.put(`/api/admin/orders/${orderId}/status`, { status });
      showToast("Order status updated", "success");
      fetchOrders();
    } catch {
      showToast("Failed to update order status", "error");
    }
  };

  const statusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-300";
      case "Processing":
        return "bg-blue-50 text-blue-700 border-blue-300";
      case "Shipped":
        return "bg-indigo-50 text-indigo-700 border-indigo-300";
      case "Delivered":
        return "bg-green-50 text-green-700 border-green-300";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-300";
      default:
        return "bg-gray-50 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Orders
          </h1>
          <p className="text-gray-500 mt-1">
            View and manage customer orders
          </p>
        </div>

        <div className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-md text-sm">
          <Package size={16} />
          {orders.length} Orders
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                Actions
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
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  #{order._id.slice(-6)}
                </td>

                {/* Customer */}
                <td className="px-6 py-4 flex items-center gap-2 text-sm text-gray-700">
                  <User size={16} />
                  {order.userId?.fullName || "Guest"}
                </td>

                {/* Total */}
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  ₹{order.total.toFixed(2)}
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className={`text-sm rounded-md px-3 py-1 border ${statusStyle(
                      order.status
                    )}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <button className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm">
                    <Eye size={16} />
                    View
                  </button>
                </td>
              </tr>
            ))}

            {!orders.length && !loading && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-10 text-gray-500"
                >
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {loading && (
          <div className="text-center py-6 text-gray-500">
            Loading orders…
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewOrders;
