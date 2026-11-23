import React from "react";

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-[#38131E]/10 animate-pulse">
      <div className="aspect-[9/16] bg-[#38131E]/8" />
      <div className="p-4 space-y-2.5">
        <div className="h-3 w-1/3 bg-[#38131E]/10 rounded" />
        <div className="h-4 w-4/5 bg-[#38131E]/12 rounded" />
        <div className="h-4 w-1/4 bg-[#D4AF63]/30 rounded" />
      </div>
    </div>
  );
}

export default function LoadingSkeleton({ count = 4, className = "" }) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`.trim()}
      aria-busy="true"
      aria-label="Loading items"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
}
