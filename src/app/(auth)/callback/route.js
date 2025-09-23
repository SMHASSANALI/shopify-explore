// src/app/auth/callback/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeCodeForToken } from "@/lib/shopify";

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const origin = process.env.NEXT_PUBLIC_BASE_URL || url.origin;

  console.log("Callback Env:", {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    shopId: process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID,
    clientId: process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_ID,
  });

  if (!code || !state) {
    console.error("Missing params:", { code, state });
    return NextResponse.redirect(`${origin}/login?error=missing-params`);
  }

  const cookieStore = await cookies();
  const storedState = cookieStore.get("oauth_state").value;
  console.log("StoredState :", storedState);
  const verifier = cookieStore.get("oauth_verifier").value;
  console.log("verifier :", verifier);


  if (!storedState) {
    console.error("No oauth_state cookie found");
    
    return NextResponse.redirect(`${origin}/login?error=no-state-cookie`);
  }

  if (state !== storedState) {
    console.error("State mismatch:", { state, storedState });
    return NextResponse.redirect(`${origin}/login?error=state-mismatch`);
  }

  if (!verifier) {
    console.error("Missing cookies:", { verifier });
    return NextResponse.redirect(`${origin}/login?error=missing-cookies`);
  }

  try {
    const tokenResponse = await exchangeCodeForToken(code, verifier, state, storedState);
    const { access_token, refresh_token, id_token, expires_in } = tokenResponse;

    const response = NextResponse.redirect(`${origin}/account`);
    response.cookies.set("customer_access_token", access_token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      expires: new Date(Date.now() + (expires_in * 1000 || 3600 * 1000)), // Fallback to 1 hour
    });
    response.cookies.set("customer_refresh_token", refresh_token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });
    response.cookies.set("customer_id_token", id_token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });
    response.cookies.delete("oauth_verifier");
    response.cookies.delete("oauth_state");

    return response;
  } catch (error) {
    console.error("Callback error:", error?.message || error);
    return NextResponse.redirect(`${origin}/login?error=callback-failed`);
  }
}