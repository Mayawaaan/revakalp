import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { sareeTypes } from "../../data/sareeTypes";

const SareeTypesPage = () => {
  const { category } = useParams();

  if (category !== "saree") {
    return <Navigate to={`/shop/${category}/all`} />;
  }

  return (
    <section className="relative bg-gradient-to-br from-[#fffafc] via-[#fff1f4] to-[#ffe6ee] py-28 overflow-hidden">

      {/* Soft background glow */}
      <div className="absolute -top-40 left-32 w-[480px] h-[480px] bg-pink-200 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute -bottom-40 right-32 w-[520px] h-[520px] bg-rose-300 rounded-full blur-3xl opacity-30"></div>

      <div className="relative max-w-7xl mx-auto px-8">

        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <p className="uppercase tracking-[0.35em] text-xs text-pink-600 mb-4">
            Discover
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-pink-900">
            Saree Traditions
          </h1>
          <p className="mt-6 text-pink-700 leading-relaxed">
            Explore India’s iconic saree styles — each rooted in regional
            craftsmanship, culture, and timeless elegance.
          </p>
        </div>

        {/* Saree Types */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
          <Link
            to={`/shop/${category}/all`}
            className="group relative"
          >
            <div className="relative overflow-hidden rounded-3xl shadow-xl bg-white">

              {/* Image */}
              <img
                src="/hero.jpg"
                alt="All Sarees"
                className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>

              {/* Text */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-serif text-2xl text-white mb-1">
                  All Sarees
                </h3>
              </div>
            </div>
          </Link>
          {sareeTypes.map((type) => (
            <Link
              to={`/shop/${category}/${type.id}`}
              key={type.id}
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-3xl shadow-xl bg-white">

                {/* Image */}
                <img
                  src={type.image}
                  alt={type.name}
                  className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>

                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-2xl text-white mb-1">
                    {type.name}
                  </h3>
                  {type.psychology && (
                    <p className="text-pink-200 text-sm leading-relaxed">
                      {type.psychology}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SareeTypesPage;
