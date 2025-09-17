// components/Dropdown.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { IoCaretDownOutline, IoCaretUpOutline } from "react-icons/io5";

const Dropdown = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex flex-row items-center justify-center gap-2 p-1 px-2 rounded-md cursor-pointer hover:bg-gray-200 font-semibold"
      >
        {title}
        {isOpen ? (
          <IoCaretUpOutline size={16} />
        ) : (
          <IoCaretDownOutline size={16} />
        )}
      </button>
      {isOpen && (
        <div className="absolute top-9 left-0 max-h-[50dvh] overflow-y-auto max-w-xl shadow z-10">
          <ul className="bg-white w-54 flex flex-col gap-1 p-4">
            {items.map((item) => (
              <li
                key={item.id}
                className="hover:bg-gray-100 rounded-md w-full flex"
              >
                <Link
                  href={item.href}
                  className="font-semibold text-neutral-800 hover:text-[var(--accent)] p-1 w-full"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
