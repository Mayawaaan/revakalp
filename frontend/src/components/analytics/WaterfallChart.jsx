import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { formatInr, formatNumber } from "../../utils/analyticsFormatters";

const WaterfallTooltip = ({ active, payload, unitType, palette }) => {
  if (!active || !payload || payload.length === 0) return null;
  const step = payload[0]?.payload;
  if (!step) return null;

  const formatVal = (val) =>
    unitType === "currency" ? formatInr(val, false) : `${formatNumber(val)} units`;

  const deltaPrefix =
    step.kind === "total" || step.kind === "subtotal"
      ? ""
      : step.delta > 0
        ? "+"
        : step.delta < 0
          ? "-"
          : "";

  return (
    <div
      style={{
        backgroundColor: palette.tooltipBg,
        borderColor: palette.tooltipBorder,
        color: palette.tooltipText,
      }}
      className="rounded-xl border px-3.5 py-2.5 shadow-lg text-xs space-y-1 min-w-[190px]"
    >
      <p className="font-serif font-semibold text-sm">{step.label}</p>
      <div className="flex items-center justify-between gap-4">
        <span className="opacity-75">
          {step.kind === "total" || step.kind === "subtotal" ? "Amount" : "Step Impact"}
        </span>
        <span
          className="font-semibold"
          style={{
            color:
              step.kind === "positive"
                ? palette.positive
                : step.kind === "negative"
                  ? palette.negative
                  : palette.tooltipText,
          }}
        >
          {deltaPrefix}
          {formatVal(Math.abs(step.delta))}
        </span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="opacity-75">Running Balance</span>
        <span className="font-medium">{formatVal(step.runningTotal)}</span>
      </div>
      <div className="flex items-center justify-between gap-4 pt-1 border-t border-current/15">
        <span className="opacity-70">Share of Gross</span>
        <span>{Number(step.shareOfGrossPct || 0).toFixed(1)}%</span>
      </div>
    </div>
  );
};

const WaterfallChart = ({
  steps = [],
  unitType = "currency",
  palette,
  height = 310,
  emptyMessage = "No activity recorded for this range.",
}) => {
  const hasAnyValue = steps.some((s) => Math.abs(Number(s?.barValue || 0)) > 0);

  if (!steps.length || !hasAnyValue) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-dashed border-current/20 text-xs opacity-70"
        style={{ height }}
      >
        {emptyMessage}
      </div>
    );
  }

  const tickFormatter = (val) =>
    unitType === "currency" ? formatInr(val, true) : formatNumber(val);

  const getStepColor = (kind) => {
    if (kind === "total") return palette.primary;
    if (kind === "subtotal") return palette.subtotal;
    if (kind === "positive") return palette.positive;
    return palette.negative;
  };

  return (
    <div className="space-y-3 min-w-0">
      <div className="flex flex-wrap items-center gap-4 text-[11px] opacity-80">
        <span className="inline-flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-xs inline-block"
            style={{ backgroundColor: palette.primary }}
          />
          Opening / Net Total
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-xs inline-block"
            style={{ backgroundColor: palette.positive }}
          />
          Additions (+)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-xs inline-block"
            style={{ backgroundColor: palette.negative }}
          />
          Deductions (-)
        </span>
      </div>

      <div className="w-full min-w-0" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={steps}
            margin={{ top: 10, right: 12, left: 4, bottom: 18 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={palette.grid} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: palette.axisTick }}
              axisLine={false}
              tickLine={false}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={46}
            />
            <YAxis
              tickFormatter={tickFormatter}
              tick={{ fontSize: 11, fill: palette.axisTick }}
              axisLine={false}
              tickLine={false}
              width={64}
            />
            <ReferenceLine y={0} stroke={palette.grid} />
            <Tooltip
              cursor={{ fill: palette.grid, opacity: 0.28 }}
              content={<WaterfallTooltip unitType={unitType} palette={palette} />}
            />
            <Bar dataKey="base" stackId="wf" fill="transparent" isAnimationActive={false} />
            <Bar dataKey="barValue" stackId="wf" radius={[6, 6, 6, 6]} maxBarSize={54}>
              {steps.map((entry) => (
                <Cell key={entry.key} fill={getStepColor(entry.kind)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WaterfallChart;
