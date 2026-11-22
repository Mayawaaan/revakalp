import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useStore from "../../store/store";
import EditorialButton from "../ui/EditorialButton";
import SceneFallback from "../three/SceneFallback";
import useReducedMotion, { checkWebGLSupport } from "../motion/useReducedMotion";
import {
  HERITAGE_TRADITIONS,
  matchTraditionProducts,
} from "../../data/heritageTraditions";

gsap.registerPlugin(ScrollTrigger);

const LazyFabricStudy = lazy(() => import("../three/FabricStudy"));

export default function TextileExperience() {
  const { products } = useStore();
  const reducedMotion = useReducedMotion();
  const [webglOk, setWebglOk] = useState(checkWebGLSupport);
  const [activeSlug, setActiveSlug] = useState(HERITAGE_TRADITIONS[0].slug);
  const sectionRef = useRef(null);
  const progressRef = useRef(0);

  const activeTradition = useMemo(
    () =>
      HERITAGE_TRADITIONS.find((t) => t.slug === activeSlug) || HERITAGE_TRADITIONS[0],
    [activeSlug]
  );

  const matchingCount = useMemo(
    () => matchTraditionProducts(products, activeTradition).length,
    [products, activeTradition]
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion || typeof window === "undefined") {
      progressRef.current = 0;
      return undefined;
    }

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.5,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progressRef.current = self.progress;
        },
      });
    });

    return () => mm.revert();
  }, [reducedMotion]);

  const staticFallback = (
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-gradient-to-br from-[#2B0E17] via-[#38131E] to-[#2B0E17]"
    >
      <img
        src="/campaign/category-lehengas.png"
        alt=""
        loading="lazy"
        className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
      />
    </div>
  );

  return (
    <section
      ref={sectionRef}
      aria-label="The Revakalp Textile Heritage Gateway"
      className="relative overflow-hidden bg-[#2B0E17] text-[#F7F1E5] py-20 sm:py-28 border-b border-[#D4AF63]/30"
    >
      {/* Interactive GLSL Textile Shader Backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        {staticFallback}
        {webglOk && !reducedMotion && (
          <SceneFallback onError={() => setWebglOk(false)} fallback={null}>
            <div className="absolute inset-0 opacity-85">
              <Suspense fallback={null}>
                <LazyFabricStudy
                  progressRef={progressRef}
                  preset={activeTradition.shaderPreset}
                  interactive
                />
              </Suspense>
            </div>
          </SceneFallback>
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#2B0E17] via-[#2B0E17]/82 to-[#2B0E17]/45"
        />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <p className="uppercase tracking-[0.3em] text-[10px] sm:text-[11px] text-[#F1D889] font-medium">
            Indian Textile Guide
          </p>

          <h2 className="font-serif text-[clamp(2.25rem,4.5vw,3.75rem)] text-[#F7F1E5] leading-[1.06]">
            Six weaves,{" "}
            <span className="italic font-normal text-[#F1D889]">
              six stories.
            </span>
          </h2>

          {/* Interactive 6-Tradition Selector Strip */}
          <div
            role="tablist"
            aria-label="Inspect regional textile weaves"
            className="flex flex-wrap gap-2 pt-1"
          >
            {HERITAGE_TRADITIONS.map((trad) => {
              const selected = trad.slug === activeTradition.slug;
              return (
                <button
                  key={trad.slug}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  onClick={() => setActiveSlug(trad.slug)}
                  className={`px-3.5 py-2 rounded-[2px] text-[11px] uppercase tracking-[0.16em] border transition-colors cursor-pointer ${
                    selected
                      ? "bg-[#D4AF63] text-[#2B0E17] border-[#F1D889] font-semibold"
                      : "bg-[#2B0E17]/75 text-[#F7F1E5]/85 border-[#D4AF63]/35 hover:border-[#F1D889]"
                  }`}
                >
                  {trad.name}
                </button>
              );
            })}
          </div>

          {/* Active Tradition Reading Plate */}
          <div className="p-6 rounded-[2px] bg-[#2B0E17]/82 backdrop-blur-xs border border-[#D4AF63]/35 space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] uppercase tracking-[0.2em] text-[#F1D889]">
              <span>
                {activeTradition.region} — {activeTradition.subRegion}
              </span>
              <span className="font-mono text-[#F7F1E5]/65">
                {matchingCount > 0 ? `${matchingCount} available now` : "Weave guide"}
              </span>
            </div>

            <p className="font-serif text-xl sm:text-2xl text-[#F7F1E5] leading-snug">
              {activeTradition.tagline}
            </p>

            <p className="text-sm text-[#F7F1E5]/78 leading-relaxed">
              {activeTradition.summary}
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <EditorialButton to="/heritage" variant="gold">
                <span>Explore Textile Guide</span>
                <ArrowRight className="w-4 h-4" />
              </EditorialButton>

              <EditorialButton to={`/heritage/${activeTradition.slug}`} variant="outlineDark">
                <span>Read the {activeTradition.name} Story</span>
                <ArrowRight className="w-4 h-4" />
              </EditorialButton>
            </div>
          </div>
        </div>

        {/* Right Optical Silk Dossier Card */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className="p-6 sm:p-7 rounded-[2px] bg-[#2B0E17]/72 backdrop-blur-xs border border-[#D4AF63]/35 space-y-5">
            <div className="flex items-center justify-between border-b border-[#D4AF63]/20 pb-3">
              <span className="text-[10px] uppercase tracking-[0.24em] text-[#F1D889]">
                Weave Preview · {activeTradition.name}
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#F7F1E5]/60">
                Classic Motifs
              </p>
              <div className="space-y-2">
                {activeTradition.motifs.map((motif) => (
                  <div
                    key={motif.id}
                    className="flex items-start justify-between gap-3 py-1.5 border-b border-[#D4AF63]/12 last:border-0"
                  >
                    <span className="font-serif text-base text-[#F7F1E5]">
                      {motif.name}
                    </span>
                    <span className="text-[11px] text-[#F7F1E5]/65 text-right max-w-[55%]">
                      {motif.description.split(".")[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                {activeTradition.paletteSwatches.map((hex) => (
                  <span
                    key={hex}
                    aria-hidden="true"
                    className="w-5 h-5 rounded-[2px] border border-[#D4AF63]/60"
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
              <Link
                to={activeTradition.shopRoute}
                className="text-[11px] uppercase tracking-[0.18em] text-[#F1D889] hover:text-[#F7F1E5] border-b border-[#D4AF63]/50 pb-0.5"
              >
                See available pieces →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
