import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCustomerAccount } from "@/lib/shopify";

export const metadata = { title: "Account | HA-AA-IB" };

export default async function AccountPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("customer_access_token")?.value;
  console.log("Route.js", token);
  if (!token) {
  redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login`);
  }

  const customer = await getCustomerAccount({ accessToken: token });
  if (!customer) {
    redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login`);
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Your Account</h1>
      <div className="space-y-2">
        <p>
          <span className="font-semibold">Name:</span> {customer?.firstName}{" "}
          {customer?.lastName}
        </p>
        <p>
          <span className="font-semibold">Email:</span>{" "}
          {customer?.emailAddress?.emailAddress}
        </p>
        {customer?.defaultAddress && (
          <div>
            <p className="font-semibold">Default address</p>
            <p>
              {customer?.defaultAddress.address1}{" "}
              {customer?.defaultAddress.address2}
            </p>
            <p>
              {customer?.defaultAddress.city},{" "}
              {customer?.defaultAddress.province}
            </p>
            <p>
              {customer?.defaultAddress.country} {customer?.defaultAddress.zip}
            </p>
          </div>
        )}
      </div>
      <a
        href="/logout"
        className="inline-block mt-6 text-red-600 hover:underline"
      >
        Logout
      </a>
    </main>
  );
}
