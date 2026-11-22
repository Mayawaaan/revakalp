import Review from "../models/review.model.js";
import {
  analyzeSentiment,
  analyzeSentimentBatch,
  getMlStatus,
} from "../services/sentiment.service.js";

function summarizeResults(results = []) {
  let positive = 0;
  let neutral = 0;
  let negative = 0;

  for (const item of results) {
    if (item?.sentiment === "positive") positive++;
    else if (item?.sentiment === "negative") negative++;
    else neutral++;
  }

  const total = results.length;
  const positivityPercentage =
    total > 0 ? Math.round(((positive + 0.5 * neutral) / total) * 100) : 0;

  return { positive, neutral, negative, positivityPercentage };
}

export const getStatus = async (req, res) => {
  try {
    const status = await getMlStatus();
    return res.status(200).json(status);
  } catch (error) {
    console.error("getStatus error:", error.message);
    return res.status(500).json({ message: "Unable to inspect ML status" });
  }
};

export const analyzeSingleText = async (req, res) => {
  try {
    const text = String(req.body?.text || "").trim();
    if (!text) {
      return res.status(400).json({ message: "Text to analyze is required" });
    }
    if (text.length > 2000) {
      return res
        .status(400)
        .json({ message: "Text must not exceed 2000 characters" });
    }

    const result = await analyzeSentiment(text);
    return res.status(200).json(result);
  } catch (error) {
    console.error("analyzeSingleText error:", error.message);
    return res.status(500).json({ message: "Sentiment analysis failed" });
  }
};

export const analyzeBatchTexts = async (req, res) => {
  try {
    const rawTexts = req.body?.texts;
    if (!Array.isArray(rawTexts)) {
      return res.status(400).json({ message: "texts array is required" });
    }

    const cleaned = rawTexts
      .map((t) => String(t || "").trim())
      .filter(Boolean);

    if (cleaned.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one non-empty text line is required" });
    }
    if (cleaned.length > 500) {
      return res
        .status(400)
        .json({ message: "Batch limit is 500 texts per request" });
    }

    const results = await analyzeSentimentBatch(cleaned);
    return res.status(200).json({
      count: results.length,
      summary: summarizeResults(results),
      results,
    });
  } catch (error) {
    console.error("analyzeBatchTexts error:", error.message);
    return res.status(500).json({ message: "Batch sentiment analysis failed" });
  }
};

export const reanalyzeReviews = async (req, res) => {
  try {
    const onlyMissing = Boolean(req.body?.onlyMissing);
    const filter = onlyMissing
      ? {
          $or: [
            { sentimentSource: "" },
            { sentimentSource: { $exists: false } },
            { sentimentConfidence: null },
          ],
        }
      : {};

    const reviews = await Review.find(filter).select("_id reviewText");
    if (reviews.length === 0) {
      return res.status(200).json({
        updatedCount: 0,
        summary: { positive: 0, neutral: 0, negative: 0, positivityPercentage: 0 },
      });
    }

    const results = await analyzeSentimentBatch(
      reviews.map((r) => r.reviewText || "")
    );

    const ops = reviews.map((review, idx) => {
      const pred = results[idx];
      return {
        updateOne: {
          filter: { _id: review._id },
          update: {
            $set: {
              sentiment: pred.sentiment,
              sentimentConfidence: pred.confidence,
              sentimentProbabilities: pred.probabilities,
              sentimentSource: pred.source,
            },
          },
        },
      };
    });

    await Review.bulkWrite(ops);

    return res.status(200).json({
      updatedCount: reviews.length,
      summary: summarizeResults(results),
    });
  } catch (error) {
    console.error("reanalyzeReviews error:", error.message);
    return res.status(500).json({ message: "Failed to re-analyze reviews" });
  }
};
