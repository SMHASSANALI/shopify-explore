import { fetchShopify, CART_LINES_FRAGMENT } from '@/lib/shopify';

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
    ${CART_LINES_FRAGMENT}
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ...CartLines }
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
    ${CART_LINES_FRAGMENT}
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ...CartLines }
      }
    }
  `;

  const variables = { cartId, lineIds };
  const data = await fetchShopify(query, variables);
  return data?.cartLinesRemove?.cart || null;
}