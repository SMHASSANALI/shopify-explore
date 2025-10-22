import { shopifyFetch } from "@/lib/shopify";
import { GET_ALL_COLLECTIONS } from "../queries/allCollections";

export async function fetchAllCollections({ first = 100, revalidate = 300 } = {}) {
  try {
    const data = await shopifyFetch({
      query: GET_ALL_COLLECTIONS,
      variables: { first },
      revalidate,
    });

    if (!data?.collections) {
      console.error("No collections found in response");
      return [];
    }

    return data.collections.edges.map(({ node }) => ({
      id: node.id,
      title: node.title,
      handle: node.handle,
      image: node.image || { src: "/assets/placeholder.jpg", altText: node.title },
    }));
  } catch (error) {
    console.error("Error fetching collections:", error);
    return [];
  }
}