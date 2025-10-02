import { fetchAllCollections, fetchShopify } from "@/lib/shopify";
import CollectionCard from "@/components/global/CollectionCard";
import { Suspense } from "react";
import Breadcrumbs from "@/components/global/Breadcrumbs";

export const metadata = {
  title: "Collections | HAAAIB",
  description:
    "Explore our curated collections, crafted with elegance and meaning to celebrate your unique story.",
  keywords: [
    "jewelry collections",
    "home decor collections",
    "lifestyle collections",
    "uk",
    "pinterest aesthetic",
    "budget-friendly",
  ],
  openGraph: {
    title: "Collections | HAAAIB",
    description:
      "Explore our curated collections, crafted with elegance and meaning to celebrate your unique story.",
    url: "https://haaaib.com/collections",
    type: "website",
    images: [
      {
        url: "/assets/logoMark-Dark.png", // Or use a collections-specific image
        width: 1200,
        height: 630,
        alt: "HAAAIB Collections",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@haaaib",
    creator: "@haaaib",
    title: "Collections | HAAAIB",
    description:
      "Explore our curated collections, crafted with elegance and meaning to celebrate your unique story.",
    images: ["/assets/haaaib-logo.svg"],
  },
};

export default async function CollectionsPage() {
  const allCollections = await fetchAllCollections();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "HAAAIB Collections",
    description:
      "Explore our curated jewelry collections, crafted with elegance and meaning to celebrate your unique story.",
    url: `${
      process.env.NEXT_PUBLIC_SITE_URL || "https://haaaib.com"
    }/collections`,
    hasPart: {
      "@type": "ItemList",
      itemListElement: allCollections.map((edge, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Collection",
          name: edge.title,
          url: `${
            process.env.NEXT_PUBLIC_SITE_URL || "https://haaaib.com"
          }/collections/${edge.handle}`,
          description:
            edge.description ||
            `Discover the ${edge.title} collection from HAAAIB, featuring elegant and meaningful designs.`,
          image:
            edge.image?.url ||
            edge.featuredImage?.url ||
            "/assets/placeholder-collection.jpg", // Adjust based on your data
          numberOfItems: edge.productsCount || 0,
          // Optional: Link to first product in collection for deeper hierarchy
          hasPart: {
            "@type": "ItemList",
            itemListElement: edge.products?.edges
              ?.slice(0, 3)
              .map((product, pIndex) => ({
                "@type": "ListItem",
                position: pIndex + 1,
                item: {
                  "@type": "Product",
                  name: product.node.title,
                },
              })),
          },
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <Breadcrumbs
            className="my-4 md:!my-8"
            overrides={{ collections: "Collections" }}
          />
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {allCollections.slice().reverse().map((edge) => {
                if (
                  edge.title !== "Hero Banners" &&
                  edge.title !== "Bento Images" &&
                  edge.title !== "Ad Banners"
                ) {
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
    </>
  );
}
