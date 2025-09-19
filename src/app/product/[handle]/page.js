import { fetchShopify } from "@/lib/shopify";
import Image from "next/image";
import AddToCartButton from "@/components/global/AddToCartButton";
import ProductsSlider from "@/components/global/ProductsSlider";
import ProductDetailClient from "@/components/products/ProductDetailClient";
import Breadcrumbs from "@/components/global/Breadcrumbs";

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
      images: image ? [{ url: image, alt: product?.images?.edges?.[0]?.node?.altText || title }] : undefined,
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

  const query = `
    query ProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        descriptionHtml
        images(first: 10) { edges { node { src altText } } }
        collections(first: 3) { edges { node { id title handle } } }
        totalInventory
        variants(first: 50) {
          edges {
            node {
              id
              availableForSale
              price { amount currencyCode }
              compareAtPrice { amount currencyCode }
              image { src altText }
              selectedOptions { name value }
            }
          }
        }
        tags
        metafields(identifiers: [
          { namespace: "reviews", key: "rating" },
          { namespace: "reviews", key: "rating_count" }
        ]) {
            id
            key
            value
            type
        }
      }
    }
  `;

  const variables = { handle };
  const data = await fetchShopify(query, variables);
  const product = data?.productByHandle;
  const totalInventory = product?.totalInventory || 0;
  const images = product?.images?.edges || [];
  const reviews = product?.metafields || [];
  const variants = (product?.variants?.edges || []).map(({ node: v }) => ({
    id: v.id,
    price: v.price,
    compareAtPrice: v.compareAtPrice,
    tags: product.tags,
    image: v.image,
    availableForSale: v.availableForSale,
    selectedOptions: v.selectedOptions,
    collections: product.collections,
    title: (v.selectedOptions || [])
      .map((o) => `${o.name}: ${o.value}`)
      .join(" / "),
  }));

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">Product not found</div>
    );
  }

  return (
    <main className="max-w-[1400px] mx-auto 2xl:p-0 lg:p-4 p-2">
      <Breadcrumbs className="mb-8" overrides={{ product: "Products" }} />
      <ProductDetailClient
        title={product.title}
        description={product.descriptionHtml}
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
              ).fetchCollectionByHandle(product.collections.edges[0].node.handle)
            ).products
          }
        />
      </div>
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
