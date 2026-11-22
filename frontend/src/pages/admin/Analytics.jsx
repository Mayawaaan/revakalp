import React, { useCallback, useEffect, useState } from "react";
import { Users, ShoppingCart, Package, IndianRupee, RefreshCw } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
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

const ChartCard = ({ title, onRefresh, loading, children }) => (
  <div className="bg-white border border-[#38131E]/12 rounded-2xl p-6 shadow-xs">
    <div className="flex items-center justify-between mb-5">
      <h3 className="font-serif text-xl text-[#38131E]">{title}</h3>
      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        className="flex items-center gap-1.5 text-xs text-[#38131E] hover:bg-[#F7F1E5] transition disabled:opacity-40 border border-[#38131E]/20 px-3.5 py-1.5 rounded-full cursor-pointer"
      >
        <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
        {loading ? "Loading…" : "Refresh"}
      </button>
    </div>
    {children}
  </div>
);

const Analytics = () => {
  const { showToast } = useStore();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });
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
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const fetchRevenueData = useCallback(
    async (range = "7d") => {
      setLoadingRevenue(true);
      try {
        const res = await axios.get(`/api/admin/analytics/revenue?range=${encodeURIComponent(range)}`);
        setRevenueData(
          Array.isArray(res.data)
            ? res.data.map((d) => ({
                day: typeof d?.date === "string" ? d.date.slice(5) : "",
                revenue: Number(d?.revenue || 0),
              }))
            : []
        );
      } catch {
        showToast("Failed to load revenue data", "error");
        setRevenueData([]);
      } finally {
        setLoadingRevenue(false);
      }
    },
    [showToast]
  );

  const fetchOrderStatusData = useCallback(async () => {
    setLoadingOrderStatus(true);
    try {
      const res = await axios.get("/api/admin/analytics/orders-by-status");
      setOrderStatusData(
        Array.isArray(res.data)
          ? res.data.map((d) => ({
              status: d?.status ?? "Unknown",
              count: Number(d?.count || 0),
            }))
          : []
      );
    } catch {
      showToast("Failed to load order status data", "error");
      setOrderStatusData([]);
    } finally {
      setLoadingOrderStatus(false);
    }
  }, [showToast]);

  const fetchUsersData = useCallback(
    async (range = "7d") => {
      setLoadingUsers(true);
      try {
        const res = await axios.get(`/api/admin/analytics/users?range=${encodeURIComponent(range)}`);
        setUsersData(
          Array.isArray(res.data)
            ? res.data.map((d) => ({
                day: typeof d?.date === "string" ? d.date.slice(5) : "",
                count: Number(d?.count || 0),
              }))
            : []
        );
      } catch {
        showToast("Failed to load users data", "error");
        setUsersData([]);
      } finally {
        setLoadingUsers(false);
      }
    },
    [showToast]
  );

  const fetchProductsData = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const res = await axios.get("/api/admin/analytics/products");
      setProductsData(
        Array.isArray(res.data)
          ? res.data.map((d) => ({
              category: d?.category ?? "Unknown",
              count: Number(d?.count || 0),
            }))
          : []
      );
    } catch {
      showToast("Failed to load products data", "error");
      setProductsData([]);
    } finally {
      setLoadingProducts(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchAnalytics();
    fetchRevenueData("7d");
    fetchOrderStatusData();
    fetchUsersData("7d");
    fetchProductsData();
  }, [
    fetchAnalytics,
    fetchRevenueData,
    fetchOrderStatusData,
    fetchUsersData,
    fetchProductsData,
  ]);

  const cards = [
    { title: "Total Users", value: analytics.totalUsers, icon: Users, accent: false },
    { title: "Total Orders", value: analytics.totalOrders, icon: ShoppingCart, accent: true },
    { title: "Total Products", value: analytics.totalProducts, icon: Package, accent: false },
    {
      title: "Total Revenue",
      value: `₹${Number(analytics.totalRevenue).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      accent: true,
    },
  ];

  const chartTooltipStyle = {
    backgroundColor: "#F7F1E5",
    border: "1px solid #D4AF63",
    borderRadius: "10px",
    color: "#38131E",
    fontSize: 12,
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] uppercase tracking-[0.24em] text-[#38131E]/65 mb-1 font-semibold">
          Insights
        </p>
        <h1 className="text-3xl font-serif text-[#38131E]">Analytics</h1>
        <p className="text-[#1A1718]/70 text-sm mt-1">
          High-level insights into store performance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((c) => (
          <StatCard key={c.title} {...c} loading={loading} />
        ))}
      </div>

      <div className="flex flex-col gap-6">
        <ChartCard
          title="Revenue Trend (Delivered)"
          onRefresh={() => fetchRevenueData("7d")}
          loading={loadingRevenue}
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8DEC8" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#38131E" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#38131E" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Line type="monotone" dataKey="revenue" stroke="#38131E" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "#D4AF63" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Orders by Status"
          onRefresh={fetchOrderStatusData}
          loading={loadingOrderStatus}
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8DEC8" />
                <XAxis dataKey="status" tick={{ fontSize: 10, fill: "#38131E" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#38131E" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="count" fill="#38131E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="User Registrations (Weekly)"
          onRefresh={() => fetchUsersData("7d")}
          loading={loadingUsers}
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8DEC8" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#38131E" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#38131E" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Line type="monotone" dataKey="count" stroke="#D4AF63" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "#38131E" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Products by Category"
          onRefresh={fetchProductsData}
          loading={loadingProducts}
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8DEC8" />
                <XAxis dataKey="category" tick={{ fontSize: 10, fill: "#38131E" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#38131E" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="count" fill="#D4AF63" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default Analytics;
