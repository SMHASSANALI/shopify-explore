// In /app/logout/route.js

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { customerLogout } from "@/lib/shopify";

export async function GET(request) {
  const cookieStore = await cookies();
  const idToken = cookieStore.get("customer_id_token")?.value;
  const origin = new URL(request.url).origin;

  // The default response is to redirect to the homepage.
  // We will attach cookie deletions to this response.
  const response = NextResponse.redirect(origin, { status: 302 });

  // Delete all authentication cookies
  response.cookies.delete("customer_access_token");
  response.cookies.delete("customer_refresh_token");
  response.cookies.delete("customer_id_token");
  
  if (idToken) {
    try {
      // If logged in, create the Shopify single-logout URL
      const shopifyLogoutUrl = await customerLogout(idToken);
      // Overwrite the redirect location to point to Shopify's logout
      response.headers.set("Location", shopifyLogoutUrl);
    } catch (err) {
      console.error("Logout failed:", err?.message || err);
      // If Shopify logout fails, we still proceed with deleting our local cookies
      // and redirecting to the homepage.
    }
  }

  return response;
}