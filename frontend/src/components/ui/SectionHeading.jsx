import React from "react";

export default function SectionHeading({
  eyebrow,
  title,
  accentWord,
  subtitle,
  align = "center",
  tone = "light",
  className = "",
}) {
  const isDark = tone === "dark";
  const alignment = align === "left" ? "text-left items-start" : "text-center items-center mx-auto";

  return (
    <div className={`flex flex-col max-w-3xl ${alignment} ${className}`.trim()}>
      {eyebrow && (
        <div className="inline-flex items-center gap-3 mb-3">
          <span data-line-draw className={`h-px w-6 ${isDark ? "bg-[#D4AF63]/70" : "bg-[#D4AF63]"}`} aria-hidden="true" />
          <p
            className={`uppercase tracking-[0.28em] text-[11px] font-medium ${
              isDark ? "text-[#F1D889]" : "text-[#38131E]/75"
            }`}
          >
            {eyebrow}
          </p>
          <span data-line-draw className={`h-px w-6 ${isDark ? "bg-[#D4AF63]/70" : "bg-[#D4AF63]"}`} aria-hidden="true" />
        </div>
      )}

      <div className="overflow-hidden">
        <h2
          data-reveal="heading"
          className={`font-serif text-3xl sm:text-4xl md:text-5xl leading-[1.12] tracking-tight ${
            isDark ? "text-[#F7F1E5]" : "text-[#38131E]"
          }`}
        >
          {title}{" "}
          {accentWord && (
            <span className={`italic font-normal ${isDark ? "text-[#F1D889]" : "text-[#38131E]/85"}`}>
              {accentWord}
            </span>
          )}
        </h2>
      </div>

      {subtitle && (
        <p
          className={`mt-4 text-sm sm:text-base leading-relaxed max-w-2xl ${
            isDark ? "text-[#F7F1E5]/80" : "text-[#1A1718]/75"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
