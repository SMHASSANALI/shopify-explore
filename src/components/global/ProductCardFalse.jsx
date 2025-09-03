"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { createCart, addToCart } from "@/lib/shopify";
import { useRouter } from "next/navigation";
import { toTitleCase } from "@/utils/toTitleCase";

export default function ProductCard({
  id,
  title,
  handle,
  image,
  variantId,
  tags,
  price,
}) {
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
      // Set cartId in cookie
      document.cookie = `cartId=${encodeURIComponent(
        updatedCart.id
      )}; path=/; max-age=86400`; // 24-hour expiry
      router.push("/cart");
    } else {
      console.error("❌ Failed to add to cart");
    }
    setIsAdding(false);
  };

  return (
    <Link
      href={`/product/${handle}`}
      key={id}
      className="h-[500px] w-[350px] bg-white shadow-xl group hover:shadow-2xl transition ease-in-out delay-150 duration-300 relative z-10"
    >
      <div className="relative h-[350px] w-full overflow-hidden">
        <Image src={image.src} alt={image.altText || title} fill sizes="100%" className="group-hover:scale-110 transition ease-in-out delay-150 duration-300" />
      </div>
      <div className="p-4 rounded-2xl h-[150px] flex flex-col gap-[10px]">
        <h2 className="text-gray-800 font-semibold text-lg leading-[1]">
          {title}
        </h2>
        <div className="flex flex-row gap-2 pt-1 pb-3">
          {/* only show first 2 */}
          {tags?.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="border border-[var(--primary)] text-[var(--primary-dark)] rounded px-2 text-sm"
            >
              {toTitleCase(tag)}
            </span>
          ))}
        </div>
        <div className="flex flex-row justify-between items-end mt-auto">
          <div className="flex flex-col gap-0">
            <p className="text-gray-800 text-sm leading-5 tracking-wide">
              Price
            </p>
            <p className="text-gray-800 font-extrabold text-xl leading-3">
              {price}
            </p>
          </div>
          <motion.button
            onClick={handleAddToCart}
            disabled={isAdding}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer bg-gradient-to-b from-yellow-300 to-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline z-50"
          >
            Add to cart
          </motion.button>
        </div>
      </div>
    </Link>
  );
}
