import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { RotateCcw } from "lucide-react";
import useReducedMotion from "../motion/useReducedMotion";
import { HERITAGE_TRADITIONS } from "../../data/heritageTraditions";

/**
 * Cartographic contour path representing India across a 600x660 SVG grid.
 */
const INDIA_OUTLINE_PATH =
  "M 218 44 L 250 56 L 266 84 L 288 94 L 270 120 L 290 152 L 315 170 L 348 186 L 392 208 L 430 205 L 448 228 L 468 214 L 512 195 L 548 212 L 538 250 L 502 270 L 492 294 L 474 265 L 446 254 L 422 272 L 428 310 L 395 338 L 368 380 L 330 412 L 302 456 L 298 498 L 284 548 L 258 602 L 240 612 L 216 575 L 194 508 L 176 446 L 166 378 L 154 334 L 116 320 L 92 292 L 112 262 L 106 232 L 138 192 L 165 152 L 176 112 L 170 72 Z";

const INDORE_ANCHOR = { x: 222, y: 312 };

export default function IndiaHeritageMap({
  activeSlug = "maheshwari",
  onSelect,
  zoomToActive = true,
  onToggleZoom,
  compact = false,
}) {
  const svgRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const activeTradition =
    HERITAGE_TRADITIONS.find((t) => t.slug === activeSlug) || HERITAGE_TRADITIONS[0];

  const targetViewBox =
    zoomToActive && activeTradition?.map?.zoomViewBox
      ? activeTradition.map.zoomViewBox
      : "45 25 520 610";

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return undefined;

    if (reducedMotion || typeof window === "undefined") {
      svg.setAttribute("viewBox", targetViewBox);
      return undefined;
    }

    const currentParts = (svg.getAttribute("viewBox") || "45 25 520 610")
      .split(/\s+/)
      .map(Number);
    const targetParts = targetViewBox.split(/\s+/).map(Number);
    if (currentParts.length !== 4 || targetParts.length !== 4) {
      svg.setAttribute("viewBox", targetViewBox);
      return undefined;
    }

    const proxy = {
      x: currentParts[0],
      y: currentParts[1],
      w: currentParts[2],
      h: currentParts[3],
    };

    const tween = gsap.to(proxy, {
      x: targetParts[0],
      y: targetParts[1],
      w: targetParts[2],
      h: targetParts[3],
      duration: 0.9,
      ease: "power3.inOut",
      onUpdate: () => {
        svg.setAttribute(
          "viewBox",
          `${proxy.x.toFixed(1)} ${proxy.y.toFixed(1)} ${proxy.w.toFixed(1)} ${proxy.h.toFixed(1)}`
        );
      },
    });

    return () => tween.kill();
  }, [targetViewBox, reducedMotion]);

  const handleMarkerKeyDown = (e, slug) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (onSelect) onSelect(slug);
    }
  };

  return (
    <div className="relative w-full h-full bg-[#2B0E17] border border-[#D4AF63]/35 rounded-[2px] overflow-hidden select-none">
      {/* Subtle Cartographic Header Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2 pointer-events-none">
        <span className="px-2.5 py-1 bg-[#2B0E17]/88 border border-[#D4AF63]/35 text-[10px] uppercase tracking-[0.2em] text-[#F1D889]">
          {compact ? activeTradition.region : "India Textile Map"}
        </span>

        {!compact && onToggleZoom && (
          <button
            type="button"
            onClick={onToggleZoom}
            className="pointer-events-auto inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#2B0E17]/90 border border-[#D4AF63]/45 text-[10px] uppercase tracking-[0.16em] text-[#F7F1E5] hover:bg-[#D4AF63] hover:text-[#2B0E17] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{zoomToActive ? "Full India View" : "Focus Region"}</span>
          </button>
        )}
      </div>

      <svg
        ref={svgRef}
        viewBox="45 25 520 610"
        className="w-full h-full min-h-[340px] sm:min-h-[420px] block"
        role="img"
        aria-label="Interactive Textile Heritage Map of India showing regional textile origins"
      >
        <defs>
          <radialGradient id="rk-map-glow" cx="50%" cy="48%" r="60%">
            <stop offset="0%" stopColor="#521C2D" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#2B0E17" stopOpacity="0.98" />
          </radialGradient>
        </defs>

        <rect x="-100" y="-100" width="900" height="900" fill="url(#rk-map-glow)" />

        {/* Graticule Meridians & Parallels */}
        <g stroke="#D4AF63" strokeOpacity="0.1" strokeWidth="0.8">
          {[120, 200, 280, 360, 440].map((x) => (
            <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="660" />
          ))}
          {[100, 200, 300, 400, 500, 580].map((y) => (
            <line key={`h-${y}`} x1="0" y1={y} x2="620" y2={y} />
          ))}
        </g>

        {/* India Contour Silhouette */}
        <path
          d={INDIA_OUTLINE_PATH}
          fill="#38131E"
          fillOpacity="0.85"
          stroke="#D4AF63"
          strokeOpacity="0.55"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Indore Boutique Anchor & Connecting Silk Arc */}
        {activeTradition?.map && (
          <path
            d={`M ${INDORE_ANCHOR.x} ${INDORE_ANCHOR.y} Q ${(INDORE_ANCHOR.x + activeTradition.map.x) / 2} ${
              Math.min(INDORE_ANCHOR.y, activeTradition.map.y) - 36
            } ${activeTradition.map.x} ${activeTradition.map.y}`}
            fill="none"
            stroke="#F1D889"
            strokeOpacity="0.7"
            strokeWidth="1.4"
            strokeDasharray="4 4"
          />
        )}

        <g transform={`translate(${INDORE_ANCHOR.x}, ${INDORE_ANCHOR.y})`}>
          <polygon
            points="0,-5 5,0 0,5 -5,0"
            fill="#F7F1E5"
            stroke="#D4AF63"
            strokeWidth="1"
          />
          <text
            x="9"
            y="3"
            fill="#F7F1E5"
            fillOpacity="0.65"
            fontSize="8.5"
            letterSpacing="1.6"
          >
            INDORE
          </text>
        </g>

        {/* Regional Textile Pins */}
        {HERITAGE_TRADITIONS.map((trad) => {
          const isSelected = trad.slug === activeTradition.slug;
          const { x, y, labelAlign } = trad.map;
          const textX = labelAlign === "left" ? -13 : 13;
          const anchor = labelAlign === "left" ? "end" : "start";

          return (
            <g
              key={trad.slug}
              transform={`translate(${x}, ${y})`}
              role={onSelect ? "button" : undefined}
              tabIndex={onSelect ? 0 : undefined}
              aria-label={onSelect ? `Select ${trad.name} (${trad.region})` : undefined}
              aria-pressed={onSelect ? isSelected : undefined}
              onClick={onSelect ? () => onSelect(trad.slug) : undefined}
              onKeyDown={onSelect ? (e) => handleMarkerKeyDown(e, trad.slug) : undefined}
              className={onSelect ? "cursor-pointer outline-none" : undefined}
            >
              {/* Invisible expanded hit area */}
              <circle cx="0" cy="0" r="18" fill="transparent" />

              {isSelected && (
                <>
                  <circle
                    cx="0"
                    cy="0"
                    r="15"
                    fill="#D4AF63"
                    fillOpacity="0.16"
                    stroke="#F1D889"
                    strokeOpacity="0.55"
                    strokeWidth="1"
                  />
                  <circle cx="0" cy="0" r="9" fill="none" stroke="#F1D889" strokeWidth="1" />
                </>
              )}

              <circle
                cx="0"
                cy="0"
                r={isSelected ? "5" : "3.8"}
                fill={isSelected ? "#F1D889" : "#D4AF63"}
                stroke="#2B0E17"
                strokeWidth="1.4"
              />

              <text
                x={textX}
                y="-1"
                textAnchor={anchor}
                fill={isSelected ? "#F1D889" : "#F7F1E5"}
                fillOpacity={isSelected ? "1" : "0.78"}
                fontSize={isSelected ? "10.5" : "9"}
                fontWeight={isSelected ? "600" : "400"}
                letterSpacing="1.2"
              >
                {trad.name.toUpperCase()}
              </text>
              <text
                x={textX}
                y="9.5"
                textAnchor={anchor}
                fill="#D4AF63"
                fillOpacity={isSelected ? "0.95" : "0.6"}
                fontSize="7.5"
                letterSpacing="0.8"
              >
                {trad.region}
              </text>
            </g>
          );
        })}

        {/* Compass Rose in Bottom Left */}
        <g transform="translate(88, 560)" opacity="0.45">
          <circle cx="0" cy="0" r="18" fill="none" stroke="#D4AF63" strokeWidth="0.8" />
          <line x1="0" y1="-22" x2="0" y2="22" stroke="#D4AF63" strokeWidth="0.8" />
          <line x1="-22" y1="0" x2="22" y2="0" stroke="#D4AF63" strokeWidth="0.8" />
          <text x="0" y="-25" textAnchor="middle" fill="#F1D889" fontSize="8">
            N
          </text>
        </g>
      </svg>
    </div>
  );
}
