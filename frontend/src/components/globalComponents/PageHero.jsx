import React from "react";

/**
 * Reusable editorial page hero using official Revakalp burgundy/gold/ivory tokens.
 */
const PageHero = ({ label, title, subtitle, children }) => (
  <section className="relative overflow-hidden bg-gradient-to-br from-[#2B0E17] via-[#38131E] to-[#2B0E17] text-[#F7F1E5] py-16 sm:py-24 px-6 text-center border-b border-[#D4AF63]/25">
    <div
      className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-25 blur-3xl"
      style={{ background: "radial-gradient(circle, #D4AF63 0%, transparent 70%)" }}
    />
    <div
      className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-20 blur-3xl"
      style={{ background: "radial-gradient(circle, #F1D889 0%, transparent 70%)" }}
    />

    <div className="relative z-10 max-w-3xl mx-auto">
      {label && (
        <div className="inline-flex items-center gap-3 mb-4">
          <span className="h-px w-6 bg-[#D4AF63]/70" aria-hidden="true" />
          <p className="uppercase tracking-[0.32em] text-[11px] text-[#F1D889] font-medium">
            {label}
          </p>
          <span className="h-px w-6 bg-[#D4AF63]/70" aria-hidden="true" />
        </div>
      )}

      <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#F7F1E5] leading-tight">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-5 text-sm sm:text-base text-[#F7F1E5]/80 leading-relaxed max-w-xl mx-auto">
          {subtitle}
        </p>
      )}

      {children && <div className="mt-7">{children}</div>}
    </div>
  </section>
);

export default PageHero;
