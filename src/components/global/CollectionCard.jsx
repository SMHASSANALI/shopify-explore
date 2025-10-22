"use client";

import Link from "next/link";
import Image from "next/image";
import { toTitleCase } from "@/utils/toTitleCase";

export default function CollectionCard({ edge }) {
  return (
    <div>
      <Link
        href={`/collections/${edge.handle}`}
        className="flex flex-col h-full "
        aria-label={`View collection: ${edge.title}`}
      >
        <div className="relative w-full h-[250px] border border-gray-300 shadow-sm rounded-md overflow-hidden">
          <Image
            src={edge.image.src}
            alt={edge.image.altText || edge.title}
            width={250}
            height={250}
            className="object-cover w-full h-full"
            styles={{ width: "auto", height: "auto" }}
            priority
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1280px) 10vw, 10vw"
          />
        </div>
        <h2 className="line-clamp-2 text-center pt-3">
          {toTitleCase(edge.title)}
        </h2>
      </Link>
    </div>
  );
}
