import { Poppins, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/global/Navbar";
import MobileBottomNav from "@/components/global/MobileBottomNav";
import { cookies } from "next/headers";
import { getCustomerAccount } from "@/lib/shopify";
import Footer from "@/components/global/Footer";
import { CustomerProvider } from "@/contexts/CustomerContext";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.haaaib.com"),
  title: {
    default: "HAAAIB | Pinterest-perfect home & lifestyle for less",
    template: "%s | HAAAIB",
  },
  description:
    "Discover elegant, trending home décor, fashion, and lifestyle accessories – all at budget-friendly prices. UK-wide delivery.",
  applicationName: "HAAAIB",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  keywords: [
    "home decor",
    "lifestyle",
    "fashion",
    "uk",
    "budget",
    "pinterest aesthetic",
    "online store",
  ],
  authors: [{ name: "HAAAIB" }],
  creator: "HAAAIB",
  publisher: "HAAAIB",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "HAAAIB",
    title: "HAAAIB | Pinterest-perfect home & lifestyle for less",
    description:
      "Discover elegant, trending home décor, fashion, and lifestyle accessories – all at budget-friendly prices. UK-wide delivery.",
    images: [
      {
        url: "/assets/haaaib-logo.svg",
        width: 1200,
        height: 630,
        alt: "HAAAIB logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@haaaib",
    creator: "@haaaib",
    title: "HAAAIB | Pinterest-perfect home & lifestyle for less",
    description:
      "Discover elegant, trending home décor, fashion, and lifestyle accessories – all at budget-friendly prices. UK-wide delivery.",
    images: [
      {
        url: "/assets/haaaib-logo.svg",
        alt: "HAAAIB logo",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      maxVideoPreview: -1,
      maxImagePreview: "large",
      maxSnippet: -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    pinterest: process.env.NEXT_PUBLIC_PINTEREST_SITE_VERIFICATION || undefined,
  },
  manifest: "/assets/favicon_io/site.webmanifest",
  icons: {
    icon: [
      { url: "/assets/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/assets/favicon_io/favicon.ico" },
    ],
    apple: "/assets/favicon_io/apple-touch-icon.png",
  },
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("customer_access_token")?.value;
  console.log("Root Layout:", { accessToken, cookieStore });
  const customer = accessToken
    ? await getCustomerAccount({ accessToken })
    : null;
  console.log("Root Layout:", { customer });
  return (
    <html lang="en">
      <body suppressHydrationWarning
        className={`${poppins.variable} ${montserrat.variable} antialiased`}
      >
        <CustomerProvider customer={customer}>
          <Navbar customer={customer} />
          {children}
          <Footer />
          <MobileBottomNav />
        </CustomerProvider>
      </body>
    </html>
  );
}
