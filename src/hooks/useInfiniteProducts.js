"use client";

import { fetchCollectionPageData } from "@/lib/shopify/fetch/collection";
import { useState, useCallback, useRef, useEffect } from "react";

export function useInfiniteProducts({
  initialProducts = [],
  initialHasNextPage,
  initialEndCursor,
  collectionId = null,
}) {
  const [products, setProducts] = useState(initialProducts);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [endCursor, setEndCursor] = useState(initialEndCursor);
  const [loading, setLoading] = useState(false);
  const [refetching, setRefetching] = useState(false);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("relevance");

  const abortController = useRef(null);
  const filtersRef = useRef(filters);
  const sortRef = useRef(sort);

  // Sync refs
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    sortRef.current = sort;
  }, [sort]);

  // Helper function to apply client-side filters
  const applyClientSideFilters = useCallback((productsList, filterOptions) => {
    let filtered = [...productsList];

    // Out of Stock filter - only show products where ALL variants are unavailable
    if (filterOptions.availability === "outOfStock") {
      filtered = filtered.filter((p) => {
        const allVariantsUnavailable = p.node.variants.edges.every(
          (edge) => !edge.node.availableForSale
        );
        return allVariantsUnavailable;
      });
    }

    // Price filter - apply strict boundary checking
    if (filterOptions.priceMin !== undefined || filterOptions.priceMax !== undefined) {
      filtered = filtered.filter((p) => {
        const price = parseFloat(p.node.price);
        const min = filterOptions.priceMin !== undefined ? filterOptions.priceMin : 0;
        const max = filterOptions.priceMax !== undefined ? filterOptions.priceMax : Infinity;
        
        // Use strict comparison with small epsilon for floating point
        return price >= min && price <= max;
      });
    }

    return filtered;
  }, []);

  const loadMore = useCallback(async () => {
    if (loading || !hasNextPage || !collectionId) return;

    setLoading(true);
    if (abortController.current) abortController.current.abort();
    abortController.current = new AbortController();

    try {
      // Build query filters - exclude outOfStock from server query
      const queryFilters = { ...filtersRef.current };
      const isOutOfStockFilter = queryFilters.availability === "outOfStock";
      
      // Remove outOfStock from server query, we'll filter client-side
      if (isOutOfStockFilter) {
        delete queryFilters.availability;
      }

      const queryParams = {
        handle: collectionId,
        after: endCursor,
        firstProducts: isOutOfStockFilter ? 100 : 32, // Fetch more if filtering out of stock
        sort: sortRef.current,
        filters: queryFilters,
      };

      const {
        products: newProducts,
        hasNextPage: next,
        endCursor: cursor,
      } = await fetchCollectionPageData(queryParams);

      // Apply client-side filters
      const filteredProducts = applyClientSideFilters(newProducts, filtersRef.current);

      setProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p.node.id));
        const deduped = filteredProducts.filter((p) => !existingIds.has(p.node.id));
        return [...prev, ...deduped];
      });

      setHasNextPage(next);
      setEndCursor(cursor);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("❌ Infinite scroll failed:", err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, hasNextPage, endCursor, collectionId, applyClientSideFilters]);

  const resetAndFetch = useCallback(
    async (newFilters = filtersRef.current, newSort = sortRef.current) => {

      if (abortController.current) abortController.current.abort();
      setRefetching(true);
      setFilters(newFilters);
      setSort(newSort);
      setHasNextPage(true);

      try {
        // Build query filters - exclude outOfStock from server query
        const queryFilters = { ...newFilters };
        const isOutOfStockFilter = queryFilters.availability === "outOfStock";
        
        // Remove outOfStock from server query
        if (isOutOfStockFilter) {
          delete queryFilters.availability;
        }

        const queryParams = {
          handle: collectionId,
          firstProducts: isOutOfStockFilter ? 100 : 32, // Fetch more if filtering out of stock
          sort: newSort,
          filters: queryFilters,
        };

        const {
          products: fresh,
          hasNextPage,
          endCursor,
        } = await fetchCollectionPageData(queryParams);

        // Apply client-side filters
        const filteredProducts = applyClientSideFilters(fresh, newFilters);

        setProducts(filteredProducts);
        setHasNextPage(hasNextPage);
        setEndCursor(endCursor);
      } catch (err) {
        console.error("❌ Error refetching products:", err);
        setProducts([]);
        setHasNextPage(false);
        setEndCursor(null);
      } finally {
        setRefetching(false);
      }
    },
    [collectionId, applyClientSideFilters]
  );

  return {
    products,
    hasNextPage,
    loading,
    refetching,
    filters,
    sort,
    loadMore,
    resetAndFetch,
  };
}