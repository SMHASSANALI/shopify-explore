import { fetchShopify } from "@/lib/shopify";
import { cookies } from "next/headers";
import {
  calculateTotal,
  updateQuantityMutation,
  removeItemMutation,
} from "@/utils/helper";
import { revalidatePath } from "next/cache";

export const metadata = {
  title: "Cart | HA-AA-IB",
};

export default async function CartPage({ searchParams }) {
  const { resolvedSearchParams } = await searchParams;
  // Get cartId from cookies
  const cookieStore = await cookies();
  const cartId =
    cookieStore.get("cartId")?.value ||
    resolvedSearchParams?.cartId ||
    (typeof window !== "undefined" ? localStorage.getItem("cartId") : null);

  if (!cartId) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <p className="text-gray-600">Your cart is empty.</p>
      </main>
    );
  }

  // Fetch cart data
  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  product {
                    title
                    images(first: 1) {
                      edges {
                        node {
                          src
                          altText
                        }
                      }
                    }
                  }
                  priceV2 {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = { cartId };
  const data = await fetchShopify(query, variables);
  const cart = data?.cart || { lines: { edges: [] }, checkoutUrl: "#" };

  // Calculate total
  const total = calculateTotal(cart.lines.edges);
  const currencyCode =
    cart.lines.edges[0]?.node?.merchandise?.priceV2?.currencyCode || "USD";

  return (
    <main className="max-w-[1600px] w-full mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-10 text-gray-800">Your Cart</h1>
      {cart.lines.edges.length === 0 ? (
        <p className="text-gray-600 text-lg">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-5 gap-4 p-4 bg-gray-100 font-semibold text-gray-700">
                <div className="col-span-2">Product</div>
                <div>Price</div>
                <div>Quantity</div>
                <div>Subtotal</div>
              </div>
              <div className="divide-y divide-gray-200">
                {cart.lines.edges.map(({ node }) => {
                  const image = node.merchandise.product.images.edges[0]?.node;
                  const price = parseFloat(node.merchandise.priceV2.amount);
                  const subtotal = (price * node.quantity).toFixed(2);

                  return (
                    <div
                      key={node.id}
                      className="grid grid-cols-5 gap-4 p-4 items-center border-b border-gray-200 last:border-b-0"
                    >
                      {/* Product Image and Title */}
                      <div className="col-span-2 flex items-center gap-4">
                        {image && (
                          <img
                            src={image.src}
                            alt={
                              image.altText || node.merchandise.product.title
                            }
                            className="w-20 h-24 object-cover rounded"
                          />
                        )}
                        <h3 className="text-lg font-medium text-gray-800">
                          {node.merchandise.product.title}
                        </h3>
                      </div>
                      {/* Price */}
                      <div>
                        <p className="text-gray-600">
                          {price} {node.merchandise.priceV2.currencyCode}
                        </p>
                      </div>
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <form
                          action={async () => {
                            "use server";
                            const newQuantity = Math.max(1, node.quantity - 1);
                            const lines = [
                              { id: node.id, quantity: newQuantity },
                            ];
                            await fetchShopify(updateQuantityMutation, {
                              cartId,
                              lines,
                            });
                            revalidatePath("/cart");
                          }}
                        >
                          <button
                            type="submit"
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            -
                          </button>
                        </form>
                        <span className="px-3">{node.quantity}</span>
                        <form
                          action={async () => {
                            "use server";
                            const newQuantity = node.quantity + 1;
                            const lines = [
                              { id: node.id, quantity: newQuantity },
                            ];
                            await fetchShopify(updateQuantityMutation, {
                              cartId,
                              lines,
                            });
                            revalidatePath("/cart");
                          }}
                        >
                          <button
                            type="submit"
                            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            +
                          </button>
                        </form>
                      </div>
                      {/* Subtotal and Remove */}
                      <div className="flex items-center justify-between">
                        <p className="text-gray-800 font-medium">
                          {subtotal} {node.merchandise.priceV2.currencyCode}
                        </p>
                        <form
                          action={async () => {
                            "use server";
                            const lineIds = [node.id];
                            await fetchShopify(removeItemMutation, {
                              cartId,
                              lineIds,
                            });
                            revalidatePath("/cart");
                          }}
                        >
                          <button
                            type="submit"
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              ></path>
                            </svg>
                          </button>
                        </form>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 sticky top-12 bg-gray-50">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 ">
                Order Summary
              </h2>
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Total</span>
                <span className="text-lg font-bold text-gray-800">
                  {total} {currencyCode}
                </span>
              </div>
              <a
                href={cart.checkoutUrl}
                className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Proceed to Checkout
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
