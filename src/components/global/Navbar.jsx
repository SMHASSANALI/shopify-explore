// components/Navbar.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchShopify } from "@/lib/shopify";
import logo from "../../../public/assets/haaaib-logo.svg";
import { MdFacebook, MdPerson, MdSearch } from "react-icons/md";
import { PiInstagramLogo } from "react-icons/pi";
import { IoMdCart } from "react-icons/io";
import CategoriesDropdown from "../Dropdowns/Dropdown"; // Import the new component
import Dropdown from "../Dropdowns/Dropdown";

const Navbar = async () => {
  // Updated query to fetch up to 100 (or "all" for most stores)
  const query = `{
    collections(first: 100) {
      edges {
        node {
          id
          title
          handle
        }
      }
    }
    blogs(first: 100) {
      edges {
        node {
          id
          title
          handle
        }
      }
    }
    articles(first: 100) {
      edges {
        node {
          id
          title
          handle
        }
      }
    }
  }`;

  // Data Extraction (add error handling as before if needed)
  const fetchData = async () => {
    const data = await fetchShopify(query);
    return data;
  };
  const collectionsData = await fetchData();
  const collections = collectionsData?.collections?.edges || [];
  const articles = collectionsData?.articles?.edges || [];

  const collectionItems = collections.map((edge) => ({
    id: edge.node.id,
    title: edge.node.title,
    href: `/collections/${edge.node.handle}`,
  }));

  const blogItems = articles.map((edge) => ({
    id: edge.node.id,
    title: edge.node.title,
    href: `/blogs/${edge.node.handle}`,
  }));

  return (
    <main className="w-full sticky top-0 z-[1000]">
      {/* Header */}
      <header className="w-full bg-[var(--accent)] flex items-center justify-center text-white">
        <main className="max-w-[1400px] w-full py-1 flex flex-row relative">
          <div className="w-fit flex flex-row gap-[10px]">
            <span>
              <MdFacebook size={"26px"} />
            </span>
            <span>
              <PiInstagramLogo size={"26px"} />
            </span>
          </div>
          <div className="max-w-xl absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
            <p className="text-sm font-light">
              Minimal. Aesthetic. Budget-friendly. FREE shipping
            </p>
          </div>
        </main>
      </header>
      {/* Search and Account */}
      <main className="w-full flex items-center justify-center bg-[var(--primary-dark)]">
        <div className="flex flex-row items-center justify-between h-auto w-full max-w-[1400px] py-1.5">
          <div className="w-3/12 h-full relative">
            <Image
              src={logo}
              alt="Logo"
              height={60}
              width={160}
              className="w-auto h-auto"
            />
          </div>
          <div className="w-6/12 h-full flex flex-row items-center justify-center gap-[10px]">
            <input
              type="text"
              placeholder="Search for Products..."
              className="w-8/12 border border-white/20 rounded-md text-sm p-1.5 placeholder:text-white/50 text-white focus:outline-none focus:ring-1 focus:ring-white/50"
            />
            <button className="bg-[var(--accent)] text-white rounded-md p-1 cursor-pointer">
              <MdSearch size={"28px"} />
            </button>
          </div>
          <div className="w-3/12 h-full flex flex-row items-center gap-[10px]">
            <div className="flex flex-row gap-1 items-end ml-auto">
              <MdPerson size={"30px"} color="white" />
              <div>
                <p className="text-white text-[12px] font-extralight leading-[14px]">
                  Hello, Sign in
                </p>
                <p className="text-white text-[14px] font-light leading-none">
                  Account & List
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-1 items-end">
              <IoMdCart size={"30px"} color="white" />
              <div>
                <p className="text-white text-[12px] font-extralight leading-none">
                  Cart
                </p>
                <p className="text-white text-[14px] font-light leading-none">
                  $ 0.00
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Navigation */}
      <nav className="w-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.3)] h-auto flex flex-row items-center justify-center">
        <main className="max-w-[1400px] py-2 w-full flex flex-row items-center justify-between">
          <div className="w-2/12">
            <Dropdown title="All Categories" items={collectionItems} />
          </div>
          <div className="max-w-8/12 overflow-x-auto overflow-y-hidden">
            <ul className="w-full h-full flex flex-row items-center justify-center divide-x-2 divide-gray-300">
              <li>
                <Link
                  href={`/`}
                  className="font-semibold text-neutral-800 hover:text-[var(--accent)] p-2"
                >
                  Home
                </Link>
              </li>
              {/* Slice to show only the first 7 in main nav */}
              {collections.slice(0, 7).map((edge) => (
                <li key={edge.node.id}>
                  <Link
                    href={`/collections/${edge.node.handle}`}
                    className="font-semibold text-neutral-800 hover:text-[var(--accent)] p-1"
                  >
                    {edge.node.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-2/12">
            <ul className="ml-auto w-fit h-full flex flex-row items-center justify-center divide-x-2 divide-gray-300">
              <li className="pr-2">
                <Dropdown title="Blogs" items={blogItems} />
              </li>
              <li>
                <Link
                  href={`/contact`}
                  className="font-semibold text-neutral-800 hover:text-[var(--accent)] p-2"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </main>
      </nav>
    </main>
  );
};

export default Navbar;
