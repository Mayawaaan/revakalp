import React, { Suspense, lazy, useState } from "react";
import { ZoomIn, ZoomOut, Sun, Play, Pause } from "lucide-react";
import SceneFallback from "../three/SceneFallback";
import useReducedMotion, { checkWebGLSupport } from "../motion/useReducedMotion";
import MotifDiagram from "./MotifDiagram";

const LazyFabricStudy = lazy(() => import("../three/FabricStudy"));

const LIGHT_MODES = [
  { label: "Soft Light", angle: 0.45 },
  { label: "Warm Gold", angle: 1.05 },
  { label: "Side Light", angle: 1.75 },
];

export default function HeritageFabricCanvas({
  preset = "maheshwari",
  traditionName = "Textile Study",
  motifKind = "wave",
  swatches = ["#38131E", "#D4AF63", "#F1D889"],
  showControls = true,
  className = "h-64 sm:h-80",
}) {
  const reducedMotion = useReducedMotion();
  const [webglOk, setWebglOk] = useState(checkWebGLSupport);
  const [macroZoom, setMacroZoom] = useState(false);
  const [lightIdx, setLightIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  const activeLight = LIGHT_MODES[lightIdx] || LIGHT_MODES[0];

  return (
    <div
      className={`relative overflow-hidden rounded-[2px] bg-[#2B0E17] border border-[#D4AF63]/35 ${className}`}
    >
      {/* Static / Reduced-Motion Fallback Woven Representation */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center p-6"
        style={{
          background: `radial-gradient(circle at 35% 30%, ${swatches[0]}cc 0%, #2B0E17 75%)`,
        }}
      >
        <div className="w-48 opacity-35 text-[#F1D889]">
          <MotifDiagram kind={motifKind} className="w-full h-auto" />
        </div>
      </div>

      {/* Live 3D GLSL Fabric Study when supported */}
      {webglOk && !reducedMotion && (
        <SceneFallback onError={() => setWebglOk(false)} fallback={null}>
          <div className="absolute inset-0">
            <Suspense fallback={null}>
              <LazyFabricStudy
                preset={preset}
                zoom={macroZoom ? 2.15 : 1.0}
                lightAngle={activeLight.angle}
                breeze={paused ? 0.0 : 1.0}
                paused={paused}
                interactive
              />
            </Suspense>
          </div>
        </SceneFallback>
      )}

      {/* Subtle Label */}
      <div className="pointer-events-none absolute top-3 left-3 flex items-center gap-2 z-10">
        <span className="px-2.5 py-1 bg-[#2B0E17]/82 backdrop-blur-xs border border-[#D4AF63]/40 text-[10px] uppercase tracking-[0.2em] text-[#F1D889]">
          {traditionName} Weave
        </span>
      </div>

      {showControls && webglOk && !reducedMotion && (
        <div
          role="toolbar"
          aria-label={`Interactive fabric controls for ${traditionName}`}
          className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 z-10 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2"
        >
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setMacroZoom((prev) => !prev)}
              aria-pressed={macroZoom}
              className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-[2px] text-[9.5px] sm:text-[10px] uppercase tracking-[0.12em] sm:tracking-[0.14em] border backdrop-blur-xs transition-colors cursor-pointer ${
                macroZoom
                  ? "bg-[#D4AF63] text-[#2B0E17] border-[#F1D889] font-semibold"
                  : "bg-[#2B0E17]/82 text-[#F1D889] border-[#D4AF63]/40 hover:bg-[#38131E]"
              }`}
            >
              {macroZoom ? <ZoomOut className="w-3 h-3" /> : <ZoomIn className="w-3 h-3" />}
              <span>{macroZoom ? "Full Drape" : "Zoom In"}</span>
            </button>

            <button
              type="button"
              onClick={() => setLightIdx((i) => (i + 1) % LIGHT_MODES.length)}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-[2px] text-[9.5px] sm:text-[10px] uppercase tracking-[0.12em] sm:tracking-[0.14em] border bg-[#2B0E17]/82 text-[#F1D889] border-[#D4AF63]/40 hover:bg-[#38131E] backdrop-blur-xs transition-colors cursor-pointer"
            >
              <Sun className="w-3 h-3" />
              <span>{activeLight.label}</span>
            </button>

            <button
              type="button"
              onClick={() => setPaused((prev) => !prev)}
              aria-pressed={paused}
              className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-[2px] text-[9.5px] sm:text-[10px] uppercase tracking-[0.12em] sm:tracking-[0.14em] border bg-[#2B0E17]/82 text-[#F1D889] border-[#D4AF63]/40 hover:bg-[#38131E] backdrop-blur-xs transition-colors cursor-pointer"
            >
              {paused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
              <span>{paused ? "Move" : "Pause"}</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-[#2B0E17]/80 px-2 py-1 border border-[#D4AF63]/30 rounded-[2px]">
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
