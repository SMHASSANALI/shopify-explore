"use client";

import { useState, useEffect } from "react";
import { fetchAllCollections } from "@/lib/shopify";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaSquareInstagram } from "react-icons/fa6";
import logo from "../../../public/assets/haaaib-logo.svg";

const Footer = () => {
  const [collections, setCollections] = useState(null);

  useEffect(() => {
    async function fetchCollections() {
      const data = await fetchAllCollections({ first: 5 });
      setCollections(data);
    }
    fetchCollections();
  }, []);

  return (
    <footer className="w-full bg-[var(--primary-dark)] text-white p-4">
      <div className="max-w-[1400px] mx-auto flex flex-col">
        <div className="relative w-[250px] h-[100px] aspect-[16/9] mb-[50px]">
          <Image
            src={logo}
            alt="logo"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
        <div className="flex flex-row justify-between items-start border-b border-gray-400 pb-[50px]">
          <div className="max-w-6/12 w-fit flex flex-row gap-[60px]">
            <div>
              <h2 className="pb-4">Popular Collections</h2>
              <ul className="space-y-1">
                {collections &&
                  collections.map((collection) => (
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
          <div className="max-w-6/12 w-fit">
            <h2 className="pb-4">Subscribe to our newsletter</h2>
            <p className="pb-1">
              Be the first to know about new collections and special offers.
            </p>
            <form className="flex flex-row w-full">
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
            <Link className="!text-sm !text-gray-400" href="/policies/refund">
              Return Policy
            </Link>
          </div>
          <div className="flex flex-row gap-1">
            <Link href="https://www.facebook.com/haaaib" target="_blank">
              <FaFacebook size={20} />
            </Link>
            <Link href="https://www.instagram.com/haaaib" target="_blank">
              <FaSquareInstagram size={20} />
            </Link>
          </div>
        </div>
        <div className="flex flex-row justify-between items-center py-4 border-b border-gray-400">
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
              src="/assets/visa.svg"
              alt="Visa Logo"
              width={30}
              height={20}
            />
            <Image
              src="/assets/masterCard.svg"
              alt="Mastercard Logo"
              width={30}
              height={20}
            />
            <Image
              src="/assets/paypal.svg"
              alt="Paypal Logo"
              width={30}
              height={20}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
