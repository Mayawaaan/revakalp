import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import FilterPanel from "../ui/FilterPanel";
import EditorialButton from "../ui/EditorialButton";

export default function FilterDrawer({ open, onClose, resultCount = 0, ...filterProps }) {
  const closeRef = useRef(null);

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
        className="fixed inset-0 bg-[#1A1718]/60 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative bg-[#F7F1E5] rounded-t-3xl border-t border-[#D4AF63]/40 shadow-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#38131E]/12">
          <span className="font-serif text-xl text-[#38131E]">Refine Selection</span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close filter drawer"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#38131E] hover:bg-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <FilterPanel {...filterProps} />
        </div>

        <div className="p-4 bg-white border-t border-[#38131E]/10 flex items-center justify-between gap-3">
          <EditorialButton onClick={onClose} className="w-full">
            Show {resultCount} {resultCount === 1 ? "Piece" : "Pieces"}
          </EditorialButton>
        </div>
      </div>
    </div>
  );
}
