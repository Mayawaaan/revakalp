import React from "react";
import EditorialButton from "../components/ui/EditorialButton";
import { useSeoMeta } from "../utils/seo";

const NotFound = () => {
  useSeoMeta({
    title: "Page Not Found",
    description: "The requested page could not be found at Revakalp.",
    noindex: true,
  });

  return (
    <div className="min-h-[75vh] bg-[#F7F1E5] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="rk-surface-card p-10 sm:p-14 max-w-md w-full space-y-4">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[#38131E]/65 font-semibold">
          Not Found
        </p>
        <h1 className="font-serif text-6xl sm:text-7xl text-[#38131E]">404</h1>
        <h2 className="font-serif text-2xl sm:text-3xl text-[#38131E]">
          We couldn&apos;t find that page
        </h2>
        <p className="text-sm text-[#1A1718]/75 leading-relaxed pb-2">
          The link may have moved or expired. Head back home or browse what&apos;s in store today.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <EditorialButton to="/" variant="primary">
            Back to Home
          </EditorialButton>
          <EditorialButton to="/shop" variant="secondary">
            Browse Store
          </EditorialButton>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
