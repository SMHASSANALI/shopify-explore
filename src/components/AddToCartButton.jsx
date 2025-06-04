"use client";

import { useState, useEffect } from "react";
import { createCart, addToCart } from "@/lib/shopify";
import { useRouter } from "next/navigation";
import { setCookie } from 'cookie';

export default function AddToCartButton({ variantId }) {
  const [cartId, setCartId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  // Initialize or retrieve cart on mount
  useEffect(() => {
    const initializeCart = async () => {
      if (!cartId) {
        const storedCartId = localStorage.getItem("cartId");
        if (storedCartId) {
          setCartId(storedCartId);
        } else {
          const newCart = await createCart();
          if (newCart?.id) {
            setCartId(newCart.id);
            localStorage.setItem("cartId", newCart.id);
          }
        }
      }
    };
    initializeCart();
  }, [cartId]);

  // Handle adding to cart
 const handleAddToCart = async (e) => {
  e.preventDefault(); // Only for ProductCard.jsx
  if (!cartId || !variantId) return;

  setIsAdding(true);
  const lines = [{ merchandiseId: variantId, quantity: 1 }];
  const updatedCart = await addToCart(cartId, lines);

  if (updatedCart) {
    console.log("✅ Added to cart:", updatedCart);
    // Set cartId in cookie
    document.cookie = `cartId=${encodeURIComponent(updatedCart.id)}; path=/; max-age=86400`; // 24-hour expiry
    router.push("/cart");
  } else {
    console.error("❌ Failed to add to cart");
  }
  setIsAdding(false);
};

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding || !cartId}
      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {isAdding ? "Adding..." : "Add to Cart"}
    </button>
  );
}