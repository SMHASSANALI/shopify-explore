import { fetchShopify } from "@/lib/shopify";
import ProductCard from "@/components/global/ProductCardFalse";

export async function generateMetadata({ params }) {
  const { handle } = await params; // Await params to resolve the Promise
  return {
    title: `${handle} Collection | HA-AA-IB`,
  };
}

export default async function CollectionPage({ params }) {
  const { handle } = await params; // Await params to resolve the Promise

  const query = `
    query CollectionByHandle($handle: String!) {
      collectionByHandle(handle: $handle) {
        title
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
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
            tags
          }
        }
      }
      }
    }
  `;

  const variables = { handle };
  const data = await fetchShopify(query, variables);

  if (data?.errors) {
    console.error("GraphQL Errors:", data.errors);
    return (
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Error</h1>
        <p>Error loading collection. Please try again later.</p>
      </main>
    );
  }

  const collection = data?.collectionByHandle;
  if (!collection) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Collection Not Found</h1>
        <p>The requested collection does not exist.</p>
      </main>
    );
  }

  const products = collection.products?.edges || [];
  const productData = products.map(({ node }) => ({
    node: {
      id: node.id,
      title: node.title,
      handle: node.handle,
      image: node.images.edges[0]?.node || {
        src: "/images/placeholder.jpg",
        altText: node.title,
      },
      variants: node.variants,
      tags: node.tags,
    },
  }));

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{collection.title}</h1>
      {productData.length === 0 ? (
        <p>No products found in this collection.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {productData.map(({ node }) => (
            <ProductCard
              key={node.id}
              id={node.id}
              title={node.title}
              handle={node.handle}
              image={node.image}
              variantId={node.variantId}
              tags={node.tags}
              price={
                node.variants?.edges[0]?.node?.price?.amount +
                " " +
                node.variants?.edges[0]?.node?.price?.currencyCode
              }
            />
          ))}
        </div>
      )}
    </main>
  );
}
