import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { customerCreate, customerAccessTokenCreate } from "@/lib/shopify";

export const metadata = { title: "Register | HA-AA-IB" };

export default function RegisterPage() {
  async function registerAction(formData) {
    "use server";
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();
    const firstName = String(formData.get("firstName") || "").trim();
    const lastName = String(formData.get("lastName") || "").trim();
    if (!email || !password) return;

    const createRes = await customerCreate({ email, password, firstName, lastName });
    const errors = createRes?.userErrors || [];
    if (errors.length > 0) {
      redirect("/register?error=1");
    }

    const tokenRes = await customerAccessTokenCreate({ email, password });
    const token = tokenRes?.customerAccessToken?.accessToken;
    const expiresAt = tokenRes?.customerAccessToken?.expiresAt;
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
    redirect("/login");
  }

  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Create account</h1>
      <form action={registerAction} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1" htmlFor="firstName">First name</label>
            <input id="firstName" name="firstName" type="text" className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="lastName">Last name</label>
            <input id="lastName" name="lastName" type="text" className="w-full border rounded p-2" />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required className="w-full border rounded p-2" />
        </div>
        <button type="submit" className="bg-[var(--primary-dark)] text-white px-4 py-2 rounded">
          Create account
        </button>
      </form>
      <p className="mt-4 text-sm">
        Already have an account? <a href="/login" className="text-blue-600 underline">Login</a>
      </p>
    </main>
  );
}


