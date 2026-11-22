import React from "react";
import { motion } from "framer-motion";
import EditorialButton from "../ui/EditorialButton";

const MotionDiv = motion.div;
const MotionImg = motion.img;
const MotionP = motion.p;
const MotionH1 = motion.h1;

const EASE_OUT = [0.22, 1, 0.36, 1];

export default function HeroEditorial() {
  return (
    <section
      aria-label="Revakalp Hero"
      className="relative overflow-hidden bg-[#2B0E17] text-[#F7F1E5] border-b border-[#D4AF63]/25"
    >
      {/* Mobile & Tablet (< 1024px) */}
      <div className="lg:hidden">
        <div className="relative aspect-[4/4.2] sm:aspect-[16/10] w-full overflow-hidden bg-[#2B0E17]">
          <MotionImg
            initial={{ scale: 1.08, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.35, ease: EASE_OUT }}
            src="/campaign/hero-editorial-800.jpg"
            srcSet="/campaign/hero-editorial-800.jpg 800w, /campaign/hero-editorial-1600.jpg 1600w"
            sizes="100vw"
            width={1600}
            height={900}
            fetchPriority="high"
            loading="eager"
            decoding="sync"
            alt="Revakalp bridal lehenga campaign artwork"
            className="w-full h-full object-cover object-[76%_18%]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#2B0E17] via-[#2B0E17]/25 to-transparent"
          />
        </div>

        <div className="px-4 sm:px-10 pb-10 sm:pb-14 pt-4">
          <MotionP
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: EASE_OUT }}
            className="uppercase tracking-[0.26em] text-[10px] font-medium text-[#F1D889] mb-3 sm:mb-4"
          >
            Indore Store
          </MotionP>

          <MotionH1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: EASE_OUT }}
            className="font-serif text-[2.2rem] sm:text-5xl text-[#F7F1E5] leading-[1.04] tracking-tight"
          >
            Weaving Life
            <span className="block italic font-normal text-[#F1D889] mt-1">
              Into Time.
            </span>
          </MotionH1>

          <MotionP
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.26, ease: EASE_OUT }}
            className="mt-3.5 sm:mt-4 text-sm sm:text-base text-[#F7F1E5]/82 max-w-md leading-relaxed"
          >
            Sarees, lehengas, Indo-Western, and everyday tees.
          </MotionP>

          <MotionDiv
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.34, ease: EASE_OUT }}
            className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3"
          >
            <EditorialButton to="/shop" variant="gold" className="w-full sm:w-auto">
              <span>Explore Collections</span>
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
          initial={{ scale: 1.07, opacity: 0.72 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.45, ease: EASE_OUT }}
          src="/campaign/hero-editorial-1600.jpg"
          srcSet="/campaign/hero-editorial-800.jpg 800w, /campaign/hero-editorial-1600.jpg 1600w"
          sizes="100vw"
          width={1600}
          height={900}
          fetchPriority="high"
          loading="eager"
          decoding="sync"
          alt="Revakalp bridal lehenga campaign artwork"
          className="absolute inset-0 w-full h-full object-cover object-[76%_18%]"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#2B0E17] via-[#2B0E17]/82 to-transparent"
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 py-20">
          <div className="max-w-xl">
            <MotionP
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: EASE_OUT }}
              className="uppercase tracking-[0.32em] text-[11px] font-medium text-[#F1D889] mb-6"
            >
              Indore Store
            </MotionP>

            <MotionH1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.16, ease: EASE_OUT }}
              className="font-serif text-[clamp(3.3rem,5.2vw,5rem)] text-[#F7F1E5] leading-[1.02] tracking-tight"
            >
              Weaving Life
              <span className="block italic font-normal text-[#F1D889] mt-2">
                Into Time.
              </span>
            </MotionH1>

            <MotionP
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.28, ease: EASE_OUT }}
              className="mt-6 text-base xl:text-lg text-[#F7F1E5]/82 leading-relaxed"
            >
              Sarees, lehengas, Indo-Western, and everyday tees.
            </MotionP>

            <MotionDiv
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.36, ease: EASE_OUT }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <EditorialButton to="/shop" variant="gold">
                <span>Explore Collections</span>
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
