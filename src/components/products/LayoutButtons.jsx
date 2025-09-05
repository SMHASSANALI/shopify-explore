"use client";

import { useState, useEffect } from "react";
import { TfiLayoutColumn3, TfiLayoutColumn3Alt, TfiLayoutColumn4, TfiLayoutColumn4Alt } from "react-icons/tfi";

export default function LayoutButtons({ onLayoutChange }) {
  const [layout, setLayout] = useState(3); // Default 3 columns

  useEffect(() => {
    onLayoutChange(layout);
  }, [layout, onLayoutChange]);

  return (
    <div className="flex flex-row gap-2">
      <button
        className="p-2 text-[var(--primary-dark)] cursor-pointer"
        onClick={() => setLayout(3)}
      >
        {layout === 3 ? (
          <TfiLayoutColumn3Alt size={20} />
        ) : (
          <TfiLayoutColumn3 size={20} />
        )}
      </button>
      <button
        className="p-2 text-[var(--primary-dark)] cursor-pointer"
        onClick={() => setLayout(4)}
      >
        {layout === 4 ? (
          <TfiLayoutColumn4Alt size={20} />
        ) : (
          <TfiLayoutColumn4 size={20} />
        )}
      </button>
    </div>
  );
}
