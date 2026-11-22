import React from "react";
import { Link } from "react-router-dom";

const VARIANT_CLASSES = {
  primary:
    "bg-[#38131E] text-[#F7F1E5] border-[#38131E] hover:bg-[#2B0E17] hover:border-[#D4AF63] hover:shadow-lg",
  secondary:
    "bg-[#F7F1E5] text-[#38131E] border-[#38131E]/35 hover:bg-[#38131E] hover:text-[#F7F1E5] hover:border-[#38131E]",
  outlineDark:
    "bg-transparent text-[#F7F1E5] border-[#D4AF63]/70 hover:bg-[#D4AF63] hover:text-[#2B0E17] hover:border-[#D4AF63]",
  gold:
    "bg-[#D4AF63] text-[#2B0E17] border-[#D4AF63] hover:bg-[#F1D889] hover:border-[#F1D889]",
  ghost:
    "bg-transparent text-[#38131E] border-transparent hover:bg-[#38131E]/5",
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
    "inline-flex items-center justify-center gap-2 min-h-[44px] px-7 py-3 rounded-full text-xs sm:text-sm font-medium tracking-[0.14em] uppercase border transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none";
  const classes = `${base} ${VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
