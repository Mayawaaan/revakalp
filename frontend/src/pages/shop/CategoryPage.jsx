import React from "react";
import { Link } from "react-router-dom";
import useStore from "../../store/store";

const CategoryPage = () => {
  const { collections } = useStore();

  if (!collections?.length) return null;

  return (
    <section className="relative bg-gradient-to-br from-[#fffafc] via-[#fff1f4] to-[#ffe6ee] py-28 overflow-hidden">

      {/* Background glow */}
      <div className="absolute -top-40 left-24 w-[480px] h-[480px] bg-pink-200 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute -bottom-40 right-24 w-[520px] h-[520px] bg-rose-300 rounded-full blur-3xl opacity-30"></div>

      <div className="relative max-w-7xl mx-auto px-8">

        {/* Section Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <p className="uppercase tracking-[0.35em] text-xs text-pink-600 mb-4">
            Explore
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-pink-900">
            Our Collections
          </h1>
          <p className="mt-6 text-pink-700 text-lg leading-relaxed">
            Thoughtfully curated saree collections inspired by regional
            traditions, occasions, and timeless elegance.
          </p>
        </div>

        {/* Collection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
          {collections.map((collection) => (
            <Link
              to={`/shop/${collection.id}`}
              key={collection.id}
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-3xl shadow-xl bg-white">

                {/* Image */}
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-80"></div>

                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-2xl text-white mb-2">
                    {collection.name}
                  </h3>
                  <p className="text-pink-200 text-sm leading-relaxed">
                    {collection.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CategoryPage;
