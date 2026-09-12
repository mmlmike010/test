"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/data/products";
import WarehouseResultCard from "@/components/WarehouseResultCard";

/** costco.com homepage aisle scroller. UI only. */
export default function WarehouseAisleScroller({
  products,
}: {
  products: Product[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const nudge = (dir: number) => {
    scrollerRef.current?.scrollBy({
      left: dir * 160,
      behavior: "smooth",
    });
  };

  if (!products.length) return null;

  return (
    <div className="relative">
      {products.length > 2 ? (
        <>
          <button
            type="button"
            aria-label="Previous items"
            onClick={() => nudge(-1)}
            className="absolute left-1 top-[42%] z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#e8e8e8] bg-white text-[#1a1a1a] shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:bg-[#f6f6f6]"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next items"
            onClick={() => nudge(1)}
            className="absolute right-1 top-[42%] z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#e8e8e8] bg-white text-[#1a1a1a] shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:bg-[#f6f6f6]"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </>
      ) : null}
      <div ref={scrollerRef} className="overflow-x-auto scrollbar-hide">
        <div className="flex w-max gap-2 px-2 pb-2 pt-2">
          {products.map((product) => (
            <div key={`aisle-${product.id}`} className="w-[148px] shrink-0">
              <WarehouseResultCard product={product} density="featured" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
