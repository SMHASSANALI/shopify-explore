export async function getJudgemeReviews(params) {
  if (!params.externalId) {
    console.error("Missing externalId for Judge.me reviews");
    return { judgeMeReviews: [], internalProductId: null };
  }

  // Fetch Judge.me internal product ID
  const productApiUrl = `https://judge.me/api/v1/products/-1?shop_domain=${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}&api_token=${process.env.JUDGEME_PRIVATE_TOKEN}&external_id=${params.externalId}`;
  const productRes = await fetch(productApiUrl, { cache: "no-store" });
  if (!productRes.ok) {
    const text = await productRes.text();
    console.error("Error fetching Judge.me product ID:", {
      status: productRes.status,
      response: text,
    });
    return { judgeMeReviews: [], internalProductId: null };
  }

  const productData = await productRes.json();
  const internalProductId = productData?.product?.id;

  // Fetch reviews if internal ID exists
  let judgeMeReviews = [];
  if (internalProductId) {
    const reviewsApiUrl = `https://judge.me/api/v1/reviews?shop_domain=${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}&api_token=${process.env.JUDGEME_PRIVATE_TOKEN}&product_id=${internalProductId}&per_page=10&page=1`;
    const reviewsRes = await fetch(reviewsApiUrl, { cache: "no-store" });
    if (!reviewsRes.ok) {
      const text = await reviewsRes.text();
      console.error("Error fetching Judge.me reviews:", {
        status: reviewsRes.status,
        response: text,
      });
    } else {
      const reviewsData = await reviewsRes.json();
      judgeMeReviews = reviewsData?.reviews || [];
    }
  } else {
    console.error("No internalProductId found for externalId:", params.externalId);
  }

  return { judgeMeReviews, internalProductId };
}