import React from "react";
import useStore from "../../store/store";
import ProductItem from "../products/ProductItem";

const BestSeller = () => {
  const { products } = useStore();

  const bestSellers = products.filter(
    (product) =>
      product.bestseller === true &&
      product.stock !== null &&
      product.stock !== undefined &&
      product.stock > 0
  );

  if (!bestSellers.length) return null;

  return (
    <section className="relative bg-gradient-to-br from-[#fffafc] via-[#fff1f4] to-[#ffe6ee] py-28 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-8">

        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <p className="uppercase tracking-[0.35em] text-xs text-pink-600 mb-4">
            Customer Favorites
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-pink-900">
            Best Sellers
          </h2>
          <p className="mt-6 text-pink-700 text-lg leading-relaxed">
            Our most loved sarees — chosen again and again for their
            craftsmanship, elegance, and timeless appeal.
          </p>
        </div>

        {/* Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {bestSellers.map((product) => (
            <ProductItem
              key={product._id}
              id={product._id}
              {...product}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSeller;