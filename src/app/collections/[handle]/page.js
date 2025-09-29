import { fetchCollectionByHandle } from "@/lib/shopify";
import CollectionsSection from "@/components/global/CollectionsSection";
import Breadcrumbs from "@/components/global/Breadcrumbs";
import { ProductsClient } from "@/components/products/ProductsClient";

export async function generateMetadata({ params }) {
  const { handle } = await params; // Await params to resolve the Promise
  try {
    const data = await fetchCollectionByHandle(handle, { first: 1 });
    const title = data?.title || handle;
    const description = data?.description || `Explore ${title} at HAAAIB.`;
    const image = data?.image?.src || data?.products?.[0]?.node?.image?.src || null;
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
        images: image ? [{ url: image, alt: `${title} collection` }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | HAAAIB`,
        description,
        images: image ? [image] : undefined,
      },
    };
  } catch {
    return { title: `${handle} | HAAAIB` };
  }
}

export default async function CollectionPage({ params }) {
  const { handle } = await params; // Await params to resolve the Promise

  const data = await fetchCollectionByHandle(handle, { first: 250 });
  const { products: initialProducts, hasNextPage: initialHasNextPage, endCursor: initialEndCursor } = data;
  console.log("Collection data:", data);

  if (!data || !data.title) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Collection Not Found</h1>
        <p>The requested collection does not exist.</p>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen bg-white 2xl:px-0 lg:px-4 px-2">
      <main className="max-w-[1400px] mx-auto">
        <CollectionsSection />
        <Breadcrumbs
          className="my-4 md:!my-8"
          overrides={{ collections: "Collections" }}
        />

        <ProductsClient initialProducts={initialProducts} initialHasNextPage={initialHasNextPage} initialEndCursor={initialEndCursor} />
      </main>
    </main>
  );
}
