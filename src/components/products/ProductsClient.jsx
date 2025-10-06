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
  
  const isInitialOrRefetchLoading = (loading || refetching) && products.length === 0;
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

        {/* Product Grid - Keep showing existing products during refetch */}
        {products.length > 0 && <ProductGrid products={products} />}
        {isInitialOrRefetchLoading && <SkeletonGrid />}
        {showNoProducts && (
          <div className="text-center py-10 text-gray-500">
            No products found matching your filters.
          </div>
        )}

        {/* Overlay for refetch when keeping old data */}
        {showRefetchOverlay && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <SkeletonGrid />
          </div>
        )}

        {/* Infinite Scroll Loader */}
        {hasNextPage && (
          <div ref={loaderRef} className="flex justify-center py-10">
            {isAppendLoading && <SkeletonGrid />}
          </div>
        )}
        {!hasNextPage && products.length > 0 && !loading && (
          <div className="flex justify-center py-10">
            <p className="text-gray-500">You've seen it all!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-2 w-fit">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-gray-200 rounded-lg h-[250px]"
        />
      ))}
    </div>
  );
}