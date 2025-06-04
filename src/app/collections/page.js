import { fetchShopify } from "@/lib/shopify";
import CollectionCard from "@/components/CollectionCard";

export const metadata = {
  title: "Collections | HA-AA-IB",
};

export default async function CollectionsPage() {
  const query = `
    {
      collections(first: 50) {
        edges {
          node {
            id
            title
            handle
            image {
              src
              altText
            }
          }
        }
      }
    }
  `;

  const data = await fetchShopify(query);
  const collections = data?.collections?.edges || [];

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">All Collections</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {collections.map(({ node }) => (
          <CollectionCard
            key={node.id}
            id={node.id}
            title={node.title}
            handle={node.handle}
            image={node.image}
          />
        ))}
      </div>
    </main>
  );
}