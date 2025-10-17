// app/lib/shopify.js
import { generateRandomString, generateCodeChallenge } from "./auth-utils";

export async function shopifyFetch({ query, variables = {}, revalidate = 60 }) {
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
  try {
    const res = await fetch(
      `https://${shopifyDomain}/api/2025-07/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": storefrontToken,
        },
        body: JSON.stringify({ query, variables }),
        next: { revalidate },
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ Shopify API HTTP Error: ${res.status}`, errorText);
      throw new Error(`Shopify API request failed with status ${res.status}`);
    }

    const json = await res.json();
    if (json.errors) {
      console.error("❌ Shopify GraphQL Errors:", json.errors);
      throw new Error(json.errors.map((e) => e.message).join(", "));
    }

    return json.data;
  } catch (error) {
    console.error("❌ Fetch Shopify failed:", error.message);
    throw error;
  }
}

export const CART_LINES_FRAGMENT = `
  fragment CartLines on Cart {
    id
    checkoutUrl
    lines(first: 50) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              selectedOptions { name value }
              image { src altText }
              product {
                title
                images(first: 1) { edges { node { src altText } } }
                metafields(identifiers: [
                  {namespace: "custom", key: "discount_percentage"},
                  {namespace: "custom", key: "discount_badge"}
                ]) {
                  id
                  key
                  value
                  type
                }
              }
              priceV2 { amount currencyCode }
            }
          }
        }
      }
    }
  }
`;

// Storefront API fetch function
export async function fetchShopify(query, variables = {}, options = {}) {
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

  const url = `https://${shopifyDomain}/api/2025-07/graphql.json`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontToken,
      },
      body: JSON.stringify({ query, variables }),
      cache: options.cache || undefined,
      next: { revalidate: options.revalidate ?? 3600 },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ Shopify API HTTP Error: ${res.status}`, errorText);
      throw new Error(`Shopify API request failed with status ${res.status}`);
    }

    const json = await res.json();
    if (json.errors) {
      console.error("❌ Shopify GraphQL Errors:", json.errors);
      throw new Error(json.errors.map((e) => e.message).join(", "));
    }

    return json.data;
  } catch (error) {
    console.error("❌ Fetch Shopify failed:", error.message);
    throw error;
  }
}

// Customer Account API fetch function
export async function fetchCustomerAccountAPI(
  query,
  accessToken,
  variables = {}
) {
  const customerAccountAPIURL =
    process.env.NEXT_PUBLIC_CUSTOMER_ACCOUNT_API_URL;
  const apiVersion = "2025-07";
  const graphqlEndpoint = `${customerAccountAPIURL}/customer/api/${apiVersion}/graphql`;

  if (!graphqlEndpoint) {
    throw new Error("Missing GraphQL endpoint.");
  }

  try {
    const res = await fetch(graphqlEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ Customer Account API HTTP Error:", res.status, data);
      throw new Error(`API returned ${res.status}`);
    }

    if (data.errors) {
      console.error("❌ Customer Account API GraphQL Errors:", data.errors);
      throw new Error(data.errors.map((e) => e.message).join(", "));
    }

    return data.data;
  } catch (error) {
    console.error("❌ Fetch Customer Account API failed:", {
      message: error.message,
      cause: error.cause,
      stack: error.stack,
      endpoint: graphqlEndpoint,
    });
    throw error;
  }
}

// Customer Account API: Initiate OAuth flow
export async function initiateCustomerAuth() {
  const clientId = process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_ID;
  const shopId = process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!clientId || !shopId || !baseUrl) {
    console.error("❌ Missing OAuth env vars:", { clientId, shopId, baseUrl });
    throw new Error(
      "Missing required env vars for Customer Account API OAuth."
    );
  }

  const verifier = generateRandomString(43);
  const state = generateRandomString(16);
  const nonce = generateRandomString(16);
  const codeChallenge = await generateCodeChallenge(verifier);

  const params = new URLSearchParams({
    scope: "openid email customer-account-api:full",
    client_id: clientId,
    response_type: "code",
    redirect_uri: `${baseUrl}/callback`,
    state,
    nonce,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    locale: "en",
  });

  const authUrl = `https://account.haaaib.com/authentication/oauth/authorize?${params.toString()}`;

  return { authUrl, verifier, state, nonce };
}

// Customer Account API: Exchange code for tokens
export async function exchangeCodeForToken(code, verifier, state, storedState) {
  if (state !== storedState) {
    throw new Error("Invalid state parameter");
  }

  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_ID,
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/callback`,
    code,
    code_verifier: verifier,
  });

  try {
    const response = await fetch(
      `https://account.haaaib.com/authentication/oauth/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("❌ Token exchange failed:", error);
      if (response.status === 400)
        throw new Error(
          `Invalid grant: ${error.error_description || "Check code/verifier"}`
        );
      if (response.status === 401)
        throw new Error(
          `Invalid client: ${error.error_description || "Check client_id"}`
        );
      throw new Error(
        `Token exchange failed: ${error.error_description || "Unknown error"}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Exchange code error:", error.message);
    throw error;
  }
}

// Customer Account API: Refresh token
export async function refreshCustomerToken(refreshToken) {
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_ID,
    refresh_token: refreshToken,
  });

  try {
    const response = await fetch(
      `https://shopify.com/authentication/${process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID}/oauth/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("❌ Token refresh failed:", error);
      throw new Error(
        `Token refresh failed: ${error.error_description || "Unknown error"}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Refresh token error:", error.message);
    throw error;
  }
}

// Customer Account API: Logout
export async function customerLogout(idToken) {
  const params = new URLSearchParams({
    id_token_hint: idToken,
    post_logout_redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}`,
  });

  const logoutUrl = `https://shopify.com/authentication/${
    process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID
  }/logout?${params.toString()}`;
  return logoutUrl;
}

// Policy fetching (unchanged)
export async function getPolicies() {
  const query = `
    query ShopPolicyList {
      shop {
        privacyPolicy {
          id
          title
          url
          body
        }
        refundPolicy {
          id
          title
          url
          body
        }
        termsOfService {
          id
          title
          url
          body
        }
      }
    }
  `;

  try {
    const data = await fetchShopify(query, {}, { revalidate: 86400 });
    return (
      data?.shop || {
        privacyPolicy: null,
        refundPolicy: null,
        termsOfService: null,
      }
    );
  } catch (error) {
    console.error("Failed to fetch policies:", error.message);
    return { privacyPolicy: null, refundPolicy: null, termsOfService: null };
  }
}

// Customer creation (Storefront API, unchanged)
export async function customerCreate({ email, password, firstName, lastName }) {
  const query = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer { id email firstName lastName }
        customerUserErrors { field message }
      }
    }
  `;
  const variables = { input: { email, password, firstName, lastName } };
  try {
    const data = await fetchShopify(query, variables);
    return (
      data?.customerCreate || {
        customer: null,
        customerUserErrors: [{ message: "Unknown error" }],
      }
    );
  } catch (error) {
    console.error("❌ Customer create failed:", error.message);
    return { customer: null, customerUserErrors: [{ message: error.message }] };
  }
}

// Fetch customer data using Customer Account API
export async function getCustomerAccount({ accessToken }) {
  if (!accessToken) {
    console.error("❌ No access token provided for getCustomerAccount");
    return null;
  }

  const query = `
    query customerQuery {
      customer {
        id
        displayName
        firstName
        lastName
        emailAddress {
          emailAddress
        }
        phoneNumber {
          phoneNumber
        }
        defaultAddress {
          address1
          address2
          city
          country
          zip
          province
        }
        tags
      }
    }
  `;

  try {
    const data = await fetchCustomerAccountAPI(query, accessToken);
    return data?.customer || null;
  } catch (error) {
    console.error("❌ Get customer account failed:", {
      message: error.message,
      accessToken,
    });
    return null;
  }
}

// Function for Creating a Cart
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

export async function getCart(cartId) {
  if (!cartId) return null;
  const query = `
    ${CART_LINES_FRAGMENT}
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        ...CartLines
      }
    }
  `;
  const variables = { cartId };
  const data = await fetchShopify(query, variables, { revalidate: 0 });
  return data?.cart || null;
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
                {namespace: "reviews", key: "rating_count"},
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

  const variables = { handle };
  const data = await fetchShopify(query, variables, {
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

// Function to Fetch a Product by Handle
export async function fetchProductByHandle(handle, options = {}) {
  const query = `
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
  const variables = { handle };
  const data = await fetchShopify(query, variables, {
    next: {
      revalidate: options.revalidate || 300,
    },
  });

  if (!data?.productByHandle) {
    console.error(`Product with handle "${handle}" not found.`);
    return null;
  }

  const product = data.productByHandle;
  const externalId = product.id.split("/").pop();
  const totalInventory = product?.totalInventory || 0;
  const images = product?.images || [];
  const reviews = product?.metafields || [];
  const collections = product?.collections?.edges || [];
  const variants = (product?.variants?.edges || []).map(({ node: v }) => ({
    id: v.id,
    price: v.price,
    compareAtPrice: v.compareAtPrice,
    tags: product.tags,
    image: v.image,
    availableForSale: v.availableForSale,
    selectedOptions: v.selectedOptions,
    collections: product.collections,
    title: (v.selectedOptions || [])
      .map((o) => `${o.name}: ${o.value}`)
      .join(" / "),
  }));

  return {
    id: product.id,
    externalId,
    title: product.title,
    handle: product.handle,
    description: product.descriptionHtml,
    tags: product.tags,
    collections,
    images,
    variants,
    totalInventory,
    reviews,
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

// Function to Fetch Blogs along with Articles and their images
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
              articles(first: 1) {
                edges {
                  node {
                    id
                    title
                    excerpt
                    image {
                      url
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

  const variables = {};
  const data = await fetchShopify(query, variables, {
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
    image: node.blog?.articles?.edges?.[0]?.node?.image?.url,
  }));
}

// Function to Fetch every Product (for /products page) except for those whose price is 0
// Supports optional filters: availability, priceMin, priceMax, sortKey, after for paginationexport async function fetchAllProducts(options = {}) {
// Replace the fetchAllProducts function in your shopify.js

export async function fetchAllProducts(options = {}) {
  const {
    availability,
    priceMin,
    priceMax,
    sortKey,
    reverse = false,
    first = 30,
    after = null,
  } = options;

  let queryFilter = "";

  // Availability filter - fixed logic
  if (availability === "inStock") {
    queryFilter += "available_for_sale:true ";
  } else if (availability === "outOfStock") {
    queryFilter += "available_for_sale:false ";
  }
  // If availability is null or undefined, don't add any filter (show all)

  // Price filter - only add if values are provided
  if (typeof priceMin === "number" && priceMin > 0) {
    queryFilter += `variants.price:>=${priceMin} `;
  }
  if (typeof priceMax === "number" && priceMax < 1000) {
    queryFilter += `variants.price:<=${priceMax} `;
  }

  // Trim the query filter
  const finalQuery = queryFilter.trim();

  const query = `
    {
      products(
        first: ${first}
        ${after ? `, after: "${after}"` : ""}
        ${finalQuery ? `, query: "${finalQuery}"` : ""}
        ${sortKey ? `, sortKey: ${sortKey}` : ""}
        ${reverse ? `, reverse: true` : ""}
      ) {
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
              {namespace: "custom", key: "discount_percentage"},
              {namespace: "custom", key: "discount_badge"},
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
    revalidate: options.revalidate || 300,
  });

  if (!data?.products) {
    console.error("No products found in response");
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
      const minPriceVariant = variants.reduce(
        (min, v) => (min && min.price <= v.price ? min : v),
        variants[0] || null
      );
      const minPrice = minPriceVariant ? minPriceVariant.price : 0;

      // Exclude products where all variant prices are 0
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
