import React, { useCallback, useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { Users, ShoppingCart, Package, IndianRupee, RefreshCw } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";
import useStore from "../../store/store";

const StatCard = ({ title, value, icon: Icon, loading, gradient }) => (
  <div className={`relative overflow-hidden rounded-2xl p-6 ${gradient} shadow-lg`}>
    <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10 blur-xl" />
    <div className="relative flex items-start justify-between">
      <div>
        <p className="text-xs uppercase tracking-widest text-white/70 font-medium mb-2">{title}</p>
        <p className="text-3xl font-serif text-white font-semibold">{loading ? "—" : value}</p>
      </div>
      <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
        <Icon size={20} className="text-white" />
      </div>
    </div>
  </div>
);

const ChartCard = ({ title, onRefresh, loading, children }) => (
  <div className="bg-white/70 backdrop-blur-xl border border-pink-100 rounded-2xl p-6 shadow-sm">
    <div className="flex items-center justify-between mb-5">
      <h3 className="font-serif text-lg text-pink-900">{title}</h3>
      <button
        onClick={onRefresh}
        disabled={loading}
        className="flex items-center gap-1.5 text-xs text-pink-500 hover:text-pink-800 transition disabled:opacity-40 border border-pink-200 px-3 py-1.5 rounded-full"
      >
        <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
        {loading ? "Loading…" : "Refresh"}
      </button>
    </div>
    {children}
  </div>
);

const Analytics = () => {
  const { showToast } = useStore();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({ totalUsers: 0, totalOrders: 0, totalProducts: 0, totalRevenue: 0 });
  const [revenueData, setRevenueData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [loadingRevenue, setLoadingRevenue] = useState(true);
  const [loadingOrderStatus, setLoadingOrderStatus] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/analytics");
      setAnalytics(res.data);
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to load analytics data", "error");
    } finally { setLoading(false); }
  }, [showToast]);

  const fetchRevenueData = useCallback(async (range = "7d") => {
    setLoadingRevenue(true);
    try {
      const res = await axios.get(`/api/admin/analytics/revenue?range=${encodeURIComponent(range)}`);
      setRevenueData(Array.isArray(res.data)
        ? res.data.map((d) => ({ day: typeof d?.date === "string" ? d.date.slice(5) : "", revenue: Number(d?.revenue || 0) }))
        : []);
    } catch { showToast("Failed to load revenue data", "error"); setRevenueData([]); }
    finally { setLoadingRevenue(false); }
  }, [showToast]);

  const fetchOrderStatusData = useCallback(async () => {
    setLoadingOrderStatus(true);
    try {
      const res = await axios.get("/api/admin/analytics/orders-by-status");
      setOrderStatusData(Array.isArray(res.data)
        ? res.data.map((d) => ({ status: d?.status ?? "Unknown", count: Number(d?.count || 0) }))
        : []);
    } catch { showToast("Failed to load order status data", "error"); setOrderStatusData([]); }
    finally { setLoadingOrderStatus(false); }
  }, [showToast]);

  const fetchUsersData = useCallback(async (range = "7d") => {
    setLoadingUsers(true);
    try {
      const res = await axios.get(`/api/admin/analytics/users?range=${encodeURIComponent(range)}`);
      setUsersData(Array.isArray(res.data)
        ? res.data.map((d) => ({ day: typeof d?.date === "string" ? d.date.slice(5) : "", count: Number(d?.count || 0) }))
        : []);
    } catch { showToast("Failed to load users data", "error"); setUsersData([]); }
    finally { setLoadingUsers(false); }
  }, [showToast]);

  const fetchProductsData = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const res = await axios.get("/api/admin/analytics/products");
      setProductsData(Array.isArray(res.data)
        ? res.data.map((d) => ({ category: d?.category ?? "Unknown", count: Number(d?.count || 0) }))
        : []);
    } catch { showToast("Failed to load products data", "error"); setProductsData([]); }
    finally { setLoadingProducts(false); }
  }, [showToast]);

  useEffect(() => {
    fetchAnalytics();
    fetchRevenueData("7d");
    fetchOrderStatusData();
    fetchUsersData("7d");
    fetchProductsData();
  }, [fetchAnalytics, fetchRevenueData, fetchOrderStatusData, fetchUsersData, fetchProductsData]);

  const cards = [
    { title: "Total Users",    value: analytics.totalUsers,                                         icon: Users,        gradient: "bg-gradient-to-br from-[#c9487c] to-[#7b1c3e]" },
    { title: "Total Orders",   value: analytics.totalOrders,                                        icon: ShoppingCart, gradient: "bg-gradient-to-br from-[#b53f6c] to-[#9d2a52]" },
    { title: "Total Products", value: analytics.totalProducts,                                      icon: Package,      gradient: "bg-gradient-to-br from-[#d4608a] to-[#c9487c]" },
    { title: "Total Revenue",  value: `₹${Number(analytics.totalRevenue).toLocaleString("en-IN")}`, icon: IndianRupee,  gradient: "bg-gradient-to-br from-[#9d2a52] to-[#7b1c3e]" },
  ];

  const chartTooltipStyle = { backgroundColor: "#fff0f5", border: "1px solid #f9a8d4", borderRadius: "10px", color: "#9d2a52", fontSize: 12 };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-pink-500 mb-1 font-medium">Insights</p>
        <h1 className="text-3xl font-serif text-pink-900">Analytics</h1>
        <p className="text-pink-600 text-sm mt-1">High-level insights into store performance</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((c) => <StatCard key={c.title} {...c} loading={loading} />)}
      </div>

      {/* Charts */}
      <div className="flex flex-col gap-6">

        {/* Revenue */}
        <ChartCard title="Revenue Trend (Delivered)" onRefresh={() => fetchRevenueData("7d")} loading={loadingRevenue}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#c9487c" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#c9487c" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Line type="monotone" dataKey="revenue" stroke="#c9487c" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "#7b1c3e" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Orders by status */}
        <ChartCard title="Orders by Status" onRefresh={fetchOrderStatusData} loading={loadingOrderStatus}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
                <XAxis dataKey="status" tick={{ fontSize: 10, fill: "#c9487c" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#c9487c" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="count" fill="#c9487c" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Users */}
        <ChartCard title="User Registrations (Weekly)" onRefresh={() => fetchUsersData("7d")} loading={loadingUsers}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#c9487c" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#c9487c" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Line type="monotone" dataKey="count" stroke="#9d2a52" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "#7b1c3e" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Products */}
        <ChartCard title="Products by Category" onRefresh={fetchProductsData} loading={loadingProducts}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
                <XAxis dataKey="category" tick={{ fontSize: 10, fill: "#c9487c" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#c9487c" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="count" fill="#b53f6c" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

      </div>
    </div>
  );
};

export default Analytics;
