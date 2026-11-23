import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  ShoppingCart,
  Package,
  IndianRupee,
  Megaphone,
  Store,
  Ticket,
  Layers,
  List,
  BarChart3,
  Settings,
  MessageSquareWarning,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
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

const QUICK_MODULES = [
  {
    title: "Campaigns & Ads Studio",
    desc: "Run hero banners, popups, announcements, and promotional strips.",
    to: "/admin/cms",
    icon: Megaphone,
  },
  {
    title: "Products & Catalog",
    desc: "Add sarees, lehengas, specs, discounts, and product imagery.",
    to: "/admin/products",
    icon: Package,
  },
  {
    title: "Orders & Returns",
    desc: "Update order status, AWB tracking numbers, and return inspections.",
    to: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Inventory & Store POS",
    desc: "Record Indore boutique counter sales and reconcile stock.",
    to: "/admin/inventory",
    icon: Store,
  },
  {
    title: "Coupons & Promotions",
    desc: "Manage percentage promo codes, expiry dates, and usage limits.",
    to: "/admin/coupons",
    icon: Ticket,
  },
  {
    title: "Collections & Categories",
    desc: "Manage storefront collection portals and category cover imagery.",
    to: "/admin/collections",
    icon: Layers,
  },
  {
    title: "Product Types",
    desc: "Configure saree types and classification slugs.",
    to: "/admin/types",
    icon: List,
  },
  {
    title: "Users & Admin Roles",
    desc: "Promote admins or manage customer accounts.",
    to: "/admin/users",
    icon: Users,
  },
  {
    title: "Grievances & Compliance",
    desc: "Review consumer tickets and record resolution notes.",
    to: "/admin/grievances",
    icon: MessageSquareWarning,
  },
  {
    title: "Analytics & AI Sentiment",
    desc: "Revenue trends, order charts, and 20-Lakh BiLSTM review insights.",
    to: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings & Global Theme",
    desc: "Control store details, payments, maintenance mode, and Light/Dark theme.",
    to: "/admin/settings",
    icon: Settings,
  },
];

const AdminDashboard = () => {
  const { showToast } = useStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });
  const [ops, setOps] = useState({
    liveCampaigns: 0,
    pendingOrders: 0,
    lowStockCount: 0,
    openGrievances: 0,
  });

  const fetchDashboardStats = useCallback(async () => {
    setLoading(true);
    try {
      const [analyticsRes, cmsRes, ordersRes, grievancesRes, invRes] =
        await Promise.all([
          axios.get("/api/admin/analytics"),
          axios.get("/api/admin/cms").catch(() => ({ data: [] })),
          axios.get("/api/admin/orders").catch(() => ({ data: [] })),
          axios.get("/api/admin/grievances").catch(() => ({ data: [] })),
          axios.get("/api/admin/inventory").catch(() => ({ data: { products: [] } })),
        ]);

      setStats(analyticsRes.data);

      const cmsList = Array.isArray(cmsRes.data) ? cmsRes.data : [];
      const ordersList = Array.isArray(ordersRes.data) ? ordersRes.data : [];
      const grievancesList = Array.isArray(grievancesRes.data)
        ? grievancesRes.data
        : [];
      const invProducts = Array.isArray(invRes.data?.products)
        ? invRes.data.products
        : [];

      setOps({
        liveCampaigns: cmsList.filter((c) => c.status === "published").length,
        pendingOrders: ordersList.filter((o) =>
          ["Processing", "Confirmed", "Preparing"].includes(o.status)
        ).length,
        lowStockCount: invProducts.filter((p) => Number(p.available) <= 1).length,
        openGrievances: grievancesList.filter((g) => g.status !== "resolved").length,
      });
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
          Full-Site Command Center
        </p>
        <h1 className="text-3xl font-serif text-[#38131E]">Dashboard</h1>
        <p className="text-[#1A1718]/70 mt-1 text-sm">
          Live snapshot of store revenue, fulfillment queue, active campaigns, and inventory health
        </p>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((c) => (
          <StatCard key={c.title} {...c} loading={loading} />
        ))}
      </div>

      {/* Operational Health Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/cms"
          className="bg-white border border-[#38131E]/14 rounded-2xl p-4 hover:border-[#D4AF63] transition-colors"
        >
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#38131E]/65 font-semibold flex items-center gap-1.5">
            <Megaphone size={12} className="text-[#D4AF63]" /> Active Campaigns &amp; Ads
          </p>
          <p className="font-serif text-2xl text-[#38131E] font-semibold mt-1">
            {loading ? "—" : ops.liveCampaigns}
          </p>
        </Link>

        <Link
          to="/admin/orders"
          className="bg-white border border-[#38131E]/14 rounded-2xl p-4 hover:border-[#D4AF63] transition-colors"
        >
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#38131E]/65 font-semibold flex items-center gap-1.5">
            <ShoppingCart size={12} className="text-[#D4AF63]" /> Orders To Fulfill
          </p>
          <p className="font-serif text-2xl text-[#38131E] font-semibold mt-1">
            {loading ? "—" : ops.pendingOrders}
          </p>
        </Link>

        <Link
          to="/admin/inventory"
          className="bg-white border border-[#38131E]/14 rounded-2xl p-4 hover:border-[#D4AF63] transition-colors"
        >
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#38131E]/65 font-semibold flex items-center gap-1.5">
            <AlertTriangle size={12} className="text-[#D4AF63]" /> Low / Single-Piece Stock
          </p>
          <p className="font-serif text-2xl text-[#38131E] font-semibold mt-1">
            {loading ? "—" : ops.lowStockCount}
          </p>
        </Link>

        <Link
          to="/admin/grievances"
          className="bg-white border border-[#38131E]/14 rounded-2xl p-4 hover:border-[#D4AF63] transition-colors"
        >
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#38131E]/65 font-semibold flex items-center gap-1.5">
            <MessageSquareWarning size={12} className="text-[#D4AF63]" /> Open Grievances
          </p>
          <p className="font-serif text-2xl text-[#38131E] font-semibold mt-1">
            {loading ? "—" : ops.openGrievances}
          </p>
        </Link>
      </div>

      {/* Full-Site Management Directory */}
      <div className="space-y-4">
        <h2 className="font-serif text-2xl text-[#38131E]">Manage Everything</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUICK_MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.to}
                to={mod.to}
                className="group bg-white rounded-2xl border border-[#38131E]/12 p-5 shadow-xs hover:border-[#D4AF63] transition-colors flex flex-col justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F7F1E5] border border-[#D4AF63]/40 flex items-center justify-center shrink-0">
                    <Icon size={17} className="text-[#38131E]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-[#38131E]">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-[#1A1718]/70 mt-0.5 leading-relaxed">
                      {mod.desc}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] font-semibold text-[#38131E]">
                  Open Module{" "}
                  <ArrowRight
                    size={13}
                    className="text-[#D4AF63] group-hover:translate-x-1 transition-transform"
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
