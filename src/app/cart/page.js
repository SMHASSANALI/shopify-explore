import { getCart } from "@/lib/shopify";
import { cookies } from "next/headers";
import {
  calculateTotal,
  updateCartQuantity,
  removeCartItems,
} from "@/utils/helper";
import { revalidatePath } from "next/cache";
import Breadcrumbs from "@/components/global/Breadcrumbs";
import Link from "next/link";
import { MdDelete } from "react-icons/md";
import Image from "next/image";

export const metadata = {
  title: "Cart | HAAAIB",
  description:
    "Explore our curated collection of home décor, fashion, and lifestyle products at budget-friendly prices.",
  openGraph: {
    title: "Cart | HAAAIB",
    description:
      "Explore our curated collection of home décor, fashion, and lifestyle products at budget-friendly prices.",
    url: "/cart",
    images: [
      {
        url: "/assets/logoMark-Dark.png",
        width: 1200,
        height: 630,
        alt: "HAAAIB Cart",
      },
    ],
  },
};

export default async function CartPage({ searchParams }) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value || searchParams?.cartId;

  if (!cartId) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <p className="text-gray-600">Your cart is empty.</p>
      </main>
    );
  }

  let cart;
  try {
    cart = await getCart(cartId);
    if (!cart) {
      console.error("Cart not found for ID:", cartId);
      return (
        <main className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
          <p className="text-red-600">Cart not found. Please try again.</p>
        </main>
      );
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
    return (
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <p className="text-red-600">Error loading cart. Please try again.</p>
      </main>
    );
  }

  const total = calculateTotal(cart.lines.edges);
  const currencyCode =
    cart.lines.edges[0]?.node?.merchandise?.priceV2?.currencyCode || "GBP";

  return (
    <main className="bg-white min-h-screen pt-[60px] p-2 md:p-0">
      <section className="max-w-[1400px] w-full mx-auto">
        <Breadcrumbs className="my-4 md:!my-8" overrides={{ cart: "Cart" }} />
        <div className="flex flex-row items-center justify-between border-b-4 border-gray-300 pb-2">
          <h1 className="font-semibold">Shopping Cart</h1>
          <Link href="/products" className="hover:text-[var(--accent)]">
            Continue Shopping
          </Link>
        </div>
        {cart.lines.edges.length === 0 ? (
          <p className="text-gray-600 text-lg">Your cart is empty.</p>
        ) : (
          <div className="flex flex-col pt-[60px]">
            <div className="bg-[var(--secondary)]/5">
              <table className="w-full">
                <thead className="p-4 border-b border-gray-400">
                  <tr>
                    <th className="p-1">Products</th>
                    <th className="p-1">Quantity</th>
                    <th className="p-1">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cart.lines.edges.map(({ node }) => {
                    const image =
                      node.merchandise.image ||
                      node.merchandise.product.images.edges[0]?.node;
                    const price = parseFloat(node.merchandise.priceV2.amount);
                    const variantType =
                      node.merchandise.selectedOptions?.[0]?.value || "Default";
                    const subtotal = (price * node.quantity).toFixed(2);

                    return (
                      <tr
                        key={node.id}
                        className="p-4 items-center border-b border-gray-200 last:border-b-0"
                      >
                        <td className="p-2">
                          <div className="flex flex-col md:flex-row items-start md:items-center justify-start gap-2 md:gap-4">
                            {image && (
                              <div className="h-[80px] w-[80px] md:h-[250px] md:w-[250px] aspect-[1/1]">
                                <Image
                                  src={image.src}
                                  alt={
                                    image.altText ||
                                    node.merchandise.product.title
                                  }
                                  height={250}
                                  width={250}
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                  styles={{ width: "auto", height: "auto" }}
                                />
                              </div>
                            )}
                            <div>
                              <h2 className="font-light pb-1 !text-sm md:!text-lg">
                                {node.merchandise.product.title}
                              </h2>
                              <h2 className="font-semibold pb-2 !text-sm md:!text-lg">
                                £ {price}{" "}
                                {node.merchandise.priceV2.currencyCode}
                              </h2>
                              <h3 className="font-light !text-sm md:!text-lg">
                                {variantType}
                              </h3>
                            </div>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex flex-row items-center justify-center border border-gray-400 rounded bg-white">
                            <div className="flex flex-row items-center justify-between w-8/12">
                              <form
                                action={async () => {
                                  "use server";
                                  const newQuantity = Math.max(
                                    1,
                                    node.quantity - 1
                                  );
                                  const lines = [
                                    { id: node.id, quantity: newQuantity },
                                  ];
                                  await updateCartQuantity(cartId, lines);
                                  revalidatePath("/cart");
                                }}
                              >
                                <button
                                  type="submit"
                                  className="px-2 py-1 cursor-pointer"
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
                                  await updateCartQuantity(cartId, lines);
                                  revalidatePath("/cart");
                                }}
                              >
                                <button
                                  type="submit"
                                  className="px-2 py-1 cursor-pointer"
                                >
                                  +
                                </button>
                              </form>
                            </div>
                            <form
                              action={async () => {
                                "use server";
                                const lineIds = [node.id];
                                await removeCartItems(cartId, lineIds);
                                revalidatePath("/cart");
                              }}
                              className="flex flex-row items-center justify-between"
                            >
                              <button
                                className="p-1 cursor-pointer"
                                type="submit"
                              >
                                <MdDelete size={16} />
                              </button>
                            </form>
                          </div>
                        </td>
                        <td className="p-2">
                          <p className="text-center">
                            £ {subtotal} {node.merchandise.priceV2.currencyCode}
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="w-full">
              <div className="p-6 w-full md:w-4/12 ml-auto">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  Order Summary
                </h2>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Total</span>
                  <span className="text-lg font-bold text-gray-800">
                    £ {total} {currencyCode}
                  </span>
                </div>
                <a
                  href={cart.checkoutUrl}
                  className="block w-full text-center bg-[var(--primary-dark)] text-white py-3 rounded-lg hover:bg-[var(--primary-dark)]/90 transition font-semibold"
                >
                  Proceed to Checkout
                </a>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
