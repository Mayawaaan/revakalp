import React from "react";
import EditorialButton from "../components/ui/EditorialButton";

const NotFound = () => {
  return (
    <div className="min-h-[75vh] bg-[#F7F1E5] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="rk-surface-card p-10 sm:p-14 max-w-md w-full space-y-4">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#38131E]/65 font-semibold">
          Error 404
        </p>
        <h1 className="font-serif text-6xl sm:text-7xl text-[#38131E]">404</h1>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#38131E]">
          Page Not Found
        </h2>
        <p className="text-sm text-[#1A1718]/75 leading-relaxed pb-2">
          The page you requested could not be found. Return to the storefront or
          explore our active collections.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <EditorialButton to="/" variant="primary">
            Back to Home
          </EditorialButton>
          <EditorialButton to="/shop" variant="secondary">
            Browse Shop
          </EditorialButton>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
