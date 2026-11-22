import React from "react";

const SENTIMENT_LABELS = {
  positive: "Positive",
  neutral: "Neutral",
  negative: "Negative",
};

const SentimentBar = ({ sentiment, confidence = null }) => {
  const sentimentConfig = {
    positive: { percentage: 100, color: "bg-[#38131E]" },
    neutral: { percentage: 50, color: "bg-[#D4AF63]" },
    negative: { percentage: 25, color: "bg-red-700" },
  };

  const { percentage, color } = sentimentConfig[sentiment] || {
    percentage: 0,
    color: "bg-[#38131E]/20",
  };

  const numericConf = Number(confidence);
  const hasConfidence =
    confidence !== null &&
    confidence !== undefined &&
    Number.isFinite(numericConf) &&
    numericConf > 0;
  const confPct = hasConfidence
    ? Math.round(numericConf <= 1 ? numericConf * 100 : numericConf)
    : null;

  return (
    <div className="mt-2.5 max-w-xs">
      <div className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-[0.18em] text-[#38131E]/65 mb-1">
        <span>Sentiment: {SENTIMENT_LABELS[sentiment] || sentiment}</span>
        {confPct !== null && (
          <span className="font-mono text-[#38131E]/75">{confPct}% confidence</span>
        )}
      </div>
      <div className="w-full bg-[#F7F1E5] border border-[#38131E]/10 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default SentimentBar;
