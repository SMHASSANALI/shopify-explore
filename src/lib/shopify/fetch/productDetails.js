import { shopifyFetch } from "@/lib/shopify";
import {
  GET_PRODUCT_DETAILS,
  GET_PRODUCT_SEO,
  GET_COLLECTION_PRODUCTS,
} from "../queries/productDetails";
import { getJudgemeReviews } from "@/utils/getJudgemeReviews";

export async function fetchProductPageData({ handle, metadataOnly = false }) {
  try {
    // For metadata generation, use lighter query
    if (metadataOnly) {
      const data = await shopifyFetch({
        query: GET_PRODUCT_SEO,
        variables: { handle },
        revalidate: 300,
      });

      return {
        product: data?.productByHandle || null,
      };
    }

    // Fetch full product details
    const data = await shopifyFetch({
      query: GET_PRODUCT_DETAILS,
      variables: { handle },
      revalidate: 300,
    });

    if (!data?.productByHandle) {
      console.error(`Product with handle "${handle}" not found.`);
      return null;
    }

    const product = data.productByHandle;
    const externalId = product.id.split("/").pop();
    const totalInventory = product?.totalInventory || 0;
    const images = product?.images?.edges?.map(({ node }) => node) || [];
    const reviews = product?.metafields || [];
    const collections = product?.collections?.edges || [];
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

    // Get Judge.me reviews
    const { judgeMeReviews = [], internalProductId } = await getJudgemeReviews({
      externalId,
    });

    // Fetch related products from first collection
    let relatedProducts = [];
    const firstCollectionHandle = product.collections?.edges?.[0]?.node?.handle;
    if (firstCollectionHandle) {
      const relatedData = await shopifyFetch({
        query: GET_COLLECTION_PRODUCTS,
        variables: { handle: firstCollectionHandle, first: 10 },
        revalidate: 300,
      });
      relatedProducts = relatedData || [];
    }

    // Fetch trending products
    let trendingProducts = [];
    const trendingCollectionHandle = "all-products";
    if (firstCollectionHandle) {
      const trendingData = await shopifyFetch({
        query: GET_COLLECTION_PRODUCTS,
        variables: { handle: trendingCollectionHandle, first: 10 },
        revalidate: 300,
      });
      trendingProducts = trendingData || [];
    }

    return {
      product: {
        id: product.id,
        externalId,
        title: product.title,
        handle: product.handle,
        description: product.descriptionHtml,
        tags: product.tags,
        collections,
        images,
        variants,
        totalInventory,
        reviews,
      },
      judgeMeReviews,
      internalProductId,
      relatedProducts,
      trendingProducts,
    };
  } catch (error) {
    console.error(
      `Error fetching product page data for handle "${handle}":`,
      error
    );
    return {
      product: null,
      judgeMeReviews: [],
      internalProductId: null,
      relatedProducts: [],
      trendingProducts: [],
    };
  }
}