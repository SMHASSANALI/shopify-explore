"use client";

import ProductCard from "@/components/global/ProductCard";

export default function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-2 w-fit">
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product.node.id} className="h-full">
            <ProductCard product={product} />
          </div>
        ))
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}
