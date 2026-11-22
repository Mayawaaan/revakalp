import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import useStore from "../../store/store";
import EditorialButton from "../ui/EditorialButton";
import {
  REGIONAL_TEXTILE_EDITS,
  matchesCategory,
  matchesTypeOrKeyword,
  getProductImage,
} from "../../config/storefrontCategories";

export default function SareeStory() {
  const { products } = useStore();

  const sareeProducts = (products || []).filter(
    (p) => Number(p?.stock) > 0 && matchesCategory(p, "saree")
  );
  const featuredImg =
    sareeProducts.length > 0 ? getProductImage(sareeProducts[0]) : "/campaign/category-sarees.png";
  const isIllustrative = sareeProducts.length === 0;

  return (
    <section
      aria-label="Saree Editorial & Regional Textiles"
      className="py-16 sm:py-24 bg-white border-b border-[#38131E]/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Editorial Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div
              data-reveal="image"
              className="relative aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden bg-[#2B0E17] border border-[#D4AF63]/35 shadow-xl"
            >
              <img
                src={featuredImg}
                alt={
                  isIllustrative
                    ? "Illustrative regional saree textile pattern"
                    : sareeProducts[0]?.name || "Curated Saree"
                }
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#2B0E17]/60 via-transparent to-transparent"
              />
              <span className="absolute bottom-4 left-4 text-[11px] uppercase tracking-[0.2em] text-[#F1D889] bg-[#2B0E17]/80 px-3.5 py-1.5 rounded-full border border-[#D4AF63]/40">
                {isIllustrative ? "Illustrative Textile Study" : "From Saree Catalog"}
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-8 bg-[#D4AF63]" aria-hidden="true" />
              <p className="uppercase tracking-[0.28em] text-[11px] font-medium text-[#38131E]/75">
                The Saree Edit
              </p>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#38131E] leading-[1.1]">
              A celebration of{" "}
              <span className="italic font-normal">every silhouette.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#1A1718]/75 leading-relaxed max-w-xl">
              Revakalp curates regional saree traditions from across India for our
              Indore retail storefront and online shoppers — bringing together varied
              drapes, textures, and festive aesthetics under one roof.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <EditorialButton to="/shop/saree" variant="primary">
                <span>Explore Saree Traditions</span>
                <ArrowRight className="w-4 h-4" />
              </EditorialButton>
              <EditorialButton to="/shop/saree/all" variant="secondary">
                <span>Browse All Sarees</span>
              </EditorialButton>
            </div>
          </div>
        </div>

        {/* Regional Textile Browsing Subjects */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.26em] text-[#38131E]/65 mb-2">
                Editorial Browsing Subjects
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#38131E]">
                Explore by Regional Textile Tradition
              </h3>
            </div>
            <p className="text-xs text-[#1A1718]/60 max-w-sm">
              Select a tradition below to filter matching available pieces in our catalog.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {REGIONAL_TEXTILE_EDITS.map((item) => {
              const count = sareeProducts.filter((p) =>
                matchesTypeOrKeyword(p, item.slug)
              ).length;

              return (
                <Link
                  key={item.slug}
                  to={`/shop/saree/${item.slug}`}
                  className="group p-4 sm:p-5 rounded-2xl bg-[#F7F1E5]/70 hover:bg-[#38131E] border border-[#38131E]/12 hover:border-[#D4AF63] transition-all duration-300 flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#38131E]/60 group-hover:text-[#F1D889] transition-colors">
                        {item.region}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#38131E]/50 group-hover:text-[#F1D889] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                    <h4 className="font-serif text-xl text-[#38131E] group-hover:text-[#F7F1E5] transition-colors">
                      {item.name}
                    </h4>
                    <p className="mt-1.5 text-xs text-[#1A1718]/70 group-hover:text-[#F7F1E5]/80 leading-relaxed line-clamp-2 transition-colors">
                      {item.note}
                    </p>
                  </div>

                  <p className="text-[11px] font-medium uppercase tracking-wider text-[#38131E]/80 group-hover:text-[#D4AF63] transition-colors">
                    {count > 0 ? `${count} available` : "Editorial subject →"}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
