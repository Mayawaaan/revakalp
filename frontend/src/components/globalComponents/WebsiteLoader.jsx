import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useStore from "../../store/store";
import BrandMark from "../brand/BrandMark";
import useReducedMotion from "../motion/useReducedMotion";

const MotionDiv = motion.div;
const MotionP = motion.p;

/**
 * Luxury woven-curtain initial loader synchronized with page-entry choreography.
 * Skips immediately for /admin routes or reduced-motion users and triggers
 * `setSiteLoaded(true)` right as the curtain lifts so hero & scroll animations
 * begin only once the screen opens.
 */
const WebsiteLoader = () => {
  const siteLoaded = useStore((s) => s.siteLoaded);
  const setSiteLoaded = useStore((s) => s.setSiteLoaded);
  const settingsHydrated = useStore((s) => s.settingsHydrated);
  const reducedMotion = useReducedMotion();

  const isAdminPath =
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/admin");

  const [dismissed, setDismissed] = useState(
    () => siteLoaded || reducedMotion || isAdminPath
  );

  const hydratedRef = useRef(settingsHydrated);
  const tryCompleteRef = useRef(null);

  useEffect(() => {
    hydratedRef.current = settingsHydrated;
    if (settingsHydrated) {
      tryCompleteRef.current?.();
    }
  }, [settingsHydrated]);

  useEffect(() => {
    if (siteLoaded || reducedMotion || isAdminPath) {
      setSiteLoaded(true);
      setDismissed(true);
      return undefined;
    }

    let minDelayDone = false;
    let windowLoaded =
      typeof document !== "undefined" && document.readyState === "complete";
    let finished = false;

    const finishLoading = () => {
      if (finished) return;
      finished = true;
      if (typeof document !== "undefined") {
        delete document.documentElement.dataset.themePending;
      }
      setSiteLoaded(true);
      setDismissed(true);
    };

    const tryComplete = () => {
      if (minDelayDone && windowLoaded && hydratedRef.current) {
        finishLoading();
      }
    };

    tryCompleteRef.current = tryComplete;

    const minTimer = setTimeout(() => {
      minDelayDone = true;
      tryComplete();
    }, 950);

    // Safety cap ensures hero content is never blocked on slow external assets or API calls
    const maxCapTimer = setTimeout(finishLoading, 2200);

    const onWindowLoad = () => {
      windowLoaded = true;
      tryComplete();
    };

    if (!windowLoaded && typeof window !== "undefined") {
      window.addEventListener("load", onWindowLoad, { once: true });
    }

    return () => {
      tryCompleteRef.current = null;
      clearTimeout(minTimer);
      clearTimeout(maxCapTimer);
      if (typeof window !== "undefined") {
        window.removeEventListener("load", onWindowLoad);
      }
    };
  }, [siteLoaded, reducedMotion, isAdminPath, setSiteLoaded]);

  return (
    <AnimatePresence>
      {!dismissed && (
        <MotionDiv
          key="rk-site-loader"
          role="status"
          aria-live="polite"
          aria-label="Loading Revakalp"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[220] flex flex-col items-center justify-center overflow-hidden select-none pointer-events-auto"
          style={{
            backgroundColor: "var(--rk-primary-deep, #141416)",
            color: "var(--rk-on-primary, #F6F6F4)",
          }}
        >
          {/* Decorative Zari Warp & Weft Loom Lines */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.14]"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="rk-loom-grid"
                width="72"
                height="72"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 72 0 L 0 0 0 72"
                  fill="none"
                  stroke="var(--rk-accent, #B8A47C)"
                  strokeWidth="0.6"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#rk-loom-grid)" />
          </svg>

          {/* Subtle radial halo behind crest */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute w-[420px] h-[420px] rounded-full blur-3xl opacity-25"
            style={{
              background:
                "radial-gradient(circle, var(--rk-accent, #B8A47C) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 flex flex-col items-center px-6 text-center space-y-6">
            {/* Ornamental Hairline Frame */}
            <MotionDiv
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="px-6 py-4"
            >
              <BrandMark
                variant="primaryDark"
                className="w-52 sm:w-64"
                alt="REVAKALP"
              />
            </MotionDiv>

            {/* Golden Shuttle Loom Progress Track */}
            <div
              className="w-48 sm:w-56 h-[2px] rounded-full overflow-hidden"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--rk-accent, #B8A47C) 22%, transparent)",
              }}
            >
              <MotionDiv
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.92, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full origin-left"
                style={{ backgroundColor: "var(--rk-accent-bright, #D4C4A1)" }}
              />
            </div>

            <MotionP
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 0.85, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-[10px] sm:text-[11px] uppercase tracking-[0.34em] font-medium"
              style={{ color: "var(--rk-accent-bright, #D4C4A1)" }}
            >
              Weaving Life Into Time · Indore
            </MotionP>
          </div>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
};

export default WebsiteLoader;
