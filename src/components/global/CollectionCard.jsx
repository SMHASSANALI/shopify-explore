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
    <div>
      <Link
        href={`/collections/${edge.handle}`}
        className="flex flex-col h-full "
        aria-label={`View collection: ${edge.title}`}
      >
        {edge.image ? (
          <div className="relative aspect-[1/1] rounded-lg overflow-hidden">
            <Image
              src={edge.image.src}
              alt={edge.image.altText || edge.title}
              fill
              className="object-cover rounded-t-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="relative aspect-[1/1] rounded-lg overflow-hidden">
            <Image
              src="/assets/placeholder.jpg"
              alt={edge.title}
              fill
              className="object-cover rounded-t-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              loading="lazy"
            />
          </div>
        )}
        <h2 className="line-clamp-2 text-center pt-3">{edge.title}</h2>
      </Link>
    </div>
  );
}
