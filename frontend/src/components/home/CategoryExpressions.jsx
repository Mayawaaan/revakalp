import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import useStore from "../../store/store";
import SectionHeading from "../ui/SectionHeading";
import {
  ACTIVE_STOREFRONT_CATEGORIES,
  MENS_STOREFRONT_CATEGORIES,
  matchesCategory,
  getProductImage,
  getAvailableStock,
} from "../../config/storefrontCategories";

export default function CategoryExpressions() {
  const { products, loading } = useStore();

  const leadCategories = ACTIVE_STOREFRONT_CATEGORIES.slice(0, 2); // Sarees, Lehengas
  const secondaryCategories = ACTIVE_STOREFRONT_CATEGORIES.slice(2); // Indo-Western, Printed Tees

  const renderCategoryTile = (cat, aspectClass) => {
    const matching = (products || []).filter(
      (p) => getAvailableStock(p) > 0 && matchesCategory(p, cat.id)
    );
    const liveImg = matching.length > 0 ? getProductImage(matching[0]) : "";
    const imgSrc = liveImg || cat.fallbackArt;
    const isIllustrative = !liveImg;

    return (
      <Link
        key={cat.id}
        to={cat.route}
        data-reveal="card"
        className={`group relative overflow-hidden rounded-[2px] bg-[#2B0E17] border border-[#38131E]/18 hover:border-[#D4AF63] transition-colors duration-500 flex items-end ${aspectClass}`}
      >
        <img
          src={imgSrc}
          alt={
            isIllustrative
              ? `${cat.label} illustrative category artwork`
              : `${cat.label} featured style`
          }
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-88"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#2B0E17] via-[#2B0E17]/30 to-transparent"
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 border border-[#D4AF63]/0 group-hover:border-[#D4AF63]/50 transition-colors duration-500"
        />

        <div className="relative z-10 w-full p-4 sm:p-6 flex items-end justify-between gap-3 sm:gap-4 text-[#F7F1E5]">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#F1D889]">
              {loading
                ? "Loading…"
                : matching.length > 0
                ? `${matching.length} ${matching.length === 1 ? "piece" : "pieces"}`
                : "Explore"}
            </p>
            <h3 className="font-serif text-2xl sm:text-3xl leading-tight">
              {cat.label}
            </h3>
            <p className="text-xs text-[#F7F1E5]/75 hidden sm:block">
              {cat.subtitle}
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-[#F1D889] shrink-0 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    );
  };

  return (
    <section
      aria-label="Curated Storefront Categories"
      className="py-12 sm:py-24 bg-[#F7F1E5] border-b border-[#38131E]/12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Shop by Style"
            title="Find something"
            accentWord="to love"
            align="left"
          />
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] font-semibold text-[#38131E] hover:text-[#2B0E17] border-b border-[#D4AF63] pb-1 self-start md:self-auto"
          >
            See all collections <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Asymmetric Top Architectural Row: Sarees + Lehengas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          <div className="lg:col-span-7" data-reveal="image">
            {leadCategories[0] &&
              renderCategoryTile(
                leadCategories[0],
                "aspect-[4/4.3] sm:aspect-[16/10] w-full"
              )}
          </div>
          <div className="lg:col-span-5" data-reveal="image">
            {leadCategories[1] &&
              renderCategoryTile(
                leadCategories[1],
                "aspect-[4/4.3] sm:aspect-[16/10] lg:aspect-auto lg:h-full min-h-[260px] sm:min-h-[300px] w-full"
              )}
          </div>
        </div>

        {/* Secondary Duo: Indo-Western & Printed Tees */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {secondaryCategories.map((cat) =>
            renderCategoryTile(cat, "aspect-[4/3] sm:aspect-[16/10] w-full")
          )}
        </div>

        {/* Empty Men's Section Strip: Suits, Kurta Pajama, Jodhpuri */}
        <div className="pt-2 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[11px] uppercase tracking-[0.26em] font-semibold text-[#38131E]/75">
              Men&apos;s Section · Coming Soon
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-5">
            {MENS_STOREFRONT_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={cat.route}
                className="group rounded-[2px] bg-[#2B0E17] border border-[#D4AF63]/30 hover:border-[#F1D889] p-4 sm:p-6 flex items-end justify-between gap-4 transition-colors"
              >
                <div className="space-y-1.5">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#F1D889]">
                    Men&apos;s Section · Coming Soon
                  </p>
                  <h3 className="font-serif text-2xl text-[#F7F1E5] leading-tight">
                    {cat.label}
                  </h3>
                  <p className="text-xs text-[#F7F1E5]/70">{cat.subtitle}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#F1D889] shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
