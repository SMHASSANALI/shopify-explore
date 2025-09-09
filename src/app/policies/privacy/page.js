import { getPolicies } from "@/lib/shopify";

export const revalidate = 300;

export const metadata = {
  title: "Privacy Policy | HA-AA-IB",
};

export default async function PrivacyPolicyPage() {
  const shop = await getPolicies();
  const policy = shop?.privacyPolicy;

  if (!policy) {
    return (
      <main className="max-w-[900px] mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold mb-4">Privacy Policy</h1>
        <p>Privacy policy is not available at the moment.</p>
      </main>
    );
  }

  return (
    <main className="max-w-[900px] mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">{policy.title}</h1>
      <article className="prose max-w-none">
        <div dangerouslySetInnerHTML={{ __html: policy.body }} />
      </article>
    </main>
  );
}


