import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { resolveColorHex } from "../../utils/colorSwatches";

export default function FilterPanel({
  categories = [],
  subCategories = [],
  states = [],
  colors = [],
  selectedCategory = "all",
  selectedSubCategories = [],
  selectedStates = [],
  selectedColors = [],
  maxPrice = 0,
  priceCeiling = 50000,
  inStockOnly = true,
  onCategoryChange,
  onToggleSubCategory,
  onToggleState,
  onToggleColor,
  onMaxPriceChange,
  onInStockChange,
  onClearAll,
  currency = "₹",
  hideHeader = false,
}) {
  const step = priceCeiling <= 2000 ? 100 : 500;
  const minPrice = priceCeiling > step ? step : 0;
  const effectiveValue =
    maxPrice > 0 ? Math.min(Math.max(maxPrice, minPrice), priceCeiling) : priceCeiling;

  const [sliderValue, setSliderValue] = useState(effectiveValue);

  useEffect(() => {
    setSliderValue(effectiveValue);
  }, [effectiveValue]);

  const rangeSpan = Math.max(1, priceCeiling - minPrice);
  const rangePct = Math.min(100, Math.max(0, ((sliderValue - minPrice) / rangeSpan) * 100));

  const activeFilterCount =
    selectedSubCategories.length +
    selectedStates.length +
    selectedColors.length +
    (maxPrice > 0 ? 1 : 0) +
    (!inStockOnly ? 1 : 0);

  return (
    <div className="divide-y divide-[#38131E]/12 text-sm text-[#1A1718]">
      {!hideHeader && (
        <div className="flex items-center justify-between gap-3 pb-4">
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="font-serif text-xl text-[#38131E]">Filters</h2>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#38131E] text-[#F1D889] text-[10px] font-semibold">
                {activeFilterCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[2px] text-xs uppercase tracking-[0.16em] text-[#38131E]/75 hover:text-[#38131E] hover:bg-[#38131E]/6 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      )}

      {/* Category */}
      {categories.length > 0 && (
        <section className="py-5 first:pt-0">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#38131E]/65 font-semibold mb-3.5">
            Category
          </p>
          <div className="flex flex-wrap gap-2.5">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onCategoryChange(cat.id)}
                  className={`rk-chip !min-h-[36px] !px-3.5 !py-1.5 ${
                    active ? "rk-chip-active" : ""
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Fabric / SubCategory */}
      {subCategories.length > 0 && (
        <section className="py-5 first:pt-0">
          <div className="flex items-center justify-between gap-2 mb-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#38131E]/65 font-semibold">
              Fabric / Style
            </p>
            {selectedSubCategories.length > 0 && (
              <span className="text-[11px] font-semibold text-[#38131E] px-1.5 py-0.5 rounded-[2px] bg-[#38131E]/8">
                {selectedSubCategories.length}
              </span>
            )}
          </div>
          <div
            data-lenis-prevent=""
            data-lenis-prevent-wheel=""
            data-lenis-prevent-touch=""
            className="space-y-1 max-h-52 overflow-y-auto overscroll-contain pr-2.5 -mr-1 rk-filter-scroll"
          >
            {subCategories.map((sub) => {
              const checked = selectedSubCategories.includes(sub);
              return (
                <label
                  key={sub}
                  className={`flex items-center gap-3 px-2.5 py-2 rounded-[2px] cursor-pointer text-sm leading-snug transition-colors ${
                    checked
                      ? "bg-[#38131E]/8 text-[#38131E] font-medium"
                      : "text-[#1A1718]/85 hover:bg-[#38131E]/6 hover:text-[#38131E]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleSubCategory(sub)}
                    className="w-4 h-4 shrink-0 accent-[#38131E] rounded cursor-pointer"
                  />
                  <span className="flex-1 min-w-0 break-words">{sub}</span>
                </label>
              );
            })}
          </div>
        </section>
      )}

      {/* Region / State */}
      {states.length > 0 && (
        <section className="py-5 first:pt-0">
          <div className="flex items-center justify-between gap-2 mb-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#38131E]/65 font-semibold">
              Region / Origin
            </p>
            {selectedStates.length > 0 && (
              <span className="text-[11px] font-semibold text-[#38131E] px-1.5 py-0.5 rounded-[2px] bg-[#38131E]/8">
                {selectedStates.length}
              </span>
            )}
          </div>
          <div
            data-lenis-prevent=""
            data-lenis-prevent-wheel=""
            data-lenis-prevent-touch=""
            className="space-y-1 max-h-52 overflow-y-auto overscroll-contain pr-2.5 -mr-1 rk-filter-scroll"
          >
            {states.map((st) => {
              const checked = selectedStates.includes(st);
              return (
                <label
                  key={st}
                  className={`flex items-center gap-3 px-2.5 py-2 rounded-[2px] cursor-pointer text-sm leading-snug transition-colors ${
                    checked
                      ? "bg-[#38131E]/8 text-[#38131E] font-medium"
                      : "text-[#1A1718]/85 hover:bg-[#38131E]/6 hover:text-[#38131E]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleState(st)}
                    className="w-4 h-4 shrink-0 accent-[#38131E] rounded cursor-pointer"
                  />
                  <span className="flex-1 min-w-0 break-words">{st}</span>
                </label>
              );
            })}
          </div>
        </section>
      )}

      {/* Color */}
      {colors.length > 0 && onToggleColor && (
        <section className="py-5 first:pt-0">
          <div className="flex items-center justify-between gap-2 mb-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#38131E]/65 font-semibold">
              Color
            </p>
            {selectedColors.length > 0 && (
              <span className="text-[11px] font-semibold text-[#38131E] px-1.5 py-0.5 rounded-[2px] bg-[#38131E]/8">
                {selectedColors.length}
              </span>
            )}
          </div>
          <div
            data-lenis-prevent=""
            data-lenis-prevent-wheel=""
            data-lenis-prevent-touch=""
            className="space-y-1 max-h-52 overflow-y-auto overscroll-contain pr-2.5 -mr-1 rk-filter-scroll"
          >
            {colors.map((item) => {
              const colorName = typeof item === "string" ? item : item.name;
              const hex = resolveColorHex(colorName, typeof item === "object" ? item.hex : "");
              const checked = selectedColors.includes(colorName);
              return (
                <label
                  key={colorName}
                  className={`flex items-center gap-3 px-2.5 py-2 rounded-[2px] cursor-pointer text-sm leading-snug transition-colors ${
                    checked
                      ? "bg-[#38131E]/8 text-[#38131E] font-medium"
                      : "text-[#1A1718]/85 hover:bg-[#38131E]/6 hover:text-[#38131E]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleColor(colorName)}
                    className="w-4 h-4 shrink-0 accent-[#38131E] rounded cursor-pointer"
                  />
                  <span
                    aria-hidden="true"
                    className="w-3.5 h-3.5 rounded-full border border-[#38131E]/25 shrink-0"
                    style={{ backgroundColor: hex }}
                  />
                  <span className="flex-1 min-w-0 break-words">{colorName}</span>
                </label>
              );
            })}
          </div>
        </section>
      )}

      {/* Max Price */}
      {priceCeiling > 0 && (
        <section className="py-5 first:pt-0">
          <div className="flex items-center justify-between gap-3 mb-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#38131E]/65 font-semibold">
              Max Price
            </p>
            <span className="text-xs font-semibold text-[#38131E] tabular-nums">
              {sliderValue < priceCeiling
                ? `Up to ${currency}${Number(sliderValue).toLocaleString("en-IN")}`
                : "Any"}
            </span>
          </div>
          <div className="py-1.5">
            <input
              type="range"
              min={minPrice}
              max={priceCeiling}
              step={step}
              value={sliderValue}
              onChange={(e) => {
                const val = Number(e.target.value);
                setSliderValue(val);
                onMaxPriceChange(val >= priceCeiling ? 0 : val);
              }}
              style={{ "--rk-range-pct": `${rangePct}%` }}
              aria-label="Maximum price filter"
              className="rk-range w-full cursor-pointer"
            />
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#1A1718]/60 tabular-nums">
            <span>
              {currency}
              {minPrice.toLocaleString("en-IN")}
            </span>
            <span>
              Any ({currency}
              {priceCeiling.toLocaleString("en-IN")})
            </span>
          </div>
        </section>
      )}

      {/* Availability */}
      <section className="pt-5 pb-1">
        <label className="flex items-center justify-between gap-3 px-2.5 py-2.5 -mx-2.5 rounded-[2px] hover:bg-[#38131E]/6 cursor-pointer transition-colors">
          <span className="text-xs uppercase tracking-[0.16em] text-[#38131E]/85 font-medium">
            In Stock Only
          </span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="w-4 h-4 shrink-0 accent-[#38131E] rounded cursor-pointer"
          />
        </label>
      </section>
    </div>
  );
}
