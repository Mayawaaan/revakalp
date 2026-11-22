/**
 * Server-authoritative pricing & delivery calculation.
 * Never trusts client-submitted unit prices, totals, or discounts.
 */

export function getEffectiveUnitPrice(product) {
  const basePrice = Number(product?.price) || 0;
  const discounted = Number(product?.discountedPrice);
  if (Number.isFinite(discounted) && discounted > 0 && discounted < basePrice) {
    return Math.round(discounted * 100) / 100;
  }
  const discountPct = Number(product?.discount) || 0;
  if (discountPct > 0 && discountPct <= 100) {
    return Math.round((basePrice - (basePrice * discountPct) / 100) * 100) / 100;
  }
  return basePrice;
}

export function calculateOrderTotals({
  cartItems = [],
  productMap,
  discountPercentage = 0,
  settings = {},
  city = "",
}) {
  let mrpSubtotal = 0;
  let effectiveSubtotal = 0;
  const lineItems = [];
  const missingProductIds = [];

  for (const item of cartItems) {
    const pid = item.productId?._id
      ? item.productId._id.toString()
      : item.productId.toString();
    const product = productMap.get(pid);

    if (!product) {
      missingProductIds.push(pid);
      continue;
    }

    const quantity = Math.max(1, Number(item.quantity) || 1);
    const basePrice = Number(product.price) || 0;
    const unitPrice = getEffectiveUnitPrice(product);

    mrpSubtotal += basePrice * quantity;
    effectiveSubtotal += unitPrice * quantity;

    lineItems.push({
      productId: product._id,
      product,
      name: product.name,
      price: unitPrice,
      originalPrice: basePrice,
      size: item.size || "NO_SIZE",
      quantity,
      image: Array.isArray(product.image) ? product.image[0] : product.image,
    });
  }

  const pct = Math.max(0, Math.min(100, Number(discountPercentage) || 0));
  const couponDiscount = Math.round(((effectiveSubtotal * pct) / 100) * 100) / 100;
  const discountedGoodsTotal = Math.max(0, Math.round((effectiveSubtotal - couponDiscount) * 100) / 100);

  const freeShippingThreshold = Number(settings?.freeShippingThreshold ?? 500);
  const configuredDeliveryFee = Number(settings?.deliveryFee ?? 50);
  const isIndore = String(city || "").toLowerCase().trim() === "indore";

  const deliveryFee =
    effectiveSubtotal >= freeShippingThreshold || isIndore
      ? 0
      : configuredDeliveryFee;

  const total = Math.max(0, Math.round((discountedGoodsTotal + deliveryFee) * 100) / 100);
  const totalDiscount = Math.max(0, Math.round((mrpSubtotal - discountedGoodsTotal) * 100) / 100);
  const expectedAmountPaise = Math.round(total * 100);

  return {
    mrpSubtotal: Math.round(mrpSubtotal * 100) / 100,
    subtotal: Math.round(effectiveSubtotal * 100) / 100,
    couponDiscount,
    discount: totalDiscount,
    deliveryFee,
    total,
    expectedAmountPaise,
    currency: "INR",
    lineItems,
    missingProductIds,
  };
}
