"use client";

import { useState, useEffect } from "react";

export default function FilterPanel({ onFilterChange }) {
  const [inStock, setInStock] = useState(false);
  const [outOfStock, setOutOfStock] = useState(false);
  const [priceFrom, setPriceFrom] = useState(0);
  const [priceTo, setPriceTo] = useState(100);

  useEffect(() => {
    onFilterChange({
      availability: { inStock, outOfStock },
      price: { min: priceFrom, max: priceTo },
    });
  }, [inStock, outOfStock, priceFrom, priceTo, onFilterChange]);

  return (
    <div className="flex flex-col gap-[10px]">
      <p className="pb-2 border-b">Availability</p>
      <div className="flex flex-row justify-start gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="accent-[var(--accent)]" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
          In Stock
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" className="accent-[var(--accent)]" checked={outOfStock} onChange={(e) => setOutOfStock(e.target.checked)} />
          Out of Stock
        </label>
      </div>
      <p className="pb-2 border-b">Price</p>
      <div className="flex flex-row justify-start gap-4">
        <div className="flex items-center gap-2">
          <span>From:</span>
          <input
            type="number"
            className="w-full p-1 border border-[var(--primary-light)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            placeholder="0"
            value={priceFrom}
            onChange={(e) => setPriceFrom(Number(e.target.value))}
          />
        </div>
        <div className="flex items-center gap-2">
          <span>To:</span>
          <input
            type="number"
            className="w-full p-1 border border-[var(--primary-light)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            placeholder="0"
            value={priceTo}
            onChange={(e) => setPriceTo(Number(e.target.value))}
          />
        </div>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        step="1"
        value={priceTo}
        onChange={(e) => setPriceTo(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}