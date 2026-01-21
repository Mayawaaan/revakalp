import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  ShoppingCart,
  Package,
  IndianRupee
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import useStore from "../../store/store";

const StatCard = ({ title, value, icon, loading }) => {
  const Icon = icon;
  return (
    <div className="bg-white border rounded-xl p-6 flex items-center gap-5">
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
};

const Analytics = () => {
  const { showToast } = useStore();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0
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
      showToast(
        error.response?.data?.message ||
          "Failed to load analytics data",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const fetchRevenueData = useCallback(async (range = "7d") => {
    setLoadingRevenue(true);
    try {
      const res = await axios.get(
        `/api/admin/analytics/revenue?range=${encodeURIComponent(range)}`
      );

      // Backend returns: [{ date: "YYYY-MM-DD", revenue: number }]
      // UI chart expects: [{ day: string, revenue: number }]
      const mapped = Array.isArray(res.data)
        ? res.data.map((d) => ({
            day: typeof d?.date === "string" ? d.date.slice(5) : "",
            revenue: Number(d?.revenue || 0),
          }))
        : [];

      setRevenueData(mapped);
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to load revenue data",
        "error"
      );
      setRevenueData([]);
    } finally {
      setLoadingRevenue(false);
    }
  }, [showToast]);

  const fetchOrderStatusData = useCallback(async () => {
    setLoadingOrderStatus(true);
    try {
      const res = await axios.get("/api/admin/analytics/orders-by-status");
      const mapped = Array.isArray(res.data)
        ? res.data.map((d) => ({
            status: d?.status ?? "Unknown",
            count: Number(d?.count || 0),
          }))
        : [];
      setOrderStatusData(mapped);
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to load order status data",
        "error"
      );
      setOrderStatusData([]);
    } finally {
      setLoadingOrderStatus(false);
    }
  }, [showToast]);

  const fetchUsersData = useCallback(async (range = "7d") => {
    setLoadingUsers(true);
    try {
      const res = await axios.get(
        `/api/admin/analytics/users?range=${encodeURIComponent(range)}`
      );

      // Backend returns: [{ date: "YYYY-MM-DD", count: number }]
      // UI chart expects: [{ day: string, count: number }]
      const mapped = Array.isArray(res.data)
        ? res.data.map((d) => ({
            day: typeof d?.date === "string" ? d.date.slice(5) : "",
            count: Number(d?.count || 0),
          }))
        : [];

      setUsersData(mapped);
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to load users data",
        "error"
      );
      setUsersData([]);
    } finally {
      setLoadingUsers(false);
    }
  }, [showToast]);

  const fetchProductsData = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const res = await axios.get("/api/admin/analytics/products");
      const mapped = Array.isArray(res.data)
        ? res.data.map((d) => ({
            category: d?.category ?? "Unknown",
            count: Number(d?.count || 0),
          }))
        : [];
      setProductsData(mapped);
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to load products data",
        "error"
      );
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
  }, [fetchAnalytics, fetchRevenueData, fetchOrderStatusData, fetchUsersData, fetchProductsData]);

  return (
    <div className="space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Analytics
        </h1>
        <p className="text-gray-500 mt-1">
          High-level insights into store performance
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={analytics.totalUsers}
          icon={Users}
          loading={loading}
        />
        <StatCard
          title="Total Orders"
          value={analytics.totalOrders}
          icon={ShoppingCart}
          loading={loading}
        />
        <StatCard
          title="Total Products"
          value={analytics.totalProducts}
          icon={Package}
          loading={loading}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${Number(analytics.totalRevenue).toLocaleString()}`}
          icon={IndianRupee}
          loading={loading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Revenue Chart */}
        <div className="bg-white border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Revenue Trend (Delivered)
            </h3>
            <button
              className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-60"
              onClick={() => fetchRevenueData("7d")}
              disabled={loadingRevenue}
            >
              {loadingRevenue ? "Loading…" : "Refresh"}
            </button>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4f46e5"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Chart */}
        <div className="bg-white border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Orders by Status
            </h3>
            <button
              className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-60"
              onClick={fetchOrderStatusData}
              disabled={loadingOrderStatus}
            >
              {loadingOrderStatus ? "Loading…" : "Refresh"}
            </button>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Users Chart */}
        <div className="bg-white border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              User Registrations (Weekly)
            </h3>
            <button
              className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-60"
              onClick={() => fetchUsersData("7d")}
              disabled={loadingUsers}
            >
              {loadingUsers ? "Loading…" : "Refresh"}
            </button>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Products Chart */}
        <div className="bg-white border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Products by Category
            </h3>
            <button
              className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-60"
              onClick={fetchProductsData}
              disabled={loadingProducts}
            >
              {loadingProducts ? "Loading…" : "Refresh"}
            </button>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill="#f59e0b"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
