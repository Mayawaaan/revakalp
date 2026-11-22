import React from "react";
import { Link } from "react-router-dom";
import { Archive, ArrowRight } from "lucide-react";
import useStore from "../../store/store";
import PageHero from "../../components/globalComponents/PageHero";
import Breadcrums from "../../components/globalComponents/Breadcrums";
import SectionHeading from "../../components/ui/SectionHeading";
import EditorialButton from "../../components/ui/EditorialButton";
import EmptyState from "../../components/ui/EmptyState";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";
import Price from "../../components/ui/Price";
import {
  getProductImage,
  getEffectivePrice,
  normalizeSlug,
} from "../../config/storefrontCategories";
import { useSeoMeta } from "../../utils/seo";

const PastEditions = () => {
  const { products, loading } = useStore();

  useSeoMeta({
    title: "Past Editions & Sold Archive",
    description:
      "Browse completed single-piece creations and sold-out archival pieces from Revakalp, with links to comparable live silhouettes.",
    canonicalPath: "/past-editions",
  });

  const archivedProducts = (products || []).filter((product) => {
    const available = Math.max(0, (Number(product?.stock) || 0) - (Number(product?.reserved) || 0));
    return available <= 0;
  });

  return (
    <div className="bg-[#F7F1E5] min-h-screen">
      <PageHero
        label="Archive"
        title="Past Editions"
        subtitle="Pieces that have already found a home — kept here for inspiration alongside similar styles in store today."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Breadcrums />
          <EditorialButton to="/shop/all/all" variant="secondary">
            <span>See Available Pieces</span>
            <ArrowRight className="w-4 h-4" />
          </EditorialButton>
        </div>

        <section aria-label="Sold Archive Pieces">
          <SectionHeading
            eyebrow="Sold Pieces"
            title="Past"
            accentWord="Editions"
            align="left"
            className="mb-8"
          />

          {loading ? (
            <LoadingSkeleton count={4} />
          ) : archivedProducts.length === 0 ? (
            <EmptyState
              icon={Archive}
              title="Everything in our store is currently available"
              description="All pieces we've listed are ready to shop online or at our Indore store right now."
              actionLabel="Browse the Collection"
              actionTo="/shop/all/all"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {archivedProducts.map((item) => {
                const resolvedId = item._id || item.id;
                const imgUrl = getProductImage(item);
                const categorySlug = normalizeSlug(item.category || "all");
                const effectivePrice = getEffectivePrice(item);

                return (
                  <article
                    key={resolvedId}
                    className="rounded-[2px] overflow-hidden bg-[#FBF7EE] border border-[#38131E]/14 flex flex-col"
                  >
                    <Link
                      to={`/product/${resolvedId}`}
                      className="relative aspect-[3/4] bg-[#2B0E17]/10 overflow-hidden block"
                    >
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={item.name}
                          loading="lazy"
                          className="w-full h-full object-cover opacity-90"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs uppercase tracking-widest text-[#38131E]/60">
                          Archive Item
                        </div>
                      )}
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-[2px] bg-[#2B0E17] text-[#F1D889] text-[10px] font-semibold uppercase tracking-[0.2em] border border-[#D4AF63]/40">
                        Sold Out
                      </span>
                    </Link>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#38131E]/65">
                          {[item.category, item.state].filter(Boolean).join(" · ")}
                        </p>
                        <h3 className="mt-1 font-serif text-xl text-[#38131E] leading-snug">
                          {item.name}
                        </h3>
                        {effectivePrice > 0 && (
                          <div className="mt-2 text-sm text-[#1A1718]/70">
                            <Price value={effectivePrice} />
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-[#38131E]/10 flex items-center justify-between gap-2">
                        <Link
                          to={`/shop/${categorySlug}/all`}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#38131E] hover:text-[#2B0E17]"
                        >
                          <span>Explore {item.category || "Similar"}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#D4AF63]" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default PastEditions;
