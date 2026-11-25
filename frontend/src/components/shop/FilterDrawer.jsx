import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import FilterPanel from "../ui/FilterPanel";
import EditorialButton from "../ui/EditorialButton";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";

export default function FilterDrawer({ open, onClose, resultCount = 0, ...filterProps }) {
  const closeRef = useRef(null);

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return undefined;
    closeRef.current?.focus();
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Filter products"
      className="fixed inset-0 z-[95] lg:hidden flex flex-col justify-end"
    >
      <div
        className="fixed inset-0 bg-[#1A1718]/65 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative bg-[#F7F1E5] rounded-t-[2px] border-t border-[#D4AF63]/50 shadow-2xl max-h-[88dvh] flex flex-col">
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-[#38131E]/14 shrink-0">
          <span className="font-serif text-xl text-[#38131E]">Refine Selection</span>
          <div className="flex items-center gap-2">
            {filterProps.onClearAll && (
              <button
                type="button"
                onClick={filterProps.onClearAll}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[2px] text-xs uppercase tracking-[0.16em] text-[#38131E]/75 hover:text-[#38131E] hover:bg-[#38131E]/6 transition-colors cursor-pointer"
              >
                Reset
              </button>
            )}
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close filter drawer"
              className="w-10 h-10 rounded-[2px] flex items-center justify-center text-[#38131E] hover:bg-[#EFE6D5] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          data-lenis-prevent=""
          data-lenis-prevent-wheel=""
          data-lenis-prevent-touch=""
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain rk-filter-scroll px-6 py-5"
        >
          <FilterPanel hideHeader {...filterProps} />
        </div>

        <div className="p-4 bg-[#FBF7EE] border-t border-[#38131E]/12 flex items-center justify-between gap-3 shrink-0">
          <EditorialButton onClick={onClose} className="w-full">
            Show {resultCount} {resultCount === 1 ? "Piece" : "Pieces"}
          </EditorialButton>
        </div>
      </div>
    </div>
  );
}
