import { fetchProductByHandle, fetchShopify } from "@/lib/shopify";
import Image from "next/image";
import AddToCartButton from "@/components/global/AddToCartButton";
import ProductsSlider from "@/components/global/ProductsSlider";
import ProductDetailClient from "@/components/products/ProductDetailClient";
import Breadcrumbs from "@/components/global/Breadcrumbs";
import StarRating from "@/components/global/StarRating";
import ReviewsSection from "@/components/products/ReviewSection";
import { getJudgemeReviews } from "@/utils/getJudgemeReviews";

export async function generateMetadata({ params }) {
  const { handle } = await params;
  if (!handle) return { title: "Product Not Found | HAAAIB" };

  const query = `
    query ProductSEO($handle: String!) {
      productByHandle(handle: $handle) {
        title
        description
        images(first: 1) { edges { node { src altText } } }
      }
    }
  `;
  const data = await fetchShopify(query, { handle });
  const product = data?.productByHandle;
  const title = product?.title || handle;
  const description = product?.description || `Buy ${title} at HAAAIB.`;
  const image = product?.images?.edges?.[0]?.node?.src || null;
  const canonical = `/product/${handle}`;
  return {
    title: `${title} | HAAAIB`,
    description,
    alternates: { canonical },
    openGraph: {
      // type: "product",
      url: canonical,
      title: `${title} | HAAAIB`,
      description,
      images: image
        ? [
            {
              url: image,
              alt: product?.images?.edges?.[0]?.node?.altText || title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | HAAAIB`,
      description,
      images: image ? [image] : undefined,
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

  return (
    <main className="max-w-[1400px] mx-auto 2xl:p-0 lg:p-4 p-2">
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
