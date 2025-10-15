// app/components/Footer.jsx
import Image from "next/image";
import Link from "next/link";
import { fetchAllCollections } from "@/lib/shopify";
import { FaFacebook, FaSquareInstagram } from "react-icons/fa6";
import logo from "../../../public/assets/haaaib-logo.svg";

export default async function Footer() {
  const collections = await fetchAllCollections({ first: 5 }).catch((error) => {
    console.error("Failed to fetch collections for footer:", error.message);
    return [];
  });

  return (
    <footer className="w-full bg-[var(--primary-dark)] text-white p-4">
      <div className="max-w-[1400px] mx-auto flex flex-col">
        <div className="relative w-[250px] h-[100px] aspect-[16/9] mb-[50px]">
          <Image
            src={logo}
            alt="HAAAIB logo"
            height={100}
            width={250}
            quality={75}
            styles={{ width: "auto", height: "auto" }}
          />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start border-b border-gray-400 gap-[20px] pb-[50px]">
          <div className="w-full md:max-w-6/12 md:w-fit flex flex-row gap-[60px]">
            <div>
              <h2 className="pb-4">Popular Collections</h2>
              <ul className="space-y-1">
                {collections.map((collection) => (
                  <li key={collection.id}>
                    <Link
                      className="!text-gray-400"
                      href={`/collections/${collection.handle}`}
                    >
                      {collection.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="pb-4">Information</h2>
              <ul className="space-y-1">
                <li>
                  <Link className="!text-gray-400" href="/blogs">
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link className="!text-gray-400" href="/contact">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full md:max-w-6/12 md:w-fit">
            <h2 className="pb-4">Subscribe to our newsletter</h2>
            <p className="pb-1">
              Be the first to know about new collections and special offers.
            </p>
            <form className="flex flex-row w-full gap-[10px]">
              <input
                type="email"
                placeholder="Enter your email"
                className="text-white p-2 rounded-md border border-gray-400 w-full"
              />
              <button
                type="submit"
                className="bg-[var(--secondary)] text-white p-2 rounded-md"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="flex flex-row justify-between items-center py-4 text-xs border-b border-gray-400">
          <div className="flex flex-row divide-x divide-gray-400 gap-2">
            <Link
              className="pr-2 !text-sm !text-gray-400"
              href="/policies/privacy"
            >
              Privacy Policy
            </Link>
            <Link
              className="pr-2 !text-sm !text-gray-400"
              href="/policies/refund"
            >
              Return Policy
            </Link>
            <Link className="!text-sm !text-gray-400" href="/policies/terms">
              Terms of Service
            </Link>
          </div>
          <div className="flex flex-row gap-1">
            <Link href="https://www.facebook.com/haaaib" target="_blank">
              <FaFacebook size={20} />
            </Link>
            <Link href="https://www.instagram.com/haaaibuk" target="_blank">
              <FaSquareInstagram size={20} />
            </Link>
          </div>
        </div>
        <div className="flex flex-col-reverse md:flex-row justify-between items-center py-4 border-b border-gray-400">
          <p className="!text-gray-400">
            &copy; {new Date().getFullYear()} Haaaib, Powered by{" "}
            <Link className="!text-sm" href="https://www.shopify.com/">
              Shopify
            </Link>
            , Design by{" "}
            <Link className="!text-sm" href="https://www.saskasolutions.com/">
              SASKA Solutions
            </Link>
          </p>
          <div className="flex flex-row gap-2">
            <Image
              styles={{ width: "auto", height: "auto" }}
              src="/assets/visa.svg"
              alt="Visa Logo"
              width={40}
              height={30}
            />
            <Image
              styles={{ width: "auto", height: "auto" }}
              src="/assets/masterCard.svg"
              alt="Mastercard Logo"
              width={40}
              height={30}
            />
            <Image
              styles={{ width: "auto", height: "auto" }}
              src="/assets/paypal.svg"
              alt="Paypal Logo"
              width={40}
              height={30}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
