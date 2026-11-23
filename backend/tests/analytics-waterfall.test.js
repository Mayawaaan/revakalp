import test from "node:test";
import assert from "node:assert/strict";
import {
  buildRevenueWaterfall,
  buildInventoryWaterfall,
  buildConversionFunnel,
  computeDeltaPct,
  resolveDateWindow,
} from "../src/lib/analyticsMath.js";

test("buildRevenueWaterfall satisfies exact accounting balance and excludes PendingPayment", () => {
  const orders = [
    {
      status: "Delivered",
      items: [{ price: 8000, originalPrice: 10000, quantity: 1 }],
      subtotal: 8000,
      discount: 800,
      deliveryFee: 200,
      total: 7400,
    },
    {
      status: "Shipped",
      items: [{ price: 5000, originalPrice: 5000, quantity: 2 }],
      subtotal: 10000,
      discount: 0,
      deliveryFee: 0,
      total: 10000,
    },
    {
      status: "Cancelled",
      items: [{ price: 3000, originalPrice: 3500, quantity: 1 }],
      subtotal: 3000,
      discount: 300,
      deliveryFee: 100,
      total: 2800,
    },
    {
      status: "Returned",
      items: [{ price: 4000, quantity: 1 }],
      subtotal: 4000,
      discount: 0,
      deliveryFee: 0,
      total: 4000,
    },
    {
      status: "PendingPayment",
      items: [{ price: 9999, quantity: 1 }],
      subtotal: 9999,
      discount: 0,
      deliveryFee: 0,
      total: 9999,
    },
  ];

  const { steps, summary } = buildRevenueWaterfall(orders);

  assert.equal(summary.pendingPaymentCount, 1);
  assert.equal(summary.pendingPaymentValue, 9999);
  assert.equal(summary.realizedDelivered, 7400);
  assert.equal(summary.inFlightPipeline, 10000);
  assert.equal(summary.netRevenue, 17400);
  assert.equal(summary.cancelledLoss, 2800);
  assert.equal(summary.returnedLoss, 4000);

  const reconciled =
    summary.grossGmv -
    summary.catalogDiscounts -
    summary.couponDiscounts +
    summary.shippingFees -
    summary.cancelledLoss -
    summary.returnedLoss;
  assert.ok(Math.abs(reconciled - summary.netRevenue) < 0.01);

  assert.equal(steps.length, 7);
  assert.equal(steps[0].key, "gross_gmv");
  assert.equal(steps[steps.length - 1].key, "net_revenue");
  assert.equal(steps[steps.length - 1].runningTotal, summary.netRevenue);
});

test("buildRevenueWaterfall handles empty orders cleanly", () => {
  const { steps, summary } = buildRevenueWaterfall([]);
  assert.equal(summary.grossGmv, 0);
  assert.equal(summary.netRevenue, 0);
  assert.equal(steps.every((s) => s.barValue === 0 && s.runningTotal === 0), true);
});

test("buildInventoryWaterfall satisfies exact unit balance invariant", () => {
  const products = [
    { status: "active", stock: 20, reserved: 3, price: 5000, discountedPrice: 4500 },
    { status: "active", stock: 2, reserved: 0, price: 3000, discountedPrice: 0 },
    { status: "active", stock: 0, reserved: 0, price: 2000 },
    { status: "archived", stock: 99, reserved: 0, price: 1000 },
  ];

  const movements = [
    { type: "admin_adjustment", quantityDeltaOnHand: 10 },
    { type: "return_restock", quantityDeltaOnHand: 2 },
    { type: "commit_web", quantityDeltaOnHand: -4 },
    { type: "commit_pos", quantityDeltaOnHand: -2 },
    { type: "damage_writeoff", quantityDeltaOnHand: -1 },
  ];

  const { steps, summary } = buildInventoryWaterfall({ products, movements });

  assert.equal(summary.currentOnHand, 22);
  assert.equal(summary.currentReserved, 3);
  assert.equal(summary.currentSellable, 19);
  assert.equal(summary.lowStockCount, 1);
  assert.equal(summary.outOfStockCount, 1);
  assert.equal(summary.totalRetailValue, 20 * 4500 + 2 * 3000);

  const balanced =
    summary.openingStock +
    summary.restocksAdded +
    summary.returnRestocks -
    summary.webSoldUnits -
    summary.posSoldUnits -
    summary.writeoffsAndAdj -
    summary.currentReserved;

  assert.equal(balanced, summary.currentSellable);
  assert.equal(steps[steps.length - 1].runningTotal, summary.currentSellable);
});

test("buildConversionFunnel computes safe conversion percentages without NaN or Infinity", () => {
  const stages = buildConversionFunnel({
    eventCounts: { view_item_list: 100, view_item: 50, add_to_cart: 10 },
    wishlistAddsCount: 20,
    activeCartItemsCount: 15,
    totalOrdersIncludingPending: 8,
    submittedOrdersCount: 6,
    deliveredOrdersCount: 4,
  });

  assert.equal(stages.length, 7);
  assert.equal(stages[0].count, 100);
  assert.equal(stages[0].stepConversionPct, null);
  assert.equal(stages[1].count, 50);
  assert.equal(stages[1].stepConversionPct, 50);
  assert.equal(stages[1].dropOffPct, 50);
  // Hybrid DB counts take max over lower event telemetry
  assert.equal(stages[2].count, 20);
  assert.equal(stages[3].count, 15);
  assert.equal(stages[6].cumulativeConversionPct, 4);

  const zeroFirst = buildConversionFunnel({});
  assert.equal(zeroFirst[1].stepConversionPct, null);
  assert.equal(Number.isNaN(zeroFirst[6].cumulativeConversionPct), false);
});

test("resolveDateWindow and computeDeltaPct handle all ranges and zero baselines", () => {
  const now = new Date("2026-11-23T12:00:00.000Z");
  for (const r of ["7d", "30d", "90d", "12m", "all"]) {
    const win = resolveDateWindow(r, now);
    assert.equal(win.range, r);
    if (r === "all") {
      assert.equal(win.startDate, null);
      assert.equal(win.prevStartDate, null);
      assert.equal(win.bucketUnit, "month");
    } else {
      assert.ok(win.startDate instanceof Date);
      assert.ok(win.prevStartDate < win.startDate);
    }
  }

  assert.equal(computeDeltaPct(150, 100), 50);
  assert.equal(computeDeltaPct(50, 100), -50);
  assert.equal(computeDeltaPct(10, 0), 100);
  assert.equal(computeDeltaPct(0, 0), 0);
  assert.equal(computeDeltaPct(10, null), null);
});
