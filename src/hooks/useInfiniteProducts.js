"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { fetchAllProducts } from "@/lib/shopify";

export function useInfiniteProducts({
  initialProducts = [],
  initialHasNextPage,
  initialEndCursor,
  collectionId,
}) {
  const [products, setProducts] = useState(initialProducts);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [endCursor, setEndCursor] = useState(initialEndCursor);
  const [loading, setLoading] = useState(false);
  const [refetching, setRefetching] = useState(false);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("best-selling");

  const abortController = useRef(null);
  const isClient = useRef(false);
  const isInitialized = useRef(false);
  const filtersRef = useRef(filters);
  const sortRef = useRef(sort);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);
  
  useEffect(() => {
    sortRef.current = sort;
  }, [sort]);

  const sortMap = {
    "best-selling": "BEST_SELLING",
    "title-ascending": "TITLE",
    "title-descending": "TITLE",
    "price-ascending": "PRICE",
    "price-descending": "PRICE",
    "created-ascending": "CREATED_AT",
    "created-descending": "CREATED_AT",
  };

  const sortReverseMap = {
    "best-selling": false,
    "title-ascending": false,
    "title-descending": true,
    "price-ascending": false,
    "price-descending": true,
    "created-ascending": false,
    "created-descending": true,
  };

  useEffect(() => {
    if (!isClient.current && initialProducts.length > 0) {
      isClient.current = true;
      isInitialized.current = true;
    }
  }, [initialProducts.length]);

  const loadMore = useCallback(async () => {
    if (loading || !hasNextPage || !isInitialized.current) return;

    setLoading(true);
    if (abortController.current) abortController.current.abort();
    abortController.current = new AbortController();

    try {
      const queryParams = {
        after: endCursor,
        first: 30,
        sortKey: sortMap[sortRef.current],
        reverse: sortReverseMap[sortRef.current],
        availability: filtersRef.current.availability || null,
        priceMin: filtersRef.current.priceMin ?? undefined,
        priceMax: filtersRef.current.priceMax ?? undefined,
        signal: abortController.current.signal,
      };
      if (collectionId) queryParams.collectionId = collectionId;

      const {
        products: newProducts,
        hasNextPage: next,
        endCursor: cursor,
      } = await fetchAllProducts(queryParams);

      setProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p.node.id));
        const deduped = newProducts.filter((p) => !existingIds.has(p.node.id));
        return [...prev, ...deduped];
      });

      setHasNextPage(next);
      setEndCursor(cursor);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Infinite scroll fetch failed:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, hasNextPage, endCursor, collectionId]);

  const resetAndFetch = useCallback(async (newFilters = filtersRef.current, newSort = sortRef.current) => {
    if (!isInitialized.current) {
      setFilters(newFilters);
      setSort(newSort);
      isInitialized.current = true;
      return;
    }

    if (abortController.current) abortController.current.abort();
    setRefetching(true);
    setFilters(newFilters);
    setSort(newSort);
    setHasNextPage(true);

    try {
      const queryParams = {
        first: 30,
        sortKey: sortMap[newSort],
        reverse: sortReverseMap[newSort],
        availability: newFilters?.availability || null,
        priceMin: newFilters?.priceMin ?? undefined,
        priceMax: newFilters?.priceMax ?? undefined,
      };
      if (collectionId) queryParams.collectionId = collectionId;

      console.log('🔍 Fetching with params:', queryParams); // Debug log

      const {
        products: fresh,
        hasNextPage,
        endCursor,
      } = await fetchAllProducts(queryParams);
      
      console.log('✅ Received products:', fresh.length); // Debug log
      
      setProducts(fresh);
      setHasNextPage(hasNextPage);
      setEndCursor(endCursor);
    } catch (err) {
      console.error("Error refetching products:", err);
    } finally {
      setRefetching(false);
    }
  }, [collectionId]);

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