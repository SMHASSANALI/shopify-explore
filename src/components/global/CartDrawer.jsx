"use client";

import React, { useEffect, useMemo, useState } from "react";
import { IoMdCart } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";
import { createCart, getCart } from "@/lib/shopify";
import { updateCartQuantity, removeCartItems } from "@/utils/helper";
import { getCartLineDiscount } from "@/utils/discount-utlis";

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartId, setCartId] = useState(null);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const itemCount = useMemo(() => {
    if (!cart) return 0;
    return cart.lines?.edges?.reduce((sum, { node }) => sum + (node.quantity || 0), 0) || 0;
  }, [cart]);

  const subtotal = useMemo(() => {
    if (!cart) return "0.00";
    // Calculate with discounts if available
    const total = cart.lines?.edges?.reduce((sum, { node }) => {
      const originalPrice = parseFloat(node.merchandise?.priceV2?.amount || 0);
      const productMetafields = node.merchandise?.product?.metafields || [];
      const priceInfo = getCartLineDiscount(node.merchandise, productMetafields);
      const price = parseFloat(priceInfo.price);
      return sum + (price * node.quantity);
    }, 0) || 0;
    return total.toFixed(2);
  }, [cart]);

  const checkoutUrl = cart?.checkoutUrl || "/cart";

  // Init or load cart
  useEffect(() => {
    const init = async () => {
      try {
        const stored = typeof window !== "undefined" ? localStorage.getItem("cartId") : null;
        let id = stored;
        if (!id) {
          const created = await createCart();
          id = created?.id || null;
          if (id) {
            localStorage.setItem("cartId", id);
            document.cookie = `cartId=${encodeURIComponent(id)}; path=/; max-age=604800`;
          }
        }
        setCartId(id);
        if (id) {
          const c = await getCart(id);
          setCart(c);
        }
      } catch (e) {
        setError("Failed to initialize cart");
      }
    };
    init();
  }, []);

  // Listen for open events
  useEffect(() => {
    const onOpen = async (e) => {
      const incomingCartId = e?.detail?.cartId;
      if (incomingCartId && incomingCartId !== cartId) {
        setCartId(incomingCartId);
      }
      setIsOpen(true);
      await refreshCart();
    };
    const onRefresh = async () => {
      await refreshCart();
    };
    if (typeof window !== "undefined") {
      window.addEventListener("cart:open", onOpen);
      window.addEventListener("cart:refresh", onRefresh);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("cart:open", onOpen);
        window.removeEventListener("cart:refresh", onRefresh);
      }
    };
  }, [cartId]);

  const refreshCart = async () => {
    if (!cartId) return;
    setLoading(true);
    try {
      const c = await getCart(cartId);
      setCart(c);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantity = async (lineId, nextQty) => {
    if (!cartId || !lineId) return;
    setLoading(true);
    try {
      const updated = await updateCartQuantity(cartId, [
        { id: lineId, quantity: Math.max(0, nextQty) },
      ]);
      setCart(updated);
    } catch (e) {
      setError("Failed to update quantity");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (lineId) => {
    if (!cartId || !lineId) return;
    setLoading(true);
    try {
      const updated = await removeCartItems(cartId, [lineId]);
      setCart(updated);
    } catch (e) {
      setError("Failed to remove item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex flex-row gap-1 items-end cursor-pointer"
        aria-label="Open cart"
        title="Open cart"
      >
        <div className="relative mr-1">
          <IoMdCart size={30} color="white" />
          {itemCount > 0 && (
            <span className="absolute top-[-10px] right-[-10px] bg-[var(--accent)] text-white rounded-full flex items-center justify-center w-[18px] h-[18px] !text-xs font-bold">
              {itemCount}
            </span>
          )}
        </div>
        <div>
          <p className="text-white text-[12px] font-extralight leading-none">Cart</p>
          <p className="text-white !text-[14px] font-light leading-none">£ {subtotal}</p>
        </div>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[1001]"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-white shadow-xl z-[1002] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <header className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="font-semibold">Shopping Cart ({itemCount})</h2>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close cart"
            className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
          >
            <IoClose size={20} />
          </button>
        </header>

        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-180px)]">
          {error && <p className="text-red-600 text-sm">{error}</p>}

          {!cart || itemCount === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            cart.lines.edges.map(({ node }) => {
              const img = node.merchandise?.image;
              const title = node.merchandise?.product?.title || "Item";
              const originalPrice = parseFloat(node.merchandise?.priceV2?.amount || 0);
              const productMetafields = node.merchandise?.product?.metafields || [];
              const priceInfo = getCartLineDiscount(node.merchandise, productMetafields);
              const displayPrice = parseFloat(priceInfo.price);
              const lineTotal = (displayPrice * node.quantity).toFixed(2);

              return (
                <div key={node.id} className="flex gap-3 items-start border-b pb-3">
                  <div className="relative w-16 h-16 rounded overflow-hidden border">
                    {img?.src && (
                      <Image
                        src={img.src}
                        alt={img.altText || title}
                        width={64}
                        height={64}
                        className="object-cover"
                        styles={{ width: "auto", height: "auto" }}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-2">{title}</p>
                    
                    {/* Price with discount badge */}
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-semibold text-[var(--accent)]">
                        £ {lineTotal}
                      </p>
                      {priceInfo.hasDiscount && (
                        <>
                          <p className="text-xs text-gray-500 line-through">
                            £ {(originalPrice * node.quantity).toFixed(2)}
                          </p>
                          <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                            {priceInfo.discountPercentage}% off
                          </span>
                        </>
                      )}
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => handleQuantity(node.id, node.quantity - 1)}
                        className="w-7 h-7 border rounded flex items-center justify-center cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="min-w-[24px] text-center text-sm">{node.quantity}</span>
                      <button
                        onClick={() => handleQuantity(node.id, node.quantity + 1)}
                        className="w-7 h-7 border rounded flex items-center justify-center cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemove(node.id)}
                        className="ml-auto text-gray-500 hover:text-red-600 text-sm cursor-pointer"
                        aria-label="Remove item"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <footer className="p-4 border-t bg-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Subtotal</span>
            <span className="font-semibold">£ {subtotal}</span>
          </div>
          <p className="text-xs text-gray-500">
            Discounts and shipping calculated at checkout
          </p>
          <div className="flex gap-3">
            <Link
              onClick={() => setIsOpen(false)}
              href="/cart"
              className="flex-1 text-center border rounded px-4 py-2 bg-gray-100 hover:bg-gray-200"
            >
              View Cart
            </Link>
            <a
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center rounded px-4 py-2 bg-[var(--accent)] text-white hover:opacity-90"
            >
              Checkout
            </a>
          </div>
        </footer>
      </aside>
    </>
  );
}