import User from "../../models/user.model.js";
import Order from "../../models/order.model.js";
import Product from "../../models/product.model.js";
import Review from "../../models/review.model.js";
import CmsCampaign from "../../models/cmsCampaign.model.js";
import InventoryMovement from "../../models/inventoryMovement.model.js";
import AnalyticsEvent from "../../models/analyticsEvent.model.js";
import Wishlist from "../../models/wishlist.model.js";
import Cart from "../../models/cart.model.js";
import { getMlStatus } from "../../services/sentiment.service.js";
import {
  ALLOWED_ANALYTICS_EVENTS,
  resolveDateWindow,
  computeDeltaPct,
  buildRevenueWaterfall,
  buildInventoryWaterfall,
  buildConversionFunnel,
} from "../../lib/analyticsMath.js";

const round2 = (n) => Math.round((Number(n || 0) + Number.EPSILON) * 100) / 100;
const round1 = (n) => Math.round((Number(n || 0) + Number.EPSILON) * 10) / 10;

const parseRangeToStartDate = (range) => {
  // Supported: 7d, 30d, 90d, 12m (defaults to 7d)
  const now = new Date();
  const safe = typeof range === "string" ? range.trim().toLowerCase() : "7d";

  const match = safe.match(/^(\d+)([dm])$/);
  if (!match) {
    const start = new Date(now);
    start.setDate(start.getDate() - 7);
    return start;
  }

  const amount = Number(match[1]);
  const unit = match[2];
  const start = new Date(now);

  if (!Number.isFinite(amount) || amount <= 0) {
    start.setDate(start.getDate() - 7);
    return start;
  }

  if (unit === "d") {
    start.setDate(start.getDate() - amount);
    return start;
  }

  start.setMonth(start.getMonth() - amount);
  return start;
};

const formatDateKeyUTC = (d) => {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
    .toISOString()
    .slice(0, 10);
};

const formatMonthKeyUTC = (d) => {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1))
    .toISOString()
    .slice(0, 7);
};

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const formatBucketLabel = (key, bucketUnit) => {
  if (bucketUnit === "month") {
    const [yr, mo] = key.split("-");
    const idx = Number(mo) - 1;
    return `${MONTH_NAMES[idx] || mo} ${yr.slice(2)}`;
  }
  const [, mo, da] = key.split("-");
  const idx = Number(mo) - 1;
  return `${Number(da)} ${MONTH_NAMES[idx] || mo}`;
};

const buildBucketList = (startDate, endDate, bucketUnit) => {
  const buckets = [];
  if (bucketUnit === "month") {
    const cursor = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), 1));
    const end = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), 1));
    // Cap runaway ranges at 60 months for chart legibility
    const minStart = new Date(end);
    minStart.setUTCMonth(minStart.getUTCMonth() - 59);
    if (cursor < minStart) {
      cursor.setTime(minStart.getTime());
    }
    while (cursor <= end) {
      const key = formatMonthKeyUTC(cursor);
      buckets.push({ key, label: formatBucketLabel(key, "month") });
      cursor.setUTCMonth(cursor.getUTCMonth() + 1);
    }
    return buckets;
  }

  const cursor = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate()));
  const end = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()));
  while (cursor <= end) {
    const key = formatDateKeyUTC(cursor);
    buckets.push({ key, label: formatBucketLabel(key, "day") });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return buckets;
};

const sanitizeShortString = (val) =>
  typeof val === "string" ? val.trim().slice(0, 64) : "";

const toTitleCase = (str) =>
  String(str || "")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (ch) => ch.toUpperCase());

const normalizePaymentMethod = (rawMethod, channel) => {
  const clean = String(rawMethod || "").trim().toLowerCase();
  if (clean === "cod" || clean.includes("cash on delivery")) return "Cash on Delivery";
  if (clean.includes("razorpay") || clean === "online" || clean === "prepaid") return "Razorpay / Online";
  if (clean === "pos_cash" || (channel === "pos" && clean.includes("cash"))) return "Boutique POS Cash";
  if (clean === "pos_card" || (channel === "pos" && clean.includes("card"))) return "Boutique POS Card";
  if (clean === "pos_upi" || (channel === "pos" && clean.includes("upi"))) return "Boutique POS UPI";
  if (clean.includes("upi")) return "UPI";
  if (clean.includes("card")) return "Card";
  if (channel === "pos") return "Boutique POS";
  return clean ? toTitleCase(clean.replace(/[_-]+/g, " ")) : "Online Checkout";
};

const computeOrderGross = (order) => {
  const items = Array.isArray(order?.items) ? order.items : [];
  let mrp = 0;
  for (const item of items) {
    const qty = Math.max(1, Number(item?.quantity || 1));
    const sell = Math.max(0, Number(item?.price || 0));
    const orig = Math.max(sell, Number(item?.originalPrice ?? sell));
    mrp += orig * qty;
  }
  return Math.max(mrp, Number(order?.subtotal ?? 0), Number(order?.total ?? 0));
};

/* ================= PUBLIC CONSENT-GATED TELEMETRY INGESTION ================= */
export const recordStorefrontEvent = async (req, res) => {
  try {
    const eventName = sanitizeShortString(req.body?.eventName);
    if (!ALLOWED_ANALYTICS_EVENTS.has(eventName)) {
      return res.status(400).json({ message: "Unsupported analytics event" });
    }

    const rawChannel = sanitizeShortString(req.body?.channel).toLowerCase();
    const channel = rawChannel === "pos" ? "pos" : "web";
    const parsedValue = Number(req.body?.value);
    const value = Number.isFinite(parsedValue) && parsedValue >= 0 ? round2(parsedValue) : 0;

    await AnalyticsEvent.create({
      eventName,
      sessionId: sanitizeShortString(req.body?.sessionId),
      itemId: sanitizeShortString(req.body?.itemId),
      category: sanitizeShortString(req.body?.category),
      value,
      channel,
    });

    return res.status(202).json({ ok: true });
  } catch (error) {
    console.error("Error in recordStorefrontEvent:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ================= EXECUTIVE DEEP ANALYTICS & WATERFALL SUITE ================= */
export const getDeepAnalytics = async (req, res) => {
  try {
    const rawRange = typeof req.query?.range === "string" ? req.query.range : "30d";
    const rawChannel = typeof req.query?.channel === "string" ? req.query.channel.trim().toLowerCase() : "all";
    const channel = rawChannel === "web" || rawChannel === "pos" ? rawChannel : "all";

    const windowInfo = resolveDateWindow(rawRange, new Date());
    const dateMatch = windowInfo.startDate
      ? { createdAt: { $gte: windowInfo.startDate, $lte: windowInfo.endDate } }
      : {};
    const prevDateMatch =
      windowInfo.prevStartDate && windowInfo.prevEndDate
        ? { createdAt: { $gte: windowInfo.prevStartDate, $lte: windowInfo.prevEndDate } }
        : null;
    const channelMatch = channel !== "all" ? { channel } : {};

    const [
      allRangeOrders,
      prevPeriodOrders,
      products,
      movements,
      campaigns,
      eventAgg,
      wishlists,
      carts,
      newUsersDocs,
      prevNewUsersCount,
      totalUsersCount,
    ] = await Promise.all([
      Order.find(dateMatch)
        .select(
          "orderNumber userId items shippingAddress channel paymentMethod paymentStatus couponCode subtotal discount deliveryFee total status createdAt"
        )
        .lean(),
      prevDateMatch
        ? Order.find({ ...prevDateMatch, ...channelMatch })
            .select("items subtotal discount deliveryFee total status")
            .lean()
        : Promise.resolve([]),
      Product.find({})
        .select("code name category subCategory type state price discountedPrice stock reserved status createdAt")
        .lean(),
      InventoryMovement.find(dateMatch)
        .select("productId type quantityDeltaOnHand channel createdAt")
        .lean(),
      CmsCampaign.find({})
        .select("title slot campaignType status impressions clicks couponCode priority createdAt")
        .sort({ priority: 1, createdAt: -1 })
        .lean(),
      AnalyticsEvent.aggregate([
        ...(windowInfo.startDate ? [{ $match: dateMatch }] : []),
        { $group: { _id: "$eventName", count: { $sum: 1 } } },
      ]),
      Wishlist.find({}).select("items updatedAt").lean(),
      Cart.find({}).select("items updatedAt").lean(),
      User.find(dateMatch).select("createdAt").lean(),
      prevDateMatch ? User.countDocuments(prevDateMatch) : Promise.resolve(null),
      User.countDocuments(),
    ]);

    const currentOrders =
      channel === "all"
        ? allRangeOrders
        : allRangeOrders.filter((o) => (o.channel || "web") === channel);

    const submittedOrders = currentOrders.filter((o) => o.status !== "PendingPayment");
    const activeOrders = submittedOrders.filter(
      (o) => o.status !== "Cancelled" && o.status !== "Returned"
    );
    const deliveredOrders = submittedOrders.filter((o) => o.status === "Delivered");
    const cancelledOrders = submittedOrders.filter((o) => o.status === "Cancelled");
    const returnedOrders = submittedOrders.filter((o) => o.status === "Returned");

    // 1. Waterfalls
    const revenueWaterfall = buildRevenueWaterfall(currentOrders);
    const prevWaterfall = prevDateMatch ? buildRevenueWaterfall(prevPeriodOrders) : null;
    const inventoryWaterfall = buildInventoryWaterfall({ products, movements });

    // 2. KPI Metrics & Deltas
    const totalOrdersCount = submittedOrders.length;
    const deliveredOrdersCount = deliveredOrders.length;
    const netRevenue = revenueWaterfall.summary.netRevenue;
    const grossGmv = revenueWaterfall.summary.grossGmv;
    const aov = activeOrders.length > 0 ? round2(netRevenue / activeOrders.length) : 0;

    const prevSubmitted = prevPeriodOrders.filter((o) => o.status !== "PendingPayment");
    const prevActiveCount = prevSubmitted.filter(
      (o) => o.status !== "Cancelled" && o.status !== "Returned"
    ).length;
    const prevNetRevenue = prevWaterfall ? prevWaterfall.summary.netRevenue : null;
    const prevGrossGmv = prevWaterfall ? prevWaterfall.summary.grossGmv : null;
    const prevAov =
      prevWaterfall && prevActiveCount > 0 ? round2(prevNetRevenue / prevActiveCount) : prevWaterfall ? 0 : null;

    // Repeat buyers among period buyers (check lifetime submitted orders for those users)
    const periodBuyerIds = Array.from(
      new Set(submittedOrders.map((o) => (o.userId ? String(o.userId) : "")).filter(Boolean))
    );
    let repeatBuyersCount = 0;
    if (periodBuyerIds.length > 0) {
      const buyerLifetimeCounts = await Order.aggregate([
        {
          $match: {
            userId: { $in: submittedOrders.map((o) => o.userId).filter(Boolean) },
            status: { $ne: "PendingPayment" },
          },
        },
        { $group: { _id: "$userId", count: { $sum: 1 } } },
      ]);
      for (const row of buyerLifetimeCounts) {
        if (Number(row.count || 0) >= 2) repeatBuyersCount += 1;
      }
    }

    const repeatCustomerRatePct =
      periodBuyerIds.length > 0 ? round1((repeatBuyersCount / periodBuyerIds.length) * 100) : 0;
    const fulfillmentRatePct =
      totalOrdersCount > 0 ? round1((deliveredOrdersCount / totalOrdersCount) * 100) : 0;
    const discountBurnPct =
      grossGmv > 0
        ? round1(
            ((revenueWaterfall.summary.catalogDiscounts + revenueWaterfall.summary.couponDiscounts) /
              grossGmv) *
              100
          )
        : 0;
    const cancellationAndReturnRatePct =
      totalOrdersCount > 0
        ? round1(((cancelledOrders.length + returnedOrders.length) / totalOrdersCount) * 100)
        : 0;

    const kpis = {
      netRevenue,
      grossGmv,
      realizedDelivered: revenueWaterfall.summary.realizedDelivered,
      inFlightPipeline: revenueWaterfall.summary.inFlightPipeline,
      totalOrders: totalOrdersCount,
      deliveredOrders: deliveredOrdersCount,
      pendingPaymentOrders: revenueWaterfall.summary.pendingPaymentCount,
      aov,
      fulfillmentRatePct,
      repeatCustomerRatePct,
      discountBurnPct,
      cancellationAndReturnRatePct,
      newUsersCount: newUsersDocs.length,
      totalUsersCount,
      deltas: {
        netRevenuePct: computeDeltaPct(netRevenue, prevNetRevenue),
        grossGmvPct: computeDeltaPct(grossGmv, prevGrossGmv),
        ordersPct: prevDateMatch ? computeDeltaPct(totalOrdersCount, prevSubmitted.length) : null,
        aovPct: computeDeltaPct(aov, prevAov),
        newUsersPct: computeDeltaPct(newUsersDocs.length, prevNewUsersCount),
      },
    };

    // 3. Conversion Funnel (Telemetry + Live DB authoritative hybrid)
    const eventCounts = {};
    let totalTelemetryEvents = 0;
    for (const row of eventAgg) {
      if (row?._id) {
        const cnt = Number(row.count || 0);
        eventCounts[row._id] = cnt;
        totalTelemetryEvents += cnt;
      }
    }

    let wishlistAddsCount = 0;
    for (const wl of wishlists) {
      for (const item of wl.items || []) {
        const stamp = item?.addedAt || wl.updatedAt;
        if (!windowInfo.startDate || (stamp && new Date(stamp) >= windowInfo.startDate)) {
          wishlistAddsCount += 1;
        }
      }
    }

    let activeCartItemsCount = 0;
    for (const cart of carts) {
      if (!windowInfo.startDate || (cart.updatedAt && new Date(cart.updatedAt) >= windowInfo.startDate)) {
        for (const item of cart.items || []) {
          activeCartItemsCount += Math.max(1, Number(item?.quantity || 1));
        }
      }
    }

    const conversionFunnel = {
      stages: buildConversionFunnel({
        eventCounts,
        wishlistAddsCount,
        activeCartItemsCount,
        totalOrdersIncludingPending: currentOrders.length,
        submittedOrdersCount: totalOrdersCount,
        deliveredOrdersCount,
      }),
      telemetryActive: totalTelemetryEvents > 0,
      totalTelemetryEvents,
    };

    // 4. Time-Series Trend (Revenue, GMV, Orders, Registrations)
    let trendStartDate = windowInfo.startDate;
    if (!trendStartDate) {
      const timestamps = [
        ...currentOrders.map((o) => new Date(o.createdAt).getTime()),
        ...newUsersDocs.map((u) => new Date(u.createdAt).getTime()),
      ].filter((t) => Number.isFinite(t));
      if (timestamps.length > 0) {
        trendStartDate = new Date(Math.min(...timestamps));
      } else {
        const fallback = new Date(windowInfo.endDate);
        fallback.setUTCMonth(fallback.getUTCMonth() - 5);
        trendStartDate = fallback;
      }
    }

    const buckets = buildBucketList(trendStartDate, windowInfo.endDate, windowInfo.bucketUnit);
    const trendMap = new Map(
      buckets.map((b) => [
        b.key,
        {
          bucket: b.key,
          label: b.label,
          grossGmv: 0,
          netRevenue: 0,
          realizedRevenue: 0,
          orders: 0,
          webRevenue: 0,
          posRevenue: 0,
        },
      ])
    );

    const getBucketKey = (dt) =>
      windowInfo.bucketUnit === "month" ? formatMonthKeyUTC(new Date(dt)) : formatDateKeyUTC(new Date(dt));

    for (const order of submittedOrders) {
      const key = getBucketKey(order.createdAt);
      const entry = trendMap.get(key);
      if (!entry) continue;
      entry.orders += 1;
      entry.grossGmv = round2(entry.grossGmv + computeOrderGross(order));
      if (order.status !== "Cancelled" && order.status !== "Returned") {
        const orderNet = Math.max(0, Number(order.total || 0));
        entry.netRevenue = round2(entry.netRevenue + orderNet);
        if (order.status === "Delivered") {
          entry.realizedRevenue = round2(entry.realizedRevenue + orderNet);
        }
        if ((order.channel || "web") === "pos") {
          entry.posRevenue = round2(entry.posRevenue + orderNet);
        } else {
          entry.webRevenue = round2(entry.webRevenue + orderNet);
        }
      }
    }
    const revenueTrend = Array.from(trendMap.values());

    const userTrendMap = new Map(buckets.map((b) => [b.key, { bucket: b.key, label: b.label, count: 0 }]));
    for (const u of newUsersDocs) {
      const key = getBucketKey(u.createdAt);
      const entry = userTrendMap.get(key);
      if (entry) entry.count += 1;
    }
    const userRegistrationsTrend = Array.from(userTrendMap.values());

    // 5. Order Status Breakdown
    const statusAgg = new Map();
    for (const order of currentOrders) {
      const st = order.status || "Unknown";
      const prev = statusAgg.get(st) || { status: st, count: 0, value: 0 };
      prev.count += 1;
      prev.value = round2(prev.value + Math.max(0, Number(order.total || 0)));
      statusAgg.set(st, prev);
    }
    const orderStatusBreakdown = Array.from(statusAgg.values()).sort((a, b) => b.count - a.count);

    // 6. Channel Breakdown (always calculated across both Web and POS for date range)
    const channelTotals = {
      web: { channel: "web", label: "Web Storefront", orders: 0, netRevenue: 0, grossGmv: 0 },
      pos: { channel: "pos", label: "Boutique POS", orders: 0, netRevenue: 0, grossGmv: 0 },
    };
    for (const order of allRangeOrders) {
      if (order.status === "PendingPayment") continue;
      const ch = order.channel === "pos" ? "pos" : "web";
      channelTotals[ch].orders += 1;
      channelTotals[ch].grossGmv = round2(channelTotals[ch].grossGmv + computeOrderGross(order));
      if (order.status !== "Cancelled" && order.status !== "Returned") {
        channelTotals[ch].netRevenue = round2(
          channelTotals[ch].netRevenue + Math.max(0, Number(order.total || 0))
        );
      }
    }
    const totalAllChannelRev = channelTotals.web.netRevenue + channelTotals.pos.netRevenue;
    const channelBreakdown = Object.values(channelTotals).map((c) => ({
      ...c,
      aov: c.orders > 0 ? round2(c.netRevenue / c.orders) : 0,
      sharePct: totalAllChannelRev > 0 ? round1((c.netRevenue / totalAllChannelRev) * 100) : 0,
    }));

    // 7. Payment Method Breakdown
    const paymentMap = new Map();
    for (const order of activeOrders) {
      const method = normalizePaymentMethod(order.paymentMethod, order.channel || "web");
      const entry = paymentMap.get(method) || { method, orders: 0, revenue: 0 };
      entry.orders += 1;
      entry.revenue = round2(entry.revenue + Math.max(0, Number(order.total || 0)));
      paymentMap.set(method, entry);
    }
    const paymentMethodBreakdown = Array.from(paymentMap.values())
      .map((p) => ({
        ...p,
        sharePct: netRevenue > 0 ? round1((p.revenue / netRevenue) * 100) : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    // 8. Category, Top Products & Watchlist
    const productMap = new Map(products.map((p) => [String(p._id), p]));
    const categoryMap = new Map();
    const productPerfMap = new Map();
    const soldProductIdsInRange = new Set();

    for (const order of activeOrders) {
      const items = Array.isArray(order.items) ? order.items : [];
      const orderTotal = Math.max(0, Number(order.total || 0));
      let itemsLineSum = 0;
      for (const item of items) {
        itemsLineSum += Math.max(0, Number(item.price || 0)) * Math.max(1, Number(item.quantity || 1));
      }

      for (const item of items) {
        const pid = item?.productId ? String(item.productId) : "";
        const prod = productMap.get(pid);
        const qty = Math.max(1, Number(item?.quantity || 1));
        const sellLine = Math.max(0, Number(item?.price || 0)) * qty;
        const mrpLine = Math.max(sellLine, Number(item?.originalPrice ?? item?.price ?? 0) * qty);
        // Pro-rate order total (accounts for coupon + shipping) when items exist
        const allocatedNet = itemsLineSum > 0 ? (sellLine / itemsLineSum) * orderTotal : sellLine;

        const catName = (prod?.category || "Other").trim() || "Other";
        const catEntry = categoryMap.get(catName) || {
          category: catName,
          unitsSold: 0,
          netRevenue: 0,
          grossGmv: 0,
        };
        catEntry.unitsSold += qty;
        catEntry.netRevenue = round2(catEntry.netRevenue + allocatedNet);
        catEntry.grossGmv = round2(catEntry.grossGmv + mrpLine);
        categoryMap.set(catName, catEntry);

        if (pid) {
          soldProductIdsInRange.add(pid);
          const pEntry = productPerfMap.get(pid) || {
            productId: pid,
            code: prod?.code || "—",
            name: prod?.name || item?.name || "Garment",
            category: prod?.category || "—",
            subCategory: prod?.subCategory || "—",
            unitsSold: 0,
            revenue: 0,
            currentStock: Math.max(0, Number(prod?.stock || 0)),
            sellableStock: Math.max(0, Number(prod?.stock || 0) - Number(prod?.reserved || 0)),
          };
          pEntry.unitsSold += qty;
          pEntry.revenue = round2(pEntry.revenue + allocatedNet);
          productPerfMap.set(pid, pEntry);
        }
      }
    }

    const totalCatRev = Array.from(categoryMap.values()).reduce((sum, c) => sum + c.netRevenue, 0);
    const categoryBreakdown = Array.from(categoryMap.values())
      .map((c) => ({
        ...c,
        sharePct: totalCatRev > 0 ? round1((c.netRevenue / totalCatRev) * 100) : 0,
      }))
      .sort((a, b) => b.netRevenue - a.netRevenue);

    const topProducts = Array.from(productPerfMap.values())
      .sort((a, b) => b.revenue - a.revenue || b.unitsSold - a.unitsSold)
      .slice(0, 10);

    const slowMovers = [];
    const lowStockAlerts = [];
    for (const p of products) {
      if (p.status === "archived") continue;
      const pid = String(p._id);
      const stock = Math.max(0, Number(p.stock || 0));
      const reserved = Math.max(0, Number(p.reserved || 0));
      const sellable = Math.max(0, stock - reserved);
      const effectivePrice =
        Number(p.discountedPrice) > 0 && Number(p.discountedPrice) < Number(p.price || 0)
          ? Number(p.discountedPrice)
          : Number(p.price || 0);

      if (sellable > 0 && !soldProductIdsInRange.has(pid)) {
        slowMovers.push({
          productId: pid,
          code: p.code,
          name: p.name,
          category: p.category,
          sellableStock: sellable,
          lockedValue: round2(sellable * effectivePrice),
        });
      }

      if (sellable <= 3) {
        lowStockAlerts.push({
          productId: pid,
          code: p.code,
          name: p.name,
          category: p.category,
          stock,
          reserved,
          sellableStock: sellable,
        });
      }
    }
    slowMovers.sort((a, b) => b.lockedValue - a.lockedValue);
    lowStockAlerts.sort((a, b) => a.sellableStock - b.sellableStock);

    // 9. Geography Breakdown (Shipping States & Cities)
    const stateMap = new Map();
    const cityMap = new Map();
    for (const order of activeOrders) {
      const rawState = order.shippingAddress?.state;
      const rawCity = order.shippingAddress?.city;
      const stateLabel = rawState
        ? toTitleCase(rawState)
        : (order.channel || "web") === "pos"
          ? "Boutique Walk-in (Indore)"
          : "Unspecified";
      const sEntry = stateMap.get(stateLabel) || { state: stateLabel, orders: 0, netRevenue: 0 };
      sEntry.orders += 1;
      sEntry.netRevenue = round2(sEntry.netRevenue + Math.max(0, Number(order.total || 0)));
      stateMap.set(stateLabel, sEntry);

      if (rawCity && String(rawCity).trim()) {
        const cityLabel = toTitleCase(rawCity);
        const cEntry = cityMap.get(cityLabel) || { city: cityLabel, orders: 0, netRevenue: 0 };
        cEntry.orders += 1;
        cEntry.netRevenue = round2(cEntry.netRevenue + Math.max(0, Number(order.total || 0)));
        cityMap.set(cityLabel, cEntry);
      }
    }
    const geographyBreakdown = {
      states: Array.from(stateMap.values())
        .map((s) => ({
          ...s,
          aov: s.orders > 0 ? round2(s.netRevenue / s.orders) : 0,
        }))
        .sort((a, b) => b.netRevenue - a.netRevenue)
        .slice(0, 12),
      topCities: Array.from(cityMap.values())
        .sort((a, b) => b.netRevenue - a.netRevenue)
        .slice(0, 8),
    };

    // 10. Coupon Performance & Campaign Attribution
    const couponMap = new Map();
    for (const order of activeOrders) {
      const code = String(order.couponCode || "").trim().toUpperCase();
      if (!code) continue;
      const entry = couponMap.get(code) || {
        code,
        redemptions: 0,
        totalDiscount: 0,
        netRevenue: 0,
      };
      entry.redemptions += 1;
      entry.totalDiscount = round2(entry.totalDiscount + Math.max(0, Number(order.discount || 0)));
      entry.netRevenue = round2(entry.netRevenue + Math.max(0, Number(order.total || 0)));
      couponMap.set(code, entry);
    }

    const couponPerformance = Array.from(couponMap.values())
      .map((c) => ({
        ...c,
        avgOrderValue: c.redemptions > 0 ? round2(c.netRevenue / c.redemptions) : 0,
        roiMultiple: c.totalDiscount > 0 ? round2(c.netRevenue / c.totalDiscount) : c.netRevenue > 0 ? 99 : 0,
      }))
      .sort((a, b) => b.netRevenue - a.netRevenue);

    const campaignAttribution = campaigns.map((camp) => {
      const impressions = Math.max(0, Number(camp.impressions || 0));
      const clicks = Math.max(0, Number(camp.clicks || 0));
      const ctrPct = impressions > 0 ? round2((clicks / impressions) * 100) : 0;
      const linkedCode = String(camp.couponCode || "").trim().toUpperCase();
      const couponMatch = linkedCode ? couponMap.get(linkedCode) : null;
      return {
        _id: String(camp._id),
        title: camp.title,
        slot: camp.slot,
        campaignType: camp.campaignType,
        status: camp.status,
        impressions,
        clicks,
        ctrPct,
        couponCode: linkedCode,
        attributedOrders: couponMatch ? couponMatch.redemptions : 0,
        attributedRevenue: couponMatch ? couponMatch.netRevenue : 0,
      };
    });

    res.status(200).json({
      meta: {
        range: windowInfo.range,
        channel,
        bucketUnit: windowInfo.bucketUnit,
        generatedAt: new Date().toISOString(),
      },
      kpis,
      revenueWaterfall,
      inventoryWaterfall,
      conversionFunnel,
      revenueTrend,
      userRegistrationsTrend,
      orderStatusBreakdown,
      channelBreakdown,
      paymentMethodBreakdown,
      categoryBreakdown,
      geographyBreakdown,
      topProducts,
      watchlist: {
        slowMovers: slowMovers.slice(0, 10),
        lowStockAlerts: lowStockAlerts.slice(0, 10),
      },
      campaignAttribution,
      couponPerformance,
    });
  } catch (error) {
    console.error("Error in getDeepAnalytics:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

    const salesSummary = await Order.aggregate([
      { $match: { status: "Delivered" } },
      { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
    ]);
    const totalRevenue = salesSummary.length > 0 ? salesSummary[0].totalRevenue : 0;

    res.status(200).json({
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue,
    });
  } catch (error) {
    console.error("Error in getAnalytics:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getRevenueAnalytics = async (req, res) => {
  try {
    const { range = "7d" } = req.query;
    const startDate = parseRangeToStartDate(range);

    const rows = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: "Delivered",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          revenue: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const byDay = new Map(rows.map((r) => [r._id, Number(r.revenue || 0)]));
    const out = [];
    const cursor = new Date(startDate);
    const end = new Date();
    cursor.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    while (cursor <= end) {
      const key = formatDateKeyUTC(cursor);
      out.push({ date: key, revenue: byDay.get(key) ?? 0 });
      cursor.setDate(cursor.getDate() + 1);
    }

    res.status(200).json(out);
  } catch (error) {
    console.error("Error in getRevenueAnalytics:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getOrdersByStatus = async (req, res) => {
  try {
    const rows = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json(rows.map((r) => ({ status: r._id, count: r.count })));
  } catch (error) {
    console.error("Error in getOrdersByStatus:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUsersAnalytics = async (req, res) => {
  try {
    const { range = "7d" } = req.query;
    const startDate = parseRangeToStartDate(range);

    const rows = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const byDay = new Map(rows.map((r) => [r._id, Number(r.count || 0)]));
    const out = [];
    const cursor = new Date(startDate);
    const end = new Date();
    cursor.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    while (cursor <= end) {
      const key = formatDateKeyUTC(cursor);
      out.push({ date: key, count: byDay.get(key) ?? 0 });
      cursor.setDate(cursor.getDate() + 1);
    }

    res.status(200).json(out);
  } catch (error) {
    console.error("Error in getUsersAnalytics:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const rows = await Product.aggregate([
      { $group: { _id: "$subCategory", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json(rows.map((r) => ({ category: r._id, count: r.count })));
  } catch (error) {
    console.error("Error in getProductsByCategory:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSentimentAnalytics = async (req, res) => {
  try {
    const [grouped, confidenceAgg, recentReviews, mlStatus] = await Promise.all([
      Review.aggregate([
        { $group: { _id: "$sentiment", count: { $sum: 1 } } },
      ]),
      Review.aggregate([
        { $match: { sentimentConfidence: { $ne: null } } },
        {
          $group: {
            _id: null,
            avgConfidence: { $avg: "$sentimentConfidence" },
          },
        },
      ]),
      Review.find({})
        .populate("userId", "fullName")
        .populate("productId", "name")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      getMlStatus(),
    ]);

    const sentimentBreakdown = {
      positive: 0,
      neutral: 0,
      negative: 0,
    };

    for (const row of grouped) {
      if (sentimentBreakdown[row._id] !== undefined) {
        sentimentBreakdown[row._id] = Number(row.count || 0);
      }
    }

    const totalReviews =
      sentimentBreakdown.positive +
      sentimentBreakdown.neutral +
      sentimentBreakdown.negative;
    const positivityPercentage =
      totalReviews > 0
        ? Math.round(
            ((sentimentBreakdown.positive + 0.5 * sentimentBreakdown.neutral) /
              totalReviews) *
              100
          )
        : 0;
    const averageConfidence =
      confidenceAgg.length > 0 && Number.isFinite(confidenceAgg[0]?.avgConfidence)
        ? Math.round(confidenceAgg[0].avgConfidence * 100)
        : 0;

    res.status(200).json({
      totalReviews,
      sentimentBreakdown,
      positivityPercentage,
      averageConfidence,
      recentReviews,
      mlStatus,
    });
  } catch (error) {
    console.error("Error in getSentimentAnalytics:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
