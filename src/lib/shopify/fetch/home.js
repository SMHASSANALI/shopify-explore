import { shopifyFetch } from "@/lib/shopify";
import { GET_HOME_DATA } from "../queries/home";

export async function fetchHomePageData() {
  try {
    const data = await shopifyFetch({
      query: GET_HOME_DATA,
      variables: {},
      revalidate: 120,
    });
    return {
      hero: data.hero,
      ads: data.ads,
      collections: data.collections?.edges?.map((e) => e.node) || [],
      blogs: data.blogs?.edges?.map((e) => e.node) || [],
      bento: data.bento,
      trending: data.trending,
      main: data.main,
      secondary: data.secondary,
    };
  } catch (error) {
    console.error("Error fetching home page data:", error);
    return { hero: {}, collections: [], blogs: [], bento: {}, trending: {}, main: {}, secondary: {} };
  }
}
