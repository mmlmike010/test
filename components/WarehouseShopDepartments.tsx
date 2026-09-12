"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { WAREHOUSE_NAV_TILES } from "@/lib/ui/warehouseSearch";

/** costco.com Shop by Department row — image-forward tiles, no gold foil. */
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
      left: dir * 128,
      behavior: "smooth",
    });
  };

  return (
    <section className="overflow-hidden bg-white">
      <div className="flex items-center justify-between gap-2 px-1 pb-1">
        <h2 className="min-w-0 truncate text-[15px] font-bold text-[#1a1a1a]">
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
        <div className="flex w-max gap-3 px-1 pb-1 pt-1">
          {WAREHOUSE_NAV_TILES.map((tile) => {
            const active = selected.includes(tile.label);
            return (
              <button
                key={tile.label}
                type="button"
                onClick={() => onPick(active ? null : tile.label)}
                className="w-[112px] shrink-0 bg-white text-center"
              >
                <span
                  className={`relative mx-auto flex h-[104px] w-full items-center justify-center overflow-hidden bg-[#f6f6f6] ${
                    active
                      ? "ring-2 ring-costco-blue ring-offset-1"
                      : "hover:ring-1 hover:ring-costco-blue"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tile.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-contain p-2"
                  />
                </span>
                <span
                  className={`mt-1.5 block text-[12px] font-bold leading-tight text-costco-blue ${
                    active ? "underline" : "hover:underline"
                  }`}
                >
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
