import React, { useCallback, useEffect, useState } from "react";
import {
  Users,
  ShoppingCart,
  Package,
  IndianRupee,
  RefreshCw,
  Brain,
  Star,
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
  Bar,
} from "recharts";
import axios from "../../utils/axiosInstance";
import useStore from "../../store/store";

const StatCard = ({ title, value, icon, loading, accent }) => {
  const Icon = icon;
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-4 sm:p-6 shadow-sm border border-[#D4AF63]/35 ${
        accent ? "bg-[#2B0E17] text-[#F7F1E5]" : "bg-[#38131E] text-[#F7F1E5]"
      }`}
    >
      <div className="relative flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.22em] text-[#F1D889]/80 font-medium mb-1.5 sm:mb-2">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-serif text-[#F7F1E5] font-semibold">
            {loading ? "—" : value}
          </p>
        </div>
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 border border-[#D4AF63]/30 flex items-center justify-center shrink-0">
          <Icon size={18} className="text-[#F1D889]" />
        </div>
      </div>
    </div>
  );
};

const ChartCard = ({ title, onRefresh, loading, children }) => (
  <div className="bg-white border border-[#38131E]/12 rounded-2xl p-4 sm:p-6 shadow-xs">
    <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
      <h3 className="font-serif text-lg sm:text-xl text-[#38131E]">{title}</h3>
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

const SENTIMENT_BADGE_CLS = {
  positive: "bg-emerald-100 text-emerald-800 border-emerald-200",
  neutral: "bg-amber-100 text-amber-800 border-amber-200",
  negative: "bg-red-100 text-red-800 border-red-200",
};

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
  const [sentimentStats, setSentimentStats] = useState({
    totalReviews: 0,
    sentimentBreakdown: { positive: 0, neutral: 0, negative: 0 },
    positivityPercentage: 0,
    averageConfidence: 0,
    recentReviews: [],
    mlStatus: null,
  });
  const [loadingRevenue, setLoadingRevenue] = useState(true);
  const [loadingOrderStatus, setLoadingOrderStatus] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingSentiment, setLoadingSentiment] = useState(true);
  const [reanalyzing, setReanalyzing] = useState(false);

  const [batchText, setBatchText] = useState("");
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchOutput, setBatchOutput] = useState(null);

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

  const fetchSentimentData = useCallback(async () => {
    setLoadingSentiment(true);
    try {
      const res = await axios.get("/api/admin/analytics/sentiment");
      setSentimentStats({
        totalReviews: Number(res.data?.totalReviews || 0),
        sentimentBreakdown: res.data?.sentimentBreakdown || {
          positive: 0,
          neutral: 0,
          negative: 0,
        },
        positivityPercentage: Number(res.data?.positivityPercentage || 0),
        averageConfidence: Number(res.data?.averageConfidence || 0),
        recentReviews: Array.isArray(res.data?.recentReviews)
          ? res.data.recentReviews
          : [],
        mlStatus: res.data?.mlStatus || null,
      });
    } catch {
      showToast("Failed to load review sentiment analytics", "error");
    } finally {
      setLoadingSentiment(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchAnalytics();
    fetchRevenueData("7d");
    fetchOrderStatusData();
    fetchUsersData("7d");
    fetchProductsData();
    fetchSentimentData();
  }, [
    fetchAnalytics,
    fetchRevenueData,
    fetchOrderStatusData,
    fetchUsersData,
    fetchProductsData,
    fetchSentimentData,
  ]);

  const handleReanalyzeAll = async () => {
    setReanalyzing(true);
    try {
      const { data } = await axios.post("/api/ml/reanalyze-reviews", {});
      showToast(
        `Analyzed ${data.updatedCount || 0} reviews using BiLSTM sentiment model`,
        "success"
      );
      await fetchSentimentData();
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to re-analyze reviews",
        "error"
      );
    } finally {
      setReanalyzing(false);
    }
  };

  const handleAnalyzeBatch = async (e) => {
    e.preventDefault();
    const lines = batchText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) {
      showToast("Enter at least one review line to analyze", "error");
      return;
    }
    setBatchLoading(true);
    try {
      const { data } = await axios.post("/api/ml/analyze-batch", { texts: lines });
      setBatchOutput(data);
    } catch (error) {
      showToast(
        error.response?.data?.message || "Batch analysis failed",
        "error"
      );
    } finally {
      setBatchLoading(false);
    }
  };

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

  const sentimentChartData = [
    { label: "Positive", count: sentimentStats.sentimentBreakdown.positive || 0 },
    { label: "Neutral", count: sentimentStats.sentimentBreakdown.neutral || 0 },
    { label: "Negative", count: sentimentStats.sentimentBreakdown.negative || 0 },
  ];

  const chartTooltipStyle = {
    backgroundColor: "#F7F1E5",
    border: "1px solid #D4AF63",
    borderRadius: "10px",
    color: "#38131E",
    fontSize: 12,
  };

  const mlInfo = sentimentStats.mlStatus;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] uppercase tracking-[0.24em] text-[#38131E]/65 mb-1 font-semibold">
          Insights
        </p>
        <h1 className="text-3xl font-serif text-[#38131E]">Analytics</h1>
        <p className="text-[#1A1718]/70 text-sm mt-1">
          High-level insights into store performance and review sentiment
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

      {/* ML Review Sentiment Intelligence */}
      <section
        aria-label="Review Sentiment Intelligence"
        className="bg-white border border-[#38131E]/12 rounded-2xl p-4 sm:p-8 space-y-6 shadow-xs"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#38131E]/10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#38131E]/70 font-semibold">
              <Brain size={14} className="text-[#38131E]" />
              <span>20-Lakh BiLSTM Sentiment Model</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl text-[#38131E]">
              Review Sentiment Intelligence
            </h2>
            <p className="text-xs text-[#1A1718]/65">
              Engine:{" "}
              <strong className="text-[#38131E]">
                {mlInfo?.activeEngine === "python-ml-service"
                  ? "Python FastAPI Service"
                  : "Embedded Node BiLSTM"}
              </strong>{" "}
              · Max Length: {mlInfo?.maxLen || 30} · Vocab: {mlInfo?.vocabSize || 349} words
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={fetchSentimentData}
              disabled={loadingSentiment}
              className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 text-xs text-[#38131E] hover:bg-[#F7F1E5] border border-[#38131E]/20 px-4 py-2 rounded-full cursor-pointer disabled:opacity-40"
            >
              <RefreshCw size={13} className={loadingSentiment ? "animate-spin" : ""} />
              Refresh
            </button>

            <button
              type="button"
              onClick={handleReanalyzeAll}
              disabled={reanalyzing}
              className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 text-xs bg-[#38131E] text-[#F1D889] hover:bg-[#2B0E17] px-4 py-2 rounded-full font-medium cursor-pointer disabled:opacity-50"
            >
              <Brain size={13} />
              {reanalyzing ? "Re-analyzing…" : "Re-analyze All Reviews"}
            </button>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 min-[420px]:grid-cols-3 gap-3 sm:gap-4">
          <div className="rounded-xl bg-[#FBF7EE] border border-[#38131E]/12 p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#38131E]/65 font-semibold">
              Analyzed Reviews
            </p>
            <p className="font-serif text-2xl text-[#38131E] font-semibold mt-1">
              {loadingSentiment ? "—" : sentimentStats.totalReviews}
            </p>
          </div>
          <div className="rounded-xl bg-[#FBF7EE] border border-[#38131E]/12 p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#38131E]/65 font-semibold">
              Positivity Score
            </p>
            <p className="font-serif text-2xl text-[#38131E] font-semibold mt-1">
              {loadingSentiment ? "—" : `${sentimentStats.positivityPercentage}%`}
            </p>
          </div>
          <div className="rounded-xl bg-[#FBF7EE] border border-[#38131E]/12 p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#38131E]/65 font-semibold">
              Average Confidence
            </p>
            <p className="font-serif text-2xl text-[#38131E] font-semibold mt-1">
              {loadingSentiment ? "—" : `${sentimentStats.averageConfidence}%`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Distribution Bar Chart */}
          <div className="lg:col-span-5 bg-[#FBF7EE] border border-[#38131E]/12 rounded-xl p-5">
            <h3 className="font-serif text-lg text-[#38131E] mb-4">
              Sentiment Distribution
            </h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sentimentChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8DEC8" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "#38131E" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: "#38131E" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Bar dataKey="count" fill="#38131E" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Scored Reviews */}
          <div className="lg:col-span-7 bg-[#FBF7EE] border border-[#38131E]/12 rounded-xl p-5 space-y-3">
            <h3 className="font-serif text-lg text-[#38131E]">
              Recent Scored Reviews
            </h3>
            {sentimentStats.recentReviews.length === 0 ? (
              <p className="text-xs text-[#1A1718]/65 py-6">
                No customer reviews recorded yet.
              </p>
            ) : (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {sentimentStats.recentReviews.map((rev) => (
                  <div
                    key={rev._id}
                    className="p-3 rounded-lg bg-white border border-[#38131E]/10 text-xs space-y-1"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold text-[#38131E]">
                        {rev.productId?.name || "Product"} ·{" "}
                        <span className="font-normal text-[#1A1718]/75">
                          {rev.userId?.fullName || "Customer"}
                        </span>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-0.5 text-[#38131E]">
                          <Star size={11} className="text-[#D4AF63] fill-[#D4AF63]" />
                          {rev.rating}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-wider font-semibold ${
                            SENTIMENT_BADGE_CLS[rev.sentiment] ||
                            "bg-gray-100 text-gray-800 border-gray-200"
                          }`}
                        >
                          {rev.sentiment}
                          {Number.isFinite(Number(rev.sentimentConfidence)) &&
                          Number(rev.sentimentConfidence) > 0
                            ? ` · ${Math.round(Number(rev.sentimentConfidence) * 100)}%`
                            : ""}
                        </span>
                      </div>
                    </div>
                    <p className="text-[#1A1718]/75 line-clamp-2">{rev.reviewText}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Interactive Batch Sentiment Analyzer */}
        <form
          onSubmit={handleAnalyzeBatch}
          className="rounded-xl bg-[#FBF7EE] border border-[#38131E]/14 p-4 sm:p-5 space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-lg text-[#38131E]">
                Batch Sentiment Analyzer
              </h3>
              <p className="text-xs text-[#1A1718]/70">
                Test multiple feedback lines at once (one sentence per line).
              </p>
            </div>
            <button
              type="submit"
              disabled={batchLoading}
              className="w-full sm:w-auto px-5 py-2.5 sm:py-2 rounded-full bg-[#38131E] text-[#F7F1E5] hover:bg-[#2B0E17] text-xs font-medium cursor-pointer disabled:opacity-50"
            >
              {batchLoading ? "Analyzing…" : "Analyze Batch"}
            </button>
          </div>

          <textarea
            rows={4}
            value={batchText}
            onChange={(e) => setBatchText(e.target.value)}
            placeholder={"This saree has amazing silk quality\nOkay for the price nothing special\nDisappointed with the stitching"}
            aria-label="Batch review text lines"
            className="w-full p-3.5 rounded-xl border border-[#38131E]/20 bg-white text-sm text-[#1A1718] focus:outline-none focus:ring-2 focus:ring-[#D4AF63]"
          />

          {batchOutput && (
            <div className="space-y-3 pt-2 border-t border-[#38131E]/10">
              <div className="flex flex-wrap gap-2 text-xs font-medium">
                <span className="px-3 py-1 rounded-full bg-white border border-[#38131E]/15 text-[#38131E]">
                  Count: {batchOutput.count}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  Positive: {batchOutput.summary?.positive || 0}
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800">
                  Neutral: {batchOutput.summary?.neutral || 0}
                </span>
                <span className="px-3 py-1 rounded-full bg-red-100 text-red-800">
                  Negative: {batchOutput.summary?.negative || 0}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#38131E] text-[#F1D889]">
                  Positivity: {batchOutput.summary?.positivityPercentage || 0}%
                </span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {(batchOutput.results || []).map((row, idx) => (
                  <div
                    key={`${idx}-${row.text}`}
                    className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-white border border-[#38131E]/10 text-xs"
                  >
                    <span className="text-[#1A1718] flex-1 min-w-0">
                      {row.text}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full border text-[10px] uppercase tracking-wider font-semibold ${
                        SENTIMENT_BADGE_CLS[row.sentiment] ||
                        "bg-gray-100 text-gray-800 border-gray-200"
                      }`}
                    >
                      {row.sentiment} ({Math.round(Number(row.confidence || 0) * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </section>
    </div>
  );
};

export default Analytics;
