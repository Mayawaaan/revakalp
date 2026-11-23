import React from "react";
import { ArrowDownRight, Radio, Database } from "lucide-react";
import { formatNumber } from "../../utils/analyticsFormatters";

const SOURCE_LABELS = {
  telemetry: "DPDPA Telemetry",
  hybrid: "Telemetry + Live DB",
  orders_db: "Orders Ledger",
};

const FunnelWaterfall = ({
  stages = [],
  palette,
  telemetryActive = false,
  totalTelemetryEvents = 0,
}) => {
  const maxCount = Math.max(...stages.map((s) => Number(s?.count || 0)), 1);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs pb-2 border-b border-current/10">
        <span className="inline-flex items-center gap-1.5 opacity-80">
          {telemetryActive ? (
            <>
              <Radio size={13} style={{ color: palette.positive }} />
              <span>
                First-party opt-in telemetry active ({formatNumber(totalTelemetryEvents)} events)
              </span>
            </>
          ) : (
            <>
              <Database size={13} style={{ color: palette.accent }} />
              <span>
                Powered by live Wishlist, Cart & Orders ledger (opt-in page telemetry awaits storefront visitors)
              </span>
            </>
          )}
        </span>
      </div>

      <div className="space-y-3">
        {stages.map((stage, idx) => {
          const count = Number(stage.count || 0);
          const widthPct = count > 0 ? Math.max(8, Math.round((count / maxCount) * 100)) : 0;

          return (
            <div
              key={stage.key}
              className="rounded-xl border border-current/10 p-3 sm:p-3.5 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-6 h-6 rounded-full text-[11px] font-semibold flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: palette.primary,
                      color: palette.tooltipBg,
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span className="font-serif text-sm sm:text-base font-medium truncate">
                    {stage.label}
                  </span>
                  <span className="hidden sm:inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-current/15 opacity-70">
                    {SOURCE_LABELS[stage.source] || stage.source}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 text-xs">
                  {stage.stepConversionPct !== null && (
                    <span
                      className="px-2 py-0.5 rounded-full font-medium text-[11px]"
                      style={{
                        backgroundColor: `${palette.positive}1A`,
                        color: palette.positive,
                      }}
                    >
                      → {stage.stepConversionPct.toFixed(1)}% step
                    </span>
                  )}
                  {stage.dropOffPct !== null && stage.dropOffCount > 0 && (
                    <span
                      className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-medium"
                      style={{
                        backgroundColor: `${palette.negative}18`,
                        color: palette.negative,
                      }}
                    >
                      <ArrowDownRight size={11} />
                      -{stage.dropOffPct.toFixed(1)}% drop
                    </span>
                  )}
                  <span className="font-serif text-base font-semibold min-w-[44px] text-right">
                    {formatNumber(count)}
                  </span>
                </div>
              </div>

              <div className="h-2.5 w-full rounded-full overflow-hidden bg-current/10">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${widthPct}%`,
                    background: `linear-gradient(90deg, ${palette.primary} 0%, ${palette.accent} 100%)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FunnelWaterfall;
