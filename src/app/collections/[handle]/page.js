import { fetchCollectionPageData } from "@/lib/shopify/fetch/collection";
import CollectionsSection from "@/components/global/CollectionsSection";
import Breadcrumbs from "@/components/global/Breadcrumbs";
import ProductsClient from "@/components/products/ProductsClient";

export async function generateMetadata({ params }) {
  const { handle } = await params;
  try {
    if (!handle || typeof handle !== "string") {
      throw new Error("Invalid handle");
    }
    const { collection } = await fetchCollectionPageData({
      handle,
      firstProducts: 1,
    });
    const title = collection?.title || handle;
    const description =
      collection?.description || `Explore ${title} at HAAAIB.`;
    const image =
      collection?.products?.[0]?.node?.image?.src || "/assets/placeholder.jpg";
    const canonical = `/collections/${handle}`;
    return {
      title: `${title} | HAAAIB`,
      description,
      alternates: { canonical },
      openGraph: {
        type: "website",
        url: canonical,
        title: `${title} | HAAAIB`,
        description,
        images: image
          ? [{ url: image, alt: `${title} collection` }]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | HAAAIB`,
        description,
        images: image ? [image] : undefined,
      },
    };
  } catch {
    return { title: `${handle || "Unknown"} | HAAAIB` };
  }
}

export default async function CollectionPage({ params }) {
  const { handle } = await params;
  if (!handle || typeof handle !== "string") {
    return (
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Collection Not Found</h1>
        <p>The requested collection does not exist.</p>
      </main>
    );
  }

  const { products, hasNextPage, endCursor, sliderCollections } =
    await fetchCollectionPageData({
      handle,
      firstProducts: 32,
      firstCollections: 10,
    });

  if (!products || products.length === 0) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Collection Not Found</h1>
        <p>The requested collection does not exist.</p>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen bg-white 2xl:px-0 lg:px-4 px-2">
      <div className="max-w-[1400px] mx-auto">
        <CollectionsSection data={sliderCollections} />
        <Breadcrumbs
          className="my-4 md:!my-8"
          overrides={{
            collections: "Collections",
            [handle]: handle,
          }}
        />
        <ProductsClient
          initialProducts={products}
          initialHasNextPage={hasNextPage}
          initialEndCursor={endCursor}
          collectionId={handle}
        />
      </div>
    </main>
  );
}