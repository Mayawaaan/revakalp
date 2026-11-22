import React from "react";
import { Link } from "react-router-dom";

export default function AnnouncementBar() {
  return (
    <div
      className="bg-[#38131E] text-[#F7F1E5] border-b border-[#D4AF63]/25"
      role="region"
      aria-label="Store notice"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-center sm:justify-between text-[11px] tracking-[0.2em] uppercase">
        <p className="text-center text-[#F7F1E5]/95 font-medium">
          Curated in Indore <span className="text-[#D4AF63] mx-1.5">·</span> Explore collections online
        </p>
        <div className="hidden sm:flex items-center gap-5 text-[#F1D889]/90">
          <Link to="/shop" className="hover:text-[#F7F1E5] transition-colors">
            Shop Catalog
          </Link>
          <span className="text-[#D4AF63]/40">|</span>
          <Link to="/about" className="hover:text-[#F7F1E5] transition-colors">
            Visit Indore Store
          </Link>
        </div>
      </div>
    </div>
  );
}
