import React, { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import useStore from "../../store/store";
import SectionHeading from "../ui/SectionHeading";
import ProductCard from "../ui/ProductCard";
import EmptyState from "../ui/EmptyState";
import LoadingSkeleton from "../ui/LoadingSkeleton";
import EditorialButton from "../ui/EditorialButton";
import { OCCASION_EDITS, getAvailableStock } from "../../config/storefrontCategories";

export default function OccasionEdit() {
  const { products, loading } = useStore();
  const [selectedOccasion, setSelectedOccasion] = useState(OCCASION_EDITS[0].id);
  const [expanded, setExpanded] = useState(false);

  const activeConfig = useMemo(
    () => OCCASION_EDITS.find((o) => o.id === selectedOccasion) || OCCASION_EDITS[0],
    [selectedOccasion]
  );

  const matchedProducts = useMemo(() => {
    const inStock = (products || []).filter((p) => getAvailableStock(p) > 0);
    return inStock.filter((p) => {
      const hay = [p.category, p.subCategory, p.type, p.name, p.print, p.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return activeConfig.keywords.some((kw) => hay.includes(kw));
    });
  }, [products, activeConfig]);

  const displayed = expanded ? matchedProducts : matchedProducts.slice(0, 4);

  return (
    <section
      aria-label="Shop by Occasion"
      className="py-16 sm:py-24 bg-[#F7F1E5] border-b border-[#38131E]/12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Sticky Architectural Chapter Selector */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <SectionHeading
              eyebrow="Shop by Occasion"
              title="What are you"
              accentWord="dressing for?"
              subtitle={activeConfig.subtitle}
              align="left"
            />

            <div
              role="tablist"
              aria-label="Select occasion"
              className="divide-y divide-[#38131E]/14 border-y border-[#38131E]/14"
            >
              {OCCASION_EDITS.map((occ) => {
                const active = occ.id === selectedOccasion;
                return (
                  <button
                    key={occ.id}
                    role="tab"
                    type="button"
                    aria-selected={active}
                    onClick={() => {
                      setSelectedOccasion(occ.id);
                      setExpanded(false);
                    }}
                    className={`w-full py-3.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                      active
                        ? "bg-[#38131E] text-[#F7F1E5] px-4"
                        : "px-2 text-[#38131E] hover:bg-[#EFE6D5]/70"
                    }`}
                  >
                    <span className="font-serif text-xl">{occ.label}</span>
                    <ArrowRight
                      className={`w-4 h-4 ${
                        active ? "text-[#F1D889]" : "text-[#38131E]/40"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <EditorialButton
                to={activeConfig.route || "/shop/all/all"}
                variant="secondary"
              >
                <span>See All {activeConfig.label} Styles</span>
                <ArrowRight className="w-4 h-4" />
              </EditorialButton>
            </div>
          </div>

          {/* Right Vertical Staggered Lookbook Stream */}
          <div className="lg:col-span-8">
            {loading ? (
              <LoadingSkeleton count={4} />
            ) : displayed.length === 0 ? (
              <EmptyState
                title={`No ${activeConfig.label.toLowerCase()} pieces on the rack right now`}
                description="Take a look at everything else currently available in our Indore store."
                actionLabel="Browse Everything"
                actionTo="/shop/all/all"
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-start">
                  {displayed.map((item, idx) => (
                    <div
                      key={item._id || item.id}
                      className={idx % 2 === 1 ? "sm:mt-10" : ""}
                    >
                      <ProductCard id={item._id || item.id} {...item} />
                    </div>
                  ))}
                </div>

                {matchedProducts.length > 4 && (
                  <div className="mt-10">
                    <EditorialButton
                      variant="secondary"
                      onClick={() => setExpanded((prev) => !prev)}
                    >
                      <span>
                        {expanded
                          ? "Show Fewer"
                          : `View All ${matchedProducts.length} ${activeConfig.label} Pieces`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </EditorialButton>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
