import { fetchAllCollections } from "@/lib/shopify";
import { toTitleCase } from "@/utils/toTitleCase";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CollectionsSection = async () => {
  const allCollections = await fetchAllCollections({ first: 10 });
  return (
    <div className="max-w-[1400px] mx-auto space-y-[50px] py-[50px]">
      <div className="flex flex-row items-center justify-between border-b-4 border-gray-300 pb-2">
        <h1 className="font-semibold">Shop By Categories</h1>
        <Link href={"/collections"} className="hover:text-[var(--accent)]">
          View All Categories
        </Link>
      </div>
      <div className="flex flex-row overflow-x-auto overflow-y-hidden gap-2 bg-white p-2 rounded-lg">
        {allCollections.length > 0 &&
          allCollections.map((item) => (
            <Link
              key={item.id}
              href={`/collections/${item.handle}`}
              className="hover:text-[var(--accent)] flex flex-col items-center gap-2"
            >
              <div className="h-[130px] w-[130px] relative rounded-sm overflow-hidden">
                <Image
                  src={item.image.src}
                  alt={item.image.altText ? item.image.altText : item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-extralight text-center">
                {toTitleCase(item.title)}
              </span>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default CollectionsSection;
