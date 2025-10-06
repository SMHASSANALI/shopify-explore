"use client";

export default function SortingSelect({ value, onChange }) {
  return (
    <select
      className="ml-2 p-1 border border-[var(--primary-light)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--accent)] bg-white cursor-pointer"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="best-selling">Best Selling</option>
      <option value="title-ascending">Title, A-Z</option>
      <option value="title-descending">Title, Z-A</option>
      <option value="price-ascending">Price, low to high</option>
      <option value="price-descending">Price, high to low</option>
      <option value="created-ascending">Date, old to new</option>
      <option value="created-descending">Date, new to old</option>
    </select>
  );
}