"use client";

import ProductCard from "@/components/global/ProductCard";

export default function ProductGrid({ products, layout }) {
  return (
    <div
      className={`flex flex-wrap justify-between space-y-4 p-2 w-fit`}
    >
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard
            key={product.node.id}
            product={product}
            compressed={layout === 4 ? true : false}
          />
        ))
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}
