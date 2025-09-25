import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCustomerAccount } from "@/lib/shopify";
import AccountTabs from "@/components/global/AccountTabs";

export const metadata = { title: "Account | HAAAIB" };

export default async function AccountPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("customer_access_token")?.value;
  console.log("Route.js", token);
  if (!token) {
  redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/`);
  }

  const customer = await getCustomerAccount({ accessToken: token });
  if (!customer) {
    redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login`);
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Account</h1>
      <AccountTabs customer={customer} />
    </main>
  );
}