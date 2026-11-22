import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import useStore from "../../store/store";
import Breadcrums from "../../components/globalComponents/Breadcrums";
import PageHero from "../../components/globalComponents/PageHero";
import SectionHeading from "../../components/ui/SectionHeading";
import EditorialButton from "../../components/ui/EditorialButton";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";
import {
  STOREFRONT_CATEGORIES,
  matchesCategory,
  getProductImage,
} from "../../config/storefrontCategories";

const CategoryPage = () => {
  const { collections, products, loading } = useStore();

  return (
    <div className="bg-[#F7F1E5] min-h-screen">
      <PageHero
        label="Explore"
        title="Our Collections"
        subtitle="Curated ethnic occasionwear and everyday apparel — discover collections available online and at our Indore retail store."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Breadcrums />
          <EditorialButton to="/shop/all/all" variant="secondary">
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </EditorialButton>
        </div>

        {/* Storefront Core Categories */}
        <section aria-label="Shop by Category">
          <SectionHeading
            eyebrow="Storefront Categories"
            title="Shop by"
            accentWord="Category"
            align="left"
            className="mb-8"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {STOREFRONT_CATEGORIES.map((cat) => {
              const matching = (products || []).filter(
                (p) => Number(p?.stock) > 0 && matchesCategory(p, cat.id)
              );
              const liveImg = matching.length > 0 ? getProductImage(matching[0]) : "";
              const imgSrc = liveImg || cat.fallbackArt;

              return (
                <Link
                  key={cat.id}
                  to={cat.route}
                  className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-white border border-[#38131E]/12 hover:border-[#D4AF63] shadow-xs hover:shadow-xl transition-all duration-500 flex items-end"
                >
                  <img
                    src={imgSrc}
                    alt={liveImg ? cat.label : `${cat.label} illustrative artwork`}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#2B0E17]/85 via-[#2B0E17]/20 to-transparent"
                  />
                  <div className="relative z-10 w-full p-5 flex items-end justify-between gap-2 text-[#F7F1E5]">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#F1D889] mb-1">
                        {matching.length > 0 ? `${matching.length} available` : "Browse category"}
                      </p>
                      <h3 className="font-serif text-2xl leading-tight">{cat.label}</h3>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#F1D889] shrink-0 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Backend-Configured Collections */}
        <section aria-label="Curated Collections">
          <SectionHeading
            eyebrow="From Our Catalog"
            title="Curated"
            accentWord="Collections"
            align="left"
            className="mb-8"
          />

          {loading && !collections?.length ? (
            <LoadingSkeleton count={4} />
          ) : collections?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {collections.map((collection) => (
                <Link
                  to={`/shop/${collection.id}`}
                  key={collection._id || collection.id}
                  className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-white border border-[#38131E]/12 hover:border-[#D4AF63] shadow-xs hover:shadow-xl transition-all duration-500 flex items-end"
                >
                  <img
                    src={collection.image}
                    alt={collection.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#2B0E17]/85 via-[#2B0E17]/25 to-transparent"
                  />
                  <div className="relative z-10 w-full p-5 flex items-end justify-between gap-3 text-[#F7F1E5]">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#F1D889] mb-1">
                        Collection
                      </p>
                      <h3 className="font-serif text-2xl leading-tight">
                        {collection.name}
                      </h3>
                      {collection.description && (
                        <p className="text-xs text-[#F7F1E5]/75 mt-1 line-clamp-2">
                          {collection.description}
                        </p>
                      )}
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#F1D889] shrink-0 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rk-surface-card p-8 text-center">
              <p className="text-sm text-[#1A1718]/75">
                Explore any of the categories above or view our{" "}
                <Link to="/shop/all/all" className="text-[#38131E] font-semibold underline">
                  complete active inventory
                </Link>
                .
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CategoryPage;
