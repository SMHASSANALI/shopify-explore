import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeCodeForToken } from "@/lib/shopify";

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
//   const origin = url.origin;
  const origin = process.env.NEXT_PUBLIC_BASE_URL;

  if (!code || !state) {
    return NextResponse.redirect(`${origin}/login?error=missing-params`);
  }

  const cookieStore = await cookies();
  const storedState = cookieStore.get("oauth_state")?.value;
  const verifier = cookieStore.get("oauth_verifier")?.value;
  const nonce = cookieStore.get("oauth_nonce")?.value;

  if (state !== storedState) {
    return NextResponse.redirect(`${origin}/login?error=state-mismatch`);
  }

  if (!verifier || !nonce) {
    return NextResponse.redirect(`${origin}/login?error=missing-cookies`);
  }

  try {
    const { access_token, refresh_token, id_token, expires_in } =
      await exchangeCodeForToken(code, verifier, state, storedState);

    const response = NextResponse.redirect(`${origin}/account`);
    response.cookies.set("customer_access_token", access_token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      expires: new Date(Date.now() + expires_in * 1000),
    });
    response.cookies.set("customer_refresh_token", refresh_token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });
    response.cookies.set("customer_id_token", id_token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });

    response.cookies.delete("oauth_verifier");
    response.cookies.delete("oauth_state");
    response.cookies.delete("oauth_nonce");

    return response;
  } catch (error) {
    console.error("Callback error:", error?.message || error);
    return NextResponse.redirect(`${origin}/login?error=callback-failed`);
  }
}
