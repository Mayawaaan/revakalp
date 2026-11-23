import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import useStore from "../../store/store";
import SectionHeading from "../ui/SectionHeading";
import {
  ACTIVE_STOREFRONT_CATEGORIES,
  MENS_STOREFRONT_CATEGORIES,
  matchesCategory,
  getCategoryTileArt,
  getAvailableStock,
} from "../../config/storefrontCategories";

export default function CategoryExpressions() {
  const { products, loading } = useStore();

  const renderCategoryTile = (cat) => {
    const matching = (products || []).filter(
      (p) => getAvailableStock(p) > 0 && matchesCategory(p, cat.id)
    );
    const imgSrc = cat.fallbackArt || getCategoryTileArt(cat.id);

    return (
      <Link
        key={cat.id}
        to={cat.route}
        data-reveal="card"
        className="group relative aspect-[9/16] w-full overflow-hidden rounded-[2px] bg-[#2B0E17] border border-[#38131E]/18 hover:border-[#D4AF63] transition-colors duration-500 flex items-end"
      >
        <img
          src={imgSrc}
          alt={`${cat.label} collection tile`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />

        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#2B0E17]/95 via-[#2B0E17]/45 to-transparent"
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-2.5 sm:inset-3 border border-[#D4AF63]/0 group-hover:border-[#D4AF63]/50 transition-colors duration-500"
        />

        <div className="relative z-10 w-full p-3.5 sm:p-6 flex items-end justify-between gap-2 sm:gap-4 text-[#F7F1E5]">
          <div className="space-y-1 min-w-0">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.22em] text-[#F1D889] truncate">
              {loading
                ? "Loading…"
                : matching.length > 0
                ? `${matching.length} ${matching.length === 1 ? "piece" : "pieces"}`
                : "Explore"}
            </p>
            <h3 className="font-serif text-xl sm:text-3xl leading-tight">
              {cat.label}
            </h3>
            <p className="text-xs text-[#F7F1E5]/75 hidden sm:block">
              {cat.subtitle}
            </p>
          </div>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#F1D889] shrink-0 group-hover:translate-x-1 transition-transform" />
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

        {/* 9:16 Category Tiles: Sarees, Lehengas, Indo-Western */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-6">
          {ACTIVE_STOREFRONT_CATEGORIES.map((cat) => renderCategoryTile(cat))}
        </div>

        {/* Men's Section Strip: Printed Tees, Suits, Kurta Pajama, Jodhpuri */}
        <div className="pt-4 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[11px] uppercase tracking-[0.26em] font-semibold text-[#38131E]/75">
              Men&apos;s Section · Printed Tees &amp; Menswear
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {MENS_STOREFRONT_CATEGORIES.map((cat) => {
              const tileSrc = cat.fallbackArt || getCategoryTileArt(cat.id);
              const matching = !cat.emptySection
                ? (products || []).filter(
                    (p) => getAvailableStock(p) > 0 && matchesCategory(p, cat.id)
                  )
                : [];
              return (
                <Link
                  key={cat.id}
                  to={cat.route}
                  data-reveal="card"
                  className="group relative aspect-[9/16] w-full overflow-hidden rounded-[2px] bg-[#2B0E17] border border-[#D4AF63]/30 hover:border-[#F1D889] flex items-end transition-colors"
                >
                  {tileSrc && (
                    <img
                      src={tileSrc}
                      alt={`${cat.label} category tile`}
                      loading="lazy"
                      decoding="async"
                      className={`absolute inset-0 w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02] ${
                        cat.emptySection ? "opacity-80" : ""
                      }`}
                    />
                  )}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#2B0E17]/95 via-[#2B0E17]/50 to-transparent"
                  />
                  <div className="relative z-10 w-full p-3.5 sm:p-6 flex items-end justify-between gap-2 sm:gap-4">
                    <div className="space-y-1 min-w-0">
                      <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.22em] text-[#F1D889]">
                        {cat.emptySection
                          ? "Men's Section · Coming Soon"
                          : matching.length > 0
                          ? `Men's Section · ${matching.length} ${
                              matching.length === 1 ? "piece" : "pieces"
                            }`
                          : "Men's Section · Explore"}
                      </p>
                      <h3 className="font-serif text-xl sm:text-2xl text-[#F7F1E5] leading-tight">
                        {cat.label}
                      </h3>
                      <p className="text-xs text-[#F7F1E5]/70 hidden sm:block">
                        {cat.subtitle}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#F1D889] shrink-0 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
