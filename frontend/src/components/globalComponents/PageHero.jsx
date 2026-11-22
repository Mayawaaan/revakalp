import React from "react";
import { motion } from "framer-motion";

const MotionDiv = motion.div;

/**
 * Architectural editorial page masthead using official Revakalp obsidian-burgundy, gold & ivory tokens.
 */
const PageHero = ({ label, title, subtitle, children }) => (
  <section className="relative overflow-hidden bg-[#2B0E17] text-[#F7F1E5] py-12 sm:py-24 px-4 sm:px-6 text-center border-b border-[#D4AF63]/30">
    {/* Atmospheric Radial Highlight */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse 65% 60% at 50% 45%, rgba(92,28,48,0.55) 0%, rgba(43,14,23,0.95) 100%)",
      }}
    />

    <MotionDiv
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 max-w-3xl mx-auto"
    >
      {label && (
        <p className="uppercase tracking-[0.34em] text-[10px] sm:text-[11px] text-[#F1D889] font-medium mb-4 sm:mb-5">
          {label}
        </p>
      )}

      <h1 className="font-serif text-[clamp(2rem,5vw,4.15rem)] text-[#F7F1E5] leading-[1.06] tracking-tight">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-4 sm:mt-5 text-sm sm:text-base text-[#F7F1E5]/78 leading-relaxed max-w-xl mx-auto">
          {subtitle}
        </p>
      )}

      {children && <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3">{children}</div>}
    </MotionDiv>
  </section>
);

export default PageHero;
