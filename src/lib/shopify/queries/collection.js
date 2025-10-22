export const GET_COLLECTION_PAGE_DATA = `
  query CollectionPageData(
    $handle: String!
    $firstProducts: Int = 32
    $after: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean = false
    $firstCollections: Int = 10
    $filters: [ProductFilter!]
  ) {
    collection: collectionByHandle(handle: $handle) {
      title
      handle
      products(first: $firstProducts, after: $after, sortKey: $sortKey, reverse: $reverse, filters: $filters) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            title
            handle
            description
            tags
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
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
              {namespace: "custom", key: "discount_badge"},
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
    sliderCollections: collections(first: $firstCollections) {
      edges {
        node {
          id
          title
          handle
          image {
            url
            altText
          }
        }
      }
    }
  }
`;