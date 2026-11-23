import React, { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search, X, MapPin } from "lucide-react";
import useStore from "../../store/store";
import Breadcrums from "../../components/globalComponents/Breadcrums";
import SectionHeading from "../../components/ui/SectionHeading";
import EditorialButton from "../../components/ui/EditorialButton";
import ProductGrid from "../../components/ui/ProductGrid";
import IndiaHeritageMap from "../../components/heritage/IndiaHeritageMap";
import HeritageFabricCanvas from "../../components/heritage/HeritageFabricCanvas";
import useReducedMotion from "../../components/motion/useReducedMotion";
import useReveal from "../../components/motion/useReveal";
import { useSeoMeta } from "../../utils/seo";
import {
  HERITAGE_TRADITIONS,
  HERITAGE_ZONES,
  matchTraditionProducts,
} from "../../data/heritageTraditions";

const HeritageAtlasPage = () => {
  const { products, loading } = useStore();
  const [activeSlug, setActiveSlug] = useState(
    HERITAGE_TRADITIONS[0]?.slug || "maheshwari"
  );
  const [activeZone, setActiveZone] = useState("All");
  const [query, setQuery] = useState("");
  const [mapFocused, setMapFocused] = useState(false);
  const pageRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useReveal(pageRef, reducedMotion);

  useSeoMeta({
    title: "Indian Textile Atlas · All 29 States",
    description:
      "Explore regional saree & handloom textile traditions from every Indian state at Revakalp — official map, Markdown textile dossiers, and 3D micro-weave previews.",
    canonicalPath: "/heritage",
  });

  const activeTradition = useMemo(
    () =>
      HERITAGE_TRADITIONS.find((t) => t.slug === activeSlug) ||
      HERITAGE_TRADITIONS[0],
    [activeSlug]
  );

  const filteredTraditions = useMemo(() => {
    const q = query.trim().toLowerCase();
    return HERITAGE_TRADITIONS.filter((t) => {
      if (activeZone !== "All" && t.zone !== activeZone) return false;
      if (!q) return true;
      return (
        t.state.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.sareeTitle.toLowerCase().includes(q) ||
        t.subRegion.toLowerCase().includes(q)
      );
    });
  }, [activeZone, query]);

  const activeMatches = useMemo(
    () => matchTraditionProducts(products, activeTradition),
    [products, activeTradition]
  );

  const allHeritageProducts = useMemo(() => {
    const seen = new Set();
    const list = [];
    for (const trad of HERITAGE_TRADITIONS) {
      for (const prod of matchTraditionProducts(products, trad)) {
        const id = prod._id || prod.id;
        if (id && !seen.has(id)) {
          seen.add(id);
          list.push(prod);
        }
      }
    }
    return list;
  }, [products]);

  const handleSelectTradition = (slug) => {
    setActiveSlug(slug);
    setMapFocused(true);
  };

  return (
    <div ref={pageRef} className="bg-[#F7F1E5] min-h-screen">
      {/* ── OPENING STAGE ── */}
      <section className="relative overflow-hidden bg-[#2B0E17] text-[#F7F1E5] py-12 sm:py-24 border-b border-[#D4AF63]/30">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#2B0E17]/75 via-[#2B0E17]/88 to-[#2B0E17]"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <p className="uppercase tracking-[0.34em] text-[10px] sm:text-[11px] font-medium text-[#F1D889]">
              Indian Textile Guide · {HERITAGE_TRADITIONS.length} Regional Dossiers
            </p>

            <h1 className="font-serif text-[clamp(2.25rem,5.2vw,4.6rem)] leading-[1.03] tracking-tight text-[#F7F1E5]">
              Stories Woven
              <span className="block italic font-normal text-[#F1D889] mt-1">
                Across Every State.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#F7F1E5]/82 leading-relaxed max-w-2xl">
              From Maheshwar along the Narmada to Srinagar, Sualkuchi, Kanchipuram,
              and Patan — explore sarees and regional handloom weaves from across{" "}
              <strong className="text-[#F1D889] font-medium">
                {HERITAGE_TRADITIONS.length} Indian states &amp; valleys
              </strong>{" "}
              with authentic state mapping and tactile 3D thread inspection.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row flex-wrap gap-3">
              <EditorialButton
                href="#interactive-atlas"
                variant="gold"
                className="w-full sm:w-auto"
              >
                <span>Explore the India Map</span>
              </EditorialButton>

              <EditorialButton
                to="/shop/saree/all"
                variant="outlineDark"
                className="w-full sm:w-auto"
              >
                <span>Browse Sarees</span>
                <ArrowRight className="w-4 h-4" />
              </EditorialButton>
            </div>
          </div>

          <div className="lg:col-span-5">
            <HeritageFabricCanvas
              preset={activeTradition?.shaderPreset}
              traditionName={activeTradition?.name}
              motifKind={activeTradition?.motifs[0]?.svgKind}
              swatches={activeTradition?.paletteSwatches}
              weaveStructure={activeTradition?.weaveStructure}
              loomType={activeTradition?.loomType}
              className="h-64 sm:h-84"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12 sm:space-y-20">
        <Breadcrums />

        {/* ── INTERACTIVE MAP STAGE ── */}
        <section
          id="interactive-atlas"
          aria-label="Official Interactive Textile Map of India"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
            <SectionHeading
              eyebrow="Across India"
              title="Pick any state"
              accentWord="tradition"
              subtitle="Click any state directly on the map, or filter by zone below, to inspect its saree dossier and 3D micro-weave."
              align="left"
            />

            {/* State / Weave Search Input */}
            <div className="relative w-full lg:w-72 shrink-0">
              <Search className="w-4 h-4 text-[#38131E]/55 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search state or saree…"
                aria-label="Filter states or saree traditions"
                className="w-full h-10 pl-9 pr-8 rounded-[2px] bg-[#FBF7EE] border border-[#38131E]/22 text-xs text-[#1A1718] placeholder:text-[#1A1718]/45 focus:outline-none focus:border-[#D4AF63]"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear filter"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#38131E]/60 hover:text-[#38131E] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Zone Filter Tabs */}
          <div className="flex flex-nowrap sm:flex-wrap overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 pb-1 gap-2 mb-4">
            {HERITAGE_ZONES.map((zone) => {
              const count =
                zone === "All"
                  ? HERITAGE_TRADITIONS.length
                  : HERITAGE_TRADITIONS.filter((t) => t.zone === zone).length;
              const isSelected = activeZone === zone;
              return (
                <button
                  key={zone}
                  type="button"
                  onClick={() => setActiveZone(zone)}
                  className={`rk-chip shrink-0 ${isSelected ? "rk-chip-active" : ""}`}
                >
                  <span>{zone}</span>
                  <span className="text-[10px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>

          {/* State Quick Selector Strip */}
          <div
            role="tablist"
            aria-label="Select Indian state textile tradition"
            className="flex flex-nowrap overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 gap-1.5 mb-6"
          >
            {filteredTraditions.map((trad) => {
              const selected = trad.slug === activeTradition?.slug;
              return (
                <button
                  key={trad.slug}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  onClick={() => handleSelectTradition(trad.slug)}
                  className={`shrink-0 px-3 py-1.5 rounded-[2px] text-[10.5px] uppercase tracking-[0.12em] border transition-colors cursor-pointer ${
                    selected
                      ? "bg-[#D4AF63] text-[#2B0E17] border-[#D4AF63] font-semibold"
                      : "bg-[#FBF7EE] text-[#38131E] border-[#38131E]/18 hover:border-[#D4AF63]"
                  }`}
                >
                  {trad.state} · {trad.name}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
            <div className="lg:col-span-7 min-h-[340px] sm:min-h-[540px]">
              <IndiaHeritageMap
                activeSlug={activeTradition?.slug}
                onSelect={handleSelectTradition}
                zoomToActive={mapFocused}
                onToggleZoom={() => setMapFocused((prev) => !prev)}
              />
            </div>

            {activeTradition && (
              <div className="lg:col-span-5 rk-surface-card p-5 sm:p-8 flex flex-col justify-between gap-5 sm:gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#38131E]/12 pb-3 text-[10px] uppercase tracking-[0.22em] text-[#38131E]/70">
                    <span className="font-semibold text-[#38131E] inline-flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-[#D4AF63]" />
                      {activeTradition.state}
                    </span>
                    <span>{activeTradition.zone} India</span>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#38131E]/60 mb-1">
                      {activeTradition.subRegion}
                    </p>
                    <h2 className="font-serif text-3xl sm:text-4xl text-[#38131E]">
                      {activeTradition.name}
                    </h2>
                    <p className="text-xs text-[#38131E]/75 mt-1 font-medium">
                      {activeTradition.sareeTitle}
                    </p>
                  </div>

                  <p className="font-serif italic text-lg text-[#38131E]/85">
                    &ldquo;{activeTradition.tagline}&rdquo;
                  </p>

                  <p className="text-sm text-[#1A1718]/80 leading-relaxed">
                    {activeTradition.summary}
                  </p>

                  {/* Weave Architecture Strip */}
                  <div className="grid grid-cols-1 gap-2 p-3 rounded-[2px] bg-[#EFE6D5] border border-[#38131E]/12 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] uppercase tracking-[0.16em] text-[#38131E]/65">
                        Weave
                      </span>
                      <span className="font-medium text-[#38131E] text-right">
                        {activeTradition.weaveStructure}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] uppercase tracking-[0.16em] text-[#38131E]/65">
                        Loom
                      </span>
                      <span className="text-[#1A1718]/85 text-right">
                        {activeTradition.loomType}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#38131E]/65 font-semibold">
                      Signature Motifs
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {activeTradition.motifs.map((m) => (
                        <span
                          key={m.id}
                          className="px-3 py-1 bg-[#EFE6D5] border border-[#38131E]/14 text-xs text-[#38131E]"
                        >
                          {m.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-5 border-t border-[#38131E]/12 space-y-3">
                  <p className="text-xs text-[#38131E]/80 font-medium">
                    In store now:{" "}
                    <strong className="text-[#38131E]">
                      {activeMatches.length > 0
                        ? `${activeMatches.length} ${
                            activeMatches.length === 1 ? "piece" : "pieces"
                          } available`
                        : "Explore full dossier or browse sarees"}
                    </strong>
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <EditorialButton
                      to={`/heritage/${activeTradition.slug}`}
                      variant="primary"
                      className="flex-1"
                    >
                      <span>Read Full Dossier</span>
                      <ArrowRight className="w-4 h-4" />
                    </EditorialButton>

                    <EditorialButton
                      to={activeTradition.shopRoute}
                      variant="secondary"
                      className="flex-1"
                    >
                      <span>Browse Sarees</span>
                    </EditorialButton>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── ALL STATE CHAPTER PLATES ── */}
        <section aria-label="State Textile Stories Directory">
          <SectionHeading
            eyebrow={`State Archive (${filteredTraditions.length})`}
            title="Sarees Across"
            accentWord="India"
            subtitle="Detailed heritage dossiers authored per state — history, weaving centers, yarn characteristics, loom method, and preservation notes."
            align="left"
            className="mb-8"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTraditions.map((trad) => {
              const count = matchTraditionProducts(products, trad).length;
              return (
                <Link
                  key={trad.slug}
                  to={`/heritage/${trad.slug}`}
                  data-reveal="card"
                  className="group rk-surface-card p-6 sm:p-7 hover:border-[#D4AF63] transition-colors flex flex-col justify-between gap-5"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-[#38131E]/65">
                      <span className="font-semibold text-[#38131E]">
                        {trad.index} · {trad.state}
                      </span>
                      <div className="flex items-center gap-1">
                        {trad.paletteSwatches.map((hex) => (
                          <span
                            key={hex}
                            aria-hidden="true"
                            className="w-3 h-3 rounded-[1px] border border-[#38131E]/20"
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-serif text-2xl sm:text-3xl text-[#38131E] group-hover:text-[#2B0E17]">
                        {trad.name}
                      </h3>
                      <p className="text-[11px] uppercase tracking-[0.14em] text-[#38131E]/60 mt-1">
                        {trad.subRegion}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-[#1A1718]/78 leading-relaxed line-clamp-3">
                      {trad.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#38131E]/12 flex items-center justify-between text-xs uppercase tracking-[0.16em] font-medium text-[#38131E]">
                    <span>{count > 0 ? `${count} in stock` : "Read dossier"}</span>
                    <ArrowRight className="w-4 h-4 text-[#D4AF63] group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── AVAILABLE HERITAGE PIECES ── */}
        <section aria-label="Available Pieces From These Traditions">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <SectionHeading
              eyebrow="In Store Now"
              title="Available"
              accentWord="Pieces"
              subtitle="Garments in our Indore shop and online right now across these weaving traditions."
              align="left"
            />
            <Link
              to="/shop/saree/all"
              className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#38131E] border-b border-[#D4AF63] pb-1 self-start md:self-auto"
            >
              See all sarees →
            </Link>
          </div>

          <ProductGrid
            products={allHeritageProducts.slice(0, 8)}
            loading={loading}
            emptyProps={{
              title: "Fresh pieces arrive regularly",
              description:
                "None of our currently listed items match these regional tags right now — browse everything in our store today.",
              actionLabel: "Browse Everything In Store",
              actionTo: "/shop/all/all",
            }}
          />
        </section>

        {/* ── TRANSPARENCY NOTE ── */}
        <section className="rounded-[2px] bg-[#2B0E17] text-[#F7F1E5] p-5 sm:p-9 border border-[#D4AF63]/35 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#F1D889]">
              A note from our store
            </p>
            <p className="text-sm text-[#F7F1E5]/82 leading-relaxed">
              Revakalp is an Indore boutique that selects garments from across India
              rather than weaving them ourselves. Exact fabric details, measurements,
              and blouse inclusions are always listed on each piece.
            </p>
          </div>
          <EditorialButton to="/past-editions" variant="gold">
            <span>See Past Editions</span>
            <ArrowRight className="w-4 h-4" />
          </EditorialButton>
        </section>
      </div>
    </div>
  );
};

export default HeritageAtlasPage;
