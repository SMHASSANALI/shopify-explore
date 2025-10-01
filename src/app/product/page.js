import { fetchAllProducts } from "@/lib/shopify";
import CollectionsSection from "@/components/global/CollectionsSection";
import { ProductsClient } from "@/components/products/ProductsClient";
import Breadcrumbs from "@/components/global/Breadcrumbs";
import Head from "next/head";

export const metadata = {
  title: "Products | HAAAIB",
  description:
    "Explore our curated collection of home décor, fashion, and lifestyle products at budget-friendly prices.",
  openGraph: {
    title: "Products | HAAAIB",
    description:
      "Explore our curated collection of home décor, fashion, and lifestyle products at budget-friendly prices.",
    url: "/products",
    images: [
      {
        url: "/assets/haaaib-logo.svg",
        width: 1200,
        height: 630,
        alt: "HAAAIB Products",
      },
    ],
  },
};

export default async function ProductsPage() {
  const {
    products: initialProducts,
    hasNextPage: initialHasNextPage,
    endCursor: initialEndCursor,
  } = await fetchAllProducts({ first: 30 });

  // Generate structured data for products
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "HAAAIB Products",
    description:
      "Explore our curated collection of home décor, fashion, and lifestyle products at budget-friendly prices.",
    url: `${
      process.env.NEXT_PUBLIC_SITE_URL || "https://www.haaaib.com"
    }/products`,
    hasPart: {
      "@type": "ItemList",
      itemListElement: initialProducts.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product.title,
          url: `${
            process.env.NEXT_PUBLIC_SITE_URL || "https://www.haaaib.com"
          }/products/${product.handle}`,
          image: product.featuredImage?.url || "/assets/placeholder.jpg",
          description:
            product.description || "High-quality product from HAAAIB",
          sku: product.variants?.[0]?.sku || product.id,
          brand: {
            "@type": "Brand",
            name: "HAAAIB",
          },
          offers: {
            "@type": "Offer",
            priceCurrency: product.variants?.[0]?.price?.currencyCode || "GBP",
            price: parseFloat(
              product.variants?.[0]?.price?.amount || 0
            ).toFixed(2),
            availability: product.availableForSale
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            url: `${
              process.env.NEXT_PUBLIC_SITE_URL || "https://www.haaaib.com"
            }/products/${product.handle}`,
            seller: {
              "@type": "Organization",
              name: "HAAAIB",
            },
          },
          // Optional: Add ratings if available
          // "aggregateRating": {
          //   "@type": "AggregateRating",
          //   "ratingValue": product.rating || 4.5,
          //   "reviewCount": product.reviewCount || 100,
          // },
        },
      })),
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        <main className="w-full min-h-screen 2xl:px-0 lg:px-4 px-2">
          <div className="max-w-[1400px] mx-auto mb-8">
            <CollectionsSection />
            <Breadcrumbs
              className="my-4 md:!my-8"
              overrides={{ products: "All Products" }}
            />
            <ProductsClient
              initialProducts={initialProducts}
              initialHasNextPage={initialHasNextPage}
              initialEndCursor={initialEndCursor}
            />
          </div>
        </main>
      </body>
    </html>
  );
}
