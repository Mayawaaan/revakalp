import React from "react";
import { ShoppingBag } from "lucide-react";
import EditorialButton from "./EditorialButton";

export default function EmptyState({
  icon = ShoppingBag,
  title = "Nothing available right now",
  description = "Explore our wider collections or reset your active filters.",
  actionLabel = "Browse Collections",
  actionTo = "/shop",
  onAction,
  secondaryAction,
}) {
  const Icon = icon;
  return (
    <div className="rk-surface-card p-10 sm:p-14 text-center max-w-xl mx-auto">
      <div className="w-16 h-16 rounded-full bg-[#38131E]/8 border border-[#D4AF63]/40 flex items-center justify-center mx-auto mb-5">
        <Icon className="w-7 h-7 text-[#38131E]" strokeWidth={1.5} />
      </div>
      <h3 className="font-serif text-2xl sm:text-3xl text-[#38131E] mb-3">{title}</h3>
      <p className="text-sm text-[#1A1718]/70 leading-relaxed mb-7 max-w-md mx-auto">
        {description}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onAction ? (
          <EditorialButton onClick={onAction}>{actionLabel}</EditorialButton>
        ) : (
          <EditorialButton to={actionTo}>{actionLabel}</EditorialButton>
        )}
        {secondaryAction}
      </div>
    </div>
  );
}
