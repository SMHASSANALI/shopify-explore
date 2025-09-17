"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import FilterPanel from "@/components/products/FilterPanel";
import SortingSelect from "@/components/products/SortingSelect";
import LayoutButtons from "@/components/products/LayoutButtons";
import ProductGrid from "@/components/products/ProductGrid";

export const CollectionClient = ({ initialProducts }) => {
  const [products, setProducts] = useState(initialProducts);
  const [filters, setFilters] = useState({
    availability: { inStock: false, outOfStock: false },
    price: { min: 0, max: 100 },
  });
  const [sort, setSort] = useState("best-selling");
  const [layout, setLayout] = useState(3);

  const allProductsRef = useRef(initialProducts);

  useEffect(() => {
    let filtered = [...allProductsRef.current];

    if (filters.availability.inStock) {
      filtered = filtered.filter((p) => p.node.availableForSale === true);
    }
    if (filters.availability.outOfStock) {
      filtered = filtered.filter((p) => p.node.availableForSale === false);
    }

    filtered = filtered.filter((p) => {
      const price = p.node.minPrice ?? p.node.price;
      return price >= filters.price.min && price <= filters.price.max;
    });

    switch (sort) {
      case "title-ascending":
        filtered.sort((a, b) => a.node.title.localeCompare(b.node.title));
        break;
      case "title-descending":
        filtered.sort((a, b) => b.node.title.localeCompare(a.node.title));
        break;
      case "price-ascending":
        filtered.sort(
          (a, b) => (a.node.minPrice ?? a.node.price) - (b.node.minPrice ?? b.node.price)
        );
        break;
      case "price-descending":
        filtered.sort(
          (a, b) => (b.node.minPrice ?? b.node.price) - (a.node.minPrice ?? a.node.price)
        );
        break;
    }

    setProducts(filtered);
  }, [filters, sort]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const handleSortChange = useCallback((newSort) => setSort(newSort), []);
  const handleLayoutChange = useCallback((newLayout) => setLayout(newLayout), []);

  return (
    <div className="flex flex-col md:flex-row w-full h-full gap-[10px]">
      <div className="relative w-full md:w-2/12">
        <div className="sticky top-[23%] h-fit py-2 w-full flex flex-col gap-[20px]">
          <h2 className="font-semibold">Filter:</h2>
          <FilterPanel onFilterChange={handleFilterChange} />
        </div>
      </div>
      <div className="w-full md:w-10/12 rounded flex flex-col gap-[20px]">
        <div className="w-full bg-[var(--background)] py-1 px-2 flex flex-row justify-between items-center">
          <LayoutButtons onLayoutChange={handleLayoutChange} />
          <div>
            <span className="font-light">Sort by:</span>
            <SortingSelect onSortChange={handleSortChange} />
          </div>
        </div>
        <ProductGrid products={products} layout={layout} />
      </div>
    </div>
  );
};


