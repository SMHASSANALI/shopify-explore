import { fetchShopify } from "@/lib/shopify";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";

export async function generateMetadata({ params }) {
  const handle = params?.handle; // Ensure params is defined
  if (!handle) {
    return { title: "Product Not Found | HA-AA-IB" };
  }
  return {
    title: `${handle} | HA-AA-IB`,
  };
}

export default async function ProductPage({ params }) {
  const handle = params?.handle; // Ensure params is defined
  if (!handle) {
    return <div className="max-w-6xl mx-auto px-4 py-12">Product not found</div>;
  }

  const query = `
    query ProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        description
        images(first: 10) {
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
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;

  const variables = { handle };
  const data = await fetchShopify(query, variables);
  const product = data?.productByHandle;
  const images = product?.images?.edges || [];
  const price = product?.variants?.edges[0]?.node?.price;
  const variantId = product?.variants?.edges[0]?.node?.id;

  if (!product) {
    return <div className="max-w-6xl mx-auto px-4 py-12">Product not found</div>;
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {images.map(({ node }, index) => (
            <Image
              key={index}
              src={node.src}
              alt={node.altText || product.title}
              width={500}
              height={300}
              className="w-full h-auto object-cover rounded-lg"
            />
          ))}
        </div>
        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          {price && (
            <p className="text-xl font-semibold mb-4">
              {price.amount} {price.currencyCode}
            </p>
          )}
          <AddToCartButton variantId={variantId} />
        </div>
      </div>
    </main>
  );
}