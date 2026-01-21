import React, { useEffect, useRef, useState } from "react";
import useStore from "../../store/store";
import ProductItem from "./ProductItem";

const RelatedProducts = ({ category, subCategory }) => {
  const products = useStore((state) => state.products);
  const [related, setRelated] = useState([]);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (products.length > 0) {
      const matched = products
        .filter((item) => item.category === category)
        .filter((item) => item.subCategory === subCategory)
        .slice(0, 10);

      setRelated(matched);
    }
  }, [products, category, subCategory]);

  const scrollLeft = () => {
    sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <section className="relative py-28 mt-28 bg-gradient-to-br from-[#fffafc] via-[#fff1f4] to-[#ffe6ee] overflow-hidden">

      {/* Background flow */}
      <div className="absolute -top-32 left-20 w-[500px] h-[500px] bg-pink-200 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute -bottom-40 right-20 w-[600px] h-[600px] bg-rose-300 rounded-full blur-3xl opacity-30"></div>

      <div className="relative max-w-7xl mx-auto px-8">

        {/* Heading */}
        <div className="text-center mb-16">
          <p className="uppercase tracking-[0.35em] text-xs text-pink-600 mb-4">
            Styled For You
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-pink-900">
            You May Also Love
          </h2>
          <p className="mt-5 text-pink-700 max-w-2xl mx-auto leading-relaxed">
            Customers who loved this piece also chose these hand-curated styles.
          </p>

          <span className="inline-block mt-8 bg-white/70 backdrop-blur px-8 py-3 rounded-full shadow text-sm text-pink-700">
            Bestseller picks • Limited availability
          </span>
        </div>

        {/* Carousel */}
        <div className="relative">

          {/* Arrows */}
          <button
            onClick={scrollLeft}
            className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-lg p-3 rounded-full shadow-lg hover:bg-white transition"
          >
            ❮
          </button>

          <button
            onClick={scrollRight}
            className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-lg p-3 rounded-full shadow-lg hover:bg-white transition"
          >
            ❯
          </button>

          <div
            ref={sliderRef}
            className="flex gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-10"
          >
            {related.map((item) => (
              <div
                key={item._id}
                className="snap-start min-w-[240px] sm:min-w-[260px] md:min-w-[280px]"
              >
                <div className="group bg-white/70 backdrop-blur-xl rounded-3xl p-4 shadow-lg hover:shadow-2xl transition duration-500">
                  <div className="overflow-hidden rounded-2xl">
                    <div className="group-hover:scale-105 transition duration-700">
                      <ProductItem
                        id={item._id}
                        name={item.name}
                        price={item.price}
                        image={item.image}
                      />
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <span className="inline-block text-xs tracking-widest uppercase text-pink-600">
                      Recommended
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default RelatedProducts;
