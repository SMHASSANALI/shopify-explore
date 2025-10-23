import ProductsSlider from "@/components/global/ProductsSlider";
import ProductDetailClient from "@/components/products/ProductDetailClient";
import Breadcrumbs from "@/components/global/Breadcrumbs";
import ReviewsSection from "@/components/products/ReviewSection";
import { fetchProductPageData } from "@/lib/shopify/fetch/productDetails";

export async function generateMetadata({ params }) {
  const { handle } = await params;
  if (!handle) return { title: "Product Not Found | HAAAIB" };

  const { product } = await fetchProductPageData({
    handle,
    metadataOnly: true,
  });

  if (!product) return { title: "Product Not Found | HAAAIB" };

  const title = product.title || handle;
  const description = product.description || `Buy ${title} at HAAAIB.`;
  const image =
    product.images?.edges?.[0]?.node?.src || "/assets/placeholder.jpg";
  const price = product.variants?.edges?.[0]?.node?.priceV2?.amount || "0.00";
  const currency =
    product.variants?.edges?.[0]?.node?.priceV2?.currencyCode || "GBP";

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
    alternates: { canonical: `/products/${handle}` },
    openGraph: {
      type: "website",
      url: `/products/${handle}`,
      title: `${title} | HAAAIB`,
      description,
      images: [
        {
          url: image,
          alt: product.images?.edges?.[0]?.node?.altText || title,
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

  const {
    product,
    judgeMeReviews,
    internalProductId,
    relatedProducts,
    trendingProducts,
  } = await fetchProductPageData({ handle });

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">Product not found</div>
    );
  }
  const images = product.images?.map((node) => node) || [];
  const variants = product.variants || [];
  const totalInventory = product.totalInventory || 0;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    url: `${
      process.env.NEXT_PUBLIC_SITE_URL || "https://haaaib.com"
    }/products/${product.handle}`,
    description: product.description || `Discover ${product.title} at HAAAIB.`,
    image:
      product.featuredImage?.url || images[0]?.src || "/assets/placeholder.jpg",
    sku: variants?.edges?.[0]?.node?.sku || product.handle,
    mpn: variants?.edges?.[0]?.node?.sku || product.handle,
    brand: {
      "@type": "Brand",
      name: "HAAAIB",
    },
    offers: {
      "@type": "Offer",
      url: `${
        process.env.NEXT_PUBLIC_SITE_URL || "https://haaaib.com"
      }/products/${product.handle}`,
      priceCurrency: variants?.edges?.[0]?.node?.priceV2?.currencyCode || "GBP",
      price: parseFloat(
        variants?.edges?.[0]?.node?.priceV2?.amount || 0
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
        overrides={{ [handle]: product.title }}
      />

      <ProductDetailClient
        title={product.title}
        description={product.description}
        images={images}
        tags={product.tags}
        collections={product.collections}
        variants={variants}
        totalInventory={totalInventory}
        reviews={[]}
      />

      {/* Related Products */}
      <div className="mt-12">
        <ProductsSlider
          title="You Might like"
          data={relatedProducts.collectionByHandle}
        />
      </div>

      {/* Reviews Section */}
      <div className="my-12">
        {internalProductId && (
          <ReviewsSection
            initialReviews={judgeMeReviews}
            internalProductId={internalProductId}
            shopDomain={process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}
            apiToken={process.env.JUDGEME_PRIVATE_TOKEN}
          />
        )}
      </div>

      {/* Trending Products */}
      <div className="mb-12">
        <ProductsSlider
          title="Not right for you ? Try these !!"
          data={trendingProducts.collectionByHandle}
        />
      </div>
    </main>
  );
}
