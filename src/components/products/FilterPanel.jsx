"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export default function FilterPanel({ onFilterChange }) {
  const [inStock, setInStock] = useState(false);
  const [outOfStock, setOutOfStock] = useState(false);
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");

  const isInitialMount = useRef(true);
  const timeoutRef = useRef(null);
  const prevFiltersRef = useRef(null);

  const handleDebouncedChange = useCallback((newFilters) => {
    // Skip if same as previous
    const filtersStr = JSON.stringify(newFilters);
    if (filtersStr === JSON.stringify(prevFiltersRef.current)) {
      return;
    }
    prevFiltersRef.current = newFilters;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      console.log('🎯 Applying filters:', newFilters); // Debug
      onFilterChange(newFilters);
    }, 500);
  }, [onFilterChange]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Build availability filter
    let availability = null;
    if (inStock && !outOfStock) availability = "inStock";
    else if (outOfStock && !inStock) availability = "outOfStock";

    // Parse prices (empty string means no filter)
    const minPrice = priceFrom === "" ? undefined : Number(priceFrom);
    const maxPrice = priceTo === "" ? undefined : Number(priceTo);

    const nextFilters = {
      availability,
      priceMin: minPrice,
      priceMax: maxPrice,
    };

    // Check if any filter is actually active
    const hasActiveFilters = 
      nextFilters.availability !== null ||
      (typeof minPrice === 'number' && minPrice > 0) ||
      (typeof maxPrice === 'number' && maxPrice < 1000);

    console.log('📊 Filter state:', {
      availability,
      minPrice,
      maxPrice,
      hasActiveFilters
    }); // Debug

    if (hasActiveFilters) {
      handleDebouncedChange(nextFilters);
    } else {
      // Reset to show all products when no filters are active
      handleDebouncedChange({});
    }
  }, [inStock, outOfStock, priceFrom, priceTo, handleDebouncedChange]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col gap-[30px]">
      <div className="flex flex-col gap-[10px]">
        <p className="pb-2 border-b">Availability</p>
        <div className="flex lg:flex-col flex-row justify-start gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="availability"
              className="accent-[var(--accent)]"
              checked={inStock && !outOfStock}
              onChange={() => {
                setInStock(true);
                setOutOfStock(false);
              }}
            />
            In Stock
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="availability"
              className="accent-[var(--accent)]"
              checked={outOfStock && !inStock}
              onChange={() => {
                setInStock(false);
                setOutOfStock(true);
              }}
            />
            Out of Stock
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="availability"
              className="accent-[var(--accent)]"
              checked={!inStock && !outOfStock}
              onChange={() => {
                setInStock(false);
                setOutOfStock(false);
              }}
            />
            Any
          </label>
        </div>
      </div>
      <div className="flex flex-col gap-[10px]">
        <p className="pb-2 border-b">Price</p>
        <div className="flex flex-row justify-start gap-4">
          <div className="flex items-center gap-2">
            <span className="!text-sm !font-light !text-nowrap">From:</span>
            <input
              type="number"
              min="0"
              className="w-[60px] p-1 border border-[var(--primary-light)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              placeholder="0"
              value={priceFrom}
              onChange={(e) => setPriceFrom(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="!text-sm !font-light !text-nowrap">To:</span>
            <input
              type="number"
              max="1000"
              className="w-[60px] p-1 border border-[var(--primary-light)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              placeholder="1000"
              value={priceTo}
              onChange={(e) => setPriceTo(e.target.value)}
            />
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="1000"
          step="10"
          value={priceTo || 1000}
          onChange={(e) => setPriceTo(e.target.value)}
          className="w-full accent-[var(--accent)]"
        />
      </div>
    </div>
  );
}