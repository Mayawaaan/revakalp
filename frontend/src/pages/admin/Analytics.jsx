import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  IndianRupee,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Download,
  Brain,
  Star,
  Layers,
  Filter,
  Package,
  MapPin,
  Megaphone,
  AlertTriangle,
  Percent,
  Repeat,
  CheckCircle2,
  Clock,
  BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import axios from "../../utils/axiosInstance";
import useStore from "../../store/store";
import { useTheme } from "../../context/themeConfig";
import {
  formatInr,
  formatNumber,
  formatPct,
  getAnalyticsChartPalette,
  exportDeepAnalyticsCsv,
} from "../../utils/analyticsFormatters";
import WaterfallChart from "../../components/analytics/WaterfallChart";
import FunnelWaterfall from "../../components/analytics/FunnelWaterfall";
import {
  AdminStaggerGrid,
  AdminStaggerItem,
  AdminTabPanel,
} from "../../components/admin/AdminMotion";
import useReducedMotion from "../../components/motion/useReducedMotion";

const MotionSpan = motion.span;

const RANGE_OPTIONS = [
  { id: "7d", label: "7D" },
  { id: "30d", label: "30D" },
  { id: "90d", label: "90D" },
  { id: "12m", label: "12M" },
  { id: "all", label: "All Time" },
];

const CHANNEL_OPTIONS = [
  { id: "all", label: "All Channels" },
  { id: "web", label: "Web" },
  { id: "pos", label: "Boutique POS" },
];

const TABS = [
  { id: "waterfalls", label: "Waterfalls & Revenue", icon: BarChart3 },
  { id: "funnel", label: "Funnel & Channels", icon: Filter },
  { id: "catalog", label: "Catalog & Geography", icon: Package },
  { id: "campaigns", label: "Campaigns & Coupons", icon: Megaphone },
  { id: "sentiment", label: "AI Sentiment", icon: Brain },
];

const SENTIMENT_BADGE_CLS = {
  positive: "bg-emerald-100 text-emerald-800 border-emerald-200",
  neutral: "bg-amber-100 text-amber-800 border-amber-200",
  negative: "bg-red-100 text-red-800 border-red-200",
};

const DeltaBadge = ({ deltaPct, palette }) => {
  if (deltaPct === null || deltaPct === undefined || !Number.isFinite(Number(deltaPct))) {
    return null;
  }
  const num = Number(deltaPct);
  const isUp = num >= 0;
  return (
    <span
      className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{
        backgroundColor: isUp ? `${palette.positive}20` : `${palette.negative}20`,
        color: isUp ? palette.positive : palette.negative,
      }}
    >
      {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
      {isUp ? "+" : ""}
      {num.toFixed(1)}%
    </span>
  );
};

const ExecutiveKpiCard = ({
  title,
  value,
  sublabel,
  icon,
  deltaPct,
  loading,
  palette,
  accent,
}) => {
  const Icon = icon;
  return (
    <div
      className={`rk-admin-card rounded-2xl p-4 sm:p-5 border hover:shadow-md ${
        accent
          ? "bg-[#38131E] text-[#F7F1E5] border-[#D4AF63]/35"
          : "bg-white text-[#1A1718] border-[#38131E]/12 shadow-xs"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p
          className={`text-[10px] uppercase tracking-[0.18em] font-semibold ${
            accent ? "text-[#F1D889]/85" : "text-[#38131E]/65"
          }`}
        >
          {title}
        </p>
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            accent
              ? "bg-white/10 border border-[#D4AF63]/30 text-[#F1D889]"
              : "bg-[#F7F1E5] border border-[#38131E]/12 text-[#38131E]"
          }`}
        >
          <Icon size={15} />
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
        <p
          className={`font-serif text-xl sm:text-2xl font-semibold ${
            accent ? "text-[#F7F1E5]" : "text-[#38131E]"
          }`}
        >
          {loading ? "—" : value}
        </p>
        {!loading && <DeltaBadge deltaPct={deltaPct} palette={palette} />}
      </div>

      {sublabel && (
        <p
          className={`text-[11px] mt-1.5 truncate ${
            accent ? "text-[#F7F1E5]/75" : "text-[#1A1718]/65"
          }`}
        >
          {sublabel}
        </p>
      )}
    </div>
  );
};

const SectionCard = ({ title, subtitle, rightSlot, children }) => (
  <div className="bg-white border border-[#38131E]/12 rounded-2xl p-4 sm:p-6 shadow-xs min-w-0">
    <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
      <div className="min-w-0">
        <h3 className="font-serif text-lg sm:text-xl text-[#38131E]">{title}</h3>
        {subtitle && <p className="text-xs text-[#1A1718]/65 mt-0.5">{subtitle}</p>}
      </div>
      {rightSlot}
    </div>
    {children}
  </div>
);

const Analytics = () => {
  const { showToast } = useStore();
  const { scheme, isDarkMode } = useTheme();
  const reducedMotion = useReducedMotion();
  const palette = useMemo(
    () => getAnalyticsChartPalette(scheme, isDarkMode),
    [scheme, isDarkMode]
  );

  const [range, setRange] = useState("30d");
  const [channel, setChannel] = useState("all");
  const [activeTab, setActiveTab] = useState("waterfalls");

  const [deepLoading, setDeepLoading] = useState(true);
  const [deepData, setDeepData] = useState(null);

  const [sentimentStats, setSentimentStats] = useState({
    totalReviews: 0,
    sentimentBreakdown: { positive: 0, neutral: 0, negative: 0 },
    positivityPercentage: 0,
    averageConfidence: 0,
    recentReviews: [],
    mlStatus: null,
  });
  const [loadingSentiment, setLoadingSentiment] = useState(true);
  const [reanalyzing, setReanalyzing] = useState(false);

  const [batchText, setBatchText] = useState("");
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchOutput, setBatchOutput] = useState(null);

  const fetchDeepAnalytics = useCallback(
    async (targetRange = range, targetChannel = channel) => {
      setDeepLoading(true);
      try {
        const res = await axios.get(
          `/api/admin/analytics/deep?range=${encodeURIComponent(targetRange)}&channel=${encodeURIComponent(targetChannel)}`
        );
        setDeepData(res.data);
      } catch (error) {
        showToast(
          error.response?.data?.message || "Failed to load deep analytics",
          "error"
        );
      } finally {
        setDeepLoading(false);
      }
    },
    [range, channel, showToast]
  );

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
    fetchDeepAnalytics(range, channel);
  }, [range, channel, fetchDeepAnalytics]);

  useEffect(() => {
    fetchSentimentData();
  }, [fetchSentimentData]);

  const handleRefreshAll = () => {
    fetchDeepAnalytics(range, channel);
    fetchSentimentData();
  };

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

  const chartTooltipStyle = useMemo(
    () => ({
      backgroundColor: palette.tooltipBg,
      border: `1px solid ${palette.tooltipBorder}`,
      borderRadius: "10px",
      color: palette.tooltipText,
      fontSize: 12,
    }),
    [palette]
  );

  const kpis = deepData?.kpis || {};
  const revWf = deepData?.revenueWaterfall || { steps: [], summary: {} };
  const invWf = deepData?.inventoryWaterfall || { steps: [], summary: {} };
  const funnel = deepData?.conversionFunnel || {
    stages: [],
    telemetryActive: false,
    totalTelemetryEvents: 0,
  };
  const revenueTrend = deepData?.revenueTrend || [];
  const userTrend = deepData?.userRegistrationsTrend || [];
  const orderStatusBreakdown = deepData?.orderStatusBreakdown || [];
  const channelBreakdown = deepData?.channelBreakdown || [];
  const paymentBreakdown = deepData?.paymentMethodBreakdown || [];
  const categoryBreakdown = deepData?.categoryBreakdown || [];
  const stateBreakdown = deepData?.geographyBreakdown?.states || [];
  const topCities = deepData?.geographyBreakdown?.topCities || [];
  const topProducts = deepData?.topProducts || [];
  const slowMovers = deepData?.watchlist?.slowMovers || [];
  const lowStockAlerts = deepData?.watchlist?.lowStockAlerts || [];
  const campaignAttribution = deepData?.campaignAttribution || [];
  const couponPerformance = deepData?.couponPerformance || [];

  const webSummary = channelBreakdown.find((c) => c.channel === "web") || { orders: 0 };
  const posSummary = channelBreakdown.find((c) => c.channel === "pos") || { orders: 0 };

  const sentimentChartData = [
    { label: "Positive", count: sentimentStats.sentimentBreakdown.positive || 0 },
    { label: "Neutral", count: sentimentStats.sentimentBreakdown.neutral || 0 },
    { label: "Negative", count: sentimentStats.sentimentBreakdown.negative || 0 },
  ];
  const mlInfo = sentimentStats.mlStatus;

  const kpiCards = [
    {
      title: "Net Revenue",
      value: formatInr(kpis.netRevenue, false),
      sublabel: `Delivered ${formatInr(kpis.realizedDelivered, true)} · Pipeline ${formatInr(kpis.inFlightPipeline, true)}`,
      icon: IndianRupee,
      deltaPct: kpis.deltas?.netRevenuePct,
      accent: true,
    },
    {
      title: "Gross GMV",
      value: formatInr(kpis.grossGmv, false),
      sublabel: "Catalog MRP before markdowns & coupons",
      icon: Layers,
      deltaPct: kpis.deltas?.grossGmvPct,
      accent: false,
    },
    {
      title: "Submitted Orders",
      value: formatNumber(kpis.totalOrders),
      sublabel: `Web: ${formatNumber(webSummary.orders)} · Boutique POS: ${formatNumber(posSummary.orders)}`,
      icon: ShoppingBag,
      deltaPct: kpis.deltas?.ordersPct,
      accent: true,
    },
    {
      title: "Average Order Value",
      value: formatInr(kpis.aov, false),
      sublabel: "Net revenue per non-cancelled order",
      icon: TrendingUp,
      deltaPct: kpis.deltas?.aovPct,
      accent: false,
    },
    {
      title: "Fulfillment Rate",
      value: formatPct(kpis.fulfillmentRatePct),
      sublabel: `${formatNumber(kpis.deliveredOrders)} of ${formatNumber(kpis.totalOrders)} delivered`,
      icon: CheckCircle2,
      deltaPct: null,
      accent: false,
    },
    {
      title: "Repeat Buyers",
      value: formatPct(kpis.repeatCustomerRatePct),
      sublabel: `${formatNumber(kpis.newUsersCount)} new patrons joined in period`,
      icon: Repeat,
      deltaPct: kpis.deltas?.newUsersPct,
      accent: false,
    },
    {
      title: "Discount Burn",
      value: formatPct(kpis.discountBurnPct),
      sublabel: "Markdowns + Coupons as % of GMV",
      icon: Percent,
      deltaPct: null,
      accent: false,
    },
    {
      title: "Cancel & Return Rate",
      value: formatPct(kpis.cancellationAndReturnRatePct),
      sublabel: `${formatNumber(kpis.pendingPaymentOrders)} unpaid checkouts excluded`,
      icon: AlertTriangle,
      deltaPct: null,
      accent: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header + Controls */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#38131E]/65 mb-1 font-semibold">
            Executive Intelligence
          </p>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#38131E]">
            Deep Analytics & Waterfalls
          </h1>
          <p className="text-[#1A1718]/70 text-sm mt-1">
            Real-time accounting bridges, conversion funnel, inventory flow, geography & campaign attribution
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Range Pills */}
          <div className="inline-flex flex-wrap items-center rounded-full bg-white border border-[#38131E]/15 p-1 gap-0.5">
            {RANGE_OPTIONS.map((opt) => {
              const isSelected = range === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setRange(opt.id)}
                  className={`relative px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? "text-[#F1D889]"
                      : "text-[#38131E] hover:bg-[#F7F1E5]"
                  }`}
                >
                  {isSelected && (
                    <MotionSpan
                      layoutId={reducedMotion ? undefined : "analytics-range-pill"}
                      transition={{ type: "spring", stiffness: 450, damping: 34 }}
                      className="absolute inset-0 rounded-full bg-[#38131E]"
                    />
                  )}
                  <span className="relative z-10">{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Channel Filter */}
          <div className="inline-flex items-center rounded-full bg-white border border-[#38131E]/15 p-1 gap-0.5">
            {CHANNEL_OPTIONS.map((opt) => {
              const isSelected = channel === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setChannel(opt.id)}
                  className={`relative px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? "text-[#F1D889]"
                      : "text-[#38131E] hover:bg-[#F7F1E5]"
                  }`}
                >
                  {isSelected && (
                    <MotionSpan
                      layoutId={reducedMotion ? undefined : "analytics-channel-pill"}
                      transition={{ type: "spring", stiffness: 450, damping: 34 }}
                      className="absolute inset-0 rounded-full bg-[#38131E]"
                    />
                  )}
                  <span className="relative z-10">{opt.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleRefreshAll}
            disabled={deepLoading || loadingSentiment}
            className="rk-admin-btn inline-flex items-center gap-1.5 text-xs bg-white text-[#38131E] hover:bg-[#F7F1E5] border border-[#38131E]/20 px-3.5 py-2 rounded-full font-medium cursor-pointer disabled:opacity-45"
          >
            <RefreshCw size={13} className={deepLoading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => exportDeepAnalyticsCsv(deepData, { range, channel })}
            disabled={deepLoading || !deepData}
            className="rk-admin-btn inline-flex items-center gap-1.5 text-xs bg-[#38131E] text-[#F1D889] hover:bg-[#2B0E17] px-4 py-2 rounded-full font-medium cursor-pointer disabled:opacity-45"
          >
            <Download size={13} />
            Export CSV
          </button>
        </div>
      </div>

      {/* 8 Executive KPI Strip */}
      <AdminStaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <AdminStaggerItem key={card.title}>
            <ExecutiveKpiCard
              {...card}
              loading={deepLoading}
              palette={palette}
            />
          </AdminStaggerItem>
        ))}
      </AdminStaggerGrid>

      {/* Section Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#38131E]/12 pb-3">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer border ${
                active
                  ? "text-[#F1D889] border-[#38131E]"
                  : "bg-white text-[#38131E] border-[#38131E]/15 hover:bg-[#F7F1E5]"
              }`}
            >
              {active && (
                <MotionSpan
                  layoutId={reducedMotion ? undefined : "analytics-active-tab"}
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-[#38131E]"
                />
              )}
              <Icon size={14} className="relative z-10" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <AdminTabPanel activeKey={activeTab}>
      {/* TAB 1: WATERFALLS & REVENUE */}
      {activeTab === "waterfalls" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-8 min-w-0">
              <SectionCard
                title="Revenue Decomposition Waterfall"
                subtitle="Exact accounting bridge from catalog GMV through discounts, shipping, cancellations & returns to net revenue"
              >
                <WaterfallChart
                  steps={revWf.steps || []}
                  unitType="currency"
                  palette={palette}
                  height={320}
                  emptyMessage="No submitted orders recorded in this window."
                />
              </SectionCard>
            </div>

            <div className="xl:col-span-4 min-w-0">
              <SectionCard
                title="Accounting Bridge Ledger"
                subtitle="Reconciled component breakdown"
              >
                <div className="space-y-2 text-xs">
                  {(revWf.steps || []).map((step) => {
                    const isDeduction = step.kind === "negative";
                    const isAddition = step.kind === "positive";
                    const isTotal = step.kind === "total" || step.kind === "subtotal";
                    return (
                      <div
                        key={step.key}
                        className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl border ${
                          isTotal
                            ? "bg-[#FBF7EE] border-[#D4AF63]/40 font-semibold"
                            : "border-[#38131E]/10"
                        }`}
                      >
                        <span className="text-[#1A1718] truncate">{step.label}</span>
                        <div className="text-right shrink-0">
                          <span
                            style={{
                              color: isAddition
                                ? palette.positive
                                : isDeduction
                                  ? palette.negative
                                  : palette.axisTick,
                            }}
                            className="font-semibold"
                          >
                            {isAddition && step.delta > 0 ? "+" : isDeduction && step.delta < 0 ? "-" : ""}
                            {formatInr(Math.abs(step.delta), false)}
                          </span>
                          <span className="block text-[10px] text-[#1A1718]/60">
                            {Number(step.shareOfGrossPct || 0).toFixed(1)}% of GMV
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  <div className="mt-3 pt-3 border-t border-[#38131E]/12 grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-[#FBF7EE] border border-[#38131E]/10 p-2.5">
                      <p className="text-[10px] uppercase tracking-wider text-[#38131E]/65">
                        Realized (Delivered)
                      </p>
                      <p className="font-serif text-sm font-semibold text-[#38131E] mt-0.5">
                        {formatInr(revWf.summary?.realizedDelivered, false)}
                      </p>
                    </div>
                    <div className="rounded-xl bg-[#FBF7EE] border border-[#38131E]/10 p-2.5">
                      <p className="text-[10px] uppercase tracking-wider text-[#38131E]/65">
                        In-Flight Pipeline
                      </p>
                      <p className="font-serif text-sm font-semibold text-[#38131E] mt-0.5">
                        {formatInr(revWf.summary?.inFlightPipeline, false)}
                      </p>
                    </div>
                  </div>

                  {Number(revWf.summary?.pendingPaymentCount || 0) > 0 && (
                    <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 flex items-center justify-between gap-2 text-[11px] text-amber-900">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock size={12} />
                        Unpaid Checkout Attempts
                      </span>
                      <span className="font-semibold">
                        {revWf.summary.pendingPaymentCount} ({formatInr(revWf.summary.pendingPaymentValue, true)})
                      </span>
                    </div>
                  )}
                </div>
              </SectionCard>
            </div>
          </div>

          {/* Dual-Axis Revenue & Orders ComposedChart */}
          <SectionCard
            title="Gross GMV vs Net Revenue & Order Volume"
            subtitle="Time-series comparison across the selected window"
          >
            {revenueTrend.length === 0 ? (
              <p className="text-xs text-[#1A1718]/65 py-10 text-center">
                No order trend data available for this window.
              </p>
            ) : (
              <div className="h-72 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={revenueTrend} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 10, fill: palette.axisTick }}
                      axisLine={false}
                      tickLine={false}
                      minTickGap={16}
                    />
                    <YAxis
                      yAxisId="left"
                      tickFormatter={(v) => formatInr(v, true)}
                      tick={{ fontSize: 11, fill: palette.axisTick }}
                      axisLine={false}
                      tickLine={false}
                      width={60}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      allowDecimals={false}
                      tick={{ fontSize: 11, fill: palette.axisTick }}
                      axisLine={false}
                      tickLine={false}
                      width={34}
                    />
                    <Tooltip
                      contentStyle={chartTooltipStyle}
                      formatter={(val, name) =>
                        name === "Orders" ? [val, name] : [formatInr(val, false), name]
                      }
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar
                      yAxisId="right"
                      dataKey="orders"
                      name="Orders"
                      fill={`${palette.accent}55`}
                      radius={[4, 4, 0, 0]}
                      maxBarSize={24}
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="netRevenue"
                      name="Net Revenue"
                      stroke={palette.primary}
                      fill={`${palette.primary}22`}
                      strokeWidth={2.4}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="grossGmv"
                      name="Gross GMV"
                      stroke={palette.secondary}
                      strokeDasharray="4 4"
                      strokeWidth={2}
                      dot={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}
          </SectionCard>

          {/* Inventory Flow Waterfall + Stock Metrics */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-8 min-w-0">
              <SectionCard
                title="Inventory Unit Flow Waterfall"
                subtitle="Opening stock reconciled through restocks, web & POS sales, write-offs and reserved holds to sellable units"
              >
                <WaterfallChart
                  steps={invWf.steps || []}
                  unitType="units"
                  palette={palette}
                  height={300}
                  emptyMessage="No inventory units or movements recorded."
                />
              </SectionCard>
            </div>

            <div className="xl:col-span-4 min-w-0">
              <SectionCard
                title="Stock Valuation & Health"
                subtitle="Live active catalog position"
              >
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="col-span-2 rounded-xl bg-[#FBF7EE] border border-[#D4AF63]/35 p-3.5">
                    <p className="text-[10px] uppercase tracking-wider text-[#38131E]/65 font-semibold">
                      On-Hand Retail Value
                    </p>
                    <p className="font-serif text-2xl font-semibold text-[#38131E] mt-1">
                      {formatInr(invWf.summary?.totalRetailValue, false)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#38131E]/12 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-[#1A1718]/60">On Hand</p>
                    <p className="font-serif text-xl font-semibold text-[#38131E] mt-0.5">
                      {formatNumber(invWf.summary?.currentOnHand)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#38131E]/12 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-[#1A1718]/60">Sellable Now</p>
                    <p className="font-serif text-xl font-semibold text-[#38131E] mt-0.5">
                      {formatNumber(invWf.summary?.currentSellable)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-amber-300/60 bg-amber-50/70 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-amber-800">Low Stock (≤3)</p>
                    <p className="font-serif text-xl font-semibold text-amber-900 mt-0.5">
                      {formatNumber(invWf.summary?.lowStockCount)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-red-300/60 bg-red-50/70 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-red-800">Out of Stock</p>
                    <p className="font-serif text-xl font-semibold text-red-900 mt-0.5">
                      {formatNumber(invWf.summary?.outOfStockCount)}
                    </p>
                  </div>
                </div>
              </SectionCard>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FUNNEL & CHANNELS */}
      {activeTab === "funnel" && (
        <div className="space-y-6">
          <SectionCard
            title="Conversion Funnel Waterfall"
            subtitle="Step-by-step shopper progression from catalog discovery to delivered orders"
          >
            <FunnelWaterfall
              stages={funnel.stages || []}
              palette={palette}
              telemetryActive={Boolean(funnel.telemetryActive)}
              totalTelemetryEvents={Number(funnel.totalTelemetryEvents || 0)}
            />
          </SectionCard>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Omnichannel Mix */}
            <div className="lg:col-span-5 min-w-0">
              <SectionCard
                title="Omnichannel Mix (Web vs Boutique POS)"
                subtitle="Net revenue share across sales channels for active date range"
              >
                {channelBreakdown.every((c) => c.netRevenue === 0 && c.orders === 0) ? (
                  <p className="text-xs text-[#1A1718]/65 py-10 text-center">
                    No channel orders recorded in this window.
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div className="h-52 w-full min-w-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={channelBreakdown}
                            dataKey="netRevenue"
                            nameKey="label"
                            innerRadius={52}
                            outerRadius={80}
                            paddingAngle={3}
                          >
                            {channelBreakdown.map((entry, idx) => (
                              <Cell
                                key={entry.channel}
                                fill={palette.piePalette[idx % palette.piePalette.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={chartTooltipStyle}
                            formatter={(val) => formatInr(val, false)}
                          />
                          <Legend wrapperStyle={{ fontSize: 11 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {channelBreakdown.map((ch) => (
                        <div
                          key={ch.channel}
                          className="rounded-xl bg-[#FBF7EE] border border-[#38131E]/12 p-3"
                        >
                          <p className="font-semibold text-[#38131E]">{ch.label}</p>
                          <p className="font-serif text-lg font-semibold text-[#38131E] mt-1">
                            {formatInr(ch.netRevenue, true)}
                          </p>
                          <p className="text-[11px] text-[#1A1718]/70 mt-0.5">
                            {formatNumber(ch.orders)} orders · AOV {formatInr(ch.aov, true)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </SectionCard>
            </div>

            {/* Payment Method Breakdown */}
            <div className="lg:col-span-7 min-w-0">
              <SectionCard
                title="Payment Method Breakdown"
                subtitle="Prepaid Razorpay, Cash on Delivery & Boutique POS settlement mix"
              >
                {paymentBreakdown.length === 0 ? (
                  <p className="text-xs text-[#1A1718]/65 py-10 text-center">
                    No payment transactions recorded in this window.
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div className="h-52 w-full min-w-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={paymentBreakdown}
                          layout="vertical"
                          margin={{ top: 4, right: 20, left: 8, bottom: 4 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} horizontal={false} />
                          <XAxis
                            type="number"
                            tickFormatter={(v) => formatInr(v, true)}
                            tick={{ fontSize: 11, fill: palette.axisTick }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            type="category"
                            dataKey="method"
                            width={130}
                            tick={{ fontSize: 11, fill: palette.axisTick }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip
                            contentStyle={chartTooltipStyle}
                            formatter={(val) => formatInr(val, false)}
                          />
                          <Bar dataKey="revenue" fill={palette.primary} radius={[0, 6, 6, 0]} maxBarSize={26} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {paymentBreakdown.map((pm) => (
                        <div
                          key={pm.method}
                          className="flex items-center justify-between px-3 py-2 rounded-xl border border-[#38131E]/10"
                        >
                          <span className="font-medium text-[#38131E] truncate">{pm.method}</span>
                          <span className="text-[#1A1718]/75 shrink-0">
                            {pm.orders} orders · {pm.sharePct}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </SectionCard>
            </div>
          </div>

          {/* Order Status & User Registrations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SectionCard
              title="Order Status Pipeline"
              subtitle="Distribution of order lifecycle states in range"
            >
              {orderStatusBreakdown.length === 0 ? (
                <p className="text-xs text-[#1A1718]/65 py-10 text-center">No orders in window.</p>
              ) : (
                <div className="h-64 w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={orderStatusBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} vertical={false} />
                      <XAxis
                        dataKey="status"
                        tick={{ fontSize: 10, fill: palette.axisTick }}
                        axisLine={false}
                        tickLine={false}
                        interval={0}
                        angle={-15}
                        textAnchor="end"
                        height={46}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 11, fill: palette.axisTick }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip contentStyle={chartTooltipStyle} />
                      <Bar dataKey="count" name="Orders" fill={palette.primary} radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </SectionCard>

            <SectionCard
              title="New Customer Registrations"
              subtitle="Patron signups over the active time window"
              rightSlot={<DeltaBadge deltaPct={kpis.deltas?.newUsersPct} palette={palette} />}
            >
              <div className="h-64 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 10, fill: palette.axisTick }}
                      axisLine={false}
                      tickLine={false}
                      minTickGap={16}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11, fill: palette.axisTick }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Area
                      type="monotone"
                      dataKey="count"
                      name="New Users"
                      stroke={palette.accent}
                      fill={`${palette.accent}33`}
                      strokeWidth={2.4}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          </div>
        </div>
      )}

      {/* TAB 3: CATALOG & GEOGRAPHY */}
      {activeTab === "catalog" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SectionCard
              title="Revenue by Garment Category"
              subtitle="Net revenue & units sold per collection category"
            >
              {categoryBreakdown.length === 0 ? (
                <p className="text-xs text-[#1A1718]/65 py-10 text-center">
                  No category sales recorded in this range.
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="h-60 w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={categoryBreakdown}
                        layout="vertical"
                        margin={{ top: 4, right: 20, left: 6, bottom: 4 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} horizontal={false} />
                        <XAxis
                          type="number"
                          tickFormatter={(v) => formatInr(v, true)}
                          tick={{ fontSize: 11, fill: palette.axisTick }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          type="category"
                          dataKey="category"
                          width={105}
                          tick={{ fontSize: 11, fill: palette.axisTick }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={chartTooltipStyle}
                          formatter={(val) => formatInr(val, false)}
                        />
                        <Bar dataKey="netRevenue" name="Net Revenue" fill={palette.primary} radius={[0, 6, 6, 0]} maxBarSize={24} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {categoryBreakdown.map((cat) => (
                      <div
                        key={cat.category}
                        className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#FBF7EE] border border-[#38131E]/10"
                      >
                        <span className="font-medium text-[#38131E]">{cat.category}</span>
                        <span className="text-[#1A1718]/75">
                          {formatNumber(cat.unitsSold)} units · {formatInr(cat.netRevenue, false)} ({cat.sharePct}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </SectionCard>

            <SectionCard
              title="Top Shipping States & Cities"
              subtitle="Pan-India regional demand & boutique walk-in share"
              rightSlot={<MapPin size={16} className="text-[#D4AF63]" />}
            >
              {stateBreakdown.length === 0 ? (
                <p className="text-xs text-[#1A1718]/65 py-10 text-center">
                  No regional order data recorded in this window.
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="h-60 w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stateBreakdown.slice(0, 8)}
                        layout="vertical"
                        margin={{ top: 4, right: 20, left: 6, bottom: 4 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} horizontal={false} />
                        <XAxis
                          type="number"
                          tickFormatter={(v) => formatInr(v, true)}
                          tick={{ fontSize: 11, fill: palette.axisTick }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          type="category"
                          dataKey="state"
                          width={125}
                          tick={{ fontSize: 10, fill: palette.axisTick }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={chartTooltipStyle}
                          formatter={(val) => formatInr(val, false)}
                        />
                        <Bar dataKey="netRevenue" name="Net Revenue" fill={palette.accent} radius={[0, 6, 6, 0]} maxBarSize={22} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {topCities.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#38131E]/65 font-semibold mb-2">
                        Top Cities
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {topCities.map((c) => (
                          <span
                            key={c.city}
                            className="text-[11px] px-2.5 py-1 rounded-full bg-[#FBF7EE] border border-[#38131E]/15 text-[#38131E]"
                          >
                            {c.city} · {c.orders} ({formatInr(c.netRevenue, true)})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </SectionCard>
          </div>

          {/* Top Products Leaderboard */}
          <SectionCard
            title="Top Performing Products"
            subtitle="Highest revenue-generating weaves & garments in the selected window"
          >
            {topProducts.length === 0 ? (
              <p className="text-xs text-[#1A1718]/65 py-6 text-center">
                No product sales recorded in this range.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#38131E]/12 text-[10px] uppercase tracking-wider text-[#38131E]/65">
                      <th className="py-2.5 pr-3">#</th>
                      <th className="py-2.5 pr-3">Code</th>
                      <th className="py-2.5 pr-3">Product</th>
                      <th className="py-2.5 pr-3">Category</th>
                      <th className="py-2.5 pr-3 text-right">Units Sold</th>
                      <th className="py-2.5 pr-3 text-right">Net Revenue</th>
                      <th className="py-2.5 text-right">Sellable Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#38131E]/10">
                    {topProducts.map((p, idx) => (
                      <tr key={p.productId}>
                        <td className="py-2.5 pr-3 font-semibold text-[#38131E]">{idx + 1}</td>
                        <td className="py-2.5 pr-3 font-mono text-[11px] text-[#38131E]/80">{p.code}</td>
                        <td className="py-2.5 pr-3 font-medium text-[#1A1718]">{p.name}</td>
                        <td className="py-2.5 pr-3 text-[#1A1718]/75">{p.category}</td>
                        <td className="py-2.5 pr-3 text-right font-semibold">{formatNumber(p.unitsSold)}</td>
                        <td className="py-2.5 pr-3 text-right font-semibold text-[#38131E]">
                          {formatInr(p.revenue, false)}
                        </td>
                        <td className="py-2.5 text-right">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              p.sellableStock <= 3
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {formatNumber(p.sellableStock)} left
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>

          {/* Slow-Moving & Low-Stock Watchlist */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SectionCard
              title="Slow-Moving Stock Watchlist"
              subtitle="In-stock active products with zero units sold in this range"
            >
              {slowMovers.length === 0 ? (
                <p className="text-xs text-[#1A1718]/65 py-6 text-center">
                  All active in-stock garments sold at least 1 unit!
                </p>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs">
                  {slowMovers.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#FBF7EE] border border-[#38131E]/10"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-[#38131E] truncate">
                          <span className="font-mono text-[10px] mr-1.5 opacity-70">{item.code}</span>
                          {item.name}
                        </p>
                        <p className="text-[11px] text-[#1A1718]/65">
                          {item.category} · {formatNumber(item.sellableStock)} sellable units
                        </p>
                      </div>
                      <span className="font-semibold text-[#38131E] shrink-0">
                        {formatInr(item.lockedValue, true)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard
              title="Low & Out-of-Stock Alerts"
              subtitle="Active garments with 3 or fewer sellable units remaining"
            >
              {lowStockAlerts.length === 0 ? (
                <p className="text-xs text-[#1A1718]/65 py-6 text-center">
                  Healthy stock levels across all active garments.
                </p>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs">
                  {lowStockAlerts.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#FBF7EE] border border-[#38131E]/10"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-[#38131E] truncate">
                          <span className="font-mono text-[10px] mr-1.5 opacity-70">{item.code}</span>
                          {item.name}
                        </p>
                        <p className="text-[11px] text-[#1A1718]/65">
                          {item.category} · On hand: {item.stock} · Reserved: {item.reserved}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                          item.sellableStock === 0
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.sellableStock === 0 ? "Out of Stock" : `${item.sellableStock} left`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      )}

      {/* TAB 4: CAMPAIGNS & COUPONS */}
      {activeTab === "campaigns" && (
        <div className="space-y-6">
          <SectionCard
            title="Campaign & Ad Attribution"
            subtitle="Impressions, clicks, CTR & linked coupon conversions from CMS Campaigns"
          >
            {campaignAttribution.length === 0 ? (
              <p className="text-xs text-[#1A1718]/65 py-6 text-center">
                No CMS campaigns created yet. Launch one from Campaigns & Ads Studio.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#38131E]/12 text-[10px] uppercase tracking-wider text-[#38131E]/65">
                      <th className="py-2.5 pr-3">Campaign</th>
                      <th className="py-2.5 pr-3">Slot</th>
                      <th className="py-2.5 pr-3">Status</th>
                      <th className="py-2.5 pr-3 text-right">Impressions</th>
                      <th className="py-2.5 pr-3 text-right">Clicks</th>
                      <th className="py-2.5 pr-3 text-right">CTR</th>
                      <th className="py-2.5 pr-3">Coupon</th>
                      <th className="py-2.5 pr-3 text-right">Orders</th>
                      <th className="py-2.5 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#38131E]/10">
                    {campaignAttribution.map((c) => (
                      <tr key={c._id}>
                        <td className="py-2.5 pr-3 font-medium text-[#38131E]">{c.title}</td>
                        <td className="py-2.5 pr-3 font-mono text-[11px]">{c.slot}</td>
                        <td className="py-2.5 pr-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider bg-[#FBF7EE] border border-[#38131E]/15">
                            {c.status}
                          </span>
                        </td>
                        <td className="py-2.5 pr-3 text-right">{formatNumber(c.impressions)}</td>
                        <td className="py-2.5 pr-3 text-right">{formatNumber(c.clicks)}</td>
                        <td className="py-2.5 pr-3 text-right font-semibold">{c.ctrPct.toFixed(2)}%</td>
                        <td className="py-2.5 pr-3 font-mono text-[11px]">{c.couponCode || "—"}</td>
                        <td className="py-2.5 pr-3 text-right">{formatNumber(c.attributedOrders)}</td>
                        <td className="py-2.5 text-right font-semibold text-[#38131E]">
                          {formatInr(c.attributedRevenue, false)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Coupon Code Discount ROI"
            subtitle="Redemptions, discount outlay vs net revenue generated in this range"
          >
            {couponPerformance.length === 0 ? (
              <p className="text-xs text-[#1A1718]/65 py-6 text-center">
                No coupon redemptions recorded in this range.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#38131E]/12 text-[10px] uppercase tracking-wider text-[#38131E]/65">
                      <th className="py-2.5 pr-3">Coupon Code</th>
                      <th className="py-2.5 pr-3 text-right">Redemptions</th>
                      <th className="py-2.5 pr-3 text-right">Discount Outlay</th>
                      <th className="py-2.5 pr-3 text-right">Net Revenue</th>
                      <th className="py-2.5 pr-3 text-right">Avg Order Value</th>
                      <th className="py-2.5 text-right">Revenue / Discount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#38131E]/10">
                    {couponPerformance.map((cp) => (
                      <tr key={cp.code}>
                        <td className="py-2.5 pr-3 font-mono font-semibold text-[#38131E]">{cp.code}</td>
                        <td className="py-2.5 pr-3 text-right">{formatNumber(cp.redemptions)}</td>
                        <td className="py-2.5 pr-3 text-right text-red-700 font-medium">
                          -{formatInr(cp.totalDiscount, false)}
                        </td>
                        <td className="py-2.5 pr-3 text-right font-semibold text-[#38131E]">
                          {formatInr(cp.netRevenue, false)}
                        </td>
                        <td className="py-2.5 pr-3 text-right">{formatInr(cp.avgOrderValue, false)}</td>
                        <td className="py-2.5 text-right font-semibold">{cp.roiMultiple}x</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        </div>
      )}

      {/* TAB 5: AI SENTIMENT (20-Lakh BiLSTM Preserved) */}
      {activeTab === "sentiment" && (
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
            <div className="lg:col-span-5 bg-[#FBF7EE] border border-[#38131E]/12 rounded-xl p-5 min-w-0">
              <h3 className="font-serif text-lg text-[#38131E] mb-4">
                Sentiment Distribution
              </h3>
              <div className="h-56 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sentimentChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: palette.axisTick }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11, fill: palette.axisTick }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      <Cell fill={palette.positive} />
                      <Cell fill={palette.neutral} />
                      <Cell fill={palette.negative} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#FBF7EE] border border-[#38131E]/12 rounded-xl p-5 space-y-3 min-w-0">
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
      )}
      </AdminTabPanel>
    </div>
  );
};

export default Analytics;
