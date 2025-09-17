import { Poppins, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/global/Navbar";
import MobileBottomNav from "@/components/global/MobileBottomNav";
import { cookies } from "next/headers";
import { getCustomerAccount } from "@/lib/shopify";
import Footer from "@/components/global/Footer";

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
  title: "Haaaib",
  description:
    "Discover elegant, trending home décor, fashion, and lifestyle accessories – all at budget-friendly prices. HAAAIB offers UK-wide delivery for Pinterest-perfect finds.",
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("customer_access_token")?.value;
  const customer = accessToken
    ? await getCustomerAccount({ accessToken })
    : null;

  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${montserrat.variable} antialiased`}
      >
        <Navbar customer={customer} />
        {children}
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
