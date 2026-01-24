import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import useStore from "../../store/store";

const SubCategoryPage = () => {
  const { category } = useParams();
  const { sareeTypes, suitTypes, kurtaTypes } = useStore();

  let types;
  let heading;

  switch (category) {
    case "saree":
      types = sareeTypes;
      heading = "Saree Traditions";
      break;
    case "suit":
      types = suitTypes;
      heading = "Suit Collections";
      break;
    case "kurta":
      types = kurtaTypes;
      heading = "Kurta Styles";
      break;
    default:
      return <Navigate to="/shop/saree/all" replace />;
  }

  if (!types || types.length === 0) {
    return (
      <section className="py-32 text-center text-pink-700">
        Loading collections…
      </section>
    );
  }

  return (
    <section className="relative bg-gradient-to-br from-[#fffafc] via-[#fff1f4] to-[#ffe6ee] py-28 overflow-hidden">

      {/* Background glow */}
      <div className="absolute -top-40 left-32 w-[480px] h-[480px] bg-pink-200 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute -bottom-40 right-32 w-[520px] h-[520px] bg-rose-300 rounded-full blur-3xl opacity-30"></div>

      <div className="relative max-w-7xl mx-auto px-8">

        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <p className="uppercase tracking-[0.35em] text-xs text-pink-600 mb-4">
            Discover
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-pink-900">
            {heading}
          </h1>
          <p className="mt-6 text-pink-700 leading-relaxed">
            Curated styles that celebrate craftsmanship, comfort, and timeless
            Indian elegance.
          </p>
        </div>

        {/* Types Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
          {types.map((type) => (
            <Link
              key={type.slug}
              to={`/shop/${category}/${type.slug}`}
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-3xl shadow-xl bg-white">

                <img
                  src={type.image}
                  alt={type.name}
                  className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-2xl text-white mb-1">
                    {type.name}
                  </h3>
                </div>

              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SubCategoryPage;
