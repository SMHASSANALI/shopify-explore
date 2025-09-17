"use client";

import ProductCard from "@/components/global/ProductCard";

export default function ProductGrid({ products, layout }) {
  return (
    <div
      className={`grid grid-cols-${layout === 5 ? 2 : 2} md:grid-cols-${layout === 5 ? 5 : 4} ${
        layout === 5 ? "gap-2" : "gap-4"
      } p-2 w-fit`}
    >
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard
            key={product.node.id}
            product={product}
            compressed={layout === 5 ? true : false}
          />
        ))
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}
