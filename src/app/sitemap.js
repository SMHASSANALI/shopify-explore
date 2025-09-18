export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.haaaib.com";

  // Add core static routes; dynamic entries can be added later (products, collections, blogs)
  const routes = ["/", "/collections", "/blogs", "/policies", "/account", "/cart"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: route === "/" ? 1 : 0.7,
  }));

  return routes;
}


