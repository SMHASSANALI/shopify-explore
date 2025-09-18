"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import FilterPanel from "@/components/products/FilterPanel";
import SortingSelect from "@/components/products/SortingSelect";
import ProductGrid from "@/components/products/ProductGrid";
import { fetchAllProducts } from "@/lib/shopify";

export const ProductsClient = ({
  initialProducts,
  initialHasNextPage,
  initialEndCursor,
}) => {
  const [products, setProducts] = useState(initialProducts);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [endCursor, setEndCursor] = useState(initialEndCursor);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [filters, setFilters] = useState({
    availability: { inStock: false, outOfStock: false },
    price: { min: 0, max: 100 },
  });
  const [sort, setSort] = useState("best-selling");

  // Use useRef to store the initial and accumulated products for stable reference
  const allProductsRef = useRef(initialProducts);

  // Apply filters and sorting when filters or sort change
  useEffect(() => {
    let filtered = [...allProductsRef.current];

    // Availability filter
    if (filters.availability.inStock) {
      filtered = filtered.filter(
        (product) => product.node.availableForSale === true
      );
    }
    if (filters.availability.outOfStock) {
      filtered = filtered.filter(
        (product) => product.node.availableForSale === false
      );
    }

    // Price filter
    filtered = filtered.filter((product) => {
      const price = product.node.minPrice ?? product.node.price;
      return price >= filters.price.min && price <= filters.price.max;
    });

    // Sorting
    switch (sort) {
      case "title-ascending":
        filtered.sort((a, b) => a.node.title.localeCompare(b.node.title));
        break;
      case "title-descending":
        filtered.sort((a, b) => b.node.title.localeCompare(a.node.title));
        break;
      case "price-ascending":
        filtered.sort(
          (a, b) =>
            (a.node.minPrice ?? a.node.price) -
            (b.node.minPrice ?? b.node.price)
        );
        break;
      case "price-descending":
        filtered.sort(
          (a, b) =>
            (b.node.minPrice ?? b.node.price) -
            (a.node.minPrice ?? a.node.price)
        );
        break;
      // Add more cases as needed
    }

    setProducts(filtered);
  }, [filters, sort]);

  const loadMore = async () => {
    setIsLoadingMore(true);
    const {
      products: newProducts,
      hasNextPage: newHasNextPage,
      endCursor: newEndCursor,
    } = await fetchAllProducts({
      first: 30,
      after: endCursor,
    });
    allProductsRef.current = [...allProductsRef.current, ...newProducts];
    setProducts((prev) => [...prev, ...newProducts]); // Append to current filtered list
    setHasNextPage(newHasNextPage);
    setEndCursor(newEndCursor);
    setIsLoadingMore(false);
  };

  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  }, []);

  const handleSortChange = useCallback((newSort) => {
    setSort(newSort);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row w-full h-full gap-[10px]">
      <div className="relative w-full lg:w-2/12">
        <div className="sticky top-[25%] h-fit py-2 w-full flex flex-col gap-[20px]">
          <h2 className="font-semibold">Filter:</h2>
          <FilterPanel onFilterChange={handleFilterChange} />
        </div>
      </div>
      <div className="w-full lg:w-10/12 rounded flex flex-col gap-[20px]">
        <div className="w-full bg-[var(--background)] py-1 px-2 flex flex-row justify-between items-center">
          <div>
            <span className="font-light">Sort by:</span>
            <SortingSelect onSortChange={handleSortChange} />
          </div>
        </div>
        <ProductGrid products={products} />
        {hasNextPage && (
          <div className="text-center mt-4">
            <button
              onClick={loadMore}
              disabled={isLoadingMore}
              className="bg-[var(--primary-dark)] cursor-pointer text-white px-4 py-2 rounded hover:bg-[var(--primary-dark)]/80 disabled:bg-gray-400"
            >
              {isLoadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
