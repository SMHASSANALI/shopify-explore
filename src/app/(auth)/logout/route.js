import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { customerLogout } from "@/lib/shopify";

export async function GET(request) {
  const cookieStore = await cookies();
  const idToken = cookieStore.get("customer_id_token")?.value;

  const url = new URL(request.url);
  const origin = `${url.protocol}//${url.host}`;
//   const origin = process.env.NEXT_PUBLIC_BASE_URL;
  const response = NextResponse.redirect(new URL("/", origin));

  response.cookies.delete("customer_access_token");
  response.cookies.delete("customer_refresh_token");
  response.cookies.delete("customer_id_token");
  response.cookies.delete("oauth_verifier");
  response.cookies.delete("oauth_state");
  response.cookies.delete("oauth_nonce");

  try {
    if (idToken) {
      const shopifyLogout = await customerLogout(idToken, origin);
      console.log(shopifyLogout)
    //   return NextResponse.redirect(new URL(shopifyLogout));
    }
  } catch (err) {
    console.error("Logout redirect failed:", err?.message || err);
  }

  return response;
}


