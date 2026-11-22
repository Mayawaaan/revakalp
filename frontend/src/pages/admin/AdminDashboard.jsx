import React, { useCallback, useEffect, useState } from "react";
import { Users, ShoppingCart, Package, IndianRupee, TrendingUp } from "lucide-react";
import axios from "../../utils/axiosInstance";
import useStore from "../../store/store";

const StatCard = ({ title, value, icon, loading, accent }) => {
  const Icon = icon;
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 shadow-sm border border-[#D4AF63]/35 ${
        accent ? "bg-[#2B0E17] text-[#F7F1E5]" : "bg-[#38131E] text-[#F7F1E5]"
      }`}
    >
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#F1D889]/80 font-medium mb-2">
            {title}
          </p>
          <p className="text-3xl font-serif text-[#F7F1E5] font-semibold">
            {loading ? "—" : value}
          </p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-white/10 border border-[#D4AF63]/30 flex items-center justify-center">
          <Icon size={20} className="text-[#F1D889]" />
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { showToast } = useStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });

  const fetchDashboardStats = useCallback(async () => {
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
  }, [showToast]);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const cards = [
    { title: "Total Users", value: stats.totalUsers, icon: Users, accent: false },
    { title: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, accent: true },
    { title: "Total Products", value: stats.totalProducts, icon: Package, accent: false },
    {
      title: "Total Revenue",
      value: `₹${Number(stats.totalRevenue).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      accent: true,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] uppercase tracking-[0.24em] text-[#38131E]/65 mb-1 font-semibold">
          Overview
        </p>
        <h1 className="text-3xl font-serif text-[#38131E]">Dashboard</h1>
        <p className="text-[#1A1718]/70 mt-1 text-sm">
          Live snapshot of your store performance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((c) => (
          <StatCard key={c.title} {...c} loading={loading} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#38131E]/12 p-6 shadow-xs">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#F7F1E5] border border-[#D4AF63]/40 flex items-center justify-center">
              <ShoppingCart size={16} className="text-[#38131E]" />
            </div>
            <h2 className="font-serif text-xl text-[#38131E]">Order Operations</h2>
          </div>
          <p className="text-sm text-[#1A1718]/70">
            Manage incoming customer orders, statuses, and tracking details under Orders.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#38131E]/12 p-6 shadow-xs">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#F7F1E5] border border-[#D4AF63]/40 flex items-center justify-center">
              <TrendingUp size={16} className="text-[#38131E]" />
            </div>
            <h2 className="font-serif text-xl text-[#38131E]">Sales Insights</h2>
          </div>
          <p className="text-sm text-[#1A1718]/70">
            Inspect detailed revenue trends, user growth, and category counts under Analytics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
