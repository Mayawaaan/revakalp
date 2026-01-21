import React from "react";
import useStore from "../../store/store";
import ProductItem from "../products/ProductItem";

const LatestCollection = () => {
  const { products } = useStore();

  // Avoid mutating original array
  const latestProducts = [...products]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  if (!latestProducts.length) return null;

  return (
    <section className="relative bg-gradient-to-br from-[#fffafc] via-[#fff1f4] to-[#ffe6ee] py-28 overflow-hidden">

      {/* Background glow */}
      <div className="absolute -top-32 right-24 w-[420px] h-[420px] bg-rose-200 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute -bottom-40 left-24 w-[520px] h-[520px] bg-pink-300 rounded-full blur-3xl opacity-30"></div>

      <div className="relative max-w-7xl mx-auto px-8">

        {/* Section Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <p className="uppercase tracking-[0.35em] text-xs text-pink-600 mb-4">
            Just Arrived
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-pink-900">
            Latest Collection
          </h2>
          <p className="mt-6 text-pink-700 text-lg leading-relaxed">
            Freshly curated sarees showcasing new weaves, colors, and stories —
            created for the season ahead.
          </p>
        </div>

        {/* Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {latestProducts.map((product) => (
            <div
              className="bg-white/70 backdrop-blur-xl rounded-3xl p-4 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition duration-300"
            >
              <ProductItem
                key={product._id}
                id={product._id}
                name={product.name}
                price={product.price}
                image={product.image}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default LatestCollection;
