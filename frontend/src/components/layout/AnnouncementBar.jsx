import React from "react";
import { Link } from "react-router-dom";

export default function AnnouncementBar() {
  return (
    <div
      className="bg-[#2B0E17] text-[#F7F1E5] border-b border-[#D4AF63]/25"
      role="region"
      aria-label="Store notice"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-8 flex items-center justify-center sm:justify-between text-[10px] tracking-[0.24em] uppercase">
        <p className="text-center text-[#F7F1E5]/90 font-medium truncate">
          Weaving Life Into Time <span className="text-[#D4AF63] mx-2">·</span> Indore
        </p>
        <div className="hidden sm:flex items-center gap-5 text-[#F1D889]/90 shrink-0">
          <Link to="/heritage" className="hover:text-[#F7F1E5] transition-colors">
            Indian Textiles
          </Link>
          <span className="text-[#D4AF63]/35">|</span>
          <Link to="/about" className="hover:text-[#F7F1E5] transition-colors">
            Visit Our Store
          </Link>
        </div>
      </div>
    </div>
  );
}
