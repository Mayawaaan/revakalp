import React, { useEffect } from "react";
import { motion } from "framer-motion";
import useStore from "../../store/store";
import EditorialButton from "../ui/EditorialButton";
import useReducedMotion from "../motion/useReducedMotion";

const MotionDiv = motion.div;
const MotionImg = motion.img;
const MotionP = motion.p;
const MotionH1 = motion.h1;

const EASE_OUT = [0.22, 1, 0.36, 1];

export default function HeroEditorial() {
  const activeCampaigns = useStore((s) => s.activeCampaigns);
  const trackCampaign = useStore((s) => s.trackCampaign);
  const siteLoaded = useStore((s) => s.siteLoaded);
  const reducedMotion = useReducedMotion();
  const ready = reducedMotion || siteLoaded;

  const heroCampaign = Array.isArray(activeCampaigns)
    ? activeCampaigns.find((c) => c.slot === "home_hero")
    : null;

  useEffect(() => {
    if (heroCampaign?._id) {
      trackCampaign?.(heroCampaign._id, "impression");
    }
  }, [heroCampaign?._id, trackCampaign]);

  const eyebrow = heroCampaign?.badgeText || "Indore Store";
  const subtitle =
    heroCampaign?.subtitle ||
    "Sarees, lehengas, Indo-Western, and everyday tees.";
  const ctaLabel = heroCampaign?.ctaLabel || "Explore Collections";
  const ctaRoute = heroCampaign?.destinationRoute || "/shop";
  const desktopImg =
    heroCampaign?.desktopImage || "/campaign/hero-editorial-1600.jpg";
  const mobileImg =
    heroCampaign?.mobileImage ||
    heroCampaign?.desktopImage ||
    "/campaign/hero-editorial-800.jpg";
  const altText =
    heroCampaign?.altText || "Revakalp bridal lehenga campaign artwork";

  const handleHeroCtaClick = () => {
    if (heroCampaign?._id) {
      trackCampaign?.(heroCampaign._id, "click");
    }
  };

  return (
    <section
      aria-label="Revakalp Hero"
      className="relative overflow-hidden bg-[#2B0E17] text-[#F7F1E5] border-b border-[#D4AF63]/25"
    >
      {/* Mobile & Tablet (< 1024px) */}
      <div className="lg:hidden">
        <div className="relative aspect-[4/4.2] sm:aspect-[16/10] w-full overflow-hidden bg-[#2B0E17]">
          <MotionImg
            initial={reducedMotion ? false : { scale: 1.08, opacity: 0.7 }}
            animate={ready ? { scale: 1, opacity: 1 } : { scale: 1.08, opacity: 0.7 }}
            transition={{ duration: reducedMotion ? 0 : 1.35, ease: EASE_OUT }}
            src={mobileImg}
            srcSet={
              heroCampaign?.mobileImage || heroCampaign?.desktopImage
                ? undefined
                : "/campaign/hero-editorial-800.jpg 800w, /campaign/hero-editorial-1600.jpg 1600w"
            }
            sizes="100vw"
            width={1600}
            height={900}
            fetchPriority="high"
            loading="eager"
            decoding="sync"
            alt={altText}
            className="w-full h-full object-cover object-[76%_18%]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(0deg, color-mix(in srgb, var(--rk-primary-deep, #2B0E17) 72%, transparent) 0%, color-mix(in srgb, var(--rk-primary-deep, #2B0E17) 22%, transparent) 45%, transparent 100%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, color-mix(in srgb, var(--rk-primary-deep, #2B0E17) 58%, transparent) 0%, color-mix(in srgb, var(--rk-primary, #38131E) 24%, var(--rk-accent, #D4AF63) 10%) 48%, transparent 100%)",
            }}
          />
        </div>

        <div className="px-4 sm:px-10 pb-10 sm:pb-14 pt-4">
          <MotionP
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: reducedMotion ? 0 : 0.55, delay: 0.08, ease: EASE_OUT }}
            className="uppercase tracking-[0.26em] text-[10px] font-medium text-[#F1D889] mb-3 sm:mb-4"
          >
            {eyebrow}
          </MotionP>

          <MotionH1
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: reducedMotion ? 0 : 0.7, delay: 0.16, ease: EASE_OUT }}
            className="font-serif text-[2.2rem] sm:text-5xl text-[#F7F1E5] leading-[1.04] tracking-tight"
          >
            {heroCampaign?.title ? (
              heroCampaign.title
            ) : (
              <>
                Weaving Life
                <span className="block italic font-normal text-[#F1D889] mt-1">
                  Into Time.
                </span>
              </>
            )}
          </MotionH1>

          <MotionP
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: reducedMotion ? 0 : 0.65, delay: 0.26, ease: EASE_OUT }}
            className="mt-3.5 sm:mt-4 text-sm sm:text-base text-[#F7F1E5]/85 max-w-md leading-relaxed"
          >
            {subtitle}
          </MotionP>

          <MotionDiv
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: reducedMotion ? 0 : 0.65, delay: 0.34, ease: EASE_OUT }}
            className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3"
          >
            <EditorialButton
              to={ctaRoute}
              onClick={handleHeroCtaClick}
              variant="gold"
              className="w-full sm:w-auto"
            >
              <span>{ctaLabel}</span>
            </EditorialButton>

            <EditorialButton to="/heritage" variant="outlineDark" className="w-full sm:w-auto">
              <span>Indian Textiles</span>
            </EditorialButton>
          </MotionDiv>
        </div>
      </div>

      {/* Desktop (>= 1024px) */}
      <div className="hidden lg:flex relative min-h-[78vh] max-h-[780px] items-center">
        <MotionImg
          initial={reducedMotion ? false : { scale: 1.07, opacity: 0.72 }}
          animate={ready ? { scale: 1, opacity: 1 } : { scale: 1.07, opacity: 0.72 }}
          transition={{ duration: reducedMotion ? 0 : 1.45, ease: EASE_OUT }}
          src={desktopImg}
          srcSet={
            heroCampaign?.desktopImage
              ? undefined
              : "/campaign/hero-editorial-800.jpg 800w, /campaign/hero-editorial-1600.jpg 1600w"
          }
          sizes="100vw"
          width={1600}
          height={900}
          fetchPriority="high"
          loading="eager"
          decoding="sync"
          alt={altText}
          className="absolute inset-0 w-full h-full object-cover object-[76%_18%]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, color-mix(in srgb, var(--rk-primary-deep, #2B0E17) 74%, transparent) 0%, color-mix(in srgb, var(--rk-primary, #38131E) 52%, var(--rk-accent, #D4AF63) 10%) 34%, color-mix(in srgb, var(--rk-primary-deep, #2B0E17) 20%, var(--rk-accent, #D4AF63) 8%) 62%, transparent 100%)",
          }}
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 py-20">
          <div className="max-w-xl">
            <MotionP
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: reducedMotion ? 0 : 0.55, delay: 0.08, ease: EASE_OUT }}
              className="uppercase tracking-[0.32em] text-[11px] font-medium text-[#F1D889] mb-6"
            >
              {eyebrow}
            </MotionP>

            <MotionH1
              initial={reducedMotion ? false : { opacity: 0, y: 24 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: reducedMotion ? 0 : 0.75, delay: 0.16, ease: EASE_OUT }}
              className="font-serif text-[clamp(3.3rem,5.2vw,5rem)] text-[#F7F1E5] leading-[1.02] tracking-tight"
            >
              {heroCampaign?.title ? (
                heroCampaign.title
              ) : (
                <>
                  Weaving Life
                  <span className="block italic font-normal text-[#F1D889] mt-2">
                    Into Time.
                  </span>
                </>
              )}
            </MotionH1>

            <MotionP
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: reducedMotion ? 0 : 0.65, delay: 0.28, ease: EASE_OUT }}
              className="mt-6 text-base xl:text-lg text-[#F7F1E5]/88 leading-relaxed"
            >
              {subtitle}
            </MotionP>

            <MotionDiv
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: reducedMotion ? 0 : 0.65, delay: 0.36, ease: EASE_OUT }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <EditorialButton
                to={ctaRoute}
                onClick={handleHeroCtaClick}
                variant="gold"
              >
                <span>{ctaLabel}</span>
              </EditorialButton>

              <EditorialButton to="/heritage" variant="outlineDark">
                <span>Indian Textiles</span>
              </EditorialButton>
            </MotionDiv>
          </div>
        </div>
      </div>
    </section>
  );
}
