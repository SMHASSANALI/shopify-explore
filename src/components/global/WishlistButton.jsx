"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import {
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
} from "@/utils/wishlist";

export default function WishlistButton({ product, customer }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Check if product is in wishlist on mount
  useEffect(() => {
    if (product?.node?.id) {
      setIsWishlisted(isInWishlist(product.node.id));
    }
  }, [product?.node?.id]);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is logged in
    if (!customer) {
      router.push("/login");
      return;
    }

    if (!product?.node?.id) return;

    setIsLoading(true);

    try {
      if (isWishlisted) {
        removeFromWishlist(product.node.id);
        setIsWishlisted(false);
      } else {
        // Prepare product data for wishlist
        const wishlistProduct = {
          id: product.node.id,
          title: product.node.title,
          handle: product.node.handle,
          image: product.node.image || product.node.images?.edges?.[0]?.node,
          price: product.node.price,
          variants: product.node.variants?.edges?.map(({ node }) => ({
            id: node.id,
            price: node.price,
            availableForSale: node.availableForSale,
          })),
        };

        addToWishlist(wishlistProduct);
        setIsWishlisted(true);
      }

      // Dispatch event to update wishlist count in navbar if needed
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("wishlist:updated"));
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleWishlistToggle}
      disabled={isLoading}
      className="w-fit bg-white/50 p-2 hover:bg-white rounded-full shadow-md transition-all duration-200 z-20 cursor-pointer group flex items-center justify-center"
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isLoading ? (
        <div className="border-2 size-4 border-gray-300 border-t-gray-600 rounded-full animate-spin flex items-center justify-center" />
      ) : isWishlisted ? (
        <MdFavorite className="text-red-500" />
      ) : (
        <MdFavoriteBorder className="text-gray-600 group-hover:text-red-500" />
      )}
    </button>
  );
}
