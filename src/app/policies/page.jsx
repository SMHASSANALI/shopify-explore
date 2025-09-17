// app/policies/page.jsx
import Link from "next/link";
import { getPolicies } from "@/lib/shopify";

export const revalidate = 300; // Revalidate every 5 minutes

export default async function PoliciesIndexPage() {
  let shop;
  try {
    shop = await getPolicies();
  } catch (error) {
    console.error("Failed to fetch policies:", error.message);
    shop = { privacyPolicy: null, refundPolicy: null, termsOfService: null };
  }
  const { privacyPolicy, refundPolicy, termsOfService } = shop || {};

  return (
    <main className="max-w-[900px] mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Store Policies</h1>
      <p className="mb-8 text-gray-600">
        Read about how we handle your data, returns, and terms of service.
      </p>
      <ul className="list-disc pl-6 space-y-3">
        <li>
          <Link
            className="text-blue-600 hover:underline"
            href="/policies/privacy"
          >
            {privacyPolicy?.title || "Privacy Policy"}
          </Link>
        </li>
        <li>
          <Link
            className="text-blue-600 hover:underline"
            href="/policies/refund"
          >
            {refundPolicy?.title || "Refund Policy"}
          </Link>
        </li>
        <li>
          <Link
            className="text-blue-600 hover:underline"
            href="/policies/terms"
          >
            {termsOfService?.title || "Terms of Service"}
          </Link>
        </li>
      </ul>
      {!privacyPolicy && !refundPolicy && !termsOfService && (
        <p className="mt-4 text-red-600">
          Unable to load policies at this time. Please try again later.
        </p>
      )}
    </main>
  );
}