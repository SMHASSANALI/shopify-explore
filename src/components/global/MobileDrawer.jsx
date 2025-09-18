"use client";

import React, { useState } from "react";
import Link from "next/link";
import { IoClose, IoMenu } from "react-icons/io5";

const MobileDrawer = ({ collections, blogs }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => setIsOpen(!isOpen);
  const closeDrawer = () => setIsOpen(false);


  return (
    <>
      <button
        onClick={toggleDrawer}
        className="md:hidden flex items-center justify-center p-2 text-white"
        aria-label="Open navigation menu"
      >
        <IoMenu size={24} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <button
            onClick={closeDrawer}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Close navigation menu"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex flex-col h-full overflow-y-auto pb-[200px]">
          {/* Home Link */}
          <div className="p-4 border-b border-gray-100">
            <Link
              href="/"
              className="block text-lg font-semibold text-neutral-800 hover:text-[var(--accent)] py-2"
              onClick={closeDrawer}
            >
              Home
            </Link>
          </div>

          {/* Categories Section */}
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Categories</h3>
            <div className="space-y-2">
              {collections.map((edge) => (
                <Link
                  key={edge.node.id}
                  href={`/collections/${edge.node.handle}`}
                  className="block text-neutral-800 hover:text-[var(--accent)] py-1"
                  onClick={closeDrawer}
                >
                  {edge.node.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Blogs Section */}
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Blogs</h3>
            <div className="space-y-2">
              {blogs.slice(0, 5).map((edge) => (
                <Link
                  key={edge.node.id}
                  href={`/blogs/${edge.node.handle}`}
                  className="block text-neutral-800 hover:text-[var(--accent)] py-1"
                  onClick={closeDrawer}
                >
                  {edge.node.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Spacer to push content to top */}
          <div className="flex-1" />
        </div>
      </div>
    </>
  );
};

export default MobileDrawer;
