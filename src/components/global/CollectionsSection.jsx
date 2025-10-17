import Link from "next/link";
import React from "react";
import CollectionsSlider from "./CollectionSlider";

const CollectionsSection = async ({ data }) => {
  return (
    <div className="max-w-[1400px] mx-auto space-y-[20px] md:space-y-[50px] py-[20px] md:py-[50px]">
      <div className="flex flex-row items-center justify-between border-b-4 border-gray-300 pb-2">
        <h1 className="font-semibold">Shop By Categories</h1>
        <Link href={"/collections"} className="hover:text-[var(--accent)]">
          View All Categories
        </Link>
      </div>
      <CollectionsSlider data={data} />
    </div>
  );
};

export default CollectionsSection;
