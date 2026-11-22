import mongoose from "mongoose";
import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

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

    let sentiment = "neutral";

    try {
      const response = await axios.post(
        `${ML_SERVICE_URL}/predict`,
        { text: trimmedText },
        { timeout: 3000 }
      );

      sentiment = response.data?.sentiment || "neutral";
    } catch (error) {
      console.error("ML service unavailable:", error.message);
    }

    const review = await Review.create({
      userId,
      productId,
      rating: boundedRating,
      reviewText: trimmedText,
      sentiment,
    });
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

    reviews.forEach((review) => {
      if (sentimentBreakdown[review.sentiment] !== undefined) {
        sentimentBreakdown[review.sentiment]++;
      }
    });

    const totalReviews = reviews.length;
    const positivityPercentage =
      totalReviews > 0
        ? ((sentimentBreakdown.positive + 0.5 * sentimentBreakdown.neutral) /
            totalReviews) *
          100
        : 0;

    res.status(200).json({
      reviews,
      sentimentBreakdown,
      positivityPercentage: Math.round(positivityPercentage),
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
