export const GET_HOME_DATA = `
  {
    hero: collectionByHandle(handle: "hero-banners") {
      title
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
            images(first: 1) {
              edges { node { url altText } }
            }
          }
        }
      }
    }

    ads: collectionByHandle(handle: "ad-banners") {
      title
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
            images(first: 1) {
              edges { node { url altText } }
            }
          }
        }
      }
    }

    collections(first: 10) {
      edges {
        node {
          id
          title
          handle
          image { url altText }
        }
      }
    }

    blogs: articles(first: 3) {
      edges {
        node {
          id
          title
          handle
          excerpt
          image { url altText }
          publishedAt
        }
      }
    }

    bento: collectionByHandle(handle: "bento-images") {
      products(first: 5) {
        edges {
          node {
            id
            title
            images(first: 1) {
              edges { node { url altText } }
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

    trending: collectionByHandle(handle: "trending-now") {
        title
        handle
        products(first: 10) {
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

    main: collectionByHandle(handle: "christmas") {
        title
        handle
        products(first: 10) {
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

    secondary: collectionByHandle(handle: "spooky-autumn") {
        title
        handle
        products(first: 10) {
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
    }
`;
