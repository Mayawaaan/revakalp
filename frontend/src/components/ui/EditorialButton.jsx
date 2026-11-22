import React from "react";
import { Link } from "react-router-dom";

const VARIANT_CLASSES = {
  primary:
    "bg-[#38131E] text-[#F7F1E5] border-[#38131E] hover:bg-[#2B0E17] hover:border-[#D4AF63] hover:shadow-[0_14px_34px_-16px_rgba(43,14,23,0.75)]",
  secondary:
    "bg-transparent text-[#38131E] border-[#38131E]/35 hover:bg-[#38131E] hover:text-[#F7F1E5] hover:border-[#38131E]",
  outlineDark:
    "bg-transparent text-[#F7F1E5] border-[#D4AF63]/65 hover:bg-[#D4AF63] hover:text-[#2B0E17] hover:border-[#D4AF63]",
  gold:
    "bg-[#D4AF63] text-[#2B0E17] border-[#D4AF63] hover:bg-[#F1D889] hover:border-[#F1D889]",
  ghost:
    "bg-transparent text-[#38131E] border-transparent hover:border-[#D4AF63]/50 hover:bg-[#38131E]/5",
};

export default function EditorialButton({
  to,
  href,
  variant = "primary",
  className = "",
  children,
  type = "button",
  ...props
}) {
  const base =
    "group relative overflow-hidden inline-flex items-center justify-center gap-2 min-h-[44px] sm:min-h-[46px] px-4 sm:px-7 py-2.5 sm:py-3 rounded-[2px] max-w-full text-center text-[11px] sm:text-xs font-medium tracking-[0.14em] sm:tracking-[0.2em] uppercase border transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none";
  const classes = `${base} ${VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary} ${className}`.trim();

  const inner = (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-[-20deg] transition-transform duration-700 group-hover:translate-x-[340%]"
      />
      <span className="relative z-10 inline-flex items-center gap-2.5">{children}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {inner}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {inner}
      </a>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {inner}
    </button>
  );
}
