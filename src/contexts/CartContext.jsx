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

      // 1. Try cookie first (more reliable across tabs)
      const cookieMatch = document.cookie.match(/cartId=([^;]+)/);
      if (cookieMatch) {
        id = cookieMatch[1];
      }

      // 2. Fallback to localStorage
      if (!id) {
        id = localStorage.getItem("cartId");
      }

      // 3. Create new cart if none exists
      if (!id) {
        try {
          const newCart = await createCart();
          if (newCart?.id) {
            id = newCart.id;
            localStorage.setItem("cartId", id);
            document.cookie = `cartId=${id}; path=/; max-age=604800`;
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