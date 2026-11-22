import React, { Suspense, lazy, useEffect, useState } from "react";
import { ArrowRight, MapPin, Sparkles, Image as ImageIcon } from "lucide-react";
import EditorialButton from "../ui/EditorialButton";
import SceneFallback from "../three/SceneFallback";
import useReducedMotion, { checkWebGLSupport } from "../motion/useReducedMotion";

const LazyLehengaScene = lazy(() => import("../three/LehengaScene"));

export default function HeroEditorial() {
  const reducedMotion = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : false
  );
  const [webglSupported] = useState(checkWebGLSupport);
  const [sceneReady, setSceneReady] = useState(false);
  const [viewMode, setViewMode] = useState("3d"); // "3d" | "editorial"

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const canShow3D = isDesktop && webglSupported && !reducedMotion && viewMode === "3d";

  return (
    <section
      aria-label="Revakalp Occasion Collection Hero"
      className="relative overflow-hidden bg-[#F7F1E5] border-b border-[#D4AF63]/30"
    >
      {/* ── MOBILE & TABLET HERO (< 1024px): fast LCP campaign layout, never hidden ── */}
      <div className="lg:hidden">
        <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden bg-[#2B0E17]">
          <img
            src="/campaign/hero-editorial-800.jpg"
            srcSet="/campaign/hero-editorial-800.jpg 800w, /campaign/hero-editorial-1600.jpg 1600w"
            sizes="100vw"
            width={1600}
            height={900}
            fetchPriority="high"
            loading="eager"
            decoding="sync"
            alt="Illustrative bridal lehenga editorial campaign artwork for Revakalp"
            className="w-full h-full object-cover object-[72%_18%]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#F7F1E5] via-[#F7F1E5]/15 to-transparent"
          />
        </div>

        <div className="relative -mt-6 px-5 sm:px-8 pb-12 pt-2 text-left">
          <div className="inline-flex items-center gap-2.5 mb-3">
            <span className="h-px w-6 bg-[#D4AF63]" aria-hidden="true" />
            <p className="uppercase tracking-[0.26em] text-[11px] font-medium text-[#38131E]/80">
              The Occasion Collection
            </p>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl text-[#38131E] leading-[1.08] tracking-tight">
            Tradition,{" "}
            <span className="italic font-normal text-[#38131E]">
              beautifully reimagined.
            </span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-[#1A1718]/80 max-w-md leading-relaxed">
            Ethnic wear and everyday expressions, curated in Indore.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <EditorialButton to="/shop" variant="primary" className="w-full sm:w-auto">
              <span>Explore Collections</span>
              <ArrowRight className="w-4 h-4" />
            </EditorialButton>

            <EditorialButton to="/about" variant="secondary" className="w-full sm:w-auto">
              <MapPin className="w-4 h-4" />
              <span>Our Store</span>
            </EditorialButton>
          </div>
        </div>
      </div>

      {/* ── DESKTOP HERO (>= 1024px): LCP Campaign Poster + Lazy R3F Exhibit Hybrid ── */}
      <div className="hidden lg:block relative min-h-[640px] xl:min-h-[700px]">
        {/* Eager LCP Campaign Backdrop */}
        <img
          src="/campaign/hero-editorial-1600.jpg"
          srcSet="/campaign/hero-editorial-800.jpg 800w, /campaign/hero-editorial-1600.jpg 1600w"
          sizes="100vw"
          width={1600}
          height={900}
          fetchPriority="high"
          loading="eager"
          decoding="sync"
          alt="Illustrative bridal lehenga editorial campaign artwork for Revakalp"
          className="absolute inset-0 w-full h-full object-cover object-right"
        />

        {/* Warm Ivory Scrim on Left for Guaranteed Readability */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#F7F1E5] via-[#F7F1E5]/92 to-[#F7F1E5]/10"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-16 min-h-[640px] xl:min-h-[700px] grid grid-cols-12 items-center gap-8">
          {/* Left Editorial Column */}
          <div className="col-span-6 pr-6">
            <div className="inline-flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-[#D4AF63]" aria-hidden="true" />
              <p className="uppercase tracking-[0.3em] text-xs font-medium text-[#38131E]/80">
                The Occasion Collection
              </p>
            </div>

            <h1 className="font-serif text-5xl xl:text-[4.1rem] text-[#38131E] leading-[1.05] tracking-tight">
              Tradition,
              <span className="block italic font-normal mt-1">
                beautifully reimagined.
              </span>
            </h1>

            <p className="mt-5 text-base xl:text-lg text-[#1A1718]/80 max-w-lg leading-relaxed">
              Ethnic wear and everyday expressions, curated in Indore.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <EditorialButton to="/shop" variant="primary">
                <span>Explore Collections</span>
                <ArrowRight className="w-4 h-4" />
              </EditorialButton>

              <EditorialButton to="/about" variant="secondary">
                <MapPin className="w-4 h-4" />
                <span>Our Store</span>
              </EditorialButton>
            </div>

            <div className="mt-8 flex items-center gap-4 text-xs text-[#38131E]/70">
              <span>Indore Retail Boutique</span>
              <span className="text-[#D4AF63]">•</span>
              <span>Sarees, Lehengas, Menswear &amp; Printed Tees</span>
            </div>
          </div>

          {/* Right Stage: Seamless Transition from LCP Campaign Art to Lazy 3D Exhibit */}
          <div className="col-span-6 relative h-[540px] xl:h-[600px] flex items-center justify-center">
            {canShow3D && (
              <SceneFallback onError={() => setViewMode("editorial")}>
                <div
                  className={`relative w-full max-w-[460px] h-full rounded-t-[230px] rounded-b-3xl overflow-hidden border border-[#D4AF63]/45 shadow-2xl transition-opacity duration-700 ${
                    sceneReady ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                  style={{
                    background:
                      "radial-gradient(circle at 50% 35%, rgba(72,24,39,0.92) 0%, rgba(43,14,23,0.98) 100%)",
                  }}
                >
                  <Suspense fallback={null}>
                    <LazyLehengaScene onReady={() => setSceneReady(true)} />
                  </Suspense>

                  {sceneReady && (
                    <div className="pointer-events-none absolute top-7 inset-x-10 flex items-center justify-center">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2B0E17]/75 backdrop-blur-xs border border-[#D4AF63]/40 text-[10px] uppercase tracking-[0.18em] text-[#F1D889]/90 whitespace-nowrap">
                        <span>Drag to rotate</span>
                      </span>
                    </div>
                  )}
                </div>
              </SceneFallback>
            )}

            {/* Toggle between 3D Exhibit and Full Campaign Art */}
            {webglSupported && !reducedMotion && (
              <button
                type="button"
                onClick={() =>
                  setViewMode((prev) => (prev === "3d" ? "editorial" : "3d"))
                }
                aria-label={
                  viewMode === "3d"
                    ? "Switch hero to campaign illustration"
                    : "Switch hero to interactive 3D exhibit"
                }
                className="absolute top-3 right-2 z-20 inline-flex items-center gap-2 min-h-[38px] px-3.5 py-1.5 rounded-full bg-[#F7F1E5]/95 border border-[#D4AF63]/60 text-[10px] uppercase tracking-[0.16em] font-medium text-[#38131E] shadow-md hover:bg-[#38131E] hover:text-[#F1D889] transition-colors cursor-pointer"
              >
                {viewMode === "3d" ? (
                  <>
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Campaign View</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>3D Exhibit</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
