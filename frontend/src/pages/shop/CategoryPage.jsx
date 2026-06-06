import React from "react";
import { Link } from "react-router-dom";
import useStore from "../../store/store";
import Breadcrums from "../../components/globalComponents/Breadcrums";
import { ArrowRight } from "lucide-react";

const CategoryPage = () => {
  const { collections } = useStore();

  if (!collections?.length) return null;

  return (
    <section className="relative bg-gradient-to-br from-[#fffafc] via-[#fff1f4] to-[#ffe6ee] py-12 overflow-hidden">

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
        <Breadcrums />


        {/* Collection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
          {collections.map((collection) => (
            <Link
              to={`/shop/${collection.id}`}
              key={collection.id}
              className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#f5f3ef] shadow-[0_40px_80px_-20px_rgba(110,18,46,0.2),0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-white/50 flex items-end transform transition-all duration-700 hover:-translate-y-6 hover:shadow-[0_60px_120px_-20px_rgba(110,18,46,0.25)] block w-full"
            >
              <img
                src={collection.image}
                alt={collection.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#c9487c]/80 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
              
              <div className="relative z-10 w-full flex justify-between items-end backdrop-blur-2xl bg-white/20 p-5 sm:p-6 lg:p-8 m-3 sm:m-4 rounded-[1.5rem] border border-white/40 shadow-[0_30px_60px_-15px_rgba(110,18,46,0.15),inset_0_0_0_1px_rgba(255,255,255,0.2)] group-hover:bg-white/30 transition-all duration-700">
                <div className="flex-1 pr-2">
                  <p className="text-white/90 text-[10px] sm:text-xs mb-1.5 sm:mb-2 uppercase tracking-[0.2em] drop-shadow-sm font-semibold">
                    Collection
                  </p>
                  <h3 className="font-serif text-xl sm:text-2xl text-white drop-shadow-md leading-tight">
                    {collection.name}
                  </h3>
                </div>
                <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-white transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 drop-shadow-md shrink-0 mb-1" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CategoryPage;
