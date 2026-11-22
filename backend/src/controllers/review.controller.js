import mongoose from "mongoose";
import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import { analyzeSentiment } from "../services/sentiment.service.js";

export const createReview = async (req, res) => {
  try {
    const { productId, rating, reviewText } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const trimmedText = String(reviewText || "").trim();
    if (!trimmedText) {
      return res.status(400).json({ message: "Review text is required" });
    }
    if (trimmedText.length > 2000) {
      return res
        .status(400)
        .json({ message: "Review text must not exceed 2000 characters" });
    }

    const numericRating = Number(rating);
    const boundedRating = Number.isFinite(numericRating)
      ? Math.min(5, Math.max(1, Math.round(numericRating)))
      : 5;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingReview = await Review.findOne({ userId, productId });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    const analysis = await analyzeSentiment(trimmedText);

    const review = await Review.create({
      userId,
      productId,
      rating: boundedRating,
      reviewText: trimmedText,
      sentiment: analysis.sentiment,
      sentimentConfidence: analysis.confidence,
      sentimentProbabilities: analysis.probabilities,
      sentimentSource: analysis.source,
    });

    if (typeof review.populate === "function") {
      await review.populate("userId", "fullName profilePic");
    }

    res.status(201).json(review);
  } catch (error) {
    console.error("createReview error:", error.message);
    res.status(500).json({ message: "Error submitting review" });
  }
};

export const getReviewsForProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const reviews = await Review.find({ productId })
      .populate("userId", "fullName profilePic")
      .sort({ createdAt: -1 });

    const sentimentBreakdown = {
      positive: 0,
      negative: 0,
      neutral: 0,
    };

    let confSum = 0;
    let confCount = 0;

    reviews.forEach((review) => {
      if (sentimentBreakdown[review.sentiment] !== undefined) {
        sentimentBreakdown[review.sentiment]++;
      }
      if (
        review.sentimentConfidence !== null &&
        review.sentimentConfidence !== undefined &&
        Number.isFinite(Number(review.sentimentConfidence))
      ) {
        confSum += Number(review.sentimentConfidence);
        confCount++;
      }
    });

    const totalReviews = reviews.length;
    const positivityPercentage =
      totalReviews > 0
        ? ((sentimentBreakdown.positive + 0.5 * sentimentBreakdown.neutral) /
            totalReviews) *
          100
        : 0;
    const averageConfidence =
      confCount > 0 ? Math.round((confSum / confCount) * 100) : 0;

    res.status(200).json({
      reviews,
      sentimentBreakdown,
      positivityPercentage: Math.round(positivityPercentage),
      averageConfidence,
    });
  } catch (error) {
    console.error("getReviewsForProduct error:", error.message);
    res.status(500).json({ message: "Error loading reviews" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await review.deleteOne();

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("deleteReview error:", error.message);
    res.status(500).json({ message: "Error deleting review" });
  }
};
