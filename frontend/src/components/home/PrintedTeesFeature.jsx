import React from "react";
import { ArrowRight } from "lucide-react";
import useStore from "../../store/store";
import EditorialButton from "../ui/EditorialButton";
import ProductCard from "../ui/ProductCard";
import { matchesCategory, getAvailableStock } from "../../config/storefrontCategories";

export default function PrintedTeesFeature() {
  const { products } = useStore();

  const teeProducts = (products || []).filter(
    (p) => getAvailableStock(p) > 0 && matchesCategory(p, "printed-tees")
  );

  return (
    <section
      aria-label="Printed Tees Editorial"
      className="py-12 sm:py-24 bg-[#38131E] text-[#F7F1E5] border-b border-[#D4AF63]/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Copy Column */}
          <div className="lg:col-span-6 space-y-5" data-reveal="card">
            <p className="uppercase tracking-[0.3em] text-[10px] sm:text-[11px] font-medium text-[#F1D889]">
              Printed Tees
            </p>

            <h2
              data-reveal="heading"
              className="font-serif text-[clamp(2.1rem,4.4vw,3.6rem)] text-[#F7F1E5] leading-[1.06]"
            >
              Easy days,{" "}
              <span className="italic font-normal text-[#F1D889]">
                effortless style.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-[#F7F1E5]/80 max-w-lg leading-relaxed">
              Relaxed printed T-shirts for everyday comfort.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <EditorialButton
                to="/shop/printed-tees/all"
                variant="gold"
                className="w-full sm:w-auto"
              >
                <span>See Printed Tees</span>
                <ArrowRight className="w-4 h-4" />
              </EditorialButton>
            </div>
          </div>

          {/* Real Catalog Tee Cards OR Illustrative Banner */}
          <div className="lg:col-span-6">
            {teeProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3.5 sm:gap-6 bg-[#FBF7EE] p-3.5 sm:p-5 rounded-[2px] border border-[#D4AF63]/45 text-[#1A1718]">
                {teeProducts.slice(0, 2).map((item) => (
                  <ProductCard
                    key={item._id || item.id}
                    id={item._id || item.id}
                    {...item}
                  />
                ))}
              </div>
            ) : (
              <div className="relative rounded-[2px] overflow-hidden bg-[#2B0E17] border border-[#D4AF63]/40 p-5 sm:p-8 flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
                <div className="w-full sm:w-48 aspect-[9/16] rounded-[2px] overflow-hidden bg-[#2B0E17] shrink-0 border border-[#D4AF63]/35">
                  <img
                    src="/category-tiles/printed-t-shirts.png"
                    alt="Illustrative graphic art for Revakalp Printed Tees category"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-3 text-left">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#F1D889]">
                    Fresh Designs Coming
                  </p>
                  <h3 className="font-serif text-2xl text-[#F7F1E5]">
                    Printed Tees
                  </h3>
                  <p className="text-xs sm:text-sm text-[#F7F1E5]/78 leading-relaxed">
                    New printed T-shirts show up here as soon as fresh batches reach our store.
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
