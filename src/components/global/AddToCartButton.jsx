"use client";

import { useState, useEffect } from "react";
import { createCart, addToCart } from "@/lib/shopify";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ variantId, quantity = 1, disabled = false }) {
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
    const lines = [{ merchandiseId: variantId, quantity: Math.max(1, Number(quantity) || 1) }];
    const updatedCart = await addToCart(cartId, lines);

    if (updatedCart) {
      // Set cartId in cookie for server-side access
      document.cookie = `cartId=${encodeURIComponent(updatedCart.id)}; path=/; max-age=604800`; // 7 days
      router.push("/cart");
    } else {
      console.error("❌ Failed to add to cart");
    }
    setIsAdding(false);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled || isAdding || !cartId}
      className="bg-[var(--primary-dark)] text-white px-6 py-2 rounded-md hover:bg-[var(--primary-dark)]/90 transition disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed w-full"
    >
      {isAdding ? "Adding..." : "Add to Cart"}
    </button>
  );
}
