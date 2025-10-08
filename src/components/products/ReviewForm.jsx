"use client";
import { useState } from "react";
import { Star } from "lucide-react";

export default function ReviewForm({ productId, onReviewSubmitted }) {
  const [reviewer, setReviewer] = useState("");
  const [email, setEmail] = useState(""); // New state for email
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState(""); // New state for errors

  const submitReview = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");

    // Basic client-side validation
    if (!reviewer.trim() || !email.trim() || !body.trim()) {
      setErrorMsg(
        "Please fill in all required fields: name, email, and review."
      );
      setIsSubmitting(false);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }
    if (rating < 1 || rating > 5) {
      setErrorMsg("Please select a rating between 1 and 5 stars.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/reviews/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          reviewer,
          email,
          rating,
          title,
          body,
        }),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (data.success) {
        setSuccessMsg(
          "Thank you for your review! It’ll appear after moderation."
        );
        onReviewSubmitted?.(data.review);
        setReviewer("");
        setEmail("");
        setTitle("");
        setBody("");
        setRating(5);
      } else {
        setErrorMsg(
          data.error || "Failed to submit review. Please try again later."
        );
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg("Something went wrong. Please try again later.");
    }
  };

  return (
    <form
      onSubmit={submitReview}
      className="p-6 bg-gray-100 rounded-md shadow-md"
    >
      <h3 className="text-2xl font-semibold mb-4">Leave a Review</h3>
      {successMsg && <p className="text-green-600 mb-2">{successMsg}</p>}
      {errorMsg && <p className="text-red-600 mb-2">{errorMsg}</p>}

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Name *
        </label>
        <input
          type="text"
          value={reviewer}
          onChange={(e) => setReviewer(e.target.value)}
          placeholder="Your name"
          className="border border-gray-400 rounded w-full p-2 ring-0 focus:outline-none"
          required
        />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Email *
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="border border-gray-400 rounded w-full p-2 ring-0 focus:outline-none"
          required
        />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Review Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Review title"
          className="border border-gray-400 rounded w-full p-2 ring-0 focus:outline-none"
        />
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Review *
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Your review"
          className="border border-gray-400 rounded w-full p-2 ring-0 focus:outline-none"
          rows="4"
          required
        />
      </div>

      {/* ⭐ Star Rating Input */}
      <div className="flex items-center gap-2 mb-4">
        <label className="block text-sm font-medium text-gray-700 mr-2">
          Rating *
        </label>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="focus:outline-none"
          >
            <Star
              size={28}
              className={`transition ${
                star <= (hoverRating || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {rating} Star{rating > 1 ? "s" : ""}
        </span>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-[var(--accent)] border border-[var(--accent)] text-white px-4 py-2 rounded hover:bg-transparent hover:text-[var(--accent)] disabled:opacity-50 cursor-pointer transition-all duration-300"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
