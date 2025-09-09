import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { customerAccessTokenCreate } from "@/lib/shopify";

export const metadata = { title: "Login | HA-AA-IB" };

export default function LoginPage() {
  async function loginAction(formData) {
    "use server";
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();
    if (!email || !password) return;

    const result = await customerAccessTokenCreate({ email, password });
    const token = result?.customerAccessToken?.accessToken;
    const expiresAt = result?.customerAccessToken?.expiresAt;

    if (token) {
      const cookieStore = await cookies();
      cookieStore.set("customerAccessToken", token, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        expires: expiresAt ? new Date(expiresAt) : undefined,
      });
      redirect("/");
    }
    // Optionally surface an error via redirect search params
    console.log("Login failed:", result?.customerUserErrors);
    redirect("/login?error=1");
  }

  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <form action={loginAction} className="space-y-4">
        <div>
          <label id="email" className="block text-sm mb-1" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required className="w-full border rounded p-2" />
        </div>
        <div>
          <label id="password" className="block text-sm mb-1" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="password" required className="w-full border rounded p-2" />
        </div>
        <button type="submit" id="login" className="bg-[var(--primary-dark)] text-white px-4 py-2 rounded cursor-pointer">
          Sign in
        </button>
      </form>
      <p className="mt-4 text-sm">
        Don&apos;t have an account? <a href="/register" className="text-blue-600 underline">Register</a>
      </p>
    </main>
  );
}


