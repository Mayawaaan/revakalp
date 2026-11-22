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
  const alignment =
    align === "left" ? "text-left items-start" : "text-center items-center mx-auto";

  return (
    <div className={`flex flex-col max-w-3xl ${alignment} ${className}`.trim()}>
      {eyebrow && (
        <p
          className={`uppercase tracking-[0.3em] text-[10px] sm:text-[11px] font-medium mb-3.5 ${
            isDark ? "text-[#F1D889]" : "text-[#38131E]/75"
          }`}
        >
          {eyebrow}
        </p>
      )}

      <div className="overflow-hidden">
        <h2
          data-reveal="heading"
          className={`font-serif text-[clamp(2rem,4.1vw,3.35rem)] leading-[1.08] tracking-tight ${
            isDark ? "text-[#F7F1E5]" : "text-[#38131E]"
          }`}
        >
          {title}{" "}
          {accentWord && (
            <span
              className={`italic font-normal ${
                isDark ? "text-[#F1D889]" : "text-[#38131E]/85"
              }`}
            >
              {accentWord}
            </span>
          )}
        </h2>
      </div>

      {subtitle && (
        <p
          className={`mt-4 text-sm sm:text-base leading-relaxed max-w-2xl ${
            isDark ? "text-[#F7F1E5]/78" : "text-[#1A1718]/75"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
