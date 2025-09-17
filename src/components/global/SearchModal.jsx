"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

export default function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({
    products: [],
    collections: [],
    articles: [],
  });

  // Close on escape
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Debounced search
  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    const id = setTimeout(async () => {
      const q = query.trim();
      if (!q) {
        setResults({ products: [], collections: [], articles: [] });
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        const json = await res.json();
        setResults(json);
      } catch (_) {}
      setLoading(false);
    }, 250);
    return () => {
      clearTimeout(id);
      controller.abort();
    };
  }, [query, open]);

  const Section = useCallback(
    ({ title, items }) =>
      items?.length ? (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">{title}</h3>
          <ul className="divide-y divide-gray-200">
            {items.map((item) => (
              <li key={item.id} className="py-2">
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded"
                >
                  {item.image?.src && (
                    <div className="relative w-12 h-12 shrink-0 rounded overflow-hidden bg-gray-100">
                      <Image
                        src={item.image.src}
                        alt={item.image.altText || item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.title}
                    </p>
                    {item.excerpt && (
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {item.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null,
    [onClose]
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-start justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-10/12 max-w-2xl bg-white rounded-lg shadow-xl mt-20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b p-1 md:p-3">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, collections, articles..."
            className="w-full p-2 outline-none"
          />
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {loading ? (
            <p className="text-sm text-gray-500">Searching…</p>
          ) : (
            <>
              <Section title="Products" items={results.products} />
              <Section title="Collections" items={results.collections} />
              <Section title="Articles" items={results.articles} />
              {!results.products.length &&
                !results.collections.length &&
                !results.articles.length && (
                  <p className="text-sm text-gray-500">
                    Try searching for something else.
                  </p>
                )}
            </>
          )}
        </div>
        <div className="border-t p-3 text-right">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
