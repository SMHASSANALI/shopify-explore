// app/api/reviews/[internalProductId]/[page]/route.js
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const { internalProductId, page } = resolvedParams;

  const apiUrl = `https://judge.me/api/v1/reviews?shop_domain=${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}&api_token=${process.env.JUDGEME_PRIVATE_TOKEN}&product_id=${internalProductId}&per_page=10&page=${page}`;
  const res = await fetch(apiUrl);
  const data = await res.json();
  return NextResponse.json(data);
}
