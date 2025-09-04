"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover: {
    y: -8,
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.3 },
  },
  tap: { scale: 0.98, transition: { duration: 0.2 } },
};

export default function CollectionCard({ edge }) {
  return (
    <div className="rounded-lg overflow-hidden bg-white border border-gray-100 shadow-sm">
      <Link
        href={`/collections/${edge.handle}`}
        className="flex flex-col h-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label={`View collection: ${edge.title}`}
      >
        {edge.image && (
          <div className="relative aspect-[4/3]">
            <Image
              src={edge.image.src}
              alt={edge.image.altText || edge.title}
              fill
              className="object-cover rounded-t-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent" />
          </div>
        )}
        <div className="p-4 flex flex-col flex-1">
          <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {edge.title}
          </h2>
        </div>
      </Link>
    </div>
  );
}
