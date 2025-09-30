export async function getJudgemeReviews(params) {
  // Fetch Judge.me internal product ID
  const productApiUrl = `https://judge.me/api/v1/products/-1?shop_domain=${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}&api_token=${process.env.JUDGEME_PRIVATE_TOKEN}&external_id=${params.externalId}`;
  const productRes = await fetch(productApiUrl, { cache: "no-store" });
  if (!productRes.ok) {
    console.error("Error fetching Judge.me product ID:", productRes.status);
    // Fallback: pass empty reviews
  }

  const productData = await productRes.json();
  const internalProductId = productData?.product?.id;

  // Fetch reviews if internal ID exists
  let judgeMeReviews = [];
  if (internalProductId) {
    const reviewsApiUrl = `https://judge.me/api/v1/reviews?shop_domain=${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}&api_token=${process.env.JUDGEME_PRIVATE_TOKEN}&product_id=${internalProductId}&per_page=10&page=1`; // Adjust per_page as needed; paginate if >100 reviews
    const reviewsRes = await fetch(reviewsApiUrl, { cache: "no-store" });
    if (!reviewsRes.ok) {
      console.error("Error fetching Judge.me reviews:", reviewsRes.status);
    } else {
      const reviewsData = await reviewsRes.json();
      judgeMeReviews = reviewsData?.reviews || [];
    }
  }

  return { judgeMeReviews, internalProductId };
}
