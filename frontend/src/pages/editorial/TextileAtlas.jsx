import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Compass, Sparkles } from "lucide-react";
import useStore from "../../store/store";
import PageHero from "../../components/globalComponents/PageHero";
import Breadcrums from "../../components/globalComponents/Breadcrums";
import SectionHeading from "../../components/ui/SectionHeading";
import EditorialButton from "../../components/ui/EditorialButton";
import {
  REGIONAL_TEXTILE_EDITS,
  matchesTypeOrKeyword,
  getProductImage,
} from "../../config/storefrontCategories";
import { useSeoMeta } from "../../utils/seo";

const TextileAtlas = () => {
  const { products } = useStore();

  useSeoMeta({
    title: "Indian Textile Atlas",
    description:
      "Explore Revakalp's regional craft edits — Bandhej, Leheriya, Pashmina, Kanjivaram, Kosa, Maheshwari, Nauvari, and Paithani.",
    canonicalPath: "/textile-atlas",
  });

  return (
    <div className="bg-[#F7F1E5] min-h-screen">
      <PageHero
        label="Regional Craft Directory"
        title="Indian Textile Atlas"
        subtitle="Discover regional draping traditions and textile edits represented across the Revakalp collection."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Breadcrums />
          <EditorialButton to="/shop/saree" variant="secondary">
            <span>Browse All Sarees</span>
            <ArrowRight className="w-4 h-4" />
          </EditorialButton>
        </div>

        <section aria-label="Regional Textile Editions">
          <SectionHeading
            eyebrow="Eight Regional Traditions"
            title="Curated"
            accentWord="Weaves & Edits"
            align="left"
            className="mb-8"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {REGIONAL_TEXTILE_EDITS.map((edit, idx) => {
              const liveMatches = (products || []).filter((p) => {
                const available = Math.max(0, (Number(p?.stock) || 0) - (Number(p?.reserved) || 0));
                return available > 0 && matchesTypeOrKeyword(p, edit.slug);
              });
              const previewImg = liveMatches.length > 0 ? getProductImage(liveMatches[0]) : "";

              return (
                <Link
                  key={edit.slug}
                  to={`/shop/saree/${edit.slug}`}
                  className="group rounded-3xl overflow-hidden bg-white border border-[#38131E]/12 hover:border-[#D4AF63] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-[#2B0E17] to-[#38131E] overflow-hidden">
                    {previewImg ? (
                      <img
                        src={previewImg}
                        alt={`${edit.name} from ${edit.region}`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#F7F1E5]">
                        <Compass className="w-7 h-7 text-[#D4AF63] mb-2" />
                        <span className="font-serif text-2xl">{edit.name}</span>
                        <span className="text-[11px] uppercase tracking-[0.2em] text-[#F1D889]/80 mt-1">
                          {edit.region}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#2B0E17]/85 text-[#F1D889] text-[10px] font-semibold uppercase tracking-[0.2em]">
                      0{idx + 1} · {edit.region}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-serif text-2xl text-[#38131E]">{edit.name}</h3>
                      <p className="mt-2 text-xs sm:text-sm text-[#1A1718]/75 leading-relaxed">
                        {edit.note}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#38131E]/10 flex items-center justify-between text-xs font-medium text-[#38131E]">
                      <span>
                        {liveMatches.length > 0
                          ? `${liveMatches.length} ${liveMatches.length === 1 ? "piece" : "pieces"} available`
                          : "Explore edition"}
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#D4AF63] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl bg-[#2B0E17] text-[#F7F1E5] p-6 sm:p-8 border border-[#D4AF63]/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-[#F1D889]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Provenance Transparency</span>
            </div>
            <p className="text-sm text-[#F7F1E5]/85 leading-relaxed">
              Verified fabric composition, dimensions, blouse inclusion, and care notes are
              recorded individually on each product&apos;s Product Intelligence panel.
            </p>
          </div>
          <EditorialButton to="/past-editions" variant="gold">
            <span>View Past Editions</span>
            <ArrowRight className="w-4 h-4" />
          </EditorialButton>
        </section>
      </div>
    </div>
  );
};

export default TextileAtlas;
