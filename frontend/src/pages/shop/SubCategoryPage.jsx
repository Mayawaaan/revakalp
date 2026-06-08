import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import useStore from "../../store/store";
import Breadcrums from "../../components/globalComponents/Breadcrums";
import { ArrowRight, ChevronLeft } from "lucide-react";

const SubCategoryPage = () => {
  const { category } = useParams();
  const { sareeTypes, suitTypes, kurtaTypes } = useStore();

  if (category === "indo-western") {
    return <Navigate to={`/shop/indo-western/all`} replace />;
  }

  let types;
  let heading;
  let subheading;

  switch (category) {
    case "saree":
      types = sareeTypes;
      heading = "Saree Traditions";
      subheading = "Explore the rich weaves, prints and draping styles from across India.";
      break;
    case "suit":
      types = suitTypes;
      heading = "Suit Collections";
      subheading = "From classic salwar to contemporary cuts — find your perfect fit.";
      break;
    case "kurta":
      types = kurtaTypes;
      heading = "Kurta Styles";
      subheading = "Effortless everyday elegance with our curated kurta range.";
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
    <section className="relative bg-gradient-to-br from-[#fffafc] via-[#fff1f4] to-[#ffe6ee] min-h-screen overflow-hidden">

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-40 left-32 w-[480px] h-[480px] rounded-full bg-pink-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-32 w-[520px] h-[520px] rounded-full bg-rose-300/30 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20">

        {/* Top nav row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <Breadcrums />
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 bg-white/70 backdrop-blur-sm border border-pink-200 text-pink-700 hover:bg-white hover:border-[#c9487c] text-xs font-medium px-4 py-2 rounded-full shadow-sm transition-all duration-300"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back to Shop
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-14 md:mb-20 max-w-2xl mx-auto">
          <p className="uppercase tracking-[0.35em] text-xs text-pink-500 mb-3 font-medium">
            {category.charAt(0).toUpperCase() + category.slice(1)} Collections
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-pink-900 leading-tight">
            {heading}
          </h1>
          <div className="mt-4 mx-auto w-14 h-0.5 bg-gradient-to-r from-transparent via-[#c9487c] to-transparent rounded-full" />
          <p className="mt-6 text-pink-700 leading-relaxed text-base">
            {subheading}
          </p>
        </div>

        {/* Types grid — same card style as ProductItem for visual consistency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
          {types.map((type) => (
            <Link
              key={type.slug}
              to={`/shop/${category}/${type.slug}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#f5f3ef] shadow-[0_40px_80px_-20px_rgba(110,18,46,0.2),0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-white/50 flex items-end transform transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_60px_120px_-20px_rgba(110,18,46,0.25)] block w-full"
            >
              <img
                src={type.image}
                alt={type.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />

              {/* Rose gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#c9487c]/80 via-transparent to-transparent opacity-40 group-hover:opacity-65 transition-opacity duration-700" />

              {/* Glass info box */}
              <div className="relative z-10 w-full flex justify-between items-end backdrop-blur-2xl bg-white/20 p-5 sm:p-6 m-3 sm:m-4 rounded-[1.5rem] border border-white/40 shadow-[0_30px_60px_-15px_rgba(110,18,46,0.15),inset_0_0_0_1px_rgba(255,255,255,0.2)] group-hover:bg-white/30 transition-all duration-700">
                <div className="flex-1 pr-2">
                  <p className="text-white/80 text-[10px] mb-1.5 uppercase tracking-[0.2em] drop-shadow-sm font-semibold">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </p>
                  <h3 className="font-serif text-xl sm:text-2xl text-white drop-shadow-md leading-tight">
                    {type.name}
                  </h3>
                </div>
                <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 text-white transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 drop-shadow-md shrink-0 mb-1" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SubCategoryPage;
