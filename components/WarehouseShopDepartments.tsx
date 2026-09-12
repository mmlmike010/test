"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { WAREHOUSE_NAV_TILES } from "@/lib/ui/warehouseSearch";

/** costco.com Shop by Department aisle. Horizontal so idle Kirk keeps merch above the fold. */
export default function WarehouseShopDepartments({
  selected,
  onPick,
}: {
  selected: string[];
  onPick: (label: string | null) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const nudge = (dir: number) => {
    scrollerRef.current?.scrollBy({
      left: dir * 148,
      behavior: "smooth",
    });
  };

  return (
    <section className="overflow-hidden rounded-[3px] border border-[#c4c4c4] bg-white">
      <div className="h-[3px] bg-gradient-to-r from-[#8c7318] via-[#f3e3a3] to-[#8c7318]" />
      <div className="flex items-center justify-between gap-2 border-b border-[#ececec] px-3 py-1.5">
        <h2 className="min-w-0 truncate text-[13px] font-bold text-[#1a1a1a]">
          Shop by Department
        </h2>
        <div className="flex shrink-0 items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              aria-label="Previous departments"
              onClick={() => nudge(-1)}
              className="flex h-7 w-7 items-center justify-center rounded-[3px] border border-[#c4c4c4] bg-white text-[#1a1a1a] hover:border-costco-blue hover:bg-[#f7fbfe]"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next departments"
              onClick={() => nudge(1)}
              className="flex h-7 w-7 items-center justify-center rounded-[3px] border border-[#c4c4c4] bg-white text-[#1a1a1a] hover:border-costco-blue hover:bg-[#f7fbfe]"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-0.5 text-[12px] font-bold text-costco-blue hover:underline"
            onClick={() => onPick(null)}
          >
            Shop All
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div ref={scrollerRef} className="overflow-x-auto scrollbar-hide">
        <div className="flex w-max gap-2 px-2 pb-2 pt-2">
          {WAREHOUSE_NAV_TILES.map((tile) => {
            const active = selected.includes(tile.label);
            return (
              <button
                key={tile.label}
                type="button"
                onClick={() => onPick(active ? null : tile.label)}
                className={`w-[132px] shrink-0 rounded-[3px] border bg-white text-center ${
                  active
                    ? "border-costco-blue ring-1 ring-costco-blue"
                    : "border-[#e8e8e8] hover:border-costco-blue hover:bg-[#f7fbfe]"
                }`}
              >
                <span className="relative mx-auto mt-1.5 flex h-[88px] w-[88px] items-center justify-center overflow-hidden rounded-[3px] border border-[#e8e8e8] bg-[#f6f6f6]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tile.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-contain p-1.5"
                  />
                </span>
                <span className="block min-h-[34px] px-1.5 py-1 text-[12px] font-bold leading-tight text-costco-blue">
                  {tile.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
