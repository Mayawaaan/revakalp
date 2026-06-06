import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { Users, ShoppingCart, Package, IndianRupee, TrendingUp } from "lucide-react";
import useStore from "../../store/store";

const StatCard = ({ title, value, icon: Icon, loading, gradient }) => (
  <div className={`relative overflow-hidden rounded-2xl p-6 ${gradient} shadow-lg`}>
    {/* Decorative blob */}
    <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10 blur-xl" />
    <div className="relative flex items-start justify-between">
      <div>
        <p className="text-xs uppercase tracking-widest text-white/70 font-medium mb-2">
          {title}
        </p>
        <p className="text-3xl font-serif text-white font-semibold">
          {loading ? "—" : value}
        </p>
      </div>
      <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
        <Icon size={20} className="text-white" />
      </div>
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
    totalRevenue: 0,
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
        error.response?.data?.message || "Failed to load dashboard statistics",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { title: "Total Users",    value: stats.totalUsers,                                         icon: Users,        gradient: "bg-gradient-to-br from-[#c9487c] to-[#7b1c3e]" },
    { title: "Total Orders",   value: stats.totalOrders,                                        icon: ShoppingCart, gradient: "bg-gradient-to-br from-[#b53f6c] to-[#9d2a52]" },
    { title: "Total Products", value: stats.totalProducts,                                      icon: Package,      gradient: "bg-gradient-to-br from-[#d4608a] to-[#c9487c]" },
    { title: "Total Revenue",  value: `₹${Number(stats.totalRevenue).toLocaleString("en-IN")}`, icon: IndianRupee,  gradient: "bg-gradient-to-br from-[#9d2a52] to-[#7b1c3e]" },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-pink-500 mb-1 font-medium">
          Overview
        </p>
        <h1 className="text-3xl font-serif text-pink-900">Dashboard</h1>
        <p className="text-pink-600 mt-1 text-sm">
          Live snapshot of your store performance
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((c) => (
          <StatCard key={c.title} {...c} loading={loading} />
        ))}
      </div>

      {/* Bottom cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-pink-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
              <ShoppingCart size={16} className="text-[#c9487c]" />
            </div>
            <h3 className="font-serif text-lg text-pink-900">Recent Orders</h3>
          </div>
          <p className="text-sm text-pink-500">
            Order activity will appear here.
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-pink-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
              <TrendingUp size={16} className="text-[#c9487c]" />
            </div>
            <h3 className="font-serif text-lg text-pink-900">Sales Insights</h3>
          </div>
          <p className="text-sm text-pink-500">
            Revenue trends and charts coming soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
