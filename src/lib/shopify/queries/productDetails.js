// lib/shopify/queries/productDetails.js

export const GET_PRODUCT_SEO = `
  query ProductSEO($handle: String!) {
    productByHandle(handle: $handle) {
      title
      description
      images(first: 1) { 
        edges { 
          node { 
            src 
            altText 
          } 
        } 
      }
      variants(first: 1) { 
        edges { 
          node { 
            priceV2 { 
              amount 
              currencyCode 
            } 
          } 
        } 
      }
    }
  }
`;

// Full product details query
export const GET_PRODUCT_DETAILS = `
   query ProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        descriptionHtml
        images(first: 10) { edges { node { src altText } } }
        totalInventory
        collections(first: 3) {
          edges {
            node {
              id
              title
              handle
            }
          }
        }
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
          {namespace: "custom", key: "discount_percentage"},
          {namespace: "custom", key: "discount_badge"},
        ]) {
            id
            key
            value
            type
        }
      }
    }
  `;

// Query for related products from collection
export const GET_COLLECTION_PRODUCTS = `
  query CollectionProducts($handle: String!, $first: Int = 10) {
    collectionByHandle(handle: $handle) {
      title
      handle
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            tags
            images(first: 10) {
              edges {
                node {
                  src
                  altText
                }
              }
            }
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
            metafields(identifiers: [
              {namespace: "custom", key: "discount_percentage"},
              {namespace: "custom", key: "discount_badge"}
            ]) {
              id
              value
              key
              type
            }
          }
        }
      }
    }
  }
`;
