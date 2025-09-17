// app/policies/refund/page.jsx
import { getPolicies } from "@/lib/shopify";

export const revalidate = 86400; // Revalidate once a day

export default async function RefundPolicyPage() {
  const shop = await getPolicies();
  const { refundPolicy } = shop || { refundPolicy: null };

  if (!refundPolicy) {
    return (
      <main className="max-w-[900px] mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>
        <p className="text-red-600">Refund Policy content is unavailable.</p>
      </main>
    );
  }

  return (
    <main className="max-w-[900px] mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">{refundPolicy.title}</h1>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: refundPolicy.body }}
      />
      <p className="mt-4 text-gray-600">{refundPolicy.bodySummary}</p>
      <a
        href={refundPolicy.url}
        className="text-blue-600 hover:underline mt-2 inline-block"
        target="_blank"
        rel="noopener noreferrer"
      >
        View official policy
      </a>
    </main>
  );
}