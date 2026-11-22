import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import useStore from "../../store/store";
import SectionHeading from "../ui/SectionHeading";
import {
  STOREFRONT_CATEGORIES,
  matchesCategory,
  getProductImage,
} from "../../config/storefrontCategories";

export default function CategoryExpressions() {
  const { products, loading } = useStore();

  return (
    <section
      aria-labelledby="heading-category-expressions"
      className="py-16 sm:py-24 bg-[#F7F1E5] border-b border-[#38131E]/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeading
            eyebrow="Curated Categories"
            title="Find your"
            accentWord="expression"
            align="left"
          />
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#38131E] hover:text-[#2B0E17] border-b border-[#D4AF63] pb-1 self-start md:self-auto"
          >
            View All Collections <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {STOREFRONT_CATEGORIES.map((cat) => {
            const matching = (products || []).filter(
              (p) => Number(p?.stock) > 0 && matchesCategory(p, cat.id)
            );
            const liveImg = matching.length > 0 ? getProductImage(matching[0]) : "";
            const imgSrc = liveImg || cat.fallbackArt;
            const isIllustrative = !liveImg;

            return (
              <Link
                key={cat.id}
                to={cat.route}
                data-reveal="card"
                className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-[#38131E]/12 hover:border-[#D4AF63] shadow-xs hover:shadow-xl transition-all duration-500"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[#2B0E17]/5">
                  <img
                    src={imgSrc}
                    alt={
                      isIllustrative
                        ? `${cat.label} illustrative category artwork`
                        : `${cat.label} featured style`
                    }
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#2B0E17]/75 via-transparent to-transparent opacity-60 group-hover:opacity-75 transition-opacity"
                  />

                  <span className="absolute top-3 left-3 text-[10px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-full bg-[#F7F1E5]/90 text-[#38131E] font-medium">
                    {loading
                      ? "Loading…"
                      : matching.length > 0
                      ? `${matching.length} ${matching.length === 1 ? "style" : "styles"}`
                      : "Explore"}
                  </span>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[#F7F1E5]">
                    <span className="font-serif text-lg sm:text-xl leading-tight">
                      {cat.label}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#F1D889] transform group-hover:translate-x-1 transition-transform shrink-0" />
                  </div>
                </div>

                <div className="px-3.5 py-3 flex items-center justify-between gap-2 bg-white">
                  <span className="text-xs text-[#1A1718]/70 truncate">
                    {matching.length > 0 ? cat.subtitle : "Browse category"}
                  </span>
                  {isIllustrative && (
                    <span className="text-[9px] uppercase tracking-wider text-[#38131E]/45 shrink-0">
                      Art
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
