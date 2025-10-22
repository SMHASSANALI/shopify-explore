import { shopifyFetch } from "@/lib/shopify";
import { GET_COLLECTION_PAGE_DATA } from "../queries/collection";

export async function fetchCollectionPageData({
  handle,
  firstProducts = 32,
  after = null,
  revalidate = 300,
  sort,
  firstCollections = 10,
  filters = {},
} = {}) {
  try {
    let sortKey = null;
    let reverse = false;
    switch (sort) {
      case "best-selling":
        sortKey = "BEST_SELLING";
        break;
      case "title-ascending":
        sortKey = "TITLE";
        reverse = false;
        break;
      case "title-descending":
        sortKey = "TITLE";
        reverse = true;
        break;
      case "price-ascending":
        sortKey = "PRICE";
        reverse = false;
        break;
      case "price-descending":
        sortKey = "PRICE";
        reverse = true;
        break;
      case "created-ascending":
        sortKey = "CREATED_AT";
        reverse = false;
        break;
      case "created-descending":
        sortKey = "CREATED_AT";
        reverse = true;
        break;
      default:
        sortKey = "RELEVANCE";
        reverse = false;
    }

    // Build filters array for the query
    let queryFilters = [];

    // Availability filter
    if (filters.availability === "inStock") {
      queryFilters.push({ available: true });
    } else if (filters.availability === "outOfStock") {
      queryFilters.push({ available: false });
    }

    // Price filters - Shopify expects price as Float
    // Use toFixed to ensure precise decimal values
    if (filters.priceMin !== undefined && filters.priceMin > 0) {
      queryFilters.push({
        price: { min: parseFloat(filters.priceMin.toFixed(2)) },
      });
    }

    if (filters.priceMax !== undefined && filters.priceMax < 1000) {
      queryFilters.push({
        price: { max: parseFloat(filters.priceMax.toFixed(2)) },
      });
    }

    const data = await shopifyFetch({
      query: GET_COLLECTION_PAGE_DATA,
      variables: {
        handle,
        firstProducts,
        after,
        sortKey,
        reverse,
        firstCollections,
        filters: queryFilters.length > 0 ? queryFilters : undefined,
      },
      revalidate,
    });

    const collection = data.collection || {
      products: {
        edges: [],
        pageInfo: { hasNextPage: false, endCursor: null },
      },
    };

    const products = collection.products.edges.map(({ node }) => {
      // Use priceRange for more accurate minimum price
      const minPrice = node.priceRange?.minVariantPrice?.amount
        ? parseFloat(node.priceRange.minVariantPrice.amount)
        : node.variants?.edges.reduce((min, edge) => {
            const price = parseFloat(edge.node.price.amount);
            return min === null || price < min ? price : min;
          }, null) || 0;

      return {
        node: {
          id: node.id,
          title: node.title,
          handle: node.handle,
          description: node.description,
          tags: node.tags,
          priceRange: node.priceRange,
          image: node.images?.edges?.[0]?.node || {
            src: "/assets/placeholder.jpg",
            altText: node.title,
          },
          images: { edges: node.images?.edges || [] },
          variants: { edges: node.variants?.edges || [] },
          chosenVariant:
            node.variants?.edges.find((edge) => edge.node.availableForSale)
              ?.node ||
            node.variants?.edges[0]?.node ||
            null,
          metafields: node.metafields || [],
          availableForSale: node.variants?.edges.some(
            (edge) => edge.node.availableForSale
          ),
          price: minPrice,
          compareAtPrice:
            node.variants?.edges.reduce(
              (min, edge) =>
                min &&
                min.node.compareAtPrice?.amount <=
                  edge.node.compareAtPrice?.amount
                  ? min
                  : edge,
              node.variants?.edges[0]
            )?.node.compareAtPrice?.amount || null,
          discountPercentage:
            node.variants?.edges.reduce(
              (min, edge) =>
                min &&
                min.node.compareAtPrice?.amount <=
                  edge.node.compareAtPrice?.amount
                  ? min
                  : edge,
              node.variants?.edges[0]
            )?.node.compareAtPrice?.amount &&
            node.variants?.edges.reduce(
              (min, edge) =>
                min && min.node.price.amount <= edge.node.price.amount
                  ? min
                  : edge,
              node.variants?.edges[0]
            )?.node.price.amount <
              node.variants?.edges.reduce(
                (min, edge) =>
                  min &&
                  min.node.compareAtPrice?.amount <=
                    edge.node.compareAtPrice?.amount
                    ? min
                    : edge,
                node.variants?.edges[0]
              )?.node.compareAtPrice?.amount
              ? Math.round(
                  ((node.variants?.edges.reduce(
                    (min, edge) =>
                      min &&
                      min.node.compareAtPrice?.amount <=
                        edge.node.compareAtPrice?.amount
                        ? min
                        : edge,
                    node.variants?.edges[0]
                  )?.node.compareAtPrice?.amount -
                    node.variants?.edges.reduce(
                      (min, edge) =>
                        min && min.node.price.amount <= edge.node.price.amount
                          ? min
                          : edge,
                      node.variants?.edges[0]
                    )?.node.price.amount) /
                    node.variants?.edges.reduce(
                      (min, edge) =>
                        min &&
                        min.node.compareAtPrice?.amount <=
                          edge.node.compareAtPrice?.amount
                          ? min
                          : edge,
                      node.variants?.edges[0]
                    )?.node.compareAtPrice?.amount) *
                    100
                )
              : null,
        },
      };
    }); 

    const sliderCollections = (data.sliderCollections?.edges || [])
      .map(({ node }) => ({
        id: node.id,
        title: node.title,
        handle: node.handle,
        image: node.image || {
          url: "/assets/placeholder-collection.jpg",
          altText: node.title,
        },
      }))
      .filter(
        (collection) =>
          collection.title !== "Hero Banners" &&
          collection.title !== "Bento Images" &&
          collection.title !== "Ad Banners"
      );

    return {
      products,
      hasNextPage: collection.products.pageInfo.hasNextPage,
      endCursor: collection.products.pageInfo.endCursor,
      sliderCollections,
    };
  } catch (error) {
    console.error(
      `Error fetching collection page data for handle "${handle}":`,
      error
    );
    return {
      products: [],
      hasNextPage: false,
      endCursor: null,
      sliderCollections: [],
    };
  }
}
