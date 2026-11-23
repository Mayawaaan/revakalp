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
  ACTIVE_STOREFRONT_CATEGORIES,
  MENS_STOREFRONT_CATEGORIES,
  matchesCategory,
  getCategoryTileArt,
  getAvailableStock,
} from "../../config/storefrontCategories";
import { useSeoMeta } from "../../utils/seo";

const CategoryPage = () => {
  const { collections, products, loading } = useStore();

  useSeoMeta({
    title: "Collections",
    description:
      "Browse curated Revakalp collections — Sarees, Lehengas, Indo-Western, and Printed Tees, plus our upcoming Men's section.",
    canonicalPath: "/shop",
  });

  return (
    <div className="bg-[#F7F1E5] min-h-screen">
      <PageHero
        label="Explore"
        title="Our Collections"
        subtitle="Everything currently available at our Indore boutique and online."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Breadcrums />
          <EditorialButton to="/shop/all/all" variant="secondary">
            <span>See Everything</span>
            <ArrowRight className="w-4 h-4" />
          </EditorialButton>
        </div>

        {/* Storefront Core Categories */}
        <section aria-label="Shop by Category">
          <SectionHeading
            eyebrow="Browse"
            title="Shop by"
            accentWord="Category"
            align="left"
            className="mb-8"
          />

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {ACTIVE_STOREFRONT_CATEGORIES.map((cat) => {
              const matching = (products || []).filter(
                (p) => getAvailableStock(p) > 0 && matchesCategory(p, cat.id)
              );
              const imgSrc = cat.fallbackArt || getCategoryTileArt(cat.id);

              return (
                <Link
                  key={cat.id}
                  to={cat.route}
                  className="group relative aspect-[9/16] rounded-[2px] overflow-hidden bg-[#2B0E17] border border-[#38131E]/15 hover:border-[#D4AF63] transition-colors duration-500 flex items-end"
                >
                  <img
                    src={imgSrc}
                    alt={`${cat.label} category tile`}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#2B0E17]/95 via-[#2B0E17]/40 to-transparent"
                  />
                  <div className="relative z-10 w-full p-3.5 sm:p-6 flex items-end justify-between gap-2 text-[#F7F1E5]">
                    <div className="min-w-0">
                      <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.22em] text-[#F1D889] mb-1 truncate">
                        {matching.length > 0 ? `${matching.length} available` : "Browse category"}
                      </p>
                      <h3 className="font-serif text-xl sm:text-3xl leading-tight">{cat.label}</h3>
                      <p className="text-xs text-[#F7F1E5]/75 mt-1 hidden sm:block">{cat.subtitle}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#F1D889] shrink-0 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Men's Section — Empty / Coming Soon */}
        <section aria-label="Men's Section">
          <SectionHeading
            eyebrow="Men's Section"
            title="Menswear"
            accentWord="Coming Soon"
            subtitle="Our Suits, Kurta Pajama, and Jodhpuri shelves are currently empty as we prepare upcoming menswear pieces."
            align="left"
            className="mb-8"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-6">
            {MENS_STOREFRONT_CATEGORIES.map((cat) => {
              const tileSrc = cat.fallbackArt || getCategoryTileArt(cat.id);
              return (
                <Link
                  key={cat.id}
                  to={cat.route}
                  className="group relative aspect-[9/16] rounded-[2px] overflow-hidden bg-[#2B0E17] text-[#F7F1E5] border border-[#D4AF63]/35 hover:border-[#F1D889] flex items-end transition-colors"
                >
                  {tileSrc && (
                    <img
                      src={tileSrc}
                      alt={`${cat.label} coming soon tile`}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-contain opacity-80 transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  )}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#2B0E17]/95 via-[#2B0E17]/50 to-transparent"
                  />
                  <div className="relative z-10 w-full p-3.5 sm:p-6 flex items-end justify-between gap-2">
                    <div className="min-w-0">
                      <span className="block text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#F1D889] font-medium mb-1">
                        Coming Soon
                      </span>
                      <h3 className="font-serif text-xl sm:text-3xl leading-tight">{cat.label}</h3>
                      <p className="text-xs text-[#F7F1E5]/70 mt-1 hidden sm:block">{cat.subtitle}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#F1D889] shrink-0 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Heritage Gateway Strip */}
        <section className="rounded-[2px] bg-[#2B0E17] text-[#F7F1E5] p-5 sm:p-10 border border-[#D4AF63]/35 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2 max-w-xl">
            <p className="text-[10px] uppercase tracking-[0.26em] text-[#F1D889]">
              Indian Textile Guide
            </p>
            <h3 className="font-serif text-2xl sm:text-3xl">
              Curious about Indian weaves?
            </h3>
            <p className="text-sm text-[#F7F1E5]/78 leading-relaxed">
              Read the stories, motifs, and care tips behind Maheshwari, Kosa, Bandhani,
              Kanjivaram, Paithani, and Pashmina.
            </p>
          </div>
          <EditorialButton to="/heritage" variant="gold" className="w-full md:w-auto">
            <span>Open Textile Guide</span>
            <ArrowRight className="w-4 h-4" />
          </EditorialButton>
        </section>

        {/* Backend-Configured Collections */}
        <section aria-label="Curated Collections">
          <SectionHeading
            eyebrow="Special Edits"
            title="Curated"
            accentWord="Collections"
            align="left"
            className="mb-8"
          />

          {loading && !collections?.length ? (
            <LoadingSkeleton count={4} />
          ) : collections?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {collections.map((collection) => {
                const tileImg = getCategoryTileArt(
                  collection.id || collection.name,
                  collection.image
                );
                return (
                  <Link
                    to={`/shop/${collection.id}`}
                    key={collection._id || collection.id}
                    className="group relative aspect-[9/16] rounded-[2px] overflow-hidden bg-[#2B0E17] border border-[#38131E]/15 hover:border-[#D4AF63] transition-colors duration-500 flex items-end"
                  >
                    <img
                      src={tileImg}
                      alt={collection.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#2B0E17]/95 via-[#2B0E17]/40 to-transparent"
                    />
                    <div className="relative z-10 w-full p-3.5 sm:p-5 flex items-end justify-between gap-2 sm:gap-3 text-[#F7F1E5]">
                      <div className="min-w-0">
                        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.22em] text-[#F1D889] mb-1">
                          Collection
                        </p>
                        <h3 className="font-serif text-lg sm:text-2xl leading-tight truncate">
                          {collection.name}
                        </h3>
                        {collection.description && (
                          <p className="text-xs text-[#F7F1E5]/75 mt-1 line-clamp-2 hidden sm:block">
                            {collection.description}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#F1D889] shrink-0 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
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
