import React from "react";
import useStore from "../../store/store";

export default function Price({
  price,
  discountedPrice,
  discount = 0,
  size = "md",
  showSavings = false,
  className = "",
}) {
  const currency = useStore((s) => s.currency || s.settings?.currencySymbol || "₹");
  const mrp = Number(price) || 0;
  const rawDiscounted = Number(discountedPrice);
  const computedDiscounted =
    Number.isFinite(rawDiscounted) && rawDiscounted > 0 && rawDiscounted < mrp
      ? Math.round(rawDiscounted)
      : Number(discount) > 0 && mrp > 0
      ? Math.round(mrp - (mrp * Number(discount)) / 100)
      : mrp;

  const hasDiscount = computedDiscounted > 0 && computedDiscounted < mrp;
  const savings = hasDiscount ? mrp - computedDiscounted : 0;

  const sizeMap = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl md:text-3xl",
  };

  return (
    <div className={`inline-flex items-baseline flex-wrap gap-2 ${className}`.trim()}>
      <span className={`font-semibold text-[#38131E] ${sizeMap[size] || sizeMap.md}`}>
        {currency}
        {computedDiscounted.toLocaleString("en-IN")}
      </span>

      {hasDiscount && (
        <span className="text-xs sm:text-sm text-[#1A1718]/45 line-through">
          {currency}
          {mrp.toLocaleString("en-IN")}
        </span>
      )}

      {showSavings && hasDiscount && (
        <span className="text-xs font-medium text-[#38131E] bg-[#D4AF63]/25 px-2.5 py-0.5 rounded-full">
          Save {currency}
          {savings.toLocaleString("en-IN")}
        </span>
      )}
    </div>
  );
}
