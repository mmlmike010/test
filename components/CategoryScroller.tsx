"use client";

import { categories } from "@/lib/data/products";
import { useCatalogStore } from "@/lib/store/catalog";

export default function CategoryScroller() {
  const tag = useCatalogStore((s) => s.tag);
  const setTag = useCatalogStore((s) => s.setTag);
  const setQuery = useCatalogStore((s) => s.setQuery);
  const search = useCatalogStore((s) => s.search);

  return (
    <div className="bg-white border-b border-costco-border py-4">
      <div className="flex gap-5 overflow-x-auto scrollbar-hide px-5">
        {categories.map((category) => {
          const active = tag === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => {
                setTag(active ? null : category.id);
                setQuery("");
                void search();
              }}
              className="flex flex-col items-center gap-2 min-w-[92px] group"
            >
              <div
                className={`relative w-[84px] h-[84px] rounded-full overflow-hidden bg-[#f3f3f3] ring-2 ring-offset-2 ${
                  active
                    ? "ring-costco-blue"
                    : "ring-transparent group-hover:ring-[#c5d8ea]"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={category.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <span
                className={`text-[12px] text-center leading-tight max-w-[96px] ${
                  active
                    ? "text-costco-blue font-bold"
                    : "text-[#333] font-medium"
                }`}
              >
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
