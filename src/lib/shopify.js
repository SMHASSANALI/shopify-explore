console.log("Full process.env:", process.env);

export async function fetchShopify(query, variables = {}) {
  const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
  const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN;

  if (!shopifyDomain || !storefrontToken) {
    console.error("❌ Missing Shopify environment variables:");
    console.error("NEXT_PUBLIC_SHOPIFY_DOMAIN:", shopifyDomain);
    console.error("NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN:", storefrontToken);
    throw new Error(
      "Shopify environment variables are missing. Please check your .env file."
    );
  }

  const url = `https://${shopifyDomain}/api/2023-10/graphql.json`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store", // Disable caching for this fetch
  });

  const json = await res.json();

  if (json.errors) {
    console.error("❌ Shopify GraphQL Errors:", json.errors);
    return null;
  }

  return json.data;
}

//  Function for Creating a Cart
export async function createCart() {
  const query = `
    mutation cartCreate {
      cartCreate {
        cart {
          id
          checkoutUrl
        }
      }
    }
  `;
  const data = await fetchShopify(query);
  console.log("createCart Response:", data);
  return data?.cartCreate?.cart || null;
}

// Function for Adding Items to the Cart
export async function addToCart(cartId, lines) {
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    product {
                      title
                      images(first: 1) {
                        edges {
                          node {
                            src
                            altText
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const variables = { cartId, lines };
  const data = await fetchShopify(query, variables);
  return data?.cartLinesAdd?.cart || null;
}

// Function to Fetch a Collection's Products by Handle
export async function fetchCollectionByHandle(handle, options = {}) {
  const query = `
    query CollectionByHandle($handle: String!) {
      collectionByHandle(handle: $handle) {
        title
        products(first: ${options.first || 10}) {
          edges {
            node {
              id
              title
              handle
              description
              tags
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
                    id
                    price {
                      amount
                      currencyCode
                    }
                    compareAtPrice {
                      amount
                      currencyCode
                    }
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

  const variables = { handle };
  const data = await fetchShopify(query, variables, {
    cache: options.cache || "no-store",
    revalidate: options.revalidate || 300,
  });

  if (!data?.collectionByHandle) {
    console.error(`Collection with handle "${handle}" not found.`);
    return { title: "", products: [] };
  }

  const collection = data.collectionByHandle;
  const products = collection.products?.edges || [];
  const productData = products.map(({ node }) => {
    const price = parseFloat(node.variants.edges[0]?.node.price.amount) || 0;
    const compareAtPrice =
      parseFloat(node.variants.edges[0]?.node.compareAtPrice?.amount) || null;
    const discountPercentage =
      compareAtPrice && price < compareAtPrice
        ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
        : null;

    return {
      node: {
        id: node.id,
        title: node.title,
        handle: node.handle,
        price,
        currencyCode: node.variants.edges[0]?.node.price.currencyCode || "USD",
        description: node.description,
        tags: node.tags,
        image: node.images.edges[0]?.node || {
          src: "/images/placeholder.jpg",
          altText: node.title,
        },
        compareAtPrice,
        discountPercentage,
        variants: node.variants || [],
        metafields: node.metafields || [],
      },
    };
  });

  return {
    title: collection.title,
    products: productData,
  };
}

// Function to Fetch All Collections
export async function fetchAllCollections(options = {}) {
  const query = `query {
        collections(first: ${options.first || 100}) {
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

  const variables = {};
  const data = await fetchShopify(query, variables, {
    cache: options.cache || "no-store",
    revalidate: options.revalidate || 300,
  });

  if (!data?.collections) {
    console.error(`No collections found.`);
    return [];
  }

  return data.collections.edges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    handle: node.handle,
    image: node.image,
  }));
}

// Function to Fetch Blogs along with Articles
export async function fetchBlogs(options = {}) {
  const query = `
    {
      articles(first: ${options.first || 10}) {
        edges {
          node {
            id
            title
            handle
            content
            excerpt
            publishedAt
            author {
              name
              bio
            }
            blog {
              title
              handle
            }
          }
        }
      }
    }
  `;

  const variables = {};
  const data = await fetchShopify(query, variables, {
    cache: options.cache || "no-store",
    revalidate: options.revalidate || 300,
  });

  if (!data?.articles) {
    console.error(`No articles found.`);
    return [];
  }

  return data.articles.edges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    handle: node.handle,
    content: node.content,
    excerpt: node.excerpt,
    publishedAt: node.publishedAt,
    author: node.author,
    blog: node.blog,
  }));
}
