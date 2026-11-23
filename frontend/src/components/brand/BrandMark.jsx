import React from "react";

/**
 * Renders only owner-supplied Revakalp SVG artwork from /public/branding/.
 * Never stretch, crop, or apply CSS recoloring filters.
 */
const VARIANTS = {
  headerLight: "/branding/logos/svg/revakalp-header-burgundy.svg",
  headerDark: "/branding/logos/svg/revakalp-header-gold.svg",
  headerIvory: "/branding/logos/svg/revakalp-header-ivory.svg",
  primaryLight: "/branding/logos/svg/revakalp-primary-burgundy.svg",
  primaryDark: "/branding/logos/svg/revakalp-primary-gold.svg",
  primaryIvory: "/branding/logos/svg/revakalp-primary-ivory.svg",
  iconLight: "/branding/icons/revakalp-icon-burgundy-on-ivory.svg",
  iconDark: "/branding/icons/revakalp-icon-gold-transparent.svg",
  iconGoldOnBurgundy: "/branding/icons/revakalp-icon-gold-on-burgundy.svg",
  iconIvory: "/branding/icons/revakalp-icon-ivory-transparent.svg",
};

export default function BrandMark({
  variant = "headerLight",
  className = "",
  decorative = false,
  alt = "REVAKALP",
  ...props
}) {
  const src = VARIANTS[variant] || VARIANTS.headerLight;
  return (
    <img
      src={src}
      alt={decorative ? "" : alt}
      aria-hidden={decorative ? true : undefined}
      loading="eager"
      decoding="async"
      className={`block object-contain select-none ${className}`.trim()}
      {...props}
    />
  );
}
