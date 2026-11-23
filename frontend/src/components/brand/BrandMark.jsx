import React from "react";
import { useTheme } from "../../context/themeConfig";

/**
 * Dynamically themed Revakalp wordmark & monogram renderer.
 * Uses CSS mask-image over owner SVG silhouettes paired with `--rk-*` palette tokens
 * so brand marks recolor natively with every Admin theme & Dark Mode without
 * leaving behind signature burgundy `#511D2A` pixels.
 */
const VARIANT_CONFIG = {
  headerLight: {
    maskUrl: "/branding/logos/svg/revakalp-header-burgundy.svg",
    aspectRatio: "480 / 91",
    fill: "var(--rk-primary, #38131E)",
    badgeBg: null,
  },
  headerDark: {
    maskUrl: "/branding/logos/svg/revakalp-header-gold.svg",
    aspectRatio: "480 / 91",
    fill: "linear-gradient(135deg, var(--rk-accent-bright, #F1D889) 0%, var(--rk-accent, #D4AF63) 55%, var(--rk-accent-bright, #F1D889) 100%)",
    badgeBg: null,
  },
  headerIvory: {
    maskUrl: "/branding/logos/svg/revakalp-header-ivory.svg",
    aspectRatio: "480 / 91",
    fill: "var(--rk-on-primary, #F7F1E5)",
    badgeBg: null,
  },
  primaryLight: {
    maskUrl: "/branding/logos/svg/revakalp-primary-burgundy.svg",
    aspectRatio: "480 / 120",
    fill: "var(--rk-primary, #38131E)",
    badgeBg: null,
  },
  primaryDark: {
    maskUrl: "/branding/logos/svg/revakalp-primary-gold.svg",
    aspectRatio: "480 / 120",
    fill: "linear-gradient(135deg, var(--rk-accent-bright, #F1D889) 0%, var(--rk-accent, #D4AF63) 55%, var(--rk-accent-bright, #F1D889) 100%)",
    badgeBg: null,
  },
  primaryIvory: {
    maskUrl: "/branding/logos/svg/revakalp-primary-ivory.svg",
    aspectRatio: "480 / 120",
    fill: "var(--rk-on-primary, #F7F1E5)",
    badgeBg: null,
  },
  iconLight: {
    maskUrl: "/branding/icons/revakalp-icon-gold-transparent.svg",
    aspectRatio: "1 / 1",
    fill: "var(--rk-primary, #38131E)",
    badgeBg: "var(--rk-bg, #F7F1E5)",
    inset: "12%",
  },
  iconDark: {
    maskUrl: "/branding/icons/revakalp-icon-gold-transparent.svg",
    aspectRatio: "1 / 1",
    fill: "linear-gradient(135deg, var(--rk-accent-bright, #F1D889) 0%, var(--rk-accent, #D4AF63) 65%, var(--rk-accent-bright, #F1D889) 100%)",
    badgeBg: null,
  },
  iconGoldOnBurgundy: {
    maskUrl: "/branding/icons/revakalp-icon-gold-transparent.svg",
    aspectRatio: "1 / 1",
    fill: "linear-gradient(135deg, var(--rk-accent-bright, #F1D889) 0%, var(--rk-accent, #D4AF63) 65%, var(--rk-accent-bright, #F1D889) 100%)",
    badgeBg: "var(--rk-primary-deep, #2B0E17)",
    inset: "12%",
  },
  iconIvory: {
    maskUrl: "/branding/icons/revakalp-icon-ivory-transparent.svg",
    aspectRatio: "1 / 1",
    fill: "var(--rk-on-primary, #F7F1E5)",
    badgeBg: null,
  },
};

const DARK_MODE_PAIR = {
  headerLight: "headerDark",
  primaryLight: "primaryDark",
  iconLight: "iconDark",
};

export default function BrandMark({
  variant = "headerLight",
  className = "",
  decorative = false,
  alt = "REVAKALP",
  style,
  ...props
}) {
  const { isDarkMode } = useTheme();
  const effectiveVariant =
    isDarkMode && DARK_MODE_PAIR[variant] ? DARK_MODE_PAIR[variant] : variant;
  const config = VARIANT_CONFIG[effectiveVariant] || VARIANT_CONFIG.headerLight;

  const maskStyles = {
    background: config.fill,
    WebkitMaskImage: `url("${config.maskUrl}")`,
    maskImage: `url("${config.maskUrl}")`,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
    WebkitMaskSize: "contain",
    maskSize: "contain",
  };

  return (
    <span
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : alt}
      aria-hidden={decorative ? true : undefined}
      className={`relative inline-block shrink-0 select-none ${className}`.trim()}
      style={{
        aspectRatio: config.aspectRatio,
        ...(config.badgeBg
          ? { backgroundColor: config.badgeBg, borderRadius: "22%" }
          : {}),
        ...style,
      }}
      {...props}
    >
      <span
        aria-hidden="true"
        className="block absolute"
        style={{
          inset: config.inset || "0",
          ...maskStyles,
        }}
      />
    </span>
  );
}
