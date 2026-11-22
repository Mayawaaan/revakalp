import React from "react";

const SentimentBar = ({ sentiment }) => {
  const sentimentConfig = {
    positive: { percentage: 100, color: "bg-[#38131E]" },
    neutral: { percentage: 50, color: "bg-[#D4AF63]" },
    negative: { percentage: 25, color: "bg-red-700" },
  };

  const { percentage, color } = sentimentConfig[sentiment] || {
    percentage: 0,
    color: "bg-[#38131E]/20",
  };

  return (
    <div className="mt-2.5 max-w-xs">
      <p className="text-[10px] uppercase tracking-[0.18em] text-[#38131E]/60 mb-1">
        Sentiment: {sentiment}
      </p>
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
