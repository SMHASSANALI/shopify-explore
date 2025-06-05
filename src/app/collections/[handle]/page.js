import { fetchShopify } from "@/lib/shopify";
import ProductCard from "@/components/ProductCard";

export async function generateMetadata({ params }) {
  return {
    title: `${params.handle} Collection | HA-AA-IB`,
  };
}

export default async function CollectionPage({ params }) {
  const query = `
    query CollectionByHandle($handle: String!) {
      collectionByHandle(handle: $handle) {
        title
        products(first: 50) {
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
    }
  `;

  const variables = { handle: params.handle };
  const data = await fetchShopify(query, variables);
  const collection = data?.collectionByHandle;
  const products = collection?.products?.edges || [];

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{collection?.title}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map(({ node }) => {
          const image = node.images.edges[0]?.node;
          const variantId = node.variants.edges[0]?.node.id;
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
