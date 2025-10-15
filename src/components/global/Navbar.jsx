import React from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchShopify } from "@/lib/shopify";
import logo from "../../../public/assets/haaaib-logo.svg";
import { MdFacebook, MdPerson, MdSearch } from "react-icons/md";
import { PiInstagramLogo } from "react-icons/pi";
import CartDrawer from "./CartDrawer";
import Dropdown from "../dropdowns/SelectDropdown";
import SearchTrigger from "./SearchTrigger";
import MobileDrawer from "./MobileDrawer";

const Navbar = async ({ customer }) => {
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
    blogs(first: 10) {
      edges {
        node {
          id
          title
          handle
        }
      }
    }
  }`;

  let collectionsData;
  try {
    collectionsData = await fetchShopify(query);
  } catch (error) {
    console.error("Failed to fetch navbar data:", error);
    collectionsData = { collections: { edges: [] }, blogs: { edges: [] } };
  }

  const collections = collectionsData?.collections?.edges || [];
  const blogs = collectionsData?.blogs?.edges || [];
  // push to the collectionsItems array if the title is not "Ad Banners", "Bento Images", "Hero Banners"
  const collectionItems = collections
    .filter((edge) => {
      return (
        edge.node.title !== "Ad Banners" &&
        edge.node.title !== "Bento Images" &&
        edge.node.title !== "Hero Banners"
      );
    })
    .map((edge) => {
      return {
        id: edge.node.id,
        title: edge.node.title,
        href: `/collections/${edge.node.handle}`,
      };
    });

  const blogItems = blogs.map((edge) => ({
    id: edge.node.id,
    title: edge.node.title,
    href: `/blogs/${edge.node.handle}`,
  }));

  return (
    <main className="w-full  md:sticky top-0 z-[1000]">
      <header className="w-full bg-[var(--accent)] flex items-center justify-center text-white 2xl:px-0 lg:px-4 px-2">
        <main className="max-w-[1400px] w-full py-1 hidden md:flex flex-row relative">
          <div className="w-fit flex flex-row gap-[10px]">
            <Link
              target="_blank"
              href={"https://www.facebook.com/haaaib"}
              aria-label="HAAAIB on Facebook"
              title="HAAAIB on Facebook"
            >
              <MdFacebook size={"26px"} />
            </Link>
            <Link
              target="_blank"
              href={"https://www.instagram.com/haaaibuk"}
              aria-label="HAAAIB on Instagram"
              title="HAAAIB on Instagram"
            >
              <PiInstagramLogo size={"26px"} />
            </Link>
          </div>
          <div className="max-w-xl absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
            <p className="text-sm font-light">
              Minimal. Aesthetic. Budget-friendly. FREE shipping
            </p>
          </div>
        </main>
        <main className="py-1 w-full md:hidden block">
          <p className="text-center !text-xs font-light">
            Minimal. Aesthetic. Budget-friendly. FREE shipping
          </p>
        </main>
      </header>
      <main className="w-full flex items-center justify-center bg-[var(--primary-dark)] 2xl:px-0 lg:px-4 px-2">
        <div className="flex flex-row items-center justify-between h-auto w-full max-w-[1400px] gap-2 py-1.5">
          <div className="w-full md:w-3/12 h-full">
            <Link
              href="/"
              className="flex items-start justify-start"
              aria-label="HAAAIB Home"
              title="HAAAIB Home"
            >
              <Image
                src={logo}
                alt="HAAAIB logo"
                height={60}
                width={160}
                quality={75}
                styles={{ width: "auto", height: "auto" }}
              />
            </Link>
          </div>
          <div className="md:flex hidden w-6/12 h-full">
            <SearchTrigger />
          </div>
          <div className="w-3/12 h-full md:flex hidden flex-row items-center gap-[10px]">
            <Link
              href="/account"
              className="flex flex-row gap-1 items-end ml-auto"
            >
              <MdPerson size={"30px"} color="white" />
              <div className="flex flex-col">
                <p className="text-white !text-[12px] !font-extralight !leading-none">
                  My Account
                </p>
                <p
                  href={customer ? "/logout" : "/login"}
                  className="text-white !text-[14px] !font-light !leading-none"
                >
                  {customer ? "Logout" : "Login"}
                </p>
              </div>
            </Link>
            <CartDrawer />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
            <MobileDrawer collections={collections} blogs={blogs} />
          </div>
        </div>
      </main>
      <nav className="w-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.3)] h-auto md:flex hidden flex-row items-center justify-center 2xl:px-0 lg:px-4 px-2">
        <main className="max-w-[1400px] py-2 w-full flex flex-row items-center justify-between">
          <div className="lg:w-2/12 w-3/12">
            <Dropdown title="All Categories" items={collectionItems} />
          </div>
          <div className="lg:w-8/12 w-6/12 overflow-x-auto overflow-y-hidden">
            <ul className="w-full h-full flex flex-row items-center justify-center divide-x-2 divide-gray-300">
              <li>
                <Link
                  href={`/`}
                  className="font-semibold text-neutral-800 hover:text-[var(--accent)] p-2"
                >
                  Home
                </Link>
              </li>
              {collections.slice(0, 5).map((edge) => (
                <li key={edge.node.id}>
                  <Link
                    href={`/collections/${edge.node.handle}`}
                    className="font-semibold text-neutral-800 hover:text-[var(--accent)] p-1 text-nowrap"
                  >
                    {edge.node.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:w-2/12 w-3/12">
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
