// app/(auth)/register/page.jsx
import { redirect } from "next/navigation";
import { customerCreate } from "@/lib/shopify";

export const metadata = { title: "Register | HA-AA-IB" };

export default async function RegisterPage({ searchParams }) {
  // Await the searchParams in case it's a Promise (for consistency with async usage)
  const params = await searchParams;
  const error = params?.error;
  const success = params?.success;

  async function registerAction(formData) {
    "use server";
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();
    const firstName = String(formData.get("firstName") || "").trim();
    const lastName = String(formData.get("lastName") || "").trim();

    if (!email || !password || !firstName || !lastName) {
      redirect("/register?error=missing-fields");
    }

    try {
      const createRes = await customerCreate({ email, password, firstName, lastName });
      const errors = createRes?.customerUserErrors || [];

      if (errors.length > 0) {
        const messages = errors.map((e) => e.message || "");
        const verificationMsg = messages.find((m) =>
          m.toLowerCase().includes("verify your email address") ||
          m.toLowerCase().includes("verification")
        );

        if (verificationMsg) {
          // Treat Shopify's verification-required response as success
          redirect(`/register?success=1`);
        }

        console.error("Registration errors:", errors);
        const errorMessage = messages.join(", ");
        redirect(`/register?error=${encodeURIComponent(errorMessage)}`);
      }

      // Created successfully
      redirect(`/register?success=1`);
    } catch (error) {
      // Don't swallow framework redirects
      if (error?.digest === 'NEXT_REDIRECT' || error?.message === 'NEXT_REDIRECT') throw error;
      console.error("Registration process failed:", error?.message || error);
      redirect(`/register?error=${encodeURIComponent(error?.message || 'Registration failed')}`);
    }
  }

  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Create account</h1>
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
          Error: {decodeURIComponent(error)}
        </div>
      )}
      {success && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          Account created successfully. Please check your email to verify your account before signing in.
        </div>
      )}
      <form action={registerAction} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1" htmlFor="firstName">
              First name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="lastName">
              Last name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              className="w-full border rounded p-2"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full border rounded p-2"
            minLength={8} // Shopify requires at least 8 characters
          />
        </div>
        <button
          type="submit"
          className="bg-[var(--primary-dark)] text-white px-4 py-2 rounded cursor-pointer"
        >
          Create account
        </button>
      </form>
      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 underline">
          Login
        </a>
      </p>
    </main>
  );
}