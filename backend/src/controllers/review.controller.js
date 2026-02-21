import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();


const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

export const createReview = async (req, res) => {
  try {
    const { productId, rating, reviewText } = req.body;
    // console.log("Creating review for productId:", productId);
    const userId = req.user._id;
    // console.log("User ID:", userId);
    if (!reviewText || !reviewText.trim()) {
      return res.status(400).json({ message: "Review text is required" });
    }

    const product = await Product.findById(productId);
    // console.log("Product:", product);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingReview = await Review.findOne({ userId, productId });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
      }
      // console.log("Existing review found:", existingReview);
    // console.log("ML service URL:", ML_SERVICE_URL);
    // Default sentiment fallback
    let sentiment = "neutral";

    try {
      const response = await axios.post(
        `${ML_SERVICE_URL}/predict`,
        { text: reviewText },
        { timeout: (3000*400*5*60*60) } // ⬅ prevents blocking
      );

      sentiment = response.data?.sentiment || "neutral";
    } catch (error) {
      console.error("ML service unavailable:", error.message);
    }

    const review = await Review.create({
      userId,
      productId,
      rating,
      reviewText,
      sentiment,
    });
    console.log("Review created:", review);
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReviewsForProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId })
      .populate("userId", "fullName profilePic")
      .sort({ createdAt: -1 });

    const sentimentBreakdown = {
      positive: 0,
      negative: 0,
      neutral: 0,
    };

    reviews.forEach((review) => {
      sentimentBreakdown[review.sentiment]++;
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
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await review.deleteOne();

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
