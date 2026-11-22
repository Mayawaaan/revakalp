import React, { useMemo, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import useStore from "../../store/store";
import Breadcrums from "../../components/globalComponents/Breadcrums";
import EditorialButton from "../../components/ui/EditorialButton";
import EmptyState from "../../components/ui/EmptyState";
import ProductGrid from "../../components/ui/ProductGrid";
import IndiaHeritageMap from "../../components/heritage/IndiaHeritageMap";
import HeritageFabricCanvas from "../../components/heritage/HeritageFabricCanvas";
import MotifDiagram from "../../components/heritage/MotifDiagram";
import useReducedMotion from "../../components/motion/useReducedMotion";
import useReveal from "../../components/motion/useReveal";
import { useSeoMeta } from "../../utils/seo";
import {
  HERITAGE_TRADITIONS,
  getTraditionBySlug,
  matchTraditionProducts,
} from "../../data/heritageTraditions";

const HeritageTraditionPage = () => {
  const { slug } = useParams();
  const { products, loading } = useStore();
  const pageRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useReveal(pageRef, reducedMotion);

  const tradition = useMemo(() => getTraditionBySlug(slug), [slug]);

  const matchingProducts = useMemo(
    () => (tradition ? matchTraditionProducts(products, tradition) : []),
    [products, tradition]
  );

  const currentIdx = tradition
    ? HERITAGE_TRADITIONS.findIndex((t) => t.slug === tradition.slug)
    : -1;
  const prevTradition =
    currentIdx >= 0
      ? HERITAGE_TRADITIONS[
          (currentIdx - 1 + HERITAGE_TRADITIONS.length) % HERITAGE_TRADITIONS.length
        ]
      : null;
  const nextTradition =
    currentIdx >= 0
      ? HERITAGE_TRADITIONS[(currentIdx + 1) % HERITAGE_TRADITIONS.length]
      : null;

  useSeoMeta({
    title: tradition
      ? `${tradition.name} — ${tradition.region}`
      : "Indian Textile Guide",
    description: tradition
      ? tradition.summary
      : "Explore six regional Indian textile traditions in Revakalp's Textile Guide.",
    canonicalPath: tradition ? `/heritage/${tradition.slug}` : "/heritage",
  });

  if (!tradition) {
    return (
      <div className="min-h-[70vh] bg-[#F7F1E5] flex items-center justify-center px-4 py-16">
        <EmptyState
          title="Weave story not found"
          description="Explore all six regional Indian textile traditions in our Indian Textile Guide."
          actionLabel="Open Textile Guide"
          actionTo="/heritage"
        />
      </div>
    );
  }

  return (
    <div ref={pageRef} className="bg-[#F7F1E5] min-h-screen">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-[#2B0E17] text-[#F7F1E5] py-12 sm:py-24 border-b border-[#D4AF63]/35">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-6 space-y-5 sm:space-y-6">
            <Link
              to="/heritage"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#F1D889] hover:text-[#F7F1E5] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Textile Guide
            </Link>

            <p className="text-[11px] uppercase tracking-[0.26em] text-[#F1D889]">
              {tradition.region}
            </p>

            <h1 className="font-serif text-[clamp(2.35rem,5.5vw,4.9rem)] leading-[1.02] tracking-tight text-[#F7F1E5]">
              {tradition.name}
            </h1>

            <p className="font-serif italic text-xl sm:text-2xl text-[#F1D889]/95 leading-snug">
              {tradition.tagline}
            </p>

            <p className="text-sm sm:text-base text-[#F7F1E5]/82 leading-relaxed max-w-xl">
              {tradition.summary}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row flex-wrap gap-3">
              <EditorialButton href="#available-pieces" variant="gold" className="w-full sm:w-auto">
                <span>
                  See Available Pieces
                  {matchingProducts.length > 0 ? ` (${matchingProducts.length})` : ""}
                </span>
                <ArrowRight className="w-4 h-4" />
              </EditorialButton>

              <EditorialButton to={tradition.shopRoute} variant="outlineDark" className="w-full sm:w-auto">
                <span>Shop This Style</span>
              </EditorialButton>
            </div>
          </div>

          <div className="lg:col-span-6">
            <HeritageFabricCanvas
              preset={tradition.shaderPreset}
              traditionName={tradition.name}
              motifKind={tradition.motifs[0]?.svgKind}
              swatches={tradition.paletteSwatches}
              className="h-60 sm:h-[400px]"
            />
          </div>
        </div>
      </section>

      {/* ── STORYTELLING & STICKY MAP RAIL ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12 sm:space-y-16">
        <Breadcrums />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Sticky Rail */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-4 sm:space-y-6">
            <div className="h-56 sm:h-72">
              <IndiaHeritageMap activeSlug={tradition.slug} zoomToActive compact />
            </div>

            <div className="rk-surface-card p-4 sm:p-6 space-y-4">
              <div className="border-b border-[#38131E]/12 pb-3">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#38131E]/60">
                  Where it&apos;s from
                </p>
                <p className="text-xs text-[#38131E] font-medium mt-1">
                  {tradition.subRegion}
                </p>
              </div>

              <nav
                aria-label="Story sections"
                className="flex lg:block overflow-x-auto scrollbar-hide gap-3 lg:gap-0 lg:space-y-1.5 text-[11px] sm:text-xs uppercase tracking-[0.14em] lg:tracking-[0.16em] pb-1 lg:pb-0"
              >
                <a href="#history" className="shrink-0 whitespace-nowrap block py-1.5 px-2.5 lg:px-0 bg-[#EFE6D5] lg:bg-transparent rounded-[2px] text-[#38131E] hover:underline">
                  History &amp; Origin
                </a>
                <a href="#motifs" className="shrink-0 whitespace-nowrap block py-1.5 px-2.5 lg:px-0 bg-[#EFE6D5] lg:bg-transparent rounded-[2px] text-[#38131E] hover:underline">
                  Classic Motifs
                </a>
                <a href="#material-craft" className="shrink-0 whitespace-nowrap block py-1.5 px-2.5 lg:px-0 bg-[#EFE6D5] lg:bg-transparent rounded-[2px] text-[#38131E] hover:underline">
                  Fabric &amp; Feel
                </a>
                <a href="#significance-care" className="shrink-0 whitespace-nowrap block py-1.5 px-2.5 lg:px-0 bg-[#EFE6D5] lg:bg-transparent rounded-[2px] text-[#38131E] hover:underline">
                  Why It&apos;s Loved &amp; Care
                </a>
                <a href="#available-pieces" className="shrink-0 whitespace-nowrap block py-1.5 px-2.5 lg:px-0 bg-[#EFE6D5] lg:bg-transparent rounded-[2px] font-semibold text-[#38131E] hover:underline">
                  Available Pieces
                </a>
              </nav>

              <div className="pt-2">
                <EditorialButton to={tradition.shopRoute} variant="primary" className="w-full">
                  <span>See Available Pieces</span>
                  <ArrowRight className="w-4 h-4" />
                </EditorialButton>
              </div>
            </div>
          </aside>

          {/* Right Story Chapters */}
          <div className="lg:col-span-8 space-y-16">
            <section id="history" className="space-y-6 border-b border-[#38131E]/12 pb-12">
              <h2 className="text-xs uppercase tracking-[0.28em] font-semibold text-[#38131E]">
                History &amp; Origin
              </h2>

              <p
                data-reveal="heading"
                className="font-serif text-2xl sm:text-3xl text-[#38131E] leading-snug"
              >
                {tradition.editorial.history}
              </p>

              <p className="text-sm sm:text-base text-[#1A1718]/82 leading-relaxed">
                {tradition.editorial.regionalOrigins}
              </p>
            </section>

            <section id="motifs" className="space-y-6 border-b border-[#38131E]/12 pb-12">
              <h2 className="text-xs uppercase tracking-[0.28em] font-semibold text-[#38131E]">
                Classic Motifs
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {tradition.motifs.map((motif) => (
                  <div
                    key={motif.id}
                    data-reveal="card"
                    className="rk-surface-card p-5 space-y-4 flex flex-col justify-between"
                  >
                    <div className="bg-[#2B0E17] p-3 rounded-[2px] text-[#F1D889]">
                      <MotifDiagram kind={motif.svgKind} className="w-full h-24" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-serif text-xl text-[#38131E]">
                        {motif.name}
                      </h3>
                      <p className="text-xs text-[#1A1718]/78 leading-relaxed">
                        {motif.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="material-craft" className="space-y-6 border-b border-[#38131E]/12 pb-12">
              <h2 className="text-xs uppercase tracking-[0.28em] font-semibold text-[#38131E]">
                Fabric &amp; Craft
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rk-surface-card p-6 space-y-2.5">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#38131E]/60 font-semibold">
                    How It Feels &amp; Drapes
                  </p>
                  <p className="text-sm text-[#1A1718]/82 leading-relaxed">
                    {tradition.editorial.materialCharacteristics}
                  </p>
                </div>

                <div className="rk-surface-card p-6 space-y-2.5">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#38131E]/60 font-semibold">
                    What Makes It Special
                  </p>
                  <p className="text-sm text-[#1A1718]/82 leading-relaxed">
                    {tradition.editorial.craftsmanship}
                  </p>
                </div>
              </div>
            </section>

            <section id="significance-care" className="space-y-6 border-b border-[#38131E]/12 pb-12">
              <h2 className="text-xs uppercase tracking-[0.28em] font-semibold text-[#38131E]">
                Why It&apos;s Loved &amp; How to Care for It
              </h2>

              <p className="font-serif text-xl sm:text-2xl text-[#38131E] leading-relaxed">
                {tradition.editorial.culturalSignificance}
              </p>

              <div className="bg-[#EFE6D5] border border-[#38131E]/14 rounded-[2px] p-6 sm:p-8 space-y-4">
                <h3 className="font-serif text-2xl text-[#38131E]">
                  Caring for Your Piece
                </h3>
                <ul className="list-disc pl-5 space-y-2.5 text-sm text-[#1A1718]/85 leading-relaxed">
                  {tradition.careGuidance.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
                <p className="text-[11px] text-[#38131E]/70 pt-2 border-t border-[#38131E]/12">
                  Exact fabric details and care needs vary by piece — always check the
                  Fabric &amp; Care section on a garment before ordering.
                </p>
              </div>
            </section>

            <section id="available-pieces" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.26em] text-[#38131E]/65 mb-2">
                    In Store Now
                  </p>
                  <h2 className="font-serif text-3xl text-[#38131E]">
                    Available {tradition.name} Pieces
                  </h2>
                </div>
                <EditorialButton to={tradition.shopRoute} variant="secondary">
                  <span>Open in Shop</span>
                  <ArrowRight className="w-4 h-4" />
                </EditorialButton>
              </div>

              <ProductGrid
                products={matchingProducts}
                loading={loading}
                columnsClass="grid-cols-2 sm:grid-cols-2"
                emptyProps={{
                  title: `No ${tradition.name} pieces in stock right now`,
                  description:
                    "Single pieces move quickly between our Indore shop and website. Take a look at our full saree collection while new styles arrive.",
                  actionLabel: "Browse All Sarees",
                  actionTo: "/shop/saree/all",
                  secondaryAction: (
                    <EditorialButton to="/shop/all/all" variant="secondary">
                      See Everything In Store
                    </EditorialButton>
                  ),
                }}
              />
            </section>
          </div>
        </div>

        {/* ── PREVIOUS / NEXT NAVIGATOR ── */}
        {prevTradition && nextTradition && (
          <nav
            aria-label="Browse neighboring textile stories"
            className="pt-8 border-t border-[#38131E]/15 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <Link
              to={`/heritage/${prevTradition.slug}`}
              className="group p-4 sm:p-6 rounded-[2px] bg-[#FBF7EE] border border-[#38131E]/14 hover:border-[#D4AF63] flex items-center justify-between gap-3 sm:gap-4 transition-colors"
            >
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#38131E]/60">
                  ← Previous
                </p>
                <p className="font-serif text-lg sm:text-2xl text-[#38131E] mt-1">
                  {prevTradition.name}
                </p>
              </div>
              <ArrowLeft className="w-5 h-5 text-[#D4AF63] group-hover:-translate-x-1 transition-transform shrink-0" />
            </Link>

            <Link
              to={`/heritage/${nextTradition.slug}`}
              className="group p-4 sm:p-6 rounded-[2px] bg-[#FBF7EE] border border-[#38131E]/14 hover:border-[#D4AF63] flex items-center justify-between gap-3 sm:gap-4 text-right transition-colors"
            >
              <ArrowRight className="w-5 h-5 text-[#D4AF63] group-hover:translate-x-1 transition-transform sm:order-2 shrink-0" />
              <div className="sm:order-1 ml-auto">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#38131E]/60">
                  Next →
                </p>
                <p className="font-serif text-lg sm:text-2xl text-[#38131E] mt-1">
                  {nextTradition.name}
                </p>
              </div>
            </Link>
          </nav>
        )}
      </div>
    </div>
  );
};

export default HeritageTraditionPage;
