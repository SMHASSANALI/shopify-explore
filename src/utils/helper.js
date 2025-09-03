// // utils/helper.js

// // Helper function to calculate total price
// export const calculateTotal = (lines) => {
//   return lines.reduce((total, { node }) => {
//     const price = parseFloat(node.merchandise.priceV2.amount) * node.quantity;
//     return total + price;
//   }, 0).toFixed(2);
// };

// // Mutation for updating quantity
// export const updateQuantityMutation = `
//   mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
//     cartLinesUpdate(cartId: $cartId, lines: $lines) {
//       cart {
//         id
//         checkoutUrl
//         lines(first: 10) {
//           edges {
//             node {
//               id
//               quantity
//               merchandise {
//                 ... on ProductVariant {
//                   id
//                   product {
//                     title
//                     images(first: 1) {
//                       edges {
//                         node {
//                           src
//                           altText
//                         }
//                       }
//                     }
//                   }
//                   priceV2 {
//                     amount
//                     currencyCode
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// `;

// // Mutation for removing items
// export const removeItemMutation = `
//   mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
//     cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
//       cart {
//         id
//         checkoutUrl
//         lines(first: 10) {
//           edges {
//             node {
//               id
//               quantity
//               merchandise {
//                 ... on ProductVariant {
//                   id
//                   product {
//                     title
//                     images(first: 1) {
//                       edges {
//                         node {
//                           src
//                           altText
//                         }
//                       }
//                     }
//                   }
//                   priceV2 {
//                     amount
//                     currencyCode
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// `;










import { fetchShopify } from '@/lib/shopify';

// Helper function to calculate total price
export const calculateTotal = (lines) => {
  return lines.reduce((total, { node }) => {
    const price = parseFloat(node.merchandise.priceV2.amount) * node.quantity;
    return total + price;
  }, 0).toFixed(2);
};

// Update cart line quantity
export async function updateCartQuantity(cartId, lines) {
  const query = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
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
                    priceV2 {
                      amount
                      currencyCode
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
  return data?.cartLinesUpdate?.cart || null;
}

// Remove items from cart
export async function removeCartItems(cartId, lineIds) {
  const query = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
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
                    priceV2 {
                      amount
                      currencyCode
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

  const variables = { cartId, lineIds };
  const data = await fetchShopify(query, variables);
  return data?.cartLinesRemove?.cart || null;
}