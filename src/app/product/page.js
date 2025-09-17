import { fetchAllProducts } from "@/lib/shopify";
import CollectionsSection from "@/components/global/CollectionsSection";
import { ProductsClient } from "@/components/products/ProductsClient";
import Breadcrumbs from "@/components/global/Breadcrumbs";

export const metadata = {
  title: "Products | HA-AA-IB",
};

export default async function ProductsPage() {
  const { products: initialProducts, hasNextPage: initialHasNextPage, endCursor: initialEndCursor } = await fetchAllProducts({ first: 30 });

  return (
    <main className="w-full min-h-screen bg-white p-2 md:p-0">
      <main className="max-w-[1400px] mx-auto mb-8">
        <CollectionsSection />

        <Breadcrumbs
          className="!mb-8"
          overrides={{ }}
        />

        <ProductsClient 
          initialProducts={initialProducts} 
          initialHasNextPage={initialHasNextPage} 
          initialEndCursor={initialEndCursor} 
        />
      </main>
    </main>
  );
}