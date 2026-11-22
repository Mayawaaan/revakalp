import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import EditorialButton from "../ui/EditorialButton";
import SceneFallback from "../three/SceneFallback";
import useReducedMotion, { checkWebGLSupport } from "../motion/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const LazyFabricStudy = lazy(() => import("../three/FabricStudy"));

export default function TextileExperience() {
  const reducedMotion = useReducedMotion();
  const [webglOk, setWebglOk] = useState(checkWebGLSupport);
  const sectionRef = useRef(null);
  const progressRef = useRef(0);

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
        start: "top top",
        end: "+=36%",
        pin: true,
        pinSpacing: true,
        scrub: 0.6,
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
        className="w-full h-full object-cover opacity-35 mix-blend-luminosity"
      />
    </div>
  );

  return (
    <section
      ref={sectionRef}
      data-pin-section="textile-study"
      aria-label="The Revakalp Experience"
      className="relative overflow-hidden bg-[#2B0E17] text-[#F7F1E5] py-20 sm:py-28 border-b border-[#D4AF63]/30"
    >
      {/* Background GLSL Fabric Study with Static Fallback */}
      <div className="absolute inset-0 pointer-events-none">
        {staticFallback}
        {webglOk && !reducedMotion && (
          <SceneFallback onError={() => setWebglOk(false)} fallback={null}>
            <div className="absolute inset-0 opacity-85">
              <Suspense fallback={null}>
                <LazyFabricStudy progressRef={progressRef} />
              </Suspense>
            </div>
          </SceneFallback>
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#2B0E17]/95 via-[#2B0E17]/65 to-[#2B0E17]/85"
        />
      </div>

      {/* Editorial Foreground */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-3">
            <span data-line-draw className="h-px w-8 bg-[#D4AF63]" aria-hidden="true" />
            <p className="uppercase tracking-[0.28em] text-[11px] text-[#F1D889] font-medium">
              The Indore Edit
            </p>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#F7F1E5] leading-[1.08]">
            The Revakalp{" "}
            <span className="italic font-normal text-[#F1D889]">Experience</span>
          </h2>

          <p className="text-sm sm:text-base text-[#F7F1E5]/80 max-w-xl leading-relaxed">
            A retail destination bringing together India&apos;s diverse regional
            textiles and contemporary everyday silhouettes — selected with care
            for weddings, festivals, and quiet celebrations.
          </p>

          <div className="pt-2">
            <EditorialButton to="/shop" variant="gold">
              <span>Discover the Edit</span>
              <ArrowRight className="w-4 h-4" />
            </EditorialButton>
          </div>
        </div>

        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          {[
            { label: "Occasionwear", value: "Sarees & Lehengas" },
            { label: "Menswear", value: "Kurta & Jodhpuri" },
            { label: "Contemporary", value: "Printed Tees" },
            { label: "Retail Root", value: "Indore, M.P." },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-5 rounded-2xl bg-[#38131E]/80 backdrop-blur-xs border border-[#D4AF63]/35"
            >
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#F1D889] mb-1">
                {stat.label}
              </p>
              <p className="font-serif text-lg sm:text-xl text-[#F7F1E5]">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
