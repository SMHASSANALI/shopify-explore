"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MdFavorite, MdDelete } from "react-icons/md";
import { getWishlist, removeFromWishlist, clearWishlist } from "@/utils/wishlist";

export default function WishlistTab() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = () => {
      setWishlist(getWishlist());
      setLoading(false);
    };

    loadWishlist();

    // Listen for wishlist updates
    const handleUpdate = () => {
      loadWishlist();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('wishlist:updated', handleUpdate);
      return () => window.removeEventListener('wishlist:updated', handleUpdate);
    }
  }, []);

  const handleRemoveItem = (productId) => {
    const updatedWishlist = removeFromWishlist(productId);
    setWishlist(updatedWishlist);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
      clearWishlist();
      setWishlist([]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-12">
        <MdFavorite className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Your wishlist is empty</h3>
        <p className="text-gray-500 mb-6">Start adding items you love to your wishlist!</p>
        <Link
          href="/collections"
          className="inline-flex items-center px-4 py-2 bg-[var(--accent)] text-white rounded-md hover:opacity-90 transition-opacity"
        >
          Browse Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          My Wishlist ({wishlist.length} {wishlist.length === 1 ? 'item' : 'items'})
        </h2>
        {wishlist.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
          >
            <MdDelete className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map((item) => (
          <div key={item.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative aspect-square">
              {item.image?.src ? (
                <Image
                  src={item.image.src}
                  alt={item.image.altText || item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all duration-200"
                aria-label="Remove from wishlist"
                title="Remove from wishlist"
              >
                <MdFavorite className="w-4 h-4 text-red-500" />
              </button>
            </div>
            
            <div className="p-4">
              <Link
                href={`/product/${item.handle}`}
                className="block hover:text-[var(--accent)] transition-colors"
              >
                <h3 className="font-medium text-sm line-clamp-2 mb-2">
                  {item.title}
                </h3>
              </Link>
              
              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg">
                  £{item.price || '0.00'}
                </span>
                
                <Link
                  href={`/product/${item.handle}`}
                  className="text-[var(--accent)] hover:underline text-sm font-medium"
                >
                  View Product
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
