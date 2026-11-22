import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import useStore from "../../store/store";
import SentimentBar from "./SentimentBar";
import EditorialButton from "../ui/EditorialButton";

const Reviews = ({ productId }) => {
  const { reviews, status, error, addReview, user, showToast, positivityPercentage } =
    useStore();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || reviewText.trim() === "") {
      showToast("Please provide a rating and a review.", "error");
      return;
    }
    setSubmitting(true);
    try {
      await addReview({ productId, rating, reviewText });
      setRating(0);
      setReviewText("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white/90 border border-[#38131E]/12 rounded-3xl p-6 sm:p-10 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#38131E]/10 mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#38131E]/65 mb-1">
            Verified Feedback
          </p>
          <h2 className="font-serif text-3xl text-[#38131E]">
            Customer Reviews
          </h2>
        </div>

        {reviews.length > 0 && positivityPercentage > 0 && (
          <div className="px-4 py-2 rounded-full bg-[#F7F1E5] border border-[#D4AF63]/45 text-xs font-semibold text-[#38131E]">
            {Math.round(positivityPercentage)}% Positive Sentiment
          </div>
        )}
      </div>

      {/* Review Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-10 bg-[#F7F1E5]/60 rounded-2xl p-6 border border-[#38131E]/10">
          <h3 className="font-serif text-xl text-[#38131E] mb-3">Leave a Review</h3>
          <div className="flex items-center gap-1.5 mb-4" role="radiogroup" aria-label="Select rating">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                aria-label={`Rate ${value} out of 5`}
                onClick={() => setRating(value)}
                className="p-1 cursor-pointer"
              >
                <Star
                  size={22}
                  className={
                    value <= rating ? "text-[#D4AF63]" : "text-[#38131E]/25"
                  }
                  fill={value <= rating ? "currentColor" : "none"}
                />
              </button>
            ))}
          </div>

          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full p-4 bg-white border border-[#38131E]/20 rounded-xl text-sm text-[#1A1718] focus:outline-none focus:ring-2 focus:ring-[#D4AF63]"
            rows="4"
            placeholder="Share your thoughts about fit, fabric, and finish…"
          />

          <div className="mt-4">
            <EditorialButton type="submit" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit Review"}
            </EditorialButton>
          </div>
        </form>
      ) : (
        <div className="text-center p-6 bg-[#F7F1E5]/60 border border-[#38131E]/12 rounded-2xl mb-8">
          <p className="text-sm text-[#1A1718]/75">
            Sign in to share your review for this piece.
          </p>
          <Link
            to="/login"
            className="mt-2 inline-block text-xs uppercase tracking-[0.18em] font-semibold text-[#38131E] underline"
          >
            Login or Sign Up
          </Link>
        </div>
      )}

      {/* Existing Reviews */}
      {status === "loading" && (
        <p className="text-sm text-[#1A1718]/65">Loading reviews…</p>
      )}
      {status === "failed" && (
        <p className="text-sm text-red-700">Could not load reviews: {error}</p>
      )}
      {status === "succeeded" && reviews.length === 0 && (
        <p className="text-sm text-[#1A1718]/65">
          No reviews yet. Be the first customer to review this item.
        </p>
      )}

      {status === "succeeded" && reviews.length > 0 && (
        <div className="space-y-6">
          {reviews.map((review) => {
            const reviewerName = review.userId?.fullName || "Customer";
            const avatar = review.userId?.profilePic;
            return (
              <div key={review._id} className="border-b border-[#38131E]/10 pb-5 last:border-0 last:pb-0">
                <div className="flex items-start gap-4">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={reviewerName}
                      className="w-10 h-10 rounded-full object-cover shrink-0 border border-[#D4AF63]/40"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#38131E] text-[#F1D889] flex items-center justify-center font-serif text-base shrink-0">
                      {reviewerName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-sm text-[#38131E]">
                        {reviewerName}
                      </p>
                      <div className="flex items-center gap-0.5" aria-label={`Rated ${review.rating} out of 5`}>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            size={15}
                            className={
                              i <= review.rating ? "text-[#D4AF63]" : "text-[#38131E]/20"
                            }
                            fill="currentColor"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-[#1A1718]/80 mt-1.5 leading-relaxed">
                      {review.reviewText}
                    </p>
                    {review.sentiment && <SentimentBar sentiment={review.sentiment} />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Reviews;
