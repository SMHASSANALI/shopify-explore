"use client";

import { useState } from "react";
import { MdSearch } from "react-icons/md";
import SearchModal from "./SearchModal";

export default function SearchTrigger() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="w-full flex flex-row items-center justify-center gap-[10px]">
        <button
          onClick={() => setOpen(true)}
          className="md:block hidden w-8/12 border border-white/20 rounded-md !text-xs md:!text-sm p-1.5 text-left text-white/70 hover:text-white cursor-pointer"
        >
          Search products, collections, articles…
        </button>
        <button
          onClick={() => setOpen(true)}
          className="bg-[var(--accent)] text-white rounded-md p-1 cursor-pointer"
        >
          <MdSearch size={"28px"} />
        </button>
      </div>
      <SearchModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
