"use client";

import React, { useState, useMemo, useCallback } from "react";
import StarRating from "@/components/global/StarRating";
import Image from "next/image";

export default function ReviewsSection({ initialReviews = [], internalProductId, shopDomain, apiToken }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [currentPage, setCurrentPage] = useState(2); // Start from page 2 for load more
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStars, setSelectedStars] = useState([]); // e.g., [5, 4] for 4-5 stars
  const [sortBy, setSortBy] = useState("mostRecent"); // "mostRecent" or "highestRated"
  const [hasMore, setHasMore] = useState(true);

  // Filter reviews by selected stars
  const filteredReviews = useMemo(() => {
    let filtered = [...reviews];
    if (selectedStars.length > 0) {
      filtered = filtered.filter((review) =>
        selectedStars.includes(review.rating)
      );
    }
    return filtered;
  }, [reviews, selectedStars]);

  // Sort filtered reviews
  const sortedReviews = useMemo(() => {
    return [...filteredReviews].sort((a, b) => {
      if (sortBy === "highestRated") {
        return b.rating - a.rating;
      }
      // mostRecent: sort by created_at descending
      return new Date(b.created_at) - new Date(a.created_at);
    });
  }, [filteredReviews, sortBy]);

  // Load more reviews
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      // Use proxy API route: fetch(`/api/reviews/${internalProductId}/${currentPage}`)
      // Or direct if token is safe: const url = `https://judge.me/api/v1/reviews?shop_domain=${shopDomain}&api_token=${apiToken}&product_id=${internalProductId}&per_page=10&page=${currentPage}`;
      const url = `/api/reviews/${internalProductId}/${currentPage}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load reviews");
      const data = await res.json();
      const newReviews = data?.reviews || [];
      if (newReviews.length === 0) {
        setHasMore(false);
      } else {
        setReviews((prev) => [...prev, ...newReviews]);
        setCurrentPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error loading more reviews:", error);
    } finally {
      setIsLoading(false);
    }
  }, [internalProductId, currentPage, isLoading, hasMore, shopDomain, apiToken]);

  // Star filter handlers
  const toggleStarFilter = (star) => {
    setSelectedStars((prev) =>
      prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]
    );
  };

  const clearFilters = () => setSelectedStars([]);

  return (
    <section className="max-w-[1400px] mx-auto">
      <h2 className="text-3xl font-bold mb-6 w-full px-4 py-2 bg-[var(--accent)] text-white">Customer Reviews</h2>
      {reviews.length > 0 && (
        <>
          {/* Reviews Header with Count */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold">
              Customer Reviews ({sortedReviews.length} of {reviews.length})
            </h3>
            <select
              className="border rounded px-3 py-2 text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="mostRecent">Sort by: Most Recent</option>
              <option value="highestRated">Sort by: Highest Rated</option>
            </select>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Filter by rating:</span>
            {[5, 4, 3, 2, 1].map((star) => (
              <label key={star} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedStars.includes(star)}
                  onChange={() => toggleStarFilter(star)}
                  className="rounded"
                />
                <StarRating ratingValue={star} scaleMin={1} scaleMax={5} size={12} />
              </label>
            ))}
            {selectedStars.length > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:underline ml-4"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {sortedReviews.map((review) => (
              <article key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <StarRating
                      ratingValue={review.rating}
                      scaleMin={1}
                      scaleMax={5}
                      size={14}
                    />
                    {review.verified && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Verified Buyer
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                {review.title && (
                  <h4 className="font-medium mb-1 text-gray-900">{review.title}</h4>
                )}
                <p className="text-gray-600 mb-3 leading-relaxed">{review.body}</p>
                <p className="text-sm text-gray-500 italic">
                  - {review.reviewer.name || "Anonymous"}
                </p>
                {review.pictures && review.pictures.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {review.pictures.slice(0, 3).map((pic, idx) => ( // Limit to 3
                      <Image
                        key={idx}
                        src={pic.urls?.compact || pic.url} // Fallback for API variations
                        alt={`Review photo ${idx + 1}`}
                        width={80}
                        height={80}
                        className="object-cover rounded-lg cursor-pointer hover:opacity-80"
                      />
                    ))}
                    {review.pictures.length > 3 && (
                      <span className="text-sm text-gray-500 self-center">
                        +{review.pictures.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition"
              >
                {isLoading ? "Loading..." : "Load More Reviews"}
              </button>
            </div>
          )}
          {!hasMore && sortedReviews.length > 0 && (
            <p className="text-center text-gray-500 mt-8">No more reviews to load.</p>
          )}
        </>
      )}
      {reviews.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No reviews yet. Be the first to share your thoughts!
        </div>
      )}
    </section>
  );
}