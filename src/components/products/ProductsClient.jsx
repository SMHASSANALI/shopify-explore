"use client";

import { useEffect, useRef, useCallback } from "react";
import { useInfiniteProducts } from "@/hooks/useInfiniteProducts";
import FilterPanel from "@/components/products/FilterPanel";
import SortingSelect from "@/components/products/SortingSelect";
import ProductGrid from "@/components/products/ProductGrid";

export default function ProductsClient({
  initialProducts,
  initialHasNextPage,
  initialEndCursor,
  collectionId,
}) {
  const {
    products,
    hasNextPage,
    loading,
    refetching,
    filters,
    sort,
    loadMore,
    resetAndFetch,
  } = useInfiniteProducts({
    initialProducts,
    initialHasNextPage,
    initialEndCursor,
    collectionId,
  });

  const loaderRef = useRef(null);
  const loadMoreRef = useRef(loadMore);
  const filtersRef = useRef(filters);
  const sortRef = useRef(sort);

  // Sync refs
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);
  useEffect(() => {
    sortRef.current = sort;
  }, [sort]);

  useEffect(() => {
    loadMoreRef.current = loadMore;
  }, [loadMore]);

  useEffect(() => {
    if (!hasNextPage || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMoreRef.current();
        }
      },
      { rootMargin: "400px" }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, loading]);

  const handleFilterChange = useCallback(
    (newFilters) => {
      resetAndFetch(newFilters, sortRef.current);
    },
    [resetAndFetch]
  );

  const handleSortChange = useCallback(
    (newSort) => {
      resetAndFetch(filtersRef.current, newSort);
    },
    [resetAndFetch]
  );

  const isInitialOrRefetchLoading =
    (loading || refetching) && products.length === 0;
  const isAppendLoading = loading && products.length > 0 && hasNextPage;
  const showNoProducts = !loading && !refetching && products.length === 0;
  const showRefetchOverlay = refetching && products.length > 0;

  return (
    <div className="flex flex-col lg:flex-row w-full h-full gap-[10px]">
      <div className="relative w-full lg:w-2/12">
        <div className="sticky top-[25%] h-fit py-2 w-full flex flex-col gap-[20px]">
          <h2 className="font-semibold">Filter:</h2>
          <FilterPanel onFilterChange={handleFilterChange} />
        </div>
      </div>

      <div className="w-full lg:w-10/12 rounded flex flex-col gap-[20px]">
        <div className="w-full bg-gray-100 rounded py-1 px-2 flex justify-between items-center">
          <div>
            <span className="font-light">Sort by:</span>
            <SortingSelect value={sort} onChange={handleSortChange} />
          </div>
        </div>
        <div className="relative">
          {/* Product Grid - Keep showing existing products during refetch */}
          {products.length > 0 && <ProductGrid products={products} />}

          {isInitialOrRefetchLoading && (
            <div className="absolute inset-0">
              <SkeletonGrid />
            </div>
          )}

          {showNoProducts && (
            <div className="text-center py-10 text-gray-500">
              No products found matching your filters.
            </div>
          )}

          {/* Overlay for refetch when keeping old data */}
          {showRefetchOverlay && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <SkeletonGrid />
            </div>
          )}

          {/* Infinite Scroll Loader */}
          {hasNextPage && !isInitialOrRefetchLoading && (
            <div ref={loaderRef} className="mt-8">
              <SkeletonGrid />
            </div>
          )}

          {/* End message */}
          {!hasNextPage && products.length > 0 && !loading && (
            <div className="flex justify-center py-10">
              <p className="text-gray-500">You've seen it all!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-2 w-full">
      {Array.from({ length: 12 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="flex flex-col h-full animate-pulse rounded-lg">
      {/* Image */}
      <div className="w-full aspect-square bg-gray-200 rounded-md mb-3" />

      <div className="flex flex-col gap-2 px-1 flex-1">
        {/* Wishlist icon */}
        <div className="ml-auto bg-gray-200 rounded-full h-5 w-5" />

        {/* Title lines */}
        <div className="h-3 bg-gray-200 rounded w-4/5" />
        <div className="h-3 bg-gray-200 rounded w-3/5" />

        {/* Price */}
        <div className="h-3 bg-gray-200 rounded w-1/3" />

        {/* Rating */}
        <div className="flex gap-1">
          <div className="h-3 w-3 bg-gray-200 rounded" />
          <div className="h-3 w-3 bg-gray-200 rounded" />
          <div className="h-3 w-3 bg-gray-200 rounded" />
          <div className="h-3 w-3 bg-gray-200 rounded" />
          <div className="h-3 w-3 bg-gray-200 rounded" />
        </div>

        {/* Add to Cart button */}
        <div className="h-9 bg-gray-200 rounded-md mt-2" />
      </div>
    </div>
  );
}
