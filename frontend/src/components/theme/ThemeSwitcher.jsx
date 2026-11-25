import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, Moon, Palette, Sun } from "lucide-react";
import { useTheme } from "../../context/themeConfig";
import useStore from "../../store/store";
import useReducedMotion from "../motion/useReducedMotion";

const MotionDiv = motion.div;

/**
 * Admin-only global storefront Theme & Color Grading controller.
 * Selecting a scheme or light/dark mode previews immediately and persists to backend settings.
 */
export default function ThemeSwitcher() {
  const { scheme, mode, schemes, setScheme, setMode } = useTheme();
  const { updateSettings, showToast } = useStore();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const panelRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return undefined;
    const onOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const activeMeta = schemes.find((s) => s.id === scheme) || schemes[0];

  const handleApplyAndPersist = async (nextScheme, nextMode) => {
    const prevScheme = scheme;
    const prevMode = mode;

    setScheme(nextScheme);
    setMode(nextMode);
    setSaving(true);
    try {
      await updateSettings({
        themeScheme: nextScheme,
        themeMode: nextMode,
      });
      showToast?.("Storefront theme updated", "success");
    } catch (error) {
      setScheme(prevScheme);
      setMode(prevMode);
      showToast?.(
        error?.response?.data?.message || error?.message || "Failed to update storefront theme",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div ref={panelRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={`Global storefront theme (${activeMeta.name}, ${mode} mode)`}
        title="Global Storefront Theme & Color Grading"
        className="h-9 px-2.5 sm:px-3 rounded-full border border-[#D4AF63]/50 bg-[#F7F1E5] text-[#38131E] flex items-center gap-2 hover:border-[#D4AF63] transition-colors cursor-pointer"
      >
        {saving ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
        ) : mode === "dark" ? (
          <Moon className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
        ) : (
          <Sun className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
        )}
        <span className="flex items-center -space-x-1 shrink-0" aria-hidden="true">
          <span
            className="w-2.5 h-2.5 rounded-full border border-white/60"
            style={{ backgroundColor: activeMeta.swatches[0] }}
          />
          <span
            className="w-2.5 h-2.5 rounded-full border border-white/60"
            style={{ backgroundColor: activeMeta.swatches[1] }}
          />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] hidden sm:inline">
          {activeMeta.shortName}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <MotionDiv
            key="theme-switcher-popover"
            initial={reducedMotion ? false : { opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -4, scale: 0.97 }}
            transition={{
              duration: reducedMotion ? 0 : 0.16,
              ease: [0.22, 1, 0.36, 1],
            }}
            role="dialog"
            aria-label="Global storefront theme selector"
            className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-[#FBF7EE] border border-[#D4AF63]/50 rounded-xl shadow-2xl p-4 z-50 text-[#1A1718] space-y-4 origin-top-right"
          >
          <div className="flex items-center justify-between border-b border-[#38131E]/12 pb-2.5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#38131E]/65 font-semibold">
                Global Storefront Theme
              </p>
              <p className="font-serif text-base text-[#38131E]">
                {activeMeta.name} · {mode === "dark" ? "Dark" : "Light"}
              </p>
            </div>
            <Palette className="w-4 h-4 text-[#D4AF63]" />
          </div>

          {/* Light / Dark Mode Segmented Control */}
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#38131E]/65 font-semibold">
              Lighting Mode (Storefront Wide)
            </p>
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-[2px] bg-[#EFE6D5] border border-[#38131E]/12">
              <button
                type="button"
                disabled={saving}
                onClick={() => handleApplyAndPersist(scheme, "light")}
                aria-pressed={mode === "light"}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-[2px] text-[10.5px] uppercase tracking-[0.14em] font-semibold transition-colors cursor-pointer disabled:opacity-60 ${
                  mode === "light"
                    ? "bg-[#38131E] text-[#F1D889]"
                    : "text-[#38131E]/75 hover:text-[#38131E]"
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => handleApplyAndPersist(scheme, "dark")}
                aria-pressed={mode === "dark"}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-[2px] text-[10.5px] uppercase tracking-[0.14em] font-semibold transition-colors cursor-pointer disabled:opacity-60 ${
                  mode === "dark"
                    ? "bg-[#D4AF63] text-[#2B0E17]"
                    : "text-[#38131E]/75 hover:text-[#38131E]"
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* Curated Brand Color Schemes */}
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#38131E]/65 font-semibold">
              {schemes.length} Color Grading Schemes
            </p>
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {schemes.map((item) => {
                const selected = item.id === scheme;
                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={saving}
                    onClick={() => handleApplyAndPersist(item.id, mode)}
                    aria-pressed={selected}
                    className={`w-full flex items-center justify-between gap-2.5 p-2.5 rounded-[2px] border text-left transition-colors cursor-pointer disabled:opacity-60 ${
                      selected
                        ? "border-[#D4AF63] bg-[#EFE6D5]"
                        : "border-[#38131E]/14 hover:border-[#D4AF63]/70"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex items-center -space-x-1 shrink-0">
                        {item.swatches.map((hex) => (
                          <span
                            key={hex}
                            className="w-4 h-4 rounded-full border border-white/60 shadow-xs"
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <p className="text-xs font-semibold text-[#38131E] truncate">
                            {item.name}
                          </p>
                          {item.mood && (
                            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#38131E]/8 text-[#38131E]/75 shrink-0">
                              {item.mood}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#1A1718]/65 truncate">
                          {item.tagline}
                        </p>
                      </div>
                    </div>
                    {selected && (
                      <Check className="w-4 h-4 text-[#D4AF63] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
}
