import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const cookieStore = await cookies();
  cookieStore.delete("customerAccessToken");
  const url = new URL("/", request.url);
  return NextResponse.redirect(url);
}


