// app/context/CartContext.jsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { createCart } from "@/lib/shopify";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartId, setCartId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initCart = async () => {
      let id = null;

      // Try cookie
      const cookieMatch = document.cookie.match(/cartId=([^;]+)/);
      if (cookieMatch) id = decodeURIComponent(cookieMatch[1]);

      // Try localStorage
      if (!id) id = localStorage.getItem("cartId");

      // Validate format
      const isValid =
        id && typeof id === "string" && id.startsWith("gid://shopify/Cart/");

      if (!isValid) {
        console.debug("Invalid cart ID found, clearing:", id);
        localStorage.removeItem("cartId");
        document.cookie =
          "cartId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        id = null;
      }

      // Create new cart if needed
      if (!id) {
        try {
          const newCart = await createCart();
          if (newCart?.id) {
            id = newCart.id;
            localStorage.setItem("cartId", id);
            document.cookie = `cartId=${encodeURIComponent(
              id
            )}; path=/; max-age=604800`;
          }
        } catch (err) {
          console.error("Failed to create cart", err);
        }
      }

      setCartId(id);
      setLoading(false);
    };

    initCart();
  }, []);

  const updateCartId = (newId) => {
    setCartId(newId);
    localStorage.setItem("cartId", newId);
    document.cookie = `cartId=${newId}; path=/; max-age=604800`;
  };

  return (
    <CartContext.Provider value={{ cartId, loading, updateCartId }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
