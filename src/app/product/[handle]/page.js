import { fetchProductByHandle, fetchShopify } from "@/lib/shopify";
import ProductsSlider from "@/components/global/ProductsSlider";
import ProductDetailClient from "@/components/products/ProductDetailClient";
import Breadcrumbs from "@/components/global/Breadcrumbs";
import ReviewsSection from "@/components/products/ReviewSection";
import { getJudgemeReviews } from "@/utils/getJudgemeReviews";

export async function generateMetadata({ params }) {
  const { handle } = await params;
  if (!handle) return { title: "Product Not Found | HAAAIB" };

  const query = `query ProductSEO($handle: String!) {
    productByHandle(handle: $handle) {
      title
      description
      images(first: 1) { edges { node { src altText } } }
      variants(first: 1) { edges { node { priceV2 { amount currencyCode } } } }
    }
  }`
    .replace(/\s+/g, " ")
    .trim(); // Normalize whitespace

  let product;
  try {
    const data = await fetchShopify(query, { handle });
    product = data?.productByHandle;
  } catch (error) {
    console.error(
      `Failed to fetch product metadata for handle "${handle}":`,
      error.message
    );
    return { title: "Product Not Found | HAAAIB" };
  }

  const title = product?.title || handle;
  const description = product?.description || `Buy ${title} at HAAAIB.`;
  const image =
    product?.images?.edges?.[0]?.node?.src || "/assets/placeholder.jpg";
  const price = product?.variants?.edges?.[0]?.node?.priceV2?.amount || "0.00";
  const currency =
    product?.variants?.edges?.[0]?.node?.priceV2?.currencyCode || "GBP";

  return {
    title: `${title} | HAAAIB`,
    description,
    keywords: [
      "jewelry",
      "home decor",
      "lifestyle",
      title.toLowerCase(),
      "haaaib",
      "uk",
    ],
    alternates: { canonical: `/product/${handle}` },
    openGraph: {
      type: "website", // Changed from "product"
      url: `/product/${handle}`,
      title: `${title} | HAAAIB`,
      description,
      images: [
        {
          url: image,
          alt: product?.images?.edges?.[0]?.node?.altText || title,
          width: 1200,
          height: 630,
        },
      ],
      price: {
        amount: parseFloat(price).toFixed(2),
        currency: currency,
      },
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | HAAAIB`,
      description,
      images: [image],
    },
  };
}

export default async function ProductPage({ params }) {
  const { handle } = await params;
  if (!handle) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">Product not found</div>
    );
  }

  const product = await fetchProductByHandle(handle);
  const images = product?.images?.edges?.map((edge) => edge.node) || [];
  const variants = product?.variants || [];
  const totalInventory = product?.totalInventory || 0;
  const reviews = [];

  const { judgeMeReviews = [], internalProductId } = await getJudgemeReviews({
    externalId: product?.externalId || "",
  });

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">Product not found</div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://haaaib.com"}/product/${
      product.handle
    }`,
    description: product.description || `Discover ${product.title} at HAAAIB.`,
    image:
      product.featuredImage?.url ||
      product.images?.edges?.[0]?.node?.src ||
      "/assets/placeholder.jpg",
    sku: product.variants?.edges?.[0]?.node?.sku || product.handle,
    mpn: product.variants?.edges?.[0]?.node?.sku || product.handle,
    brand: {
      "@type": "Brand",
      name: "HAAAIB",
    },
    offers: {
      "@type": "Offer",
      url: `${
        process.env.NEXT_PUBLIC_SITE_URL || "https://haaaib.com"
      }/product/${product.handle}`,
      priceCurrency:
        product.variants?.edges?.[0]?.node?.priceV2?.currencyCode || "GBP",
      price: parseFloat(
        product.variants?.edges?.[0]?.node?.priceV2?.amount || 0
      ).toFixed(2),
      availability:
        totalInventory > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "HAAAIB" },
    },
    aggregateRating: judgeMeReviews.length
      ? {
          "@type": "AggregateRating",
          ratingValue: (
            judgeMeReviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
            judgeMeReviews.length
          ).toFixed(1),
          reviewCount: judgeMeReviews.length.toString(),
        }
      : undefined,
    review: judgeMeReviews.slice(0, 3).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.reviewer || "Anonymous" },
      datePublished: r.date || new Date().toISOString(),
      reviewBody: r.review || "",
      reviewRating: {
        "@type": "Rating",
        ratingValue: (r.rating || 0).toString(),
        bestRating: "5",
        worstRating: "1",
      },
    })),
    isPartOf: product.collections?.edges?.[0]?.node?.handle
      ? {
          "@type": "Collection",
          name: product.collections.edges[0].node.title,
          url: `${
            process.env.NEXT_PUBLIC_SITE_URL || "https://haaaib.com"
          }/collections/${product.collections.edges[0].node.handle}`,
        }
      : undefined,
  };
  return (
    <main className="max-w-[1400px] mx-auto 2xl:p-0 lg:p-4 p-2">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Breadcrumbs
        className="my-4 md:!my-8"
        overrides={{ product: "Products" }}
      />
      <ProductDetailClient
        title={product.title}
        description={product.description}
        images={images}
        tags={product.tags}
        collections={product.collections}
        variants={variants}
        totalInventory={totalInventory}
        reviews={reviews}
      />
      <div className="mt-12">
        {/* Related products */}
        <ProductsSlider
          title="You Might Also Like"
          data={
            (
              await (
                await import("@/lib/shopify")
              ).fetchCollectionByHandle(
                product.collections?.[0]?.node?.handle || ""
              )
            ).products
          }
        />
      </div>

      {/* Reviews Section */}
      {internalProductId && (
        <ReviewsSection
          initialReviews={judgeMeReviews}
          internalProductId={internalProductId}
          shopDomain={process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN} // Pass for client fetches
          apiToken={process.env.JUDGEME_PRIVATE_TOKEN} // Pass securely (or use a proxy API route if preferred)
        />
      )}

      <div className="mt-12">
        {/* Trending products */}
        <ProductsSlider
          title="Not Right For You? Try These"
          data={
            (
              await (
                await import("@/lib/shopify")
              ).fetchAllProducts({ first: 20 })
            ).products
          }
        />
      </div>
    </main>
  );
}
