"use client";

import { Star } from "lucide-react";

/** Costco-like compact star row */
export default function StarRating({
  rating,
  reviewCount,
  size = "sm",
  showCount = true,
}: {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
  showCount?: boolean;
}) {
  const star = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const text = size === "sm" ? "text-[11px]" : "text-sm";
  const full = Math.floor(rating);
  const partial = rating - full >= 0.3;

  return (
    <div className={`flex items-center gap-1 ${text} text-gray-700`}>
      <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < full || (i === full && partial);
          return (
            <Star
              key={i}
              className={`${star} ${
                filled
                  ? "fill-[#F6C344] text-[#E5A800]"
                  : "fill-none text-gray-300"
              }`}
            />
          );
        })}
      </div>
      <span className="font-semibold text-gray-800 tabular-nums">
        {rating.toFixed(1)}
      </span>
      {showCount && typeof reviewCount === "number" && (
        <span className="text-gray-500">({reviewCount.toLocaleString()})</span>
      )}
    </div>
  );
}
