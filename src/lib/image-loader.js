const storefrontToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN;

if (!storefrontToken) {
  throw new Error("NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN is not defined");
}

export default function imageLoader({ src, width, quality }) {
  const q = quality ?? 75;
  const w = width ?? 800;

  // For SVGs, return the original source (no optimization needed)
  if (src.endsWith(".svg")) {
    return src;
  }

  // LOCAL ASSETS
  if (src.startsWith("/")) {
    return src;
  }

  try {
    const url = new URL(decodeURIComponent(src));

    // SHOPIFY CDN
    if (url.hostname === "cdn.shopify.com") {
      return `${url.origin}${url.pathname}?w=${w}&q=${q}`;
    }

    // OTHER EXTERNAL
    return `${url.origin}${url.pathname}?w=${w}&q=${q}`;
  } catch {
    // Fallback if URL parsing fails
    return `${src}?w=${w}&q=${q}`;
  }
}
