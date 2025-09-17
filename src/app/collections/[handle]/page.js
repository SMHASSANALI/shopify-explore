import { fetchCollectionByHandle } from "@/lib/shopify";
import { CollectionClient } from "@/components/products/CollectionClient";
import CollectionsSection from "@/components/global/CollectionsSection";
import Breadcrumbs from "@/components/global/Breadcrumbs";

export async function generateMetadata({ params }) {
  const { handle } = await params; // Await params to resolve the Promise
  return {
    title: `${handle} Collection | HA-AA-IB`,
  };
}

export default async function CollectionPage({ params }) {
  const { handle } = await params; // Await params to resolve the Promise

  const data = await fetchCollectionByHandle(handle, { first: 250 });

  if (!data || !data.title) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Collection Not Found</h1>
        <p>The requested collection does not exist.</p>
      </main>
    );
  }

  const { title, products: productData } = data;

  return (
    <main className="w-full min-h-screen bg-white p-2 md:p-0">
      <main className="max-w-[1400px] mx-auto">
        <CollectionsSection />
        <Breadcrumbs
          className="!mb-8"
          overrides={{ collections: "Collections" }}
        />

        <CollectionClient initialProducts={productData} />
      </main>
    </main>
  );
}
