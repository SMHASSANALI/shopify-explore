// components/HeroWrapper.tsx
import { fetchShopify } from '@/lib/shopify';
import Hero from './Hero';

export default async function HeroWrapper({ handle }) {
  const query = `
    query CollectionByHandle($handle: String!) {
      collectionByHandle(handle: $handle) {
        id
        title
        products(first: 10) {
          edges {
            node {
              id
              title
              handle
              images(first: 1) {
                edges {
                  node {
                    id
                    url
                    altText
                  }
                }
              }
              metafields(identifiers: [{namespace: "custom", key: "banner_link"}]) {
                id
                value
              }
            }
          }
        }
      }
    }
  `;

  const fetchData = async () => {
    try {
      const data = await fetchShopify(query);
      if (!data?.collection?.products?.edges) {
        console.error('No hero banners data received:', data);
        return { products: { edges: [] } };
      }
      return data.collection;
    } catch (error) {
      console.error('Error fetching Shopify hero banners:', error);
      return { products: { edges: [] } };
    }
  };

  const collection = await fetchData();
  const banners = collection?.products?.edges || [];

  return <Hero banners={banners} />;
}