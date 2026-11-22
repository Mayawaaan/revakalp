import React, { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import useStore from "../../store/store";
import SectionHeading from "../ui/SectionHeading";
import ProductGrid from "../ui/ProductGrid";
import EditorialButton from "../ui/EditorialButton";
import { OCCASION_EDITS } from "../../config/storefrontCategories";

export default function OccasionEdit() {
  const { products, loading } = useStore();
  const [selectedOccasion, setSelectedOccasion] = useState(OCCASION_EDITS[0].id);
  const [expanded, setExpanded] = useState(false);

  const activeConfig = useMemo(
    () => OCCASION_EDITS.find((o) => o.id === selectedOccasion) || OCCASION_EDITS[0],
    [selectedOccasion]
  );

  const matchedProducts = useMemo(() => {
    const inStock = (products || []).filter((p) => Number(p?.stock) > 0);
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
      className="py-16 sm:py-24 bg-[#F7F1E5] border-b border-[#38131E]/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <SectionHeading
            eyebrow="Occasion Styling"
            title="Dressed for"
            accentWord="the moment"
            subtitle={activeConfig.subtitle}
            align="left"
          />

          <div
            role="tablist"
            aria-label="Select occasion"
            className="flex flex-wrap gap-2"
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
                  className={`rk-chip ${active ? "rk-chip-active" : ""}`}
                >
                  {occ.label}
                </button>
              );
            })}
          </div>
        </div>

        <ProductGrid
          products={displayed}
          loading={loading}
          emptyProps={{
            title: `No ${activeConfig.label.toLowerCase()} matches listed right now`,
            description:
              "Browse our complete active catalog to see all styles currently in stock at Revakalp.",
            actionLabel: "Browse All Products",
            actionTo: "/shop/all/all",
          }}
        />

        {matchedProducts.length > 4 && (
          <div className="mt-10 text-center">
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
      </div>
    </section>
  );
}
