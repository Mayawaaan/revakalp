import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DEFAULT_PAGE_SIZES = [10, 25, 50, 100];

function buildPageRange(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, idx) => idx + 1);
  }
  const pages = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);

  if (left > 2) pages.push("ellipsis-left");
  for (let p = left; p <= right; p++) pages.push(p);
  if (right < total - 1) pages.push("ellipsis-right");

  pages.push(total);
  return pages;
}

export default function AdminPagination({
  page = 1,
  totalPages = 0,
  total = 0,
  limit = 10,
  onPageChange,
  onLimitChange,
  itemLabel = "items",
  options = DEFAULT_PAGE_SIZES,
  loading = false,
}) {
  const safeTotal = Math.max(0, Number(total) || 0);
  const safeLimit = Math.max(1, Number(limit) || 10);
  const safeTotalPages = Math.max(
    0,
    Number(totalPages) || (safeTotal > 0 ? Math.ceil(safeTotal / safeLimit) : 0)
  );
  const safePage = safeTotalPages > 0 ? Math.min(Math.max(1, page), safeTotalPages) : 1;

  const startItem = safeTotal === 0 ? 0 : (safePage - 1) * safeLimit + 1;
  const endItem = safeTotal === 0 ? 0 : Math.min(safeTotal, safePage * safeLimit);

  const pageNumbers = buildPageRange(safePage, safeTotalPages);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3.5 bg-[#FBF7EE]/70 border-t border-[#38131E]/12 text-xs text-[#5C4E52]">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-medium text-[#38131E]">
          {safeTotal === 0
            ? `Showing 0 ${itemLabel}`
            : `Showing ${startItem}–${endItem} of ${safeTotal} ${itemLabel}`}
        </span>

        <label className="inline-flex items-center gap-2">
          <span className="text-[#7A6A6E]">Items per page:</span>
          <select
            aria-label={`Items per page for ${itemLabel}`}
            value={safeLimit}
            disabled={loading}
            onChange={(e) => onLimitChange?.(Number(e.target.value))}
            className="border border-[#38131E]/20 rounded-lg px-2.5 py-1.5 bg-white text-[#38131E] font-medium focus:outline-none focus:ring-2 focus:ring-[#D4AF63] cursor-pointer disabled:opacity-60"
          >
            {options.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      {safeTotalPages > 1 && (
        <div className="flex items-center gap-1 flex-wrap">
          <button
            type="button"
            disabled={loading || safePage <= 1}
            onClick={() => onPageChange?.(safePage - 1)}
            aria-label="Previous page"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#38131E]/18 bg-white text-[#38131E] hover:border-[#D4AF63] hover:bg-[#F7F1E5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft size={14} />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {pageNumbers.map((entry) =>
            typeof entry === "string" ? (
              <span key={entry} className="px-1.5 text-[#7A6A6E] select-none">
                …
              </span>
            ) : (
              <button
                key={entry}
                type="button"
                disabled={loading}
                onClick={() => onPageChange?.(entry)}
                aria-current={entry === safePage ? "page" : undefined}
                className={`min-w-[32px] px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                  entry === safePage
                    ? "bg-[#38131E] text-[#F1D889] border-[#38131E] shadow-xs"
                    : "bg-white text-[#38131E] border-[#38131E]/15 hover:border-[#D4AF63] hover:bg-[#F7F1E5]"
                }`}
              >
                {entry}
              </button>
            )
          )}

          <button
            type="button"
            disabled={loading || safePage >= safeTotalPages}
            onClick={() => onPageChange?.(safePage + 1)}
            aria-label="Next page"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#38131E]/18 bg-white text-[#38131E] hover:border-[#D4AF63] hover:bg-[#F7F1E5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
