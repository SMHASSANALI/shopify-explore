// app/policies/privacy/page.jsx
import { getPolicies } from "@/lib/shopify";

export const revalidate = 86400; // Revalidate once a day, as policies are static

export default async function PrivacyPolicyPage() {
  const shop = await getPolicies();
  const { privacyPolicy } = shop || { privacyPolicy: null };

  if (!privacyPolicy) {
    return (
      <main className="max-w-[900px] mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-red-600">Privacy Policy content is unavailable.</p>
      </main>
    );
  }

  return (
    <main className="max-w-[900px] mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">{privacyPolicy.title}</h1>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: privacyPolicy.body }}
      />
      <p className="mt-4 text-gray-600">{privacyPolicy.bodySummary}</p>
      <a
        href={privacyPolicy.url}
        className="text-blue-600 hover:underline mt-2 inline-block"
        target="_blank"
        rel="noopener noreferrer"
      >
        View official policy
      </a>
    </main>
  );
}