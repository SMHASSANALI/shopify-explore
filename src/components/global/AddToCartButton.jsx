"use client";

import { useState, useEffect } from "react";
import { createCart, addToCart } from "@/lib/shopify";
import { useRouter } from "next/navigation";

export default function AddToCartButton({
  variantId,
  quantity = 1,
  disabled = false,
}) {
  const [cartId, setCartId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null); // Add error state
  const router = useRouter();

  // Initialize or retrieve cart on mount
  useEffect(() => {
    const initializeCart = async () => {
      if (!cartId) {
        const storedCartId = localStorage.getItem("cartId");
        if (storedCartId) {
          setCartId(storedCartId);
        } else {
          try {
            const newCart = await createCart();
            if (newCart?.id) {
              setCartId(newCart.id);
              localStorage.setItem("cartId", newCart.id);
            } else {
              setError("Failed to create cart.");
            }
          } catch (err) {
            setError("Error initializing cart.");
            console.error("Cart initialization error:", err);
          }
        }
      }
    };
    initializeCart();
  }, [cartId]);

  // Handle adding to cart
  const handleAddToCart = async (e) => {
    // Remove e.preventDefault() since this is a standalone button
    if (!cartId || !variantId || isAdding) return;

    // Validate variantId format (basic check for Shopify ID)
    const isValidVariantId = variantId.startsWith(
      "gid://shopify/ProductVariant/"
    );
    if (!isValidVariantId) {
      setError("Invalid product variant ID.");
      return;
    }

    setIsAdding(true);
    setError(null); // Clear previous errors

    const lines = [
      {
        merchandiseId: variantId,
        quantity: Math.max(1, Number(quantity) || 1),
      },
    ];

    try {
      const updatedCart = await addToCart(cartId, lines);
      if (updatedCart) {
        // Update cartId in cookie and localStorage
        document.cookie = `cartId=${encodeURIComponent(
          updatedCart.id
        )}; path=/; max-age=604800`; // 7 days
        localStorage.setItem("cartId", updatedCart.id);
        router.push(`/cart?ts=${Date.now()}`);
        router.refresh();
      } else {
        setError("Failed to add item to cart.");
      }
    } catch (err) {
      setError("Error adding to cart.");
      console.error("Add to cart error:", err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <button
        onClick={handleAddToCart}
        disabled={disabled || isAdding || !cartId || !!error}
        className="text-slate-600 hover:text-[var(--primary-dark)] font-medium  px-[12px] md:px-4 py-2 rounded border border-gray-300 hover:border-[var(--primary-dark)]/90 transition disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed w-full"
      >
        {isAdding ? "Adding..." : "Add to Cart"}
      </button>
      {error && (
        <p className="text-red-500 !text-xs md:text-sm mt-2">{error}</p> // Display error message
      )}
    </>
  );
}
