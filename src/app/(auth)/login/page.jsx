// // app/(auth)/login/page.jsx
// import { initiateCustomerAuth } from "@/lib/shopify";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

// export const metadata = { title: "Login | HA-AA-IB" };

// export default function LoginPage() {
//   async function loginAction() {
//     "use server";
//     const { headers } = await import("next/headers");
//     const h = await headers();
//     const forwardedProto = h.get("x-forwarded-proto") || "http";
//     const host = h.get("x-forwarded-host") || h.get("host");
//     // const baseUrl = `${forwardedProto}://${host}`;
//     const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
//     const { authUrl, verifier, state, nonce } = await initiateCustomerAuth(baseUrl);

//     // Store verifier, state, nonce in cookies (sessionStorage is client-only)
//     const cookieStore = await cookies();
//     cookieStore.set("oauth_verifier", verifier, {
//       httpOnly: true,
//       path: "/",
//       sameSite: "lax",
//     });
//     cookieStore.set("oauth_state", state, {
//       httpOnly: true,
//       path: "/",
//       sameSite: "lax",
//     });
//     cookieStore.set("oauth_nonce", nonce, {
//       httpOnly: true,
//       path: "/",
//       sameSite: "lax",
//     });

//     redirect(authUrl);
//   }

//   return (
//     <main className="max-w-md mx-auto">
//       <div className="flex flex-col items-center justify-center h-[50dvh]">
//         <h1 className="text-3xl font-bold mb-6">Login</h1>
//         <form action={loginAction} className="space-y-4">
//           <button
//             type="submit"
//             id="login"
//             className="bg-[var(--primary-dark)] text-white px-4 py-2 rounded cursor-pointer"
//           >
//             Sign in
//           </button>
//         </form>
//         <p className="mt-4 text-sm">
//           Don&apos;t have an account?{" "}
//           <a href="/register" className="text-blue-600 underline">
//             Register
//           </a>
//         </p>
//       </div>
//     </main>
//   );
// }

import { initiateCustomerAuth } from "@/lib/shopify";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = { title: "Login | HA-AA-IB" };

export default function LoginPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  console.log("Login Env:", {
    baseUrl,
    shopId: process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID,
    clientId: process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_ID,
  });
  async function loginAction() {
    "use server";

    const { authUrl, verifier, state } = await initiateCustomerAuth(baseUrl);
    const cookieStore = await cookies();
    cookieStore.set("oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // ✅ fixed (1 day in seconds)
    });
    cookieStore.set("oauth_verifier", verifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 24 * 60 * 60,
    });

    redirect(authUrl);
  }

  return (
    <main className="max-w-md mx-auto">
      <div className="flex flex-col items-center justify-center h-[50dvh]">
        <h1 className="text-3xl font-bold mb-6">Login</h1>
        <form action={loginAction} className="space-y-4">
          <button
            type="submit"
            id="login"
            className="bg-[var(--primary-dark)] text-white px-4 py-2 rounded cursor-pointer"
          >
            Sign in
          </button>
        </form>
        <p className="mt-4 text-sm">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-blue-600 underline">
            Register
          </a>
        </p>
      </div>
    </main>
  );
}
