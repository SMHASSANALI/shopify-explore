// Wishlist utilities for localStorage management

export const WISHLIST_KEY = 'haaaib_wishlist';

// Get wishlist from localStorage
export const getWishlist = () => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save wishlist to localStorage
export const saveWishlist = (items) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save wishlist:', error);
  }
};

// Add item to wishlist
export const addToWishlist = (product) => {
  const wishlist = getWishlist();
  const exists = wishlist.find(item => item.id === product.id);
  
  if (!exists) {
    const newWishlist = [...wishlist, product];
    saveWishlist(newWishlist);
    return newWishlist;
  }
  
  return wishlist;
};

// Remove item from wishlist
export const removeFromWishlist = (productId) => {
  const wishlist = getWishlist();
  const newWishlist = wishlist.filter(item => item.id !== productId);
  saveWishlist(newWishlist);
  return newWishlist;
};

// Check if item is in wishlist
export const isInWishlist = (productId) => {
  const wishlist = getWishlist();
  return wishlist.some(item => item.id === productId);
};

// Get wishlist count
export const getWishlistCount = () => {
  return getWishlist().length;
};

// Clear wishlist
export const clearWishlist = () => {
  saveWishlist([]);
};
