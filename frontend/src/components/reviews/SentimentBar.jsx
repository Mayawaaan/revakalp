import React from 'react';

const SentimentBar = ({ sentiment }) => {
  const sentimentConfig = {
    positive: { percentage: 100, color: 'bg-green-500' },
    neutral: { percentage: 50, color: 'bg-orange-500' },
    negative: { percentage: 20, color: 'bg-red-500' },
  };

  const { percentage, color } = sentimentConfig[sentiment] || { percentage: 0, color: 'bg-gray-200' };

  return (
    <div>
      <p className="text-xs text-gray-400 mt-2 mb-1 capitalize">{sentiment}</p>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default SentimentBar;
