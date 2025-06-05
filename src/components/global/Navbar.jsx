import { fetchShopify } from "@/lib/shopify";
import Link from "next/link";
import React from "react";

const Navbar = async () => {
  
  const query = ` {
      collections(first: 17) {
        edges {
          node {
            id
            title
            handle
          }
        }
      }
    }
  `;

  const fetchData = async () => {
    const data = await fetchShopify(query);
    return data;
  };
  const collectionsData = await fetchData();
  const collections = collectionsData?.collections?.edges || [];

  return (
    <main className="py-1 px-6">
      <header className="w-full flex justify-between items-end backdrop-blur-md py-6">
        <div className="">
          <Link
            href="/"
            className="text-2xl font-semibold tracking-tight leading-0"
          >
            Haaaib
          </Link>
        </div>
        <div className="flex items-center">
          <input type="text" className="p-1 border rounded-md text-sm " />
        </div>
        <div className=" flex items-center gap-4">
          {/* Find how to handle user authentication via shopify API */}
          <Link href="/">Login</Link>
          <Link href="/cart" className="hover:underline">
            Cart
          </Link>
        </div>
      </header>
      <nav className="border-y py-2 overflow-x-auto">
        <ul className="flex divide-x-[1px] justify-start items-center ">
          {collections.map(({ node }) => (
            <li
              key={node.id}
              className="px-2 flex items-center text-center justify-center w-[100px] h-[50px]"
            >
              <Link
                href={`/collections/${node.handle}`}
                className="text-sm font-medium hover:underline "
              >
                <p className="line-clamp-2">{node.title}</p>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
};

export default Navbar;
