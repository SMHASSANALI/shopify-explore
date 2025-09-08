"use client";

import React, { useMemo } from "react";

function Star({ fill = 0, size = 16 }) {
  const clamped = Math.max(0, Math.min(1, fill));
  return (
    <span className="inline-block relative" style={{ width: size, height: size }} aria-hidden>
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0"
      >
        <path
          d="M10 1.75l2.472 5.144 5.676.825-4.074 3.972.962 5.607L10 14.95l-5.036 2.348.962-5.607L1.852 7.72l5.676-.825L10 1.75z"
          fill="#E5E7EB"
        />
      </svg>
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${clamped * 100}%` }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0"
        >
          <path
            d="M10 1.75l2.472 5.144 5.676.825-4.074 3.972.962 5.607L10 14.95l-5.036 2.348.962-5.607L1.852 7.72l5.676-.825L10 1.75z"
            fill="#F59E0B"
          />
        </svg>
      </div>
    </span>
  );
}

export default function StarRating({
  ratingValue, // number between scale_min and scale_max
  scaleMin = 1,
  scaleMax = 5,
  size = 16,
  showText = false,
  ratingCount,
  className = "",
}) {
  const normalized = useMemo(() => {
    const min = Number(scaleMin) || 0;
    const max = Number(scaleMax) || 5;
    const raw = Number(ratingValue) || 0;
    const clamped = Math.min(Math.max(raw, min), max);
    return (clamped - min) / (max - min) * 5;
  }, [ratingValue, scaleMin, scaleMax]);

  const full = Math.floor(normalized);
  const frac = normalized - full;

  return (
    <div className={`flex items-center gap-2 ${className}`} aria-label={`Rating ${ratingValue} out of ${scaleMax}`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={size} fill={i < full ? 1 : i === full ? frac : 0} />
        ))}
      </div>
      {showText && (
        <span className="text-sm text-gray-600">
          {Number(ratingValue).toFixed(2)}{typeof ratingCount === "number" ? ` (${ratingCount})` : "0"}
        </span>
      )}
    </div>
  );
}


