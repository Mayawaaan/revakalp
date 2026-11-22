import React from "react";
import { ArrowRight } from "lucide-react";
import useStore from "../../store/store";
import EditorialButton from "../ui/EditorialButton";
import ProductCard from "../ui/ProductCard";
import {
  matchesCategory,
  getAvailableStock,
} from "../../config/storefrontCategories";

export default function IndoWesternFeature() {
  const { products } = useStore();

  const indoWesternProducts = (products || []).filter(
    (p) => getAvailableStock(p) > 0 && matchesCategory(p, "indo-western")
  );

  return (
    <section
      aria-label="Indo-Western Collection"
      className="py-16 sm:py-24 bg-[#FBF7EE] text-[#1A1718] border-b border-[#38131E]/12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Copy Column */}
          <div className="lg:col-span-6 space-y-5">
            <p className="uppercase tracking-[0.3em] text-[10px] sm:text-[11px] font-medium text-[#38131E]/75">
              Indo-Western
            </p>

            <h2 className="font-serif text-[clamp(2.25rem,4.4vw,3.6rem)] text-[#38131E] leading-[1.06]">
              Modern silhouettes,{" "}
              <span className="italic font-normal text-[#38131E]/85">
                festive ease.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-[#1A1718]/78 max-w-lg leading-relaxed">
              Contemporary drapes, fusion sets, and effortless evening styles.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <EditorialButton to="/shop/indo-western/all" variant="primary">
                <span>Explore Indo-Western</span>
                <ArrowRight className="w-4 h-4" />
              </EditorialButton>
            </div>
          </div>

          {/* Live Catalog Cards OR Clean Preview Card */}
          <div className="lg:col-span-6">
            {indoWesternProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#F7F1E5] p-5 rounded-[2px] border border-[#38131E]/15">
                {indoWesternProducts.slice(0, 2).map((item) => (
                  <ProductCard
                    key={item._id || item.id}
                    id={item._id || item.id}
                    {...item}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-[2px] overflow-hidden bg-[#2B0E17] border border-[#D4AF63]/40 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 text-[#F7F1E5]">
                <div className="w-full sm:w-48 aspect-[4/5] rounded-[2px] overflow-hidden bg-[#38131E] shrink-0 border border-[#D4AF63]/35">
                  <img
                    src="/campaign/category-lehengas.png"
                    alt="Revakalp Indo-Western collection preview"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover opacity-90"
                  />
                </div>
                <div className="space-y-3 text-left">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[#F1D889]">
                    New Section
                  </p>
                  <h3 className="font-serif text-2xl text-[#F7F1E5]">
                    Indo-Western
                  </h3>
                  <p className="text-xs sm:text-sm text-[#F7F1E5]/78 leading-relaxed">
                    Fresh Indo-Western styles appear here as new pieces arrive in store.
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
