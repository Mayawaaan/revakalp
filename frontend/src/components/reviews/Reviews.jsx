import React, { useState } from "react";
import useStore from "../../store/store";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import SentimentBar from "./SentimentBar";

const Reviews = ({ productId }) => {
  const { reviews, status, error, addReview, user, showToast } = useStore();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || reviewText.trim() === "") {
      showToast("Please provide a rating and a review.", "error");
      return;
    }
    addReview({ productId, rating, reviewText });
    setRating(0);
    setReviewText("");
    showToast("Review submitted successfully!", "success");
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="font-serif text-3xl text-pink-900 mb-6">
        Customer Reviews
      </h2>

      {/* Review Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <h3 className="font-medium text-pink-800 mb-4">Leave a Review</h3>
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={24}
                className={`cursor-pointer transition ${
                  i < rating ? "text-yellow-400" : "text-gray-300"
                }`}
                fill={i < rating ? "currentColor" : "none"}
                onClick={() => setRating(i + 1)}
              />
            ))}
          </div>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full p-4 border border-pink-200 rounded-lg focus:ring-2 focus:ring-[#c9487c] focus:border-transparent transition"
            rows="4"
            placeholder="Share your thoughts about the product..."
          ></textarea>
          <button
            type="submit"
            className="mt-4 bg-[#c9487c] hover:bg-[#9c2756] text-white py-2 px-6 rounded-full font-medium shadow-lg transition"
          >
            Submit Review
          </button>
        </form>
      ) : (
        <div className="text-center p-6 border border-pink-200 rounded-lg mb-8">
          <p className="text-pink-700">
            You must be logged in to leave a review.
          </p>
          <Link
            to="/login"
            className="mt-2 inline-block text-[#c9487c] font-medium hover:underline"
          >
            Login or Sign Up
          </Link>
        </div>
      )}

      {/* Existing Reviews */}
      <h3 className="font-medium text-pink-800 mb-4">Existing Reviews</h3>
      {status === "loading" && <p>Loading reviews...</p>}

      {status === "failed" && <p>Error: {error}</p>}
      
      {status === "succeeded" && reviews.length === 0 && (
        <p>No reviews yet. Be the first to review this product!</p>
      )}
      {status === "succeeded" && reviews.length > 0 && (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="border-b border-pink-100 pb-4">
              <div className="flex items-start mb-2">
                <img
                  src={
                    review.userId.profilePic ||
                    `https://ui-avatars.com/api/?name=${review.userId.fullName}&background=random`
                  }
                  alt={review.userId.fullName}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-pink-800">
                      {review.userId.fullName}
                    </p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                          fill="currentColor"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-pink-700 mt-1">{review.reviewText}</p>
                  <SentimentBar sentiment={review.sentiment} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
