/**
 * Pure formatting, theme-aware Recharts palettes, and CSV export helpers
 * for Admin Deep Analytics.
 */

export function formatInr(amount, compact = false) {
  const num = Number(amount || 0);
  if (!Number.isFinite(num)) return "₹0";
  const sign = num < 0 ? "-" : "";
  const abs = Math.abs(num);

  if (compact) {
    if (abs >= 1e7) return `${sign}₹${(abs / 1e7).toFixed(2)}Cr`;
    if (abs >= 1e5) return `${sign}₹${(abs / 1e5).toFixed(2)}L`;
    if (abs >= 1e3) return `${sign}₹${(abs / 1e3).toFixed(1)}K`;
    return `${sign}₹${Math.round(abs).toLocaleString("en-IN")}`;
  }

  return `${sign}₹${Math.round(abs).toLocaleString("en-IN")}`;
}

export function formatNumber(val) {
  const num = Number(val || 0);
  if (!Number.isFinite(num)) return "0";
  return Math.round(num).toLocaleString("en-IN");
}

export function formatPct(val) {
  if (val === null || val === undefined || !Number.isFinite(Number(val))) return "—";
  return `${Number(val).toFixed(1)}%`;
}

const SCHEME_LIGHT_BASES = {
  "royal-burgundy": {
    primary: "#38131E",
    secondary: "#7B2840",
    accent: "#B8893A",
    subtotal: "#5A1F31",
    grid: "#E8DEC8",
    axisTick: "#38131E",
    tooltipBg: "#F7F1E5",
    tooltipBorder: "#D4AF63",
    tooltipText: "#38131E",
  },
  "emerald-banaras": {
    primary: "#0F3B2E",
    secondary: "#1F634F",
    accent: "#B68D36",
    subtotal: "#154F3E",
    grid: "#DDE4D7",
    axisTick: "#0F3B2E",
    tooltipBg: "#F3F5EE",
    tooltipBorder: "#CFA653",
    tooltipText: "#0F3B2E",
  },
  "indigo-jaipur": {
    primary: "#1B2948",
    secondary: "#334D84",
    accent: "#B98A32",
    subtotal: "#263B67",
    grid: "#DCE0E8",
    axisTick: "#1B2948",
    tooltipBg: "#F4F2EC",
    tooltipBorder: "#D3A34E",
    tooltipText: "#1B2948",
  },
  "saffron-udaipur": {
    primary: "#7C2D12",
    secondary: "#B45309",
    accent: "#D99226",
    subtotal: "#9A3412",
    grid: "#EAD8C3",
    axisTick: "#7C2D12",
    tooltipBg: "#FAF3E8",
    tooltipBorder: "#D99226",
    tooltipText: "#7C2D12",
  },
  "peacock-kanchipuram": {
    primary: "#0D444D",
    secondary: "#1B6B78",
    accent: "#B88432",
    subtotal: "#135863",
    grid: "#D4E5E3",
    axisTick: "#0D444D",
    tooltipBg: "#EFF5F4",
    tooltipBorder: "#C89643",
    tooltipText: "#0D444D",
  },
  "jamuni-mysore": {
    primary: "#3D1946",
    secondary: "#6C2F7D",
    accent: "#B8863B",
    subtotal: "#532360",
    grid: "#E4D8E7",
    axisTick: "#3D1946",
    tooltipBg: "#F6F1F6",
    tooltipBorder: "#CFA158",
    tooltipText: "#3D1946",
  },
  "rose-chanderi": {
    primary: "#6B2238",
    secondary: "#9D3E5B",
    accent: "#B3744F",
    subtotal: "#842B46",
    grid: "#EBD5DA",
    axisTick: "#6B2238",
    tooltipBg: "#FAF1F2",
    tooltipBorder: "#C98F6B",
    tooltipText: "#6B2238",
  },
  "sandalwood-maheshwar": {
    primary: "#4A2F1D",
    secondary: "#7A5236",
    accent: "#B08030",
    subtotal: "#613F28",
    grid: "#E3D6C3",
    axisTick: "#4A2F1D",
    tooltipBg: "#F5EFE6",
    tooltipBorder: "#C49545",
    tooltipText: "#4A2F1D",
  },
  "obsidian-kashi": {
    primary: "#1C1C1F",
    secondary: "#4B4B52",
    accent: "#A8843B",
    subtotal: "#323238",
    grid: "#DDDAD3",
    axisTick: "#1C1C1F",
    tooltipBg: "#F4F3F0",
    tooltipBorder: "#C7A763",
    tooltipText: "#1C1C1F",
  },
};

const SCHEME_DARK_BASES = {
  "royal-burgundy": {
    primary: "#F1D889",
    secondary: "#D98A9F",
    accent: "#D4AF63",
    subtotal: "#E4C16E",
    grid: "rgba(241, 216, 137, 0.16)",
    axisTick: "#EEDCC5",
    tooltipBg: "#210E14",
    tooltipBorder: "#D4AF63",
    tooltipText: "#F7F1E5",
  },
  "emerald-banaras": {
    primary: "#E6C77A",
    secondary: "#6EE7B7",
    accent: "#CFA653",
    subtotal: "#9FE3C8",
    grid: "rgba(207, 166, 83, 0.16)",
    axisTick: "#E6ECE3",
    tooltipBg: "#0F221C",
    tooltipBorder: "#CFA653",
    tooltipText: "#F3F5EE",
  },
  "indigo-jaipur": {
    primary: "#E8C374",
    secondary: "#93B4F5",
    accent: "#D3A34E",
    subtotal: "#B6CBFA",
    grid: "rgba(211, 163, 78, 0.16)",
    axisTick: "#E6E9F2",
    tooltipBg: "#121C32",
    tooltipBorder: "#D3A34E",
    tooltipText: "#F4F2EC",
  },
  "saffron-udaipur": {
    primary: "#F8CF76",
    secondary: "#F59E0B",
    accent: "#E6A63C",
    subtotal: "#FCD34D",
    grid: "rgba(230, 166, 60, 0.16)",
    axisTick: "#F6E7D4",
    tooltipBg: "#23120C",
    tooltipBorder: "#E6A63C",
    tooltipText: "#F8EFE2",
  },
  "peacock-kanchipuram": {
    primary: "#F2D88E",
    secondary: "#5EEAD4",
    accent: "#D9AA56",
    subtotal: "#99F6E4",
    grid: "rgba(217, 170, 86, 0.16)",
    axisTick: "#E2EFF1",
    tooltipBg: "#0E2227",
    tooltipBorder: "#D9AA56",
    tooltipText: "#EAF3F4",
  },
  "jamuni-mysore": {
    primary: "#F4DC9C",
    secondary: "#D8B4FE",
    accent: "#DEB268",
    subtotal: "#E9D5FF",
    grid: "rgba(222, 178, 104, 0.16)",
    axisTick: "#EDE2F0",
    tooltipBg: "#1D0F24",
    tooltipBorder: "#DEB268",
    tooltipText: "#F3ECF5",
  },
  "rose-chanderi": {
    primary: "#F2C9AE",
    secondary: "#FDA4AF",
    accent: "#DBA07B",
    subtotal: "#FECDD3",
    grid: "rgba(219, 160, 123, 0.16)",
    axisTick: "#F2E2E5",
    tooltipBg: "#231017",
    tooltipBorder: "#DBA07B",
    tooltipText: "#F7ECEE",
  },
  "sandalwood-maheshwar": {
    primary: "#EFD28C",
    secondary: "#D6B28B",
    accent: "#D6A856",
    subtotal: "#E6CBA8",
    grid: "rgba(214, 168, 86, 0.16)",
    axisTick: "#EDE3D4",
    tooltipBg: "#1F1710",
    tooltipBorder: "#D6A856",
    tooltipText: "#F3ECE1",
  },
  "obsidian-kashi": {
    primary: "#F1D99C",
    secondary: "#CBD5E1",
    accent: "#D8B870",
    subtotal: "#E2E8F0",
    grid: "rgba(216, 184, 112, 0.18)",
    axisTick: "#ECEBE6",
    tooltipBg: "#141417",
    tooltipBorder: "#D8B870",
    tooltipText: "#F2F1ED",
  },
};

export function getAnalyticsChartPalette(scheme = "royal-burgundy", isDarkMode = false) {
  const map = isDarkMode ? SCHEME_DARK_BASES : SCHEME_LIGHT_BASES;
  const base = map[scheme] || map["royal-burgundy"];

  return {
    ...base,
    positive: isDarkMode ? "#34D399" : "#15803D",
    negative: isDarkMode ? "#F87171" : "#B91C1C",
    neutral: isDarkMode ? "#FBBF24" : "#B45309",
    piePalette: [
      base.primary,
      base.accent,
      base.secondary,
      isDarkMode ? "#34D399" : "#15803D",
      isDarkMode ? "#94A3B8" : "#64748B",
    ],
  };
}

function escapeCsvCell(value) {
  const str = String(value ?? "");
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportDeepAnalyticsCsv(deepData, { range = "30d", channel = "all" } = {}) {
  if (!deepData || typeof document === "undefined") return;

  const lines = [];
  const pushRow = (cells) => lines.push(cells.map(escapeCsvCell).join(","));

  pushRow(["Revakalp Executive Deep Analytics Report"]);
  pushRow(["Range", range, "Channel", channel, "Generated At", deepData.meta?.generatedAt || new Date().toISOString()]);
  pushRow([]);

  const kpis = deepData.kpis || {};
  pushRow(["KPI SUMMARY"]);
  pushRow(["Metric", "Value", "Delta vs Prior Period (%)"]);
  pushRow(["Net Revenue (INR)", kpis.netRevenue ?? 0, kpis.deltas?.netRevenuePct ?? ""]);
  pushRow(["Gross GMV (INR)", kpis.grossGmv ?? 0, kpis.deltas?.grossGmvPct ?? ""]);
  pushRow(["Realized Delivered Revenue (INR)", kpis.realizedDelivered ?? 0, ""]);
  pushRow(["In-Flight Pipeline Revenue (INR)", kpis.inFlightPipeline ?? 0, ""]);
  pushRow(["Submitted Orders", kpis.totalOrders ?? 0, kpis.deltas?.ordersPct ?? ""]);
  pushRow(["Delivered Orders", kpis.deliveredOrders ?? 0, ""]);
  pushRow(["Average Order Value (INR)", kpis.aov ?? 0, kpis.deltas?.aovPct ?? ""]);
  pushRow(["Fulfillment Rate (%)", kpis.fulfillmentRatePct ?? 0, ""]);
  pushRow(["Repeat Buyers (%)", kpis.repeatCustomerRatePct ?? 0, ""]);
  pushRow(["Discount Burn (%)", kpis.discountBurnPct ?? 0, ""]);
  pushRow(["Cancellation & Return Rate (%)", kpis.cancellationAndReturnRatePct ?? 0, ""]);
  pushRow([]);

  pushRow(["REVENUE WATERFALL (INR)"]);
  pushRow(["Step", "Type", "Delta", "Running Total", "% of Gross GMV"]);
  for (const step of deepData.revenueWaterfall?.steps || []) {
    pushRow([step.label, step.kind, step.delta, step.runningTotal, step.shareOfGrossPct]);
  }
  pushRow([]);

  pushRow(["INVENTORY FLOW WATERFALL (UNITS)"]);
  pushRow(["Step", "Type", "Delta", "Running Total", "% of Pool"]);
  for (const step of deepData.inventoryWaterfall?.steps || []) {
    pushRow([step.label, step.kind, step.delta, step.runningTotal, step.shareOfGrossPct]);
  }
  pushRow([]);

  pushRow(["CATEGORY PERFORMANCE"]);
  pushRow(["Category", "Units Sold", "Net Revenue (INR)", "Gross GMV (INR)", "Share (%)"]);
  for (const cat of deepData.categoryBreakdown || []) {
    pushRow([cat.category, cat.unitsSold, cat.netRevenue, cat.grossGmv, cat.sharePct]);
  }
  pushRow([]);

  pushRow(["TOP SHIPPING STATES"]);
  pushRow(["State", "Orders", "Net Revenue (INR)", "AOV (INR)"]);
  for (const st of deepData.geographyBreakdown?.states || []) {
    pushRow([st.state, st.orders, st.netRevenue, st.aov]);
  }
  pushRow([]);

  pushRow(["TOP PERFORMING PRODUCTS"]);
  pushRow(["Code", "Name", "Category", "Units Sold", "Revenue (INR)", "Sellable Stock"]);
  for (const p of deepData.topProducts || []) {
    pushRow([p.code, p.name, p.category, p.unitsSold, p.revenue, p.sellableStock]);
  }
  pushRow([]);

  pushRow(["CAMPAIGN & AD ATTRIBUTION"]);
  pushRow(["Title", "Slot", "Status", "Impressions", "Clicks", "CTR (%)", "Coupon Code", "Attributed Orders", "Attributed Revenue (INR)"]);
  for (const c of deepData.campaignAttribution || []) {
    pushRow([
      c.title,
      c.slot,
      c.status,
      c.impressions,
      c.clicks,
      c.ctrPct,
      c.couponCode || "",
      c.attributedOrders,
      c.attributedRevenue,
    ]);
  }

  const csvContent = lines.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStamp = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `revakalp-deep-analytics-${range}-${channel}-${dateStamp}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
