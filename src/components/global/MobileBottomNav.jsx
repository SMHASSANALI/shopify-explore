"use client";

import Link from "next/link";
import { IoMdHome, IoMdCart } from "react-icons/io";
import { MdSearch, MdPerson } from "react-icons/md";
import { usePathname } from "next/navigation";
import SearchTrigger from "./SearchTrigger";

export default function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[1500] bg-white border-t border-gray-200 md:hidden">
      <ul className="grid grid-cols-4 text-xs text-gray-700">
        <li>
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 py-2 ${
              pathname === "/" ? "text-[var(--accent)]" : ""
            }`}
          >
            <IoMdHome size={18} />
            <span className="!text-xs">Home</span>
          </Link>
        </li>
        <li>
          <Link
            href="/cart"
            className={`flex flex-col items-center gap-1 py-2 ${
              pathname === "/cart" ? "text-[var(--accent)]" : ""
            }`}
          >
            <IoMdCart size={18} />
            <span className="!text-xs">Cart</span>
          </Link>
        </li>
        <li>
          <Link
            href="/account"
            className={`flex flex-col items-center gap-1 py-2 ${
              pathname === "/account" ? "text-[var(--accent)]" : ""
            }`}
          >
            <MdPerson size={18} />
            <span className="!text-xs">Account</span>
          </Link>
        </li>
        <li className="flex items-center justify-center">
          <SearchTrigger />
        </li>
      </ul>
    </nav>
  );
}
