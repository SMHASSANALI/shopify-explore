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


// app/(auth)/account/page.jsx
// src/app/account/page.js
import { cookies } from "next/headers";
import { getCustomerAccount, refreshCustomerToken } from "@/lib/shopify";

export default async function AccountPage() {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("customer_access_token")?.value;

  if (!accessToken) {
    return (
      <div className="flex flex-col gap-2 items-center justify-center min-h-screen">
        <h1>Account</h1>
        <p>Please log in to view your account.</p>
        <a href="/login">Log in</a>
      </div>
    );
  }

  let customer = await getCustomerAccount({ accessToken });

  if (!customer) {
    // Try refreshing the token
    const refreshToken = cookieStore.get("customer_refresh_token")?.value;
    if (refreshToken) {
      try {
        const { access_token, expires_in } = await refreshCustomerToken(refreshToken);
        cookieStore.set("customer_access_token", access_token, {
          path: "/",
          httpOnly: true,
          sameSite: "lax",
          expires: new Date(Date.now() + expires_in * 1000),
        });
        customer = await getCustomerAccount({ accessToken: access_token });
      } catch (error) {
        console.error("Token refresh failed:", error.message);
      }
    }
  }

  if (!customer) {
    return (
      <div className="flex flex-col gap-2 items-center justify-center min-h-screen">
        <h1>Account</h1>
        <p>Unable to fetch account details. Please try again.</p>
        <a href="/login">Log in</a>
      </div>
    );
  }

  return (
    <div>
      <h1>Account</h1>
      <p>Welcome, {customer.firstName} {customer.lastName}</p>
      <p>Email: {customer.emailAddress?.emailAddress}</p>
    </div>
  );
}