import React from "react";

/**
 * Crisp architectural hairline SVG diagrams depicting traditional Indian textile motifs.
 */
export default function MotifDiagram({ kind = "wave", className = "w-full h-24" }) {
  return (
    <svg
      viewBox="0 0 160 96"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="2"
        y="2"
        width="156"
        height="92"
        stroke="currentColor"
        strokeOpacity="0.18"
        strokeWidth="1"
      />

      {kind === "wave" && (
        <g stroke="#D4AF63" strokeWidth="1.35">
          {[22, 38, 54, 70].map((y) => (
            <path
              key={y}
              d={`M 14 ${y} Q 34 ${y - 10}, 54 ${y} T 94 ${y} T 134 ${y} L 146 ${y - 4}`}
            />
          ))}
        </g>
      )}

      {kind === "lattice" && (
        <g stroke="#D4AF63" strokeWidth="1.15">
          {[20, 44, 68, 92, 116].map((x) => (
            <path key={x} d={`M ${x} 14 L ${x + 28} 82`} />
          ))}
          {[44, 68, 92, 116, 140].map((x) => (
            <path key={`r-${x}`} d={`M ${x} 14 L ${x - 28} 82`} strokeOpacity="0.7" />
          ))}
        </g>
      )}

      {kind === "floral" && (
        <g stroke="#D4AF63" strokeWidth="1.3">
          {[40, 80, 120].map((cx) => (
            <g key={cx} transform={`translate(${cx}, 48)`}>
              <circle cx="0" cy="0" r="4" fill="#D4AF63" fillOpacity="0.4" />
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <ellipse
                  key={deg}
                  cx="0"
                  cy="-12"
                  rx="4.2"
                  ry="8.5"
                  transform={`rotate(${deg})`}
                />
              ))}
            </g>
          ))}
        </g>
      )}

      {kind === "grain" && (
        <g stroke="#D4AF63" strokeWidth="1.2">
          {[18, 28, 38, 48, 58, 68, 78].map((y, idx) => (
            <line
              key={y}
              x1={14 + (idx % 3) * 4}
              y1={y}
              x2={144 - (idx % 2) * 8}
              y2={y}
              strokeDasharray={idx % 2 === 0 ? "22 6 12 4" : "10 4 28 6"}
              strokeOpacity={idx % 2 === 0 ? 0.9 : 0.55}
            />
          ))}
        </g>
      )}

      {kind === "temple" && (
        <g stroke="#D4AF63" strokeWidth="1.35">
          <path d="M 12 72 L 26 24 L 40 72 L 54 24 L 68 72 L 82 24 L 96 72 L 110 24 L 124 72 L 138 24 L 148 58" />
          <line x1="12" y1="78" x2="148" y2="78" strokeOpacity="0.65" />
          <line x1="12" y1="83" x2="148" y2="83" strokeOpacity="0.35" />
        </g>
      )}

      {kind === "stripes" && (
        <g stroke="#D4AF63">
          {[22, 28, 42, 48, 54, 68, 74].map((y, i) => (
            <line
              key={y}
              x1="14"
              y1={y}
              x2="146"
              y2={y}
              strokeWidth={i === 2 || i === 4 ? "2.4" : "1.1"}
              strokeOpacity={i % 2 === 0 ? "0.95" : "0.5"}
            />
          ))}
        </g>
      )}

      {kind === "dots" && (
        <g fill="#D4AF63">
          {[36, 80, 124].map((cx) => (
            <g key={cx}>
              <circle cx={cx} cy="48" r="2.6" />
              <circle cx={cx} cy="32" r="2.1" />
              <circle cx={cx} cy="64" r="2.1" />
              <circle cx={cx - 14} cy="48" r="2.1" />
              <circle cx={cx + 14} cy="48" r="2.1" />
              <circle cx={cx - 8} cy="39" r="1.4" opacity="0.65" />
              <circle cx={cx + 8} cy="39" r="1.4" opacity="0.65" />
              <circle cx={cx - 8} cy="57" r="1.4" opacity="0.65" />
              <circle cx={cx + 8} cy="57" r="1.4" opacity="0.65" />
            </g>
          ))}
        </g>
      )}

      {kind === "medallion" && (
        <g stroke="#D4AF63" strokeWidth="1.25">
          <circle cx="80" cy="48" r="28" />
          <circle cx="80" cy="48" r="18" strokeDasharray="3 3" />
          <polygon points="80,24 104,48 80,72 56,48" />
          <circle cx="80" cy="48" r="4" fill="#D4AF63" />
        </g>
      )}
    </svg>
  );
}
