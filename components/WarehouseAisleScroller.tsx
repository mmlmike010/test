"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/data/products";
import WarehouseResultCard from "@/components/WarehouseResultCard";

/** costco.com homepage aisle. Chevrons live in the header so they never cover packs. UI only. */
export default function WarehouseAisleScroller({
  title,
  products,
  onShowAll,
}: {
  title: string;
  products: Product[];
  onShowAll: () => void;
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
    <div className="rounded-[3px] border border-[#c4c4c4] bg-white">
      <div className="h-[3px] bg-gradient-to-r from-[#8c7318] via-[#f3e3a3] to-[#8c7318]" />
      <div className="flex items-center justify-between gap-2 border-b border-[#ececec] px-3 py-1.5">
        <p className="min-w-0 truncate text-[13px] font-bold text-[#1a1a1a]">
          {title}
        </p>
        <div className="flex shrink-0 items-center gap-1.5">
          {products.length > 2 ? (
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                aria-label="Previous items"
                onClick={() => nudge(-1)}
                className="flex h-7 w-7 items-center justify-center rounded-[3px] border border-[#c4c4c4] bg-white text-[#1a1a1a] hover:border-costco-blue hover:bg-[#f7fbfe]"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next items"
                onClick={() => nudge(1)}
                className="flex h-7 w-7 items-center justify-center rounded-[3px] border border-[#c4c4c4] bg-white text-[#1a1a1a] hover:border-costco-blue hover:bg-[#f7fbfe]"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ) : null}
          <button
            type="button"
            className="inline-flex items-center gap-0.5 text-[12px] font-bold text-costco-blue hover:underline"
            onClick={onShowAll}
          >
            Show all
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
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
