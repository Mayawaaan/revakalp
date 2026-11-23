/**
 * Pure Analytics Math, Waterfall Builders & Conversion Funnel Engine
 * Kept framework/Mongoose-free so all accounting invariants are unit-testable.
 */

export const ALLOWED_ANALYTICS_EVENTS = new Set([
  "view_item_list",
  "select_item",
  "view_item",
  "search",
  "add_to_wishlist",
  "add_to_cart",
  "remove_from_cart",
  "begin_checkout",
  "add_shipping_info",
  "add_payment_info",
  "purchase",
  "refund",
  "stock_unavailable",
  "shop_sale_recorded",
  "lead_contact_started",
]);

const round2 = (n) => Math.round((Number(n || 0) + Number.EPSILON) * 100) / 100;
const round1 = (n) => Math.round((Number(n || 0) + Number.EPSILON) * 10) / 10;

export function resolveDateWindow(range = "30d", now = new Date()) {
  const safe = typeof range === "string" ? range.trim().toLowerCase() : "30d";
  const endDate = new Date(now);

  if (safe === "all") {
    return {
      range: "all",
      startDate: null,
      endDate,
      prevStartDate: null,
      prevEndDate: null,
      bucketUnit: "month",
    };
  }

  let days = 30;
  let bucketUnit = "day";
  let resolvedRange = "30d";

  if (safe === "7d") {
    days = 7;
    resolvedRange = "7d";
  } else if (safe === "30d") {
    days = 30;
    resolvedRange = "30d";
  } else if (safe === "90d") {
    days = 90;
    resolvedRange = "90d";
  } else if (safe === "12m") {
    days = 365;
    bucketUnit = "month";
    resolvedRange = "12m";
  }

  const startDate = new Date(endDate);
  if (resolvedRange === "12m") {
    startDate.setUTCMonth(startDate.getUTCMonth() - 11);
    startDate.setUTCDate(1);
    startDate.setUTCHours(0, 0, 0, 0);
  } else {
    startDate.setUTCDate(startDate.getUTCDate() - (days - 1));
    startDate.setUTCHours(0, 0, 0, 0);
  }

  const spanMs = Math.max(1, endDate.getTime() - startDate.getTime());
  const prevEndDate = new Date(startDate.getTime() - 1);
  const prevStartDate = new Date(prevEndDate.getTime() - spanMs);

  return {
    range: resolvedRange,
    startDate,
    endDate,
    prevStartDate,
    prevEndDate,
    bucketUnit,
  };
}

export function computeDeltaPct(current, previous) {
  if (previous === null || previous === undefined || !Number.isFinite(Number(previous))) {
    return null;
  }
  const cur = Number(current || 0);
  const prev = Number(previous);
  if (cur === 0 && prev === 0) return 0;
  if (prev === 0) return cur > 0 ? 100 : -100;
  return round1(((cur - prev) / Math.abs(prev)) * 100);
}

/**
 * Reconciles each non-PendingPayment order into Gross GMV -> Markdowns -> Coupons
 * -> Shipping -> Cancellations -> Returns -> Net Revenue with exact accounting balance.
 */
export function buildRevenueWaterfall(orders = []) {
  let grossGmv = 0;
  let catalogDiscounts = 0;
  let couponDiscounts = 0;
  let shippingFees = 0;
  let cancelledLoss = 0;
  let returnedLoss = 0;
  let realizedDelivered = 0;
  let inFlightPipeline = 0;
  let pendingPaymentCount = 0;
  let pendingPaymentValue = 0;

  for (const order of orders) {
    if (!order) continue;
    const status = String(order.status || "Processing");
    const orderTotal = Math.max(0, Number(order.total ?? 0));

    if (status === "PendingPayment") {
      pendingPaymentCount += 1;
      pendingPaymentValue += orderTotal;
      continue;
    }

    const items = Array.isArray(order.items) ? order.items : [];
    let itemMrpSum = 0;
    let itemSellSum = 0;

    for (const item of items) {
      const qty = Math.max(1, Number(item?.quantity || 1));
      const sellUnit = Math.max(0, Number(item?.price || 0));
      const origUnit = Math.max(sellUnit, Number(item?.originalPrice ?? sellUnit));
      itemSellSum += sellUnit * qty;
      itemMrpSum += origUnit * qty;
    }

    const subtotal =
      order.subtotal !== undefined && order.subtotal !== null && Number.isFinite(Number(order.subtotal))
        ? Math.max(0, Number(order.subtotal))
        : itemSellSum > 0
          ? itemSellSum
          : orderTotal;

    const orderGross = Math.max(itemMrpSum, subtotal);
    let orderCatalogDiscount = Math.max(0, orderGross - subtotal);
    const orderCouponDiscount = Math.max(0, Number(order.discount || 0));
    let orderDeliveryFee = Math.max(0, Number(order.deliveryFee || 0));

    const expectedTotal = orderGross - orderCatalogDiscount - orderCouponDiscount + orderDeliveryFee;
    const diff = orderTotal - expectedTotal;
    if (diff < -0.001) {
      orderCatalogDiscount += Math.abs(diff);
    } else if (diff > 0.001) {
      orderDeliveryFee += diff;
    }

    grossGmv += orderGross;
    catalogDiscounts += orderCatalogDiscount;
    couponDiscounts += orderCouponDiscount;
    shippingFees += orderDeliveryFee;

    if (status === "Cancelled") {
      cancelledLoss += orderTotal;
    } else if (status === "Returned") {
      returnedLoss += orderTotal;
    } else if (status === "Delivered") {
      realizedDelivered += orderTotal;
    } else {
      inFlightPipeline += orderTotal;
    }
  }

  grossGmv = round2(grossGmv);
  catalogDiscounts = round2(catalogDiscounts);
  couponDiscounts = round2(couponDiscounts);
  shippingFees = round2(shippingFees);
  cancelledLoss = round2(cancelledLoss);
  returnedLoss = round2(returnedLoss);
  realizedDelivered = round2(realizedDelivered);
  inFlightPipeline = round2(inFlightPipeline);
  pendingPaymentValue = round2(pendingPaymentValue);

  const netRevenue = round2(
    grossGmv - catalogDiscounts - couponDiscounts + shippingFees - cancelledLoss - returnedLoss
  );

  const shareOfGross = (val) => (grossGmv > 0 ? round1((val / grossGmv) * 100) : 0);

  let running = 0;
  const steps = [];

  // 1. Gross GMV (starting pillar)
  running = grossGmv;
  steps.push({
    key: "gross_gmv",
    label: "Gross GMV",
    kind: "total",
    delta: grossGmv,
    base: 0,
    barValue: grossGmv,
    runningTotal: grossGmv,
    shareOfGrossPct: grossGmv > 0 ? 100 : 0,
  });

  // 2. Catalog Markdowns (negative)
  {
    const prev = running;
    running = round2(running - catalogDiscounts);
    steps.push({
      key: "catalog_discounts",
      label: "Catalog Markdowns",
      kind: "negative",
      delta: -catalogDiscounts,
      base: Math.min(prev, running),
      barValue: catalogDiscounts,
      runningTotal: running,
      shareOfGrossPct: shareOfGross(catalogDiscounts),
    });
  }

  // 3. Coupon Discounts (negative)
  {
    const prev = running;
    running = round2(running - couponDiscounts);
    steps.push({
      key: "coupon_discounts",
      label: "Coupon Discounts",
      kind: "negative",
      delta: -couponDiscounts,
      base: Math.min(prev, running),
      barValue: couponDiscounts,
      runningTotal: running,
      shareOfGrossPct: shareOfGross(couponDiscounts),
    });
  }

  // 4. Shipping & Fees (positive)
  {
    const prev = running;
    running = round2(running + shippingFees);
    steps.push({
      key: "shipping_fees",
      label: "Shipping & Fees",
      kind: "positive",
      delta: shippingFees,
      base: Math.min(prev, running),
      barValue: shippingFees,
      runningTotal: running,
      shareOfGrossPct: shareOfGross(shippingFees),
    });
  }

  // 5. Cancelled Orders (negative)
  {
    const prev = running;
    running = round2(running - cancelledLoss);
    steps.push({
      key: "cancelled_orders",
      label: "Cancelled Orders",
      kind: "negative",
      delta: -cancelledLoss,
      base: Math.min(prev, running),
      barValue: cancelledLoss,
      runningTotal: running,
      shareOfGrossPct: shareOfGross(cancelledLoss),
    });
  }

  // 6. Returns & Refunds (negative)
  {
    const prev = running;
    running = round2(running - returnedLoss);
    steps.push({
      key: "returned_orders",
      label: "Returns & Refunds",
      kind: "negative",
      delta: -returnedLoss,
      base: Math.min(prev, running),
      barValue: returnedLoss,
      runningTotal: running,
      shareOfGrossPct: shareOfGross(returnedLoss),
    });
  }

  // 7. Net Revenue (ending subtotal pillar)
  steps.push({
    key: "net_revenue",
    label: "Net Revenue",
    kind: "subtotal",
    delta: netRevenue,
    base: 0,
    barValue: Math.max(0, netRevenue),
    runningTotal: netRevenue,
    shareOfGrossPct: shareOfGross(netRevenue),
  });

  return {
    steps,
    summary: {
      grossGmv,
      catalogDiscounts,
      couponDiscounts,
      shippingFees,
      cancelledLoss,
      returnedLoss,
      netRevenue,
      realizedDelivered,
      inFlightPipeline,
      pendingPaymentCount,
      pendingPaymentValue,
    },
  };
}

/**
 * Computes unit flow waterfall from Opening Stock -> Restocks -> Sales/Writeoffs -> Reserved -> Sellable.
 */
export function buildInventoryWaterfall({ products = [], movements = [] }) {
  let currentOnHand = 0;
  let currentReserved = 0;
  let currentSellable = 0;
  let totalRetailValue = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;

  for (const product of products) {
    if (!product || product.status === "archived") continue;
    const stock = Math.max(0, Number(product.stock || 0));
    const reserved = Math.max(0, Number(product.reserved || 0));
    const sellable = Math.max(0, stock - reserved);
    const effectivePrice =
      Number(product.discountedPrice) > 0 && Number(product.discountedPrice) < Number(product.price || 0)
        ? Number(product.discountedPrice)
        : Number(product.price || 0);

    currentOnHand += stock;
    currentReserved += reserved;
    currentSellable += sellable;
    totalRetailValue += stock * Math.max(0, effectivePrice);

    if (sellable <= 0) {
      outOfStockCount += 1;
    } else if (sellable <= 3) {
      lowStockCount += 1;
    }
  }

  // Account for any over-reserved discrepancy cleanly
  const unreservedAdjustment = currentOnHand - currentReserved - currentSellable;
  const effectiveReserved = currentReserved + unreservedAdjustment;

  let restocksAdded = 0;
  let returnRestocks = 0;
  let webSoldUnits = 0;
  let posSoldUnits = 0;
  let writeoffsAndAdj = 0;

  for (const mv of movements) {
    if (!mv) continue;
    const delta = Number(mv.quantityDeltaOnHand || 0);
    switch (mv.type) {
      case "admin_adjustment":
        if (delta > 0) restocksAdded += delta;
        else if (delta < 0) writeoffsAndAdj += Math.abs(delta);
        break;
      case "return_restock":
        if (delta > 0) returnRestocks += delta;
        break;
      case "commit_web":
        webSoldUnits += Math.abs(delta);
        break;
      case "commit_pos":
        posSoldUnits += Math.abs(delta);
        break;
      case "damage_writeoff":
        writeoffsAndAdj += Math.abs(delta);
        break;
      default:
        break;
    }
  }

  const netMovement = restocksAdded + returnRestocks - webSoldUnits - posSoldUnits - writeoffsAndAdj;
  let openingStock = currentOnHand - netMovement;
  if (openingStock < 0) {
    restocksAdded += Math.abs(openingStock);
    openingStock = 0;
  }

  const shareBase = Math.max(openingStock + restocksAdded + returnRestocks, currentOnHand, 1);
  const pctOfBase = (u) => round1((u / shareBase) * 100);

  let running = openingStock;
  const steps = [
    {
      key: "opening_stock",
      label: "Opening Stock",
      kind: "total",
      delta: openingStock,
      base: 0,
      barValue: openingStock,
      runningTotal: openingStock,
      shareOfGrossPct: pctOfBase(openingStock),
    },
  ];

  const pushPositive = (key, label, val) => {
    const prev = running;
    running += val;
    steps.push({
      key,
      label,
      kind: "positive",
      delta: val,
      base: prev,
      barValue: val,
      runningTotal: running,
      shareOfGrossPct: pctOfBase(val),
    });
  };

  const pushNegative = (key, label, val) => {
    const prev = running;
    running -= val;
    steps.push({
      key,
      label,
      kind: "negative",
      delta: -val,
      base: Math.min(prev, running),
      barValue: val,
      runningTotal: running,
      shareOfGrossPct: pctOfBase(val),
    });
  };

  pushPositive("stock_intake", "Stock Intake", restocksAdded);
  pushPositive("return_restocks", "Return Restocks", returnRestocks);
  pushNegative("web_sales", "Web Sales", webSoldUnits);
  pushNegative("pos_sales", "Boutique POS", posSoldUnits);
  pushNegative("writeoffs_adj", "Write-offs & Adj", writeoffsAndAdj);
  pushNegative("reserved_holds", "Reserved Holds", effectiveReserved);

  steps.push({
    key: "sellable_stock",
    label: "Sellable Stock",
    kind: "subtotal",
    delta: currentSellable,
    base: 0,
    barValue: currentSellable,
    runningTotal: currentSellable,
    shareOfGrossPct: pctOfBase(currentSellable),
  });

  return {
    steps,
    summary: {
      openingStock,
      restocksAdded,
      returnRestocks,
      webSoldUnits,
      posSoldUnits,
      writeoffsAndAdj,
      currentOnHand,
      currentReserved: effectiveReserved,
      currentSellable,
      totalRetailValue: round2(totalRetailValue),
      lowStockCount,
      outOfStockCount,
    },
  };
}

/**
 * Combines DPDPA storefront telemetry with authoritative DB counts for an actionable funnel.
 */
export function buildConversionFunnel({
  eventCounts = {},
  wishlistAddsCount = 0,
  activeCartItemsCount = 0,
  totalOrdersIncludingPending = 0,
  submittedOrdersCount = 0,
  deliveredOrdersCount = 0,
}) {
  const catalogBrowses = Number(eventCounts.view_item_list || 0) + Number(eventCounts.search || 0);
  const productViews = Number(eventCounts.view_item || 0);
  const wishlistSaves = Math.max(Number(eventCounts.add_to_wishlist || 0), Number(wishlistAddsCount || 0));
  const addedToCart = Math.max(Number(eventCounts.add_to_cart || 0), Number(activeCartItemsCount || 0));
  const checkoutStarted = Math.max(
    Number(eventCounts.begin_checkout || 0),
    Number(totalOrdersIncludingPending || 0)
  );
  const ordersPlaced = Math.max(0, Number(submittedOrdersCount || 0));
  const ordersDelivered = Math.max(0, Number(deliveredOrdersCount || 0));

  const rawStages = [
    { key: "catalog_browses", label: "Catalog Browses", count: catalogBrowses, source: "telemetry" },
    { key: "product_views", label: "Product Views", count: productViews, source: "telemetry" },
    { key: "wishlist_saves", label: "Wishlist Saves", count: wishlistSaves, source: "hybrid" },
    { key: "added_to_cart", label: "Added to Cart", count: addedToCart, source: "hybrid" },
    { key: "checkout_started", label: "Checkout Started", count: checkoutStarted, source: "hybrid" },
    { key: "orders_placed", label: "Orders Placed", count: ordersPlaced, source: "orders_db" },
    { key: "orders_delivered", label: "Orders Delivered", count: ordersDelivered, source: "orders_db" },
  ];

  const firstNonZeroStage = rawStages.find((s) => s.count > 0);
  const anchorCount = firstNonZeroStage ? firstNonZeroStage.count : 0;

  return rawStages.map((stage, idx) => {
    const prevCount = idx > 0 ? rawStages[idx - 1].count : null;
    let stepConversionPct = null;
    let dropOffCount = 0;
    let dropOffPct = null;

    if (idx > 0 && prevCount !== null && prevCount > 0) {
      stepConversionPct = round1((stage.count / prevCount) * 100);
      dropOffCount = Math.max(0, prevCount - stage.count);
      dropOffPct = round1((dropOffCount / prevCount) * 100);
    }

    const cumulativeConversionPct =
      anchorCount > 0 ? round1((stage.count / anchorCount) * 100) : 0;

    return {
      ...stage,
      stepConversionPct,
      dropOffCount,
      dropOffPct,
      cumulativeConversionPct,
    };
  });
}
