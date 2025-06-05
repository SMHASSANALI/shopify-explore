import { fetchShopify } from "@/lib/shopify";
import ProductCard from "@/components/ProductCard";

export const metadata = {
  title: "Products | HA-AA-IB",
};

export default async function ProductsPage() {
  const query = `
    {
      products(first: 250) {
        edges {
          node {
            id
            title
            handle
            images(first: 1) {
              edges {
                node {
                  src
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await fetchShopify(query);
  const products = data?.products?.edges || [];

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map(({ node }) => {
          const image = node.images.edges[0]?.node;
          const variantId = node.variants?.edges[0]?.node?.id; // Added safer access
          return (
            <ProductCard
              key={node.id}
              id={node.id}
              title={node.title}
              handle={node.handle}
              image={image}
              variantId={variantId}
            />
          );
        })}
      </div>
    </main>
  );
}