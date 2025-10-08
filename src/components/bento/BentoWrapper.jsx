import { fetchCollectionByHandle, fetchShopify } from "@/lib/shopify";
import BentoSection from "./Bento";

export default async function BentoWrapper() {
  const query = `
    query CollectionByHandle($handle: String!) {
      collectionByHandle(handle: $handle) {
        title
        products(first: 5) {
          edges {
            node {
              id
              title
              images(first: 1) {
                edges {
                  node {
                    src
                    altText
                  }
                }
              }
              metafields(identifiers: [
                {namespace: "custom", key: "bento_position"},
                {namespace: "custom", key: "banner_link"}
              ]) {
                id
                key
                value
              }
            }
          }
        }
      }
    }
  `;

  const variables = { handle: "bento-images" };

  const fetchData = async () => {
    try {
      const data = await fetchShopify(query, variables);
      if (!data?.collectionByHandle?.products?.edges) {
        console.error("No bento images data received:", data);
        return { products: { edges: [] } };
      }
      return data.collectionByHandle;
    } catch (error) {
      console.error("Error fetching Shopify bento images:", error);
      return { products: { edges: [] } };
    }
  };

  const collection = await fetchData();
  const images = collection?.products?.edges || [];
  const trendingCollection = await fetchCollectionByHandle("trending-now");
  return <BentoSection images={images} collectionData={trendingCollection} />;
}
