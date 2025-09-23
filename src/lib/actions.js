// src/lib/actions.js
"use server";

import { cookies } from "next/headers";
import { refreshCustomerToken } from "./shopify";

export async function refreshTokenAction() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("customer_refresh_token")?.value;

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const { access_token, refresh_token, expires_in } = await refreshCustomerToken(refreshToken);

  cookieStore.set("customer_access_token", access_token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    expires: new Date(Date.now() + expires_in * 1000),
  });
  cookieStore.set("customer_refresh_token", refresh_token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
  });

  return { access_token };
}