import React, { Suspense, lazy, useState } from "react";
import { ZoomIn, ZoomOut, Sun, Play, Pause } from "lucide-react";
import SceneFallback from "../three/SceneFallback";
import useReducedMotion, { checkWebGLSupport } from "../motion/useReducedMotion";
import MotifDiagram from "./MotifDiagram";

const LazyFabricStudy = lazy(() => import("../three/FabricStudy"));

const LIGHT_MODES = [
  { label: "Atelier Soft", angle: 0.42 },
  { label: "Zari Gold Glint", angle: 1.08 },
  { label: "Raking Weave Light", angle: 1.85 },
];

const ZOOM_MODES = [
  { label: "1.0× Drape", shortLabel: "1.0×", value: 1.0 },
  { label: "2.1× Weave", shortLabel: "2.1×", value: 2.1 },
  { label: "3.4× Macro Threads", shortLabel: "3.4× Macro", value: 3.4 },
];

export default function HeritageFabricCanvas({
  preset = "maheshwari",
  traditionName = "Textile Study",
  motifKind = "wave",
  swatches = ["#38131E", "#D4AF63", "#F1D889"],
  weaveStructure = "",
  loomType = "",
  showControls = true,
  className = "h-64 sm:h-80",
}) {
  const reducedMotion = useReducedMotion();
  const [webglOk, setWebglOk] = useState(checkWebGLSupport);
  const [zoomIdx, setZoomIdx] = useState(0);
  const [lightIdx, setLightIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  const activeLight = LIGHT_MODES[lightIdx] || LIGHT_MODES[0];
  const activeZoom = ZOOM_MODES[zoomIdx] || ZOOM_MODES[0];
  const isZoomed = zoomIdx > 0;

  return (
    <div
      className={`relative overflow-hidden rounded-[2px] border ${className}`}
      style={{
        backgroundColor: "var(--rk-primary-deep, #2B0E17)",
        borderColor: "color-mix(in srgb, var(--rk-accent, #D4AF63) 38%, transparent)",
      }}
    >
      {/* Static / Reduced-Motion Fallback Woven Representation */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center p-6"
        style={{
          background: `radial-gradient(circle at 35% 30%, ${swatches[0]}cc 0%, var(--rk-primary-deep, #2B0E17) 75%)`,
        }}
      >
        <div
          className="w-48 opacity-35"
          style={{ color: "var(--rk-accent-bright, #F1D889)" }}
        >
          <MotifDiagram kind={motifKind} className="w-full h-auto" />
        </div>
      </div>

      {/* Live 3D Photorealistic Micro-Weave GLSL Fabric Study */}
      {webglOk && !reducedMotion && (
        <SceneFallback onError={() => setWebglOk(false)} fallback={null}>
          <div className="absolute inset-0">
            <Suspense fallback={null}>
              <LazyFabricStudy
                preset={preset}
                zoom={activeZoom.value}
                lightAngle={activeLight.angle}
                breeze={paused ? 0.0 : 1.0}
                paused={paused}
                interactive
              />
            </Suspense>
          </div>
        </SceneFallback>
      )}

      {/* Header Label + Weave Metadata Badge */}
      <div className="pointer-events-none absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
        <span
          className="px-2.5 py-1 backdrop-blur-xs border text-[10px] uppercase tracking-[0.2em] truncate"
          style={{
            backgroundColor: "color-mix(in srgb, var(--rk-primary-deep, #2B0E17) 84%, transparent)",
            borderColor: "color-mix(in srgb, var(--rk-accent, #D4AF63) 42%, transparent)",
            color: "var(--rk-accent-bright, #F1D889)",
          }}
        >
          {traditionName} Weave
        </span>

        {weaveStructure && (
          <span
            className="hidden sm:inline-block px-2.5 py-1 backdrop-blur-xs border text-[9px] uppercase tracking-[0.14em] truncate max-w-[220px]"
            style={{
              backgroundColor: "color-mix(in srgb, var(--rk-primary-deep, #2B0E17) 84%, transparent)",
              borderColor: "color-mix(in srgb, var(--rk-accent, #D4AF63) 32%, transparent)",
              color: "var(--rk-on-primary, #F7F1E5)",
            }}
            title={loomType ? `${weaveStructure} — ${loomType}` : weaveStructure}
          >
            {weaveStructure}
          </span>
        )}
      </div>

      {showControls && webglOk && !reducedMotion && (
        <div
          role="toolbar"
          aria-label={`Interactive 3D micro-weave controls for ${traditionName}`}
          className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 z-10 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2"
        >
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setZoomIdx((i) => (i + 1) % ZOOM_MODES.length)}
              aria-pressed={isZoomed}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-[2px] text-[9.5px] sm:text-[10px] uppercase tracking-[0.12em] sm:tracking-[0.14em] border backdrop-blur-xs transition-colors cursor-pointer"
              style={
                isZoomed
                  ? {
                      backgroundColor: "var(--rk-accent, #D4AF63)",
                      color: "var(--rk-on-accent, #2B0E17)",
                      borderColor: "var(--rk-accent-bright, #F1D889)",
                      fontWeight: 600,
                    }
                  : {
                      backgroundColor: "color-mix(in srgb, var(--rk-primary-deep, #2B0E17) 84%, transparent)",
                      color: "var(--rk-accent-bright, #F1D889)",
                      borderColor: "color-mix(in srgb, var(--rk-accent, #D4AF63) 42%, transparent)",
                    }
              }
            >
              {zoomIdx === ZOOM_MODES.length - 1 ? (
                <ZoomOut className="w-3 h-3" />
              ) : (
                <ZoomIn className="w-3 h-3" />
              )}
              <span>{activeZoom.label}</span>
            </button>

            <button
              type="button"
              onClick={() => setLightIdx((i) => (i + 1) % LIGHT_MODES.length)}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-[2px] text-[9.5px] sm:text-[10px] uppercase tracking-[0.12em] sm:tracking-[0.14em] border backdrop-blur-xs transition-colors cursor-pointer"
              style={{
                backgroundColor: "color-mix(in srgb, var(--rk-primary-deep, #2B0E17) 84%, transparent)",
                color: "var(--rk-accent-bright, #F1D889)",
                borderColor: "color-mix(in srgb, var(--rk-accent, #D4AF63) 42%, transparent)",
              }}
            >
              <Sun className="w-3 h-3" />
              <span>{activeLight.label}</span>
            </button>

            <button
              type="button"
              onClick={() => setPaused((prev) => !prev)}
              aria-pressed={paused}
              className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-[2px] text-[9.5px] sm:text-[10px] uppercase tracking-[0.12em] sm:tracking-[0.14em] border backdrop-blur-xs transition-colors cursor-pointer"
              style={{
                backgroundColor: "color-mix(in srgb, var(--rk-primary-deep, #2B0E17) 84%, transparent)",
                color: "var(--rk-accent-bright, #F1D889)",
                borderColor: "color-mix(in srgb, var(--rk-accent, #D4AF63) 42%, transparent)",
              }}
            >
              {paused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
              <span>{paused ? "Move" : "Pause"}</span>
            </button>
          </div>

          <div
            className="hidden sm:flex items-center gap-1.5 px-2 py-1 border rounded-[2px]"
            style={{
              backgroundColor: "color-mix(in srgb, var(--rk-primary-deep, #2B0E17) 82%, transparent)",
              borderColor: "color-mix(in srgb, var(--rk-accent, #D4AF63) 34%, transparent)",
            }}
          >
            {swatches.map((hex) => (
              <span
                key={hex}
                aria-hidden="true"
                className="w-3.5 h-3.5 rounded-[1px] border border-[#D4AF63]/50"
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
