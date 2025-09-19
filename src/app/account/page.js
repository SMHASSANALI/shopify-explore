// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
// import { getCustomerAccount } from "@/lib/shopify";
// import AccountTabs from "@/components/global/AccountTabs";

// export const metadata = { title: "Account | HAAAIB" };

// export default async function AccountPage() {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("customer_access_token")?.value;
//   console.log("Route.js", token);
//   if (!token) {
//   redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login`);
//   }

//   const customer = await getCustomerAccount({ accessToken: token });
//   if (!customer) {
//     redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login`);
//   }

//   return (
//     <main className="max-w-6xl mx-auto px-4 py-12">
//       <h1 className="text-3xl font-bold mb-8">Your Account</h1>
//       <AccountTabs customer={customer} />
//     </main>
//   );
// }


import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCustomerAccount, refreshCustomerToken } from "@/lib/shopify";
import AccountTabs from "@/components/global/AccountTabs";

export const metadata = { title: "Account | HAAAIB" };

export default async function AccountPage() {
  const cookieStore = await cookies();
  let token = cookieStore.get("customer_access_token")?.value;
  console.log("AccountPage Cookies:", {
    accessToken: token,
    refreshToken: cookieStore.get("customer_refresh_token")?.value,
    idToken: cookieStore.get("customer_id_token")?.value,
  });

  if (!token) {
    redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login`);
  }

  let customer = await getCustomerAccount({ accessToken: token });
  if (!customer) {
    const refreshToken = cookieStore.get("customer_refresh_token")?.value;
    if (refreshToken) {
      try {
        const newTokens = await refreshCustomerToken(refreshToken);
        token = newTokens.access_token;
        cookieStore.set("customer_access_token", token, {
          path: "/",
          httpOnly: true,
          sameSite: "lax",
          expires: new Date(Date.now() + newTokens.expires_in * 1000),
        });
        customer = await getCustomerAccount({ accessToken: token });
      } catch (error) {
        console.error("Token refresh failed:", error.message);
        redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login`);
      }
    } else {
      redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login`);
    }
  }

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