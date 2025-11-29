import { useCart } from "@/contexts/CartContext";
import { addToCart } from "@/lib/shopify";
import { useState } from "react";

export default function AddToCartButton({
  variantId,
  quantity = 1,
  disabled = false,
}) {
  const { cartId, updateCartId } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!cartId || !variantId || isAdding) return;

    setIsAdding(true);
    setError(null);

    const lines = [
      {
        merchandiseId: variantId,
        quantity: Math.max(1, Number(quantity) || 1),
      },
    ];

    try {
      const updatedCart = await addToCart(cartId, lines);
      if (updatedCart?.id) {
        updateCartId(updatedCart.id); // in case cart ID changed (rare)
        window.dispatchEvent(
          new CustomEvent("cart:open", { detail: { cartId: updatedCart.id } })
        );
        setTimeout(() => window.dispatchEvent(new Event("cart:refresh")), 200);
      } else {
        setError("Failed to add item");
      }
    } catch (err) {
      setError("Error adding to cart");
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  // Remove all cart initialization logic — it's now in context!
  return (
    <>
      <button
        onClick={handleAddToCart}
        disabled={disabled || isAdding || !cartId}
        className="text-white hover:text-[var(--primary-dark)] bg-[var(--primary-dark)] hover:bg-transparent duration-200 ease-in font-medium  px-[12px] md:px-4 py-2 rounded border border-gray-300 hover:border-[var(--primary-dark)]/90 transition disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed w-full"
      >
        {isAdding ? "Adding..." : "Add to Cart"}
      </button>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </>
  );
}
