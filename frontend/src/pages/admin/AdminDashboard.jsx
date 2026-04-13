import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance"; 
import {
  Users,
  ShoppingCart,
  Package,
  IndianRupee
} from "lucide-react";
import useStore from "../../store/store";

const StatCard = ({ title, value, icon: Icon, loading }) => (
  <div className="bg-white rounded-xl border p-6 flex items-center gap-5">
    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
      <Icon size={22} className="text-gray-700" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold text-gray-900 mt-1">
        {loading ? "—" : value}
      </p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { showToast } = useStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/analytics");
      setStats(res.data);
    } catch (error) {
      showToast(
        error.response?.data?.message ||
          "Failed to load dashboard statistics",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Overview of your store performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          loading={loading}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          loading={loading}
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          loading={loading}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${Number(stats.totalRevenue).toLocaleString()}`}
          icon={IndianRupee}
          loading={loading}
        />
      </div>

      {/* Placeholder Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Recent Orders
          </h3>
          <p className="text-sm text-gray-500">
            Order activity will appear here.
          </p>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Sales Insights
          </h3>
          <p className="text-sm text-gray-500">
            Revenue trends and charts coming soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
