import React from "react";
import { X } from "lucide-react";

export default function FilterPanel({
  categories = [],
  subCategories = [],
  states = [],
  selectedCategory = "all",
  selectedSubCategories = [],
  selectedStates = [],
  maxPrice = 0,
  priceCeiling = 50000,
  inStockOnly = true,
  onCategoryChange,
  onToggleSubCategory,
  onToggleState,
  onMaxPriceChange,
  onInStockChange,
  onClearAll,
  currency = "₹",
}) {
  return (
    <div className="space-y-6 text-sm text-[#1A1718]">
      <div className="flex items-center justify-between pb-3 border-b border-[#38131E]/12">
        <h2 className="font-serif text-xl text-[#38131E]">Filters</h2>
        <button
          type="button"
          onClick={onClearAll}
          className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.16em] text-[#38131E]/75 hover:text-[#38131E] cursor-pointer"
        >
          <X className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Category */}
      {categories.length > 0 && (
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#38131E]/65 font-semibold mb-3">
            Category
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onCategoryChange(cat.id)}
                  className={`rk-chip ${active ? "rk-chip-active" : ""}`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Fabric / SubCategory */}
      {subCategories.length > 0 && (
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#38131E]/65 font-semibold mb-3">
            Fabric / Style
          </p>
          <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
            {subCategories.map((sub) => (
              <label
                key={sub}
                className="flex items-center gap-2.5 cursor-pointer text-sm text-[#1A1718]/85 hover:text-[#38131E]"
              >
                <input
                  type="checkbox"
                  checked={selectedSubCategories.includes(sub)}
                  onChange={() => onToggleSubCategory(sub)}
                  className="w-4 h-4 accent-[#38131E] rounded"
                />
                <span>{sub}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Region / State */}
      {states.length > 0 && (
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#38131E]/65 font-semibold mb-3">
            Region / Origin
          </p>
          <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
            {states.map((st) => (
              <label
                key={st}
                className="flex items-center gap-2.5 cursor-pointer text-sm text-[#1A1718]/85 hover:text-[#38131E]"
              >
                <input
                  type="checkbox"
                  checked={selectedStates.includes(st)}
                  onChange={() => onToggleState(st)}
                  className="w-4 h-4 accent-[#38131E] rounded"
                />
                <span>{st}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Max Price */}
      {priceCeiling > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#38131E]/65 font-semibold">
              Max Price
            </p>
            <span className="text-xs font-semibold text-[#38131E]">
              {maxPrice > 0
                ? `Up to ${currency}${Number(maxPrice).toLocaleString("en-IN")}`
                : "Any"}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={priceCeiling}
            step={500}
            value={maxPrice || priceCeiling}
            onChange={(e) => {
              const val = Number(e.target.value);
              onMaxPriceChange(val >= priceCeiling ? 0 : val);
            }}
            aria-label="Maximum price filter"
            className="w-full accent-[#38131E] cursor-pointer"
          />
        </div>
      )}

      {/* Availability */}
      <label className="flex items-center justify-between pt-2 border-t border-[#38131E]/10 cursor-pointer">
        <span className="text-xs uppercase tracking-[0.16em] text-[#38131E]/80 font-medium">
          In Stock Only
        </span>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => onInStockChange(e.target.checked)}
          className="w-4 h-4 accent-[#38131E]"
        />
      </label>
    </div>
  );
}
