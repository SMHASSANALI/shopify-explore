export const GET_ALL_COLLECTIONS = `
  query GetAllCollections($first: Int = 100) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          image {
            src
            altText
          }
        }
      }
    }
  }
`;