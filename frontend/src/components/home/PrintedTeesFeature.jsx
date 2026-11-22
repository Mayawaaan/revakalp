import React from "react";
import { ArrowRight } from "lucide-react";
import useStore from "../../store/store";
import EditorialButton from "../ui/EditorialButton";
import ProductCard from "../ui/ProductCard";
import { matchesCategory } from "../../config/storefrontCategories";

export default function PrintedTeesFeature() {
  const { products } = useStore();

  const teeProducts = (products || []).filter(
    (p) => Number(p?.stock) > 0 && matchesCategory(p, "printed-tees")
  );

  return (
    <section
      aria-label="Printed Tees Editorial"
      className="py-16 sm:py-24 bg-[#38131E] text-[#F7F1E5] border-b border-[#D4AF63]/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Copy Column */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-8 bg-[#D4AF63]" aria-hidden="true" />
              <p className="uppercase tracking-[0.28em] text-[11px] font-medium text-[#F1D889]">
                Printed Tees
              </p>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl text-[#F7F1E5] leading-[1.08]">
              Everyday,{" "}
              <span className="italic font-normal text-[#F1D889]">
                with an edge.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-[#F7F1E5]/80 max-w-lg leading-relaxed">
              Alongside traditional occasionwear, Revakalp curates a dedicated
              printed T-shirt collection designed for relaxed everyday styling.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <EditorialButton to="/shop/printed-tees/all" variant="gold">
                <span>Explore Printed Tees</span>
                <ArrowRight className="w-4 h-4" />
              </EditorialButton>
            </div>
          </div>

          {/* Real Catalog Tee Cards OR Illustrative Banner */}
          <div className="lg:col-span-6">
            {teeProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-[#1A1718]">
                {teeProducts.slice(0, 2).map((item) => (
                  <ProductCard
                    key={item._id || item.id}
                    id={item._id || item.id}
                    {...item}
                  />
                ))}
              </div>
            ) : (
              <div className="relative rounded-3xl overflow-hidden bg-[#2B0E17] border border-[#D4AF63]/40 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-full sm:w-48 aspect-[4/5] rounded-2xl overflow-hidden bg-[#F7F1E5] shrink-0 border border-[#D4AF63]/30">
                  <img
                    src="/campaign/category-printed-tees.png"
                    alt="Illustrative graphic art for Revakalp Printed Tees category"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-3 text-left">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#F1D889]">
                    Illustrative Category Artwork
                  </p>
                  <h3 className="font-serif text-2xl text-[#F7F1E5]">
                    Printed Tee Collection
                  </h3>
                  <p className="text-xs sm:text-sm text-[#F7F1E5]/75 leading-relaxed">
                    Printed tee drops are listed directly from our live catalog as
                    stock arrives. Check the category page for current availability.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
