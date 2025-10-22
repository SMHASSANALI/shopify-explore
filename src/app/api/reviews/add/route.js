import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { productId, reviewer, rating, body, title, email } = await req.json();

    // Validate inputs (unchanged)
    if (!productId || !rating || !body || !email) {
      return NextResponse.json(
        { error: "Missing required fields: productId, rating, body, and email are required" },
        { status: 400 }
      );
    }
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }
    if (typeof body !== "string" || body.length > 1000) {
      return NextResponse.json({ error: "Review body is too long or invalid" }, { status: 400 });
    }
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || !process.env.JUDGEME_PRIVATE_TOKEN) {
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    const payload = {
      product_id: String(productId), // Ensure string
      rating,
      body,
      reviewer_email: email,
      reviewer_name: reviewer || "Anonymous",
      title: title || "",
    };

    const apiUrl = new URL("https://judge.me/api/v1/reviews/");
    apiUrl.searchParams.append("shop_domain", process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN);
    apiUrl.searchParams.append("api_token", process.env.JUDGEME_PRIVATE_TOKEN);

    const res = await fetch(apiUrl.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data?.error) {
      console.error("Judge.me API Error:", data.error);
      return NextResponse.json(
        { error: data.error || "Failed to submit review" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, review: data }, { status: 200 });
  } catch (err) {
    console.error("Error adding review:", err);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}