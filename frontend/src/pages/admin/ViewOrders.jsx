import React, { useCallback, useEffect, useState, useMemo } from "react";
import axios from "../../utils/axiosInstance";
import {
  Package, User, Eye, Loader2, X, MapPin, CreditCard,
  Clock, Search, ChevronDown, Phone, Mail, CheckCircle2,
  Truck, RefreshCw, XCircle, RotateCcw, Info,
} from "lucide-react";
import useStore from "../../store/store";

/* ─── Constants ──────────────────────────────────────────── */
const STATUS_OPTIONS = [
  "Processing", "Confirmed", "Preparing",
  "Shipped", "Out for Delivery", "Delivered",
  "Cancelled", "Returned",
];

const statusStyle = (status) => {
  const map = {
    "Processing":      { badge: "bg-yellow-50 text-yellow-700 border-yellow-200",  icon: Clock,         dot: "bg-yellow-400" },
    "Confirmed":       { badge: "bg-blue-50 text-blue-700 border-blue-200",         icon: CheckCircle2,  dot: "bg-blue-400"   },
    "Preparing":       { badge: "bg-orange-50 text-orange-700 border-orange-200",   icon: Package,       dot: "bg-orange-400" },
    "Shipped":         { badge: "bg-indigo-50 text-indigo-700 border-indigo-200",   icon: Truck,         dot: "bg-indigo-400" },
    "Out for Delivery":{ badge: "bg-purple-50 text-purple-700 border-purple-200",   icon: Truck,         dot: "bg-purple-400" },
    "Delivered":       { badge: "bg-green-50 text-green-700 border-green-200",      icon: CheckCircle2,  dot: "bg-green-400"  },
    "Cancelled":       { badge: "bg-red-50 text-red-700 border-red-200",            icon: XCircle,       dot: "bg-red-400"    },
    "Returned":        { badge: "bg-gray-100 text-gray-600 border-gray-300",        icon: RotateCcw,     dot: "bg-gray-400"   },
  };
  return map[status] || { badge: "bg-[#F7F1E5] text-[#38131E] border-[#38131E]/20", icon: Info, dot: "bg-[#D4AF63]" };
};

/* ─── Order Detail Drawer ─────────────────────────────────── */
const OrderDrawer = ({ order, loading, onClose, onStatusChange, updatingId }) => {
  if (!order) return null;
  const style = statusStyle(order.status);
  const StatusIcon = style.icon;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1A1718]/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg flex flex-col bg-white shadow-2xl border-l border-[#38131E]/15 overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-[#38131E] border-b border-[#D4AF63]/30 px-6 py-5 flex items-start justify-between">
          <div>
            <p className="text-[#D4AF63] text-xs uppercase tracking-widest flex items-center gap-2">
              Order Details
              {loading && <Loader2 size={11} className="animate-spin text-[#F1D889]" />}
            </p>
            <h2 className="text-[#F7F1E5] font-serif text-xl mt-1">
              #{order.orderNumber || order._id.slice(-8).toUpperCase()}
            </h2>
            <p className="text-[#F7F1E5]/75 text-xs mt-1">
              {new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
            </p>
          </div>
          <button onClick={onClose} className="text-[#F7F1E5]/75 hover:text-[#F1D889] transition mt-1">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 p-6 space-y-6">

          {/* Status + Change */}
          <div className="bg-[#F7F1E5]/60 border border-[#38131E]/15 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-[#7A6A6E] font-semibold">Order Status</p>
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${style.badge}`}>
                <StatusIcon size={12} /> {order.status}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-[#38131E] shrink-0">Change to:</label>
              <select
                value={order.status}
                disabled={updatingId === order._id}
                onChange={(e) => onStatusChange(order._id, e.target.value)}
                className="flex-1 text-sm border border-[#38131E]/20 rounded-xl px-3 py-2 bg-white text-[#1A1718] focus:outline-none focus:ring-2 focus:ring-[#D4AF63]"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {updatingId === order._id && (
                <Loader2 size={16} className="animate-spin text-[#38131E] shrink-0" />
              )}
            </div>
          </div>

          {/* Customer */}
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-[#7A6A6E] font-semibold">Customer</p>
            <div className="bg-white border border-[#38131E]/15 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-[#1A1718]">
                <div className="w-8 h-8 rounded-full bg-[#F7F1E5] border border-[#D4AF63]/35 flex items-center justify-center">
                  <User size={14} className="text-[#38131E]" />
                </div>
                <span className="font-medium">{order.userId?.fullName || "Guest"}</span>
              </div>
              {order.userId?.email && (
                <div className="flex items-center gap-2 text-sm text-[#5C4E52]">
                  <Mail size={13} className="text-[#9A7A3A]" />
                  {order.userId.email}
                </div>
              )}
              {order.shippingAddress?.phone && (
                <div className="flex items-center gap-2 text-sm text-[#5C4E52]">
                  <Phone size={13} className="text-[#9A7A3A]" />
                  {order.shippingAddress.phone}
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wider text-[#7A6A6E] font-semibold">Shipping Address</p>
              <div className="bg-white border border-[#38131E]/15 rounded-2xl p-4">
                <div className="flex items-start gap-2">
                  <MapPin size={15} className="text-[#9A7A3A] mt-0.5 shrink-0" />
                  <address className="not-italic text-sm text-[#1A1718] leading-relaxed">
                    {order.shippingAddress.street && <span>{order.shippingAddress.street}<br /></span>}
                    {order.shippingAddress.city && <span>{order.shippingAddress.city}, </span>}
                    {order.shippingAddress.state && <span>{order.shippingAddress.state}<br /></span>}
                    {order.shippingAddress.zip && <span>{order.shippingAddress.zip}, </span>}
                    {order.shippingAddress.country && <span>{order.shippingAddress.country}</span>}
                  </address>
                </div>
              </div>
            </div>
          )}

          {/* Items */}
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-[#7A6A6E] font-semibold">
              Items ({order.items?.length || 0})
            </p>
            <div className="bg-white border border-[#38131E]/15 rounded-2xl divide-y divide-[#38131E]/10 overflow-hidden">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover shadow-sm shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-[#F7F1E5] border border-[#38131E]/15 flex items-center justify-center shrink-0">
                      <Package size={18} className="text-[#7A6A6E]" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1A1718] truncate">{item.name}</p>
                    <p className="text-xs text-[#7A6A6E] mt-0.5">
                      {item.size && item.size !== "NO_SIZE" && <>Size: {item.size} · </>}
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-[#38131E] text-sm shrink-0">
                    ₹{Number(item.price).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment + Totals */}
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-[#7A6A6E] font-semibold">Payment & Totals</p>
            <div className="bg-white border border-[#38131E]/15 rounded-2xl p-4 space-y-2 text-sm">
              {order.paymentMethod && (
                <div className="flex items-center justify-between text-[#1A1718]">
                  <span className="flex items-center gap-2 text-[#5C4E52]">
                    <CreditCard size={13} /> Method
                  </span>
                  <span className="font-medium capitalize">{order.paymentMethod}</span>
                </div>
              )}
              {order.subtotal !== undefined && (
                <div className="flex justify-between text-[#1A1718]">
                  <span className="text-[#5C4E52]">Subtotal</span>
                  <span>₹{Number(order.subtotal).toFixed(2)}</span>
                </div>
              )}
              {order.discount !== undefined && order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount</span>
                  <span>−₹{Number(order.discount).toFixed(2)}</span>
                </div>
              )}
              {order.deliveryFee !== undefined && (
                <div className="flex justify-between text-[#1A1718]">
                  <span className="text-[#5C4E52]">Delivery</span>
                  <span>{order.deliveryFee === 0 ? "Free" : `₹${Number(order.deliveryFee).toFixed(2)}`}</span>
                </div>
              )}
              <div className="flex justify-between text-[#38131E] font-semibold border-t border-[#38131E]/12 pt-2 mt-1">
                <span>Total</span>
                <span>₹{Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          {order.statusHistory?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wider text-[#7A6A6E] font-semibold">Timeline</p>
              <div className="bg-white border border-[#38131E]/15 rounded-2xl p-4">
                <ol className="relative border-l border-[#38131E]/15 space-y-4 ml-2">
                  {[...order.statusHistory].reverse().map((h, i) => {
                    const s = statusStyle(h.status);
                    return (
                      <li key={i} className="ml-4">
                        <div className={`absolute w-2.5 h-2.5 rounded-full -left-1.5 mt-1 ${s.dot}`} />
                        <p className="font-medium text-[#1A1718] text-sm">{h.status}</p>
                        {h.note && <p className="text-xs text-[#5C4E52]">{h.note}</p>}
                        <p className="text-xs text-[#7A6A6E] mt-0.5">
                          {new Date(h.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                        </p>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          )}

          {/* Tracking info */}
          {(order.trackingNumber || order.carrier) && (
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wider text-[#7A6A6E] font-semibold">Tracking</p>
              <div className="bg-white border border-[#38131E]/15 rounded-2xl p-4 text-sm space-y-1">
                {order.carrier && <p className="text-[#1A1718]"><span className="text-[#7A6A6E]">Carrier: </span>{order.carrier}</p>}
                {order.trackingNumber && <p className="text-[#1A1718] font-mono"><span className="text-[#7A6A6E]">Tracking #: </span>{order.trackingNumber}</p>}
                {order.estimatedDelivery && (
                  <p className="text-[#1A1718]">
                    <span className="text-[#7A6A6E]">ETA: </span>
                    {new Date(order.estimatedDelivery).toLocaleDateString("en-IN", { dateStyle: "long" })}
                  </p>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

/* ─── Main Component ──────────────────────────────────────── */
const ViewOrders = () => {
  const { showToast } = useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drawerLoading, setDrawerLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/orders");
      setOrders(res.data || []);
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to fetch orders", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    // Optimistic update on list
    setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status } : o));
    // Also update in drawer if open
    if (selectedOrder?._id === orderId) {
      setSelectedOrder((prev) => prev ? { ...prev, status } : prev);
    }
    try {
      const res = await axios.put(`/api/admin/orders/${orderId}/status`, { status });
      // Replace with server response (includes updated statusHistory)
      setOrders((prev) => prev.map((o) => o._id === orderId ? res.data : o));
      if (selectedOrder?._id === orderId) setSelectedOrder(res.data);
      showToast("Order status updated", "success");
    } catch {
      showToast("Failed to update order status", "error");
      fetchOrders();
    } finally {
      setUpdatingId(null);
    }
  };

  const openDrawer = async (order) => {
    // Open immediately with current data, then fetch full detail
    setSelectedOrder(order);
    setDrawerLoading(true);
    try {
      const res = await axios.get(`/api/admin/orders/${order._id}`);
      setSelectedOrder(res.data);
    } catch {
      // silently fall back to list data
    } finally {
      setDrawerLoading(false);
    }
  };

  // Filtered orders
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = filterStatus === "All" || o.status === filterStatus;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        o._id.toLowerCase().includes(q) ||
        (o.orderNumber || "").toLowerCase().includes(q) ||
        (o.userId?.fullName || "").toLowerCase().includes(q) ||
        (o.userId?.email || "").toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [orders, filterStatus, search]);

  // Status counts for filter pills
  const statusCounts = useMemo(() => {
    const counts = { All: orders.length };
    STATUS_OPTIONS.forEach((s) => {
      counts[s] = orders.filter((o) => o.status === s).length;
    });
    return counts;
  }, [orders]);

  const style = (status) => statusStyle(status);

  return (
    <section className="space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#7A6A6E] mb-1 font-medium">Store</p>
          <h1 className="text-3xl font-serif text-[#38131E]">Orders</h1>
          <p className="text-[#5C4E52] text-sm mt-1">Manage and track customer purchases</p>
        </div>

        <div className="flex items-center gap-2 bg-[#38131E] text-[#F7F1E5] border border-[#D4AF63]/40 px-5 py-2.5 rounded-full text-sm shadow-sm">
          <Package size={15} className="text-[#D4AF63]" />
          {orders.length} Total Orders
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A6A6E]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, customer name or email…"
            className="w-full pl-10 pr-4 py-2.5 border border-[#38131E]/20 rounded-xl text-sm text-[#1A1718] bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF63] placeholder-[#7A6A6E]/60"
          />
        </div>

        {/* Status filter */}
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none pl-4 pr-9 py-2.5 border border-[#38131E]/20 rounded-xl text-sm text-[#1A1718] bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF63] cursor-pointer"
          >
            <option value="All">All ({statusCounts.All})</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s} ({statusCounts[s] || 0})</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6A6E] pointer-events-none" />
        </div>

        {/* Refresh */}
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 border border-[#38131E]/20 text-[#38131E] hover:bg-[#F7F1E5] px-4 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Status Pills (quick filter) */}
      <div className="flex flex-wrap gap-2">
        {["All", ...STATUS_OPTIONS].map((s) => {
          const active = filterStatus === s;
          const st = s !== "All" ? style(s) : null;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all duration-150 ${
                active
                  ? "bg-[#38131E] text-[#F7F1E5] border-[#38131E] shadow-sm"
                  : s === "All"
                  ? "bg-white text-[#38131E] border-[#38131E]/20 hover:border-[#38131E]/50"
                  : `${st?.badge} hover:shadow-sm`
              }`}
            >
              {s}
              {statusCounts[s] > 0 && (
                <span className={`ml-1.5 ${active ? "text-[#F1D889]" : "opacity-60"}`}>
                  {statusCounts[s]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Table Card */}
      <div className="bg-white/95 rounded-2xl shadow-sm border border-[#38131E]/15 overflow-hidden">

        {loading && (
          <div className="flex items-center justify-center py-20 text-[#7A6A6E]">
            <Loader2 className="animate-spin mr-2 text-[#38131E]" /> Loading orders…
          </div>
        )}

        {!loading && (
          <div className="overflow-x-auto">
            {/* Desktop */}
            <div className="hidden md:block">
              <table className="min-w-full text-sm">
                <thead className="bg-[#F7F1E5]/70 border-b border-[#38131E]/12">
                  <tr>
                    {["Order", "Date", "Customer", "Items", "Total", "Status", "Actions"].map((h, i) => (
                      <th
                        key={h}
                        className={`px-5 py-4 text-xs uppercase tracking-wider text-[#38131E] font-semibold ${i === 6 ? "text-right" : "text-left"}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#38131E]/10">
                  {filtered.map((order) => {
                    const s = style(order.status);
                    const StatusIcon = s.icon;
                    return (
                      <tr key={order._id} className="hover:bg-[#F7F1E5]/40 transition-colors group">

                        {/* Order # */}
                        <td className="px-5 py-4">
                          <p className="font-mono font-semibold text-[#1A1718] text-xs">
                            #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                          </p>
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4 text-[#5C4E52] text-xs">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                        </td>

                        {/* Customer */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-[#1A1718]">
                            <div className="w-7 h-7 rounded-full bg-[#F7F1E5] border border-[#D4AF63]/35 flex items-center justify-center shrink-0">
                              <User size={12} className="text-[#38131E]" />
                            </div>
                            <div>
                              <p className="font-medium text-sm leading-tight">{order.userId?.fullName || "Guest"}</p>
                              {order.userId?.email && (
                                <p className="text-xs text-[#7A6A6E]">{order.userId.email}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Items count */}
                        <td className="px-5 py-4 text-[#5C4E52] text-sm">
                          {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? "s" : ""}
                        </td>

                        {/* Total */}
                        <td className="px-5 py-4 font-semibold text-[#38131E]">
                          ₹{Number(order.total).toFixed(2)}
                        </td>

                        {/* Status + inline change */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${s.badge}`}>
                              <StatusIcon size={11} /> {order.status}
                            </span>
                            <div className="relative">
                              <select
                                value={order.status}
                                disabled={updatingId === order._id}
                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                className="text-xs border border-[#38131E]/20 rounded-lg pl-2 pr-6 py-1 bg-white text-[#1A1718] focus:outline-none focus:ring-2 focus:ring-[#D4AF63] appearance-none cursor-pointer"
                              >
                                {STATUS_OPTIONS.map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                              {updatingId === order._id
                                ? <Loader2 size={10} className="animate-spin absolute right-1.5 top-1.5 text-[#38131E]" />
                                : <ChevronDown size={10} className="absolute right-1.5 top-1.5 text-[#7A6A6E] pointer-events-none" />
                              }
                            </div>
                          </div>
                        </td>

                        {/* View */}
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => openDrawer(order)}
                            className="inline-flex items-center gap-1.5 text-[#38131E] hover:text-[#9A7A3A] font-medium transition-colors text-sm"
                          >
                            <Eye size={14} /> View
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {!filtered.length && (
                    <tr>
                      <td colSpan="7" className="text-center py-16 text-[#7A6A6E]">
                        {search || filterStatus !== "All" ? "No orders match your filters" : "No orders found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-[#38131E]/10">
              {filtered.map((order) => {
                const s = style(order.status);
                const StatusIcon = s.icon;
                return (
                  <div key={order._id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-mono font-semibold text-[#1A1718] text-xs">
                          #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-xs text-[#7A6A6E] mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                        </p>
                        <p className="text-sm text-[#1A1718] mt-1 flex items-center gap-1">
                          <User size={12} className="text-[#9A7A3A]" />
                          {order.userId?.fullName || "Guest"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#38131E]">₹{Number(order.total).toFixed(2)}</p>
                        <button
                          onClick={() => openDrawer(order)}
                          className="mt-1 inline-flex items-center gap-1 text-[#38131E] hover:text-[#9A7A3A] font-medium text-sm"
                        >
                          <Eye size={13} /> View
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${s.badge}`}>
                        <StatusIcon size={11} /> {order.status}
                      </span>
                      <select
                        value={order.status}
                        disabled={updatingId === order._id}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="text-xs border border-[#38131E]/20 rounded-lg px-2 py-1 bg-white text-[#1A1718] focus:outline-none"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {updatingId === order._id && (
                        <Loader2 size={13} className="animate-spin text-[#38131E]" />
                      )}
                    </div>
                  </div>
                );
              })}
              {!filtered.length && (
                <div className="text-center py-16 text-[#7A6A6E]">
                  {search || filterStatus !== "All" ? "No orders match your filters" : "No orders found"}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Drawer */}
      {selectedOrder && (
        <OrderDrawer
          order={selectedOrder}
          loading={drawerLoading}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
          updatingId={updatingId}
        />
      )}

    </section>
  );
};

export default ViewOrders;
