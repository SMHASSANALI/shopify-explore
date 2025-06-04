"use client"; // Marks this as a Client Component

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function CollectionCard({ id, title, handle, image }) {
  return (
    <motion.div
      key={id}
      whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        href={`/collections/${handle}`}
        className="border rounded-lg overflow-hidden hover:shadow-md transition"
      >
        {image && (
          <Image
            src={image.src}
            alt={image.altText || title}
            width={500}
            height={300}
            className="w-full h-64 object-cover"
          />
        )}
        <div className="p-4">
          <h2 className="text-lg font-medium">{title}</h2>
        </div>
      </Link>
    </motion.div>
  );
}