import React from "react";
import ProductCard from "./ProductCard";
import LoadingSkeleton from "./LoadingSkeleton";
import EmptyState from "./EmptyState";

export default function ProductGrid({
  products = [],
  loading = false,
  columnsClass = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  emptyProps,
  onQuickView,
}) {
  if (loading) {
    return <LoadingSkeleton count={8} />;
  }

  if (!products.length) {
    return <EmptyState {...emptyProps} />;
  }

  return (
    <div className={`grid ${columnsClass} gap-6 sm:gap-7`}>
      {products.map((product) => (
        <ProductCard
          key={product._id || product.id}
          id={product._id || product.id}
          onQuickView={onQuickView}
          {...product}
        />
      ))}
    </div>
  );
}
