"use client";

import { categories } from "@/lib/data/products";
import { useCatalogStore } from "@/lib/store/catalog";

export default function CategoryScroller() {
  const tag = useCatalogStore((s) => s.tag);
  const setTag = useCatalogStore((s) => s.setTag);
  const setQuery = useCatalogStore((s) => s.setQuery);
  const search = useCatalogStore((s) => s.search);

  return (
    <div className="bg-white border-b border-gray-200 py-4">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4">
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
              className={`flex flex-col items-center gap-2 min-w-[100px] transition-opacity ${
                active ? "opacity-100" : "hover:opacity-80"
              }`}
            >
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-sm border ${
                  active
                    ? "bg-[#0060A9] text-white border-[#0060A9]"
                    : "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
                }`}
              >
                {category.icon}
              </div>
              <span
                className={`text-xs font-medium text-center ${
                  active ? "text-[#0060A9] font-semibold" : "text-gray-700"
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
