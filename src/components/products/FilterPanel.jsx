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

  const handleDebouncedChange = useCallback(
    (newFilters) => {
      const filtersStr = JSON.stringify(newFilters);
      if (filtersStr === JSON.stringify(prevFiltersRef.current)) {
        return;
      }
      prevFiltersRef.current = newFilters;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        onFilterChange(newFilters);
      }, 500);
    },
    [onFilterChange]
  );

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    let availability = null;
    if (inStock && !outOfStock) availability = "inStock";
    else if (outOfStock && !inStock) availability = "outOfStock";

    const minPrice = priceFrom === "" ? undefined : Number(priceFrom);
    const maxPrice = priceTo === "" ? undefined : Number(priceTo);

    // Build filters object
    const nextFilters = {
      ...(availability !== null && { availability }),
      ...(minPrice >= 0 && { priceMin: minPrice }),
      ...(maxPrice >= 0 && maxPrice <= 1000 && { priceMax: maxPrice }),
    };

    const hasActiveFilters = Object.keys(nextFilters).length > 0;

    if (hasActiveFilters) {
      handleDebouncedChange(nextFilters);
    } else {
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
              min="1"
              className="w-[60px] p-1 border border-[var(--primary-light)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              placeholder="1"
              value={priceFrom}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || (!isNaN(value) && Number(value) >= 0)) {
                  setPriceFrom(value);
                }
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="!text-sm !font-light !text-nowrap">To:</span>
            <input
              type="number"
              min="0"
              max="1000"
              className="w-[60px] p-1 border border-[var(--primary-light)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              placeholder="1000"
              value={priceTo}
              onChange={(e) => {
                const value = e.target.value;
                if (
                  value === "" ||
                  (!isNaN(value) && Number(value) >= 0 && Number(value) <= 1000)
                ) {
                  setPriceTo(value);
                }
              }}
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
