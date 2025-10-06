"use client";

import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/global/ProductCard";

export default function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-2 w-fit">
      <AnimatePresence mode="popLayout">
        {products.length > 0 ? (
          products.map((product) => (
            <motion.div
              key={product.node.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <ProductCard product={product} />
            </motion.div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </AnimatePresence>
    </div>
  );
}