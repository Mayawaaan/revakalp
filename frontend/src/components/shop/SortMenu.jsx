import React from "react";
import { ChevronDown } from "lucide-react";

const OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest Arrivals" },
  { value: "bestsellers", label: "Bestsellers First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function SortMenu({ value = "featured", onChange }) {
  return (
    <div className="relative inline-flex items-center">
      <label htmlFor="sort-select" className="sr-only">
        Sort products
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none min-h-[42px] pl-4 pr-10 py-2 rounded-full bg-white border border-[#38131E]/20 text-xs sm:text-sm font-medium text-[#38131E] hover:border-[#38131E] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4AF63]"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            Sort: {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="w-4 h-4 text-[#38131E]/70 pointer-events-none absolute right-3.5" />
    </div>
  );
}
