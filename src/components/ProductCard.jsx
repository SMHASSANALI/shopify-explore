"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { createCart, addToCart } from "@/lib/shopify";
import { useRouter } from "next/navigation";
import { setCookie } from 'cookie';

export default function ProductCard({ id, title, handle, image, variantId }) {
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
    <motion.div
      key={id}
      whileHover={{ scale: 1.05, rotateX: 5, rotateY: 0 }}
      transition={{ duration: 0.3 }}
      className="border shadow rounded p-2 flex flex-col justify-between h-[450px] bg-white hover:bg-gray-50 transition-all"
    >
      <Link
        href={`/product/${handle}`}
        className="rounded-lg overflow-hidden hover:shadow-md transition"
      >
        {image && (
          <Image
            src={image.src}
            alt={image.altText || title}
            width={500}
            height={300}
            className="w-full h-64 object-cover rounded"
          />
        )}
        <div className="p-4 border flex flex-col h-full ">
          <h2 className="text-lg font-medium">{title}</h2>
          <button
            onClick={handleAddToCart}
            disabled={isAdding || !cartId}
            className="mt-auto w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isAdding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </Link>
    </motion.div>
  );
}
