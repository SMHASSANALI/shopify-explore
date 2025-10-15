const { NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN } = process.env;

if (!NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN) {
  throw new Error("NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN is not defined");
}

export default function imageLoader({ src, width, quality }) {
  // LOCAL ASSETS - Return as-is (no changes)
  if (src.startsWith("/")) {
    return `${src}?w=${width}&q=${quality || 75}`;
  }

  // SHOPIFY CDN - Add token authentication
  const url = new URL(decodeURIComponent(src));

  // Only add token for Shopify CDN
  if (url.hostname === "cdn.shopify.com") {
    const params = new URLSearchParams(url.search);
    params.set("token", NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_TOKEN);
    return `${url.origin}${url.pathname}?${params.toString()}&w=${width}&q=${
      quality || 75
    }`;
  }

  // OTHER EXTERNAL (alicdn, judge.me) - Just optimize
  const params = new URLSearchParams(url.search);
  return `${url.origin}${url.pathname}?${params.toString()}&w=${width}&q=${
    quality || 75
  }`;
}
