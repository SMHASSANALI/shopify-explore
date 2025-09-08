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
                {namespace: "custom", key: "banner_link"},
                {namespace: "reviews", key: "rating"},
                {namespace: "reviews", key: "rating_count"}
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
    const variants = (node.variants?.edges || []).map(({ node: v }) => {
      const priceAmount = parseFloat(v.price?.amount) || 0;
      const compareAmount = v.compareAtPrice?.amount
        ? parseFloat(v.compareAtPrice.amount)
        : null;
      return {
        id: v.id,
        availableForSale: !!v.availableForSale,
        price: priceAmount,
        currencyCode: v.price?.currencyCode || "USD",
        compareAtPrice: compareAmount,
        image: v.image || null,
        selectedOptions: v.selectedOptions || [],
        title: (v.selectedOptions || [])
          .map((o) => `${o.name}: ${o.value}`)
          .join(" / "),
      };
    });

    const images = (node.images?.edges || []).map(({ node: img }) => img);
    const minPriceVariant = variants.reduce(
      (min, v) => (min && min.price <= v.price ? min : v),
      variants[0] || null
    );
    const price = minPriceVariant ? minPriceVariant.price : 0;
    const compareAtPrice = minPriceVariant?.compareAtPrice || null;
    const discountPercentage =
      compareAtPrice && price < compareAtPrice
        ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
        : null;
    const anyAvailable = variants.some((v) => v.availableForSale);

    return {
      node: {
        id: node.id,
        title: node.title,
        handle: node.handle,
        price,
        minPrice: price,
        currencyCode: minPriceVariant?.currencyCode || "USD",
        description: node.description,
        tags: node.tags,
        image: node.images?.edges?.[0]?.node || {
          src: "/assets/placeholder.jpg",
          altText: node.title,
        },
        images,
        compareAtPrice,
        discountPercentage,
        variants,
        metafields: node.metafields || [],
        availableForSale: anyAvailable,
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

// Function to Fetch every Product (for /products page) except for those whose price is 0
// Supports optional filters: availability, priceMin, priceMax, sortKey, after for pagination
export async function fetchAllProducts(options = {}) {
  const { availability, priceMin, priceMax, sortKey, first = 30, after = null } = options;
  let queryFilter = '';

  // Availability filter
  if (availability) {
    if (availability === 'inStock') queryFilter += 'available_for_sale:true ';
    if (availability === 'outOfStock') queryFilter += 'available_for_sale:false ';
  }

  // Price filter
  if (priceMin || priceMax) {
    if (priceMin) queryFilter += `variants.price>${priceMin} `;
    if (priceMax) queryFilter += `variants.price<${priceMax} `;
  }

  const query = `
    {
      products(first: ${first}, after: ${after ? `"${after}"` : null}, query: "${queryFilter.trim()}", sortKey: ${sortKey || 'BEST_SELLING'}) {
        edges {
          node {
            id
            title
            handle
            description
            tags
            images(first: 10) {
              edges {
                node { src altText }
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
              {namespace: "custom", key: "banner_link"},
              {namespace: "reviews", key: "rating"},
              {namespace: "reviews", key: "rating_count"}
            ]) { id value key type }
          }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  `;

  const variables = {};
  const data = await fetchShopify(query, variables, {
    cache: options.cache || "no-store",
    revalidate: options.revalidate || 300,
  });

  if (!data?.products) {
    console.error(`No products found.`);
    return { products: [], hasNextPage: false, endCursor: null };
  }

  // Filter out products with price 0 and map to desired structure
  const products = data.products.edges
    .map(({ node }) => {
      const variants = (node.variants?.edges || []).map(({ node: v }) => {
        const priceAmount = parseFloat(v.price?.amount) || 0;
        const compareAmount = v.compareAtPrice?.amount
          ? parseFloat(v.compareAtPrice.amount)
          : null;
        return {
          id: v.id,
          availableForSale: !!v.availableForSale,
          price: priceAmount,
          currencyCode: v.price?.currencyCode || "USD",
          compareAtPrice: compareAmount,
          image: v.image || null,
          selectedOptions: v.selectedOptions || [],
          title: (v.selectedOptions || [])
            .map((o) => `${o.name}: ${o.value}`)
            .join(" / "),
        };
      });

      const images = (node.images?.edges || []).map(({ node: img }) => img);
      // Exclude products where all variant prices are 0
      const minPriceVariant = variants.reduce(
        (min, v) => (min && min.price <= v.price ? min : v),
        variants[0] || null
      );
      const minPrice = minPriceVariant ? minPriceVariant.price : 0;
      if (!minPrice || minPrice === 0) return null;

      const compareAtPrice = minPriceVariant?.compareAtPrice || null;
      const discountPercentage =
        compareAtPrice && minPrice < compareAtPrice
          ? Math.round(((compareAtPrice - minPrice) / compareAtPrice) * 100)
          : null;
      const anyAvailable = variants.some((v) => v.availableForSale);

      return {
        node: {
          id: node.id,
          title: node.title,
          handle: node.handle,
          price: minPrice,
          minPrice: minPrice,
          currencyCode: minPriceVariant?.currencyCode || "USD",
          description: node.description,
          tags: node.tags,
          image: node.images?.edges?.[0]?.node || {
            src: "/assets/placeholder.jpg",
            altText: node.title,
          },
          images,
          compareAtPrice,
          discountPercentage,
          variants,
          metafields: node.metafields || [],
          availableForSale: anyAvailable,
        },
      };
    })
    .filter((product) => product !== null);

  return {
    products,
    hasNextPage: data.products.pageInfo.hasNextPage,
    endCursor: data.products.pageInfo.endCursor,
  };
}

