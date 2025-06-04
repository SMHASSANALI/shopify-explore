console.log('Full process.env:', process.env);

export async function fetchShopify(query, variables = {}) {
  const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
  const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN;

  if (!shopifyDomain || !storefrontToken) {
    console.error('❌ Missing Shopify environment variables:');
    console.error('NEXT_PUBLIC_SHOPIFY_DOMAIN:', shopifyDomain);
    console.error('NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN:', storefrontToken);
    throw new Error('Shopify environment variables are missing. Please check your .env file.');
  }

  const url = `https://${shopifyDomain}/api/2023-10/graphql.json`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store', // Disable caching for this fetch
  });

  const json = await res.json();
  // console.log('📦 Shopify Raw Response:', JSON.stringify(json, null, 2));

  if (json.errors) {
    console.error('❌ Shopify GraphQL Errors:', json.errors);
    return null;
  }

  return json.data;
}

// Rest of the file remains unchanged
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
  console.log('createCart Response:', data);
  return data?.cartCreate?.cart || null;
}

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