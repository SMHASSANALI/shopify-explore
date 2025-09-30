// utils/discount-utils.js

/**
 * Get discount information from product metafields
 */
export function getProductDiscount(metafields) {
  if (!Array.isArray(metafields)) return null;
  
  const discountField = metafields.find(m => m?.key === "discount_percentage");
  const badgeField = metafields.find(m => m?.key === "discount_badge");
  
  const percentage = discountField?.value ? Number(discountField.value) : 0;
  const badge = badgeField?.value || null;
  
  return percentage > 0 ? { percentage, badge } : null;
}

/**
 * Calculate discounted price
 */
export function calculateDiscountedPrice(originalPrice, discountPercentage) {
  if (!discountPercentage || discountPercentage <= 0) return originalPrice;
  
  const discount = (originalPrice * discountPercentage) / 100;
  return (originalPrice - discount).toFixed(2);
}

/**
 * Get price display object with discount information
 */
export function getPriceDisplay(originalPrice, metafields) {
  const discount = getProductDiscount(metafields);
  
  if (!discount) {
    return {
      price: originalPrice,
      originalPrice: null,
      discountPercentage: null,
      badge: null,
      hasDiscount: false
    };
  }
  
  return {
    price: calculateDiscountedPrice(originalPrice, discount.percentage),
    originalPrice: originalPrice,
    discountPercentage: discount.percentage,
    badge: discount.badge,
    hasDiscount: true
  };
}

/**
 * Apply discount to cart line item
 */
export function getCartLineDiscount(merchandise, metafields) {
  const originalPrice = parseFloat(merchandise?.priceV2?.amount || 0);
  return getPriceDisplay(originalPrice, metafields);
}