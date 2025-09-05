import { fetchAllCollections, fetchShopify } from "@/lib/shopify";
import CollectionCard from "@/components/global/CollectionCard";
import { Suspense } from "react";
import BreadCrumb from "@/components/global/BreadCrumb";

export const metadata = {
  title: "Collections | HA-AA-IB",
  description:
    "Explore our curated jewelry collections, crafted with elegance and meaning to celebrate your unique story.",
  openGraph: {
    title: "Collections | HA-AA-IB",
    description:
      "Discover our exclusive jewelry collections designed for timeless elegance.",
    url: "https://haaaib.com/collections",
    type: "website",
  },
};

export default async function CollectionsPage() {
  // Fetch all collections
  const allCollections = await fetchAllCollections();

  return (
    <main className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          All Collections
        </h1>
        <p className="mt-2 text-base sm:text-lg text-gray-600">
          Discover our curated collections, crafted to tell your unique story.
        </p>
      </header>
      <Suspense
        fallback={
          <div className="text-center text-gray-600">
            Loading collections...
          </div>
        }
      >
        {allCollections.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allCollections.map((edge) => {
              if (edge.title !== "Hero Banners" && edge.title !== "Bento Images" && edge.title !== "Ad Banners" ) {
                return <CollectionCard key={edge.id} edge={edge} />;
              }
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-600">
            No collections found. Check back soon for new additions!
          </div>
        )}
      </Suspense>
    </main>
  );
}
