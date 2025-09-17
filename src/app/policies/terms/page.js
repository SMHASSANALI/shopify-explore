// app/policies/terms/page.jsx
import { getPolicies } from "@/lib/shopify";

export const revalidate = 86400; // Revalidate once a day

export default async function TermsOfServicePage() {
  const shop = await getPolicies();
  const { termsOfService } = shop || { termsOfService: null };

  if (!termsOfService) {
    return (
      <main className="max-w-[900px] mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="text-red-600">Terms of Service content is unavailable.</p>
      </main>
    );
  }

  return (
    <main className="max-w-[900px] mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">{termsOfService.title}</h1>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: termsOfService.body }}
      />
      <p className="mt-4 text-gray-600">{termsOfService.bodySummary}</p>
      <a
        href={termsOfService.url}
        className="text-blue-600 hover:underline mt-2 inline-block"
        target="_blank"
        rel="noopener noreferrer"
      >
        View official policy
      </a>
    </main>
  );
}