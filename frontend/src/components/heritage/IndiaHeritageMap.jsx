import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { RotateCcw } from "lucide-react";
import useReducedMotion from "../motion/useReducedMotion";
import { HERITAGE_TRADITIONS } from "../../data/heritageTraditions";
import {
  INDIA_FULL_VIEWBOX,
  INDIA_MAP_STATES,
  INDORE_ANCHOR,
  getMapStateByTraditionSlug,
} from "../../data/indiaMapPaths";

export default function IndiaHeritageMap({
  activeSlug = "maheshwari",
  onSelect,
  zoomToActive = true,
  onToggleZoom,
  compact = false,
}) {
  const svgRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const [hoveredStateId, setHoveredStateId] = useState(null);

  const traditionBySlug = useMemo(() => {
    const map = new Map();
    for (const t of HERITAGE_TRADITIONS) {
      map.set(t.slug, t);
    }
    return map;
  }, []);

  const activeTradition =
    traditionBySlug.get(activeSlug) || HERITAGE_TRADITIONS[0];

  const activeMapState = useMemo(
    () =>
      getMapStateByTraditionSlug(activeTradition?.slug) ||
      INDIA_MAP_STATES.find((s) => s.traditionSlug),
    [activeTradition]
  );

  const hoveredState = useMemo(
    () =>
      hoveredStateId
        ? INDIA_MAP_STATES.find((s) => s.id === hoveredStateId) || null
        : null,
    [hoveredStateId]
  );

  const targetViewBox =
    zoomToActive && activeMapState?.zoomViewBox
      ? activeMapState.zoomViewBox
      : INDIA_FULL_VIEWBOX;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return undefined;

    if (reducedMotion || typeof window === "undefined") {
      svg.setAttribute("viewBox", targetViewBox);
      return undefined;
    }

    const currentParts = (svg.getAttribute("viewBox") || INDIA_FULL_VIEWBOX)
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
      duration: 0.85,
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

  const handleStateKeyDown = (e, traditionSlug) => {
    if (!traditionSlug || !onSelect) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(traditionSlug);
    }
  };

  const hoveredTradition = hoveredState?.traditionSlug
    ? traditionBySlug.get(hoveredState.traditionSlug)
    : null;

  const pinStates = useMemo(() => {
    const seenSlugs = new Set();
    const list = [];
    // Prefer Jammu & Kashmir over Ladakh for the primary Pashmina marker dot
    const sorted = [...INDIA_MAP_STATES].sort((a, b) => {
      if (a.name === "Jammu & Kashmir") return -1;
      if (b.name === "Jammu & Kashmir") return 1;
      return a.name.localeCompare(b.name);
    });
    for (const s of sorted) {
      if (!s.traditionSlug || seenSlugs.has(s.traditionSlug)) continue;
      seenSlugs.add(s.traditionSlug);
      list.push(s);
    }
    return list;
  }, []);

  return (
    <div
      className="relative w-full h-full border rounded-[2px] overflow-hidden select-none"
      style={{
        backgroundColor: "var(--rk-primary-deep, #2B0E17)",
        borderColor: "color-mix(in srgb, var(--rk-accent, #D4AF63) 38%, transparent)",
      }}
    >
      {/* Cartographic Header Bar */}
      <div className="absolute top-2.5 left-2.5 right-2.5 sm:top-3 sm:left-3 sm:right-3 z-10 flex items-center justify-between gap-2 pointer-events-none">
        <span
          className="px-2 sm:px-2.5 py-1 border text-[9px] sm:text-[10px] uppercase tracking-[0.16em] sm:tracking-[0.2em] truncate backdrop-blur-xs"
          style={{
            backgroundColor: "color-mix(in srgb, var(--rk-primary-deep, #2B0E17) 88%, transparent)",
            borderColor: "color-mix(in srgb, var(--rk-accent, #D4AF63) 38%, transparent)",
            color: "var(--rk-accent-bright, #F1D889)",
          }}
        >
          {compact ? activeTradition?.region : "India Handloom Atlas · 29 States"}
        </span>

        {!compact && onToggleZoom && (
          <button
            type="button"
            onClick={onToggleZoom}
            className="pointer-events-auto shrink-0 inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 border text-[9px] sm:text-[10px] uppercase tracking-[0.14em] sm:tracking-[0.16em] transition-colors cursor-pointer"
            style={{
              backgroundColor: "color-mix(in srgb, var(--rk-primary-deep, #2B0E17) 92%, transparent)",
              borderColor: "color-mix(in srgb, var(--rk-accent, #D4AF63) 48%, transparent)",
              color: "var(--rk-on-primary, #F7F1E5)",
            }}
          >
            <RotateCcw className="w-3 h-3" />
            <span>{zoomToActive ? "Full India View" : "Focus State"}</span>
          </button>
        )}
      </div>

      {/* Hover Tooltip Pill */}
      {!compact && hoveredState && (
        <div
          className="pointer-events-none absolute bottom-3 left-3 z-10 px-3 py-1.5 rounded-[2px] border backdrop-blur-xs max-w-[calc(100%-1.5rem)]"
          style={{
            backgroundColor: "color-mix(in srgb, var(--rk-primary-deep, #2B0E17) 92%, transparent)",
            borderColor: "color-mix(in srgb, var(--rk-accent, #D4AF63) 50%, transparent)",
            color: "var(--rk-on-primary, #F7F1E5)",
          }}
        >
          <p className="text-[10px] uppercase tracking-[0.18em] font-semibold truncate">
            {hoveredState.name}
          </p>
          <p
            className="text-[11px] font-serif italic truncate"
            style={{ color: "var(--rk-accent-bright, #F1D889)" }}
          >
            {hoveredTradition
              ? `${hoveredTradition.name} · ${hoveredTradition.sareeTitle || hoveredTradition.tagline}`
              : hoveredState.isUT
              ? "Union Territory of India"
              : "Regional Textile Territory"}
          </p>
        </div>
      )}

      <svg
        ref={svgRef}
        viewBox={INDIA_FULL_VIEWBOX}
        className="w-full h-full min-h-[320px] sm:min-h-[480px] block"
        role="img"
        aria-label="Official State-by-State Interactive Textile Map of India"
      >
        <defs>
          <radialGradient id="rk-india-glow" cx="48%" cy="46%" r="62%">
            <stop
              offset="0%"
              stopColor="var(--rk-primary, #38131E)"
              stopOpacity="0.68"
            />
            <stop
              offset="100%"
              stopColor="var(--rk-primary-deep, #2B0E17)"
              stopOpacity="0.98"
            />
          </radialGradient>
        </defs>

        <rect x="-120" y="-120" width="1040" height="1140" fill="url(#rk-india-glow)" />

        {/* Cartographic Meridians & Parallels */}
        <g stroke="var(--rk-accent, #D4AF63)" strokeOpacity="0.09" strokeWidth="0.9">
          {[100, 200, 300, 400, 500, 600, 700].map((x) => (
            <line key={`v-${x}`} x1={x} y1="-40" x2={x} y2="940" />
          ))}
          {[100, 200, 300, 400, 500, 600, 700, 800].map((y) => (
            <line key={`h-${y}`} x1="-40" y1={y} x2="840" y2={y} />
          ))}
        </g>

        {/* Official Survey-of-India State & UT Polygons */}
        <g>
          {INDIA_MAP_STATES.map((state) => {
            const isActive =
              Boolean(state.traditionSlug) &&
              state.traditionSlug === activeTradition?.slug &&
              !(activeTradition.slug === "pashmina" && state.name === "Ladakh");
            const isHighlandActive =
              activeTradition?.slug === "pashmina" && state.name === "Ladakh";
            const isHovered = hoveredStateId === state.id;
            const clickable = Boolean(onSelect && state.traditionSlug);

            let fill = "var(--rk-primary, #38131E)";
            let fillOpacity = 0.86;
            let stroke = "var(--rk-accent, #D4AF63)";
            let strokeOpacity = 0.42;
            let strokeWidth = 0.85;

            if (isActive || isHighlandActive) {
              fill = "var(--rk-accent, #D4AF63)";
              fillOpacity = 0.34;
              stroke = "var(--rk-accent-bright, #F1D889)";
              strokeOpacity = 0.98;
              strokeWidth = 1.75;
            } else if (isHovered) {
              fill = "var(--rk-accent, #D4AF63)";
              fillOpacity = 0.18;
              stroke = "var(--rk-accent-bright, #F1D889)";
              strokeOpacity = 0.82;
              strokeWidth = 1.25;
            }

            return (
              <path
                key={state.id}
                d={state.d}
                fill={fill}
                fillOpacity={fillOpacity}
                stroke={stroke}
                strokeOpacity={strokeOpacity}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                role={clickable ? "button" : undefined}
                tabIndex={clickable ? 0 : undefined}
                aria-label={
                  state.traditionSlug
                    ? `${state.name} — ${traditionBySlug.get(state.traditionSlug)?.name || ""}`
                    : state.name
                }
                aria-pressed={clickable ? isActive : undefined}
                onMouseEnter={() => setHoveredStateId(state.id)}
                onMouseLeave={() =>
                  setHoveredStateId((curr) => (curr === state.id ? null : curr))
                }
                onClick={clickable ? () => onSelect(state.traditionSlug) : undefined}
                onKeyDown={
                  clickable ? (e) => handleStateKeyDown(e, state.traditionSlug) : undefined
                }
                className={
                  clickable
                    ? "cursor-pointer outline-none transition-opacity duration-200"
                    : "transition-opacity duration-200"
                }
              />
            );
          })}
        </g>

        {/* Silk Trade Arc from Indore Boutique to Active State */}
        {activeMapState && (
          <path
            d={`M ${INDORE_ANCHOR.x} ${INDORE_ANCHOR.y} Q ${(INDORE_ANCHOR.x + activeMapState.cx) / 2} ${
              Math.min(INDORE_ANCHOR.y, activeMapState.cy) - 48
            } ${activeMapState.cx} ${activeMapState.cy}`}
            fill="none"
            stroke="var(--rk-accent-bright, #F1D889)"
            strokeOpacity="0.72"
            strokeWidth="1.5"
            strokeDasharray="5 4"
            className="pointer-events-none"
          />
        )}

        {/* Indore Anchor Diamond */}
        <g
          transform={`translate(${INDORE_ANCHOR.x}, ${INDORE_ANCHOR.y})`}
          className="pointer-events-none"
        >
          <polygon
            points="0,-5.5 5.5,0 0,5.5 -5.5,0"
            fill="var(--rk-on-primary, #F7F1E5)"
            stroke="var(--rk-accent, #D4AF63)"
            strokeWidth="1.2"
          />
          <text
            x="8.5"
            y="3"
            fill="var(--rk-on-primary, #F7F1E5)"
            fillOpacity="0.78"
            fontSize="8.5"
            fontWeight="600"
            letterSpacing="1.6"
          >
            INDORE
          </text>
        </g>

        {/* State Pin Markers */}
        {pinStates.map((state) => {
          const trad = traditionBySlug.get(state.traditionSlug);
          if (!trad) return null;
          const isSelected = state.traditionSlug === activeTradition?.slug;
          const isHovered = hoveredStateId === state.id;

          return (
            <g
              key={`pin-${state.id}`}
              transform={`translate(${state.cx}, ${state.cy})`}
              className="pointer-events-none"
            >
              {isSelected && (
                <>
                  <circle
                    cx="0"
                    cy="0"
                    r="16"
                    fill="var(--rk-accent, #D4AF63)"
                    fillOpacity="0.2"
                    stroke="var(--rk-accent-bright, #F1D889)"
                    strokeOpacity="0.65"
                    strokeWidth="1.1"
                  />
                  <circle
                    cx="0"
                    cy="0"
                    r="9.5"
                    fill="none"
                    stroke="var(--rk-accent-bright, #F1D889)"
                    strokeWidth="1.1"
                  />
                </>
              )}

              <circle
                cx="0"
                cy="0"
                r={isSelected ? "5.2" : isHovered ? "4.4" : "3.1"}
                fill={
                  isSelected
                    ? "var(--rk-accent-bright, #F1D889)"
                    : "var(--rk-accent, #D4AF63)"
                }
                fillOpacity={isSelected || isHovered ? 1 : 0.85}
                stroke="var(--rk-primary-deep, #2B0E17)"
                strokeWidth="1.2"
              />
            </g>
          );
        })}

        {/* Active State Callout Label */}
        {activeMapState && activeTradition && (
          <g
            transform={`translate(${activeMapState.cx}, ${activeMapState.cy})`}
            className="pointer-events-none"
          >
            {(() => {
              const textX = activeMapState.labelAlign === "left" ? -14 : 14;
              const anchor = activeMapState.labelAlign === "left" ? "end" : "start";
              return (
                <>
                  <text
                    x={textX}
                    y="-2"
                    textAnchor={anchor}
                    fill="var(--rk-accent-bright, #F1D889)"
                    fontSize="12"
                    fontWeight="700"
                    letterSpacing="1.3"
                  >
                    {activeTradition.name.toUpperCase()}
                  </text>
                  <text
                    x={textX}
                    y="10.5"
                    textAnchor={anchor}
                    fill="var(--rk-on-primary, #F7F1E5)"
                    fillOpacity="0.88"
                    fontSize="8.8"
                    letterSpacing="0.9"
                  >
                    {activeMapState.name}
                  </text>
                </>
              );
            })()}
          </g>
        )}

        {/* Compass Rose in Bottom Left */}
        <g transform="translate(88, 760)" opacity="0.52" className="pointer-events-none">
          <circle
            cx="0"
            cy="0"
            r="22"
            fill="none"
            stroke="var(--rk-accent, #D4AF63)"
            strokeWidth="0.9"
          />
          <line
            x1="0"
            y1="-28"
            x2="0"
            y2="28"
            stroke="var(--rk-accent, #D4AF63)"
            strokeWidth="0.9"
          />
          <line
            x1="-28"
            y1="0"
            x2="28"
            y2="0"
            stroke="var(--rk-accent, #D4AF63)"
            strokeWidth="0.9"
          />
          <text
            x="0"
            y="-32"
            textAnchor="middle"
            fill="var(--rk-accent-bright, #F1D889)"
            fontSize="10"
            fontWeight="600"
          >
            N
          </text>
        </g>

        {/* Territory Labels for Island Chains */}
        <g
          fill="var(--rk-accent, #D4AF63)"
          fillOpacity="0.55"
          fontSize="8"
          letterSpacing="1.4"
          className="pointer-events-none"
        >
          <text x="158" y="852" textAnchor="middle">
            LAKSHADWEEP
          </text>
          <text x="650" y="878" textAnchor="middle">
            ANDAMAN &amp; NICOBAR
          </text>
        </g>
      </svg>
    </div>
  );
}
