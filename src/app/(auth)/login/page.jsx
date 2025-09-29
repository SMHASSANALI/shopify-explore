// app/(auth)/login/page.jsx
import { initiateCustomerAuth } from "@/lib/shopify";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = { title: "Login | HA-AA-IB" };

export default function LoginPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  async function loginAction() {
    "use server";
    if (!baseUrl) {
      console.error("Missing NEXT_PUBLIC_BASE_URL");
      throw new Error("Base URL is not defined");
    }
    const { authUrl, verifier, state } = await initiateCustomerAuth(baseUrl);

    const cookieStore = await cookies();
    cookieStore.set("oauth_verifier", verifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 1 day in seconds
    });
    cookieStore.set("oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 1 day in seconds
    });

    redirect(authUrl);
  }

  return (
    <main className="max-w-md mx-auto">
      <div className="flex flex-col items-center justify-center h-[50dvh]">
        <h1 className="text-3xl font-bold mb-6">Login</h1>
        <form action={loginAction} className="space-y-4">
          <button
            type="submit"
            id="login"
            className="bg-[var(--primary-dark)] text-white px-4 py-2 rounded cursor-pointer"
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
