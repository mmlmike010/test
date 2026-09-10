"use client";

import { ChevronRight } from "lucide-react";
import { departments } from "@/lib/data/products";
import { useCatalogStore } from "@/lib/store/catalog";
import { aisleLabel } from "@/lib/ui/aisleLabels";

const aisleThumbs: Record<string, string> = {
  "What's New": "/products/cat-new.jpg?v=2",
  "Weekly Savings": "/products/cat-weekly.jpg?v=2",
  Trending: "/products/cat-trending.jpg?v=2",
  "Kirkland Signature": "/products/cat-kirkland.jpg?v=2",
  "Auto Accessories": "/products/13.png",
  Babies: "/products/14.png",
  "Bakery & Desserts": "/products/15.png?v=2",
  "Beer, Wine & Spirits": "/products/16.png",
  Books: "/products/17.png",
  "Cameras & Camcorders": "/products/18.png",
  Cleaning: "/products/19.png",
  "Clothing & Shoes": "/products/20.png",
  Coffee: "/products/21.png",
  Computers: "/products/22.png",
  "Dairy & Eggs": "/products/23.png",
  "Prepared Foods": "/products/24.png",
};

export function MobileAisles() {
  const selected = useCatalogStore((s) => s.department);
  const tag = useCatalogStore((s) => s.tag);
  const setDepartment = useCatalogStore((s) => s.setDepartment);
  const setTag = useCatalogStore((s) => s.setTag);
  const setQuery = useCatalogStore((s) => s.setQuery);
  const search = useCatalogStore((s) => s.search);
  const onRecipes = tag === "recipes";
  const onFlyers = tag === "flyers";
  const onLists = tag === "lists";

  return (
    <div className="md:hidden bg-white border-b border-[#ececec] px-3 py-2">
      <p className="text-[12px] font-bold text-[#1a1a1a] mb-1.5 px-0.5">
        Browse aisles
      </p>
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
        <button
          type="button"
          onClick={() => {
            setQuery("");
            if (onFlyers) setTag(null);
            else setTag("flyers");
            void search();
          }}
          className={`shrink-0 px-2.5 py-1 rounded-full text-[12px] border ${
            onFlyers
              ? "bg-[#e8f2fa] border-costco-blue text-costco-blue font-bold"
              : "bg-white border-[#d0d0d0] text-[#333]"
          }`}
        >
          Flyer
        </button>
        <button
          type="button"
          onClick={() => {
            setQuery("");
            if (onLists) setTag(null);
            else setTag("lists");
            void search();
          }}
          className={`shrink-0 px-2.5 py-1 rounded-full text-[12px] border ${
            onLists
              ? "bg-[#e8f2fa] border-costco-blue text-costco-blue font-bold"
              : "bg-white border-[#d0d0d0] text-[#333]"
          }`}
        >
          Lists
        </button>
        <button
          type="button"
          onClick={() => {
            setQuery("");
            if (onRecipes) setTag(null);
            else setTag("recipes");
            void search();
          }}
          className={`shrink-0 px-2.5 py-1 rounded-full text-[12px] border ${
            onRecipes
              ? "bg-[#e8f2fa] border-costco-blue text-costco-blue font-bold"
              : "bg-white border-[#d0d0d0] text-[#333]"
          }`}
        >
          Meals
        </button>
        {departments.map((dept) => {
          const active = selected === dept;
          return (
            <button
              key={dept}
              type="button"
              onClick={() => {
                setDepartment(active ? null : dept);
                setQuery("");
                void search();
              }}
              className={`shrink-0 px-2.5 py-1 rounded-full text-[12px] border ${
                active
                  ? "bg-[#e8f2fa] border-costco-blue text-costco-blue font-bold"
                  : "bg-white border-[#d0d0d0] text-[#333]"
              }`}
            >
              {aisleLabel(dept)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DepartmentsSidebar({
  compact = false,
}: {
  compact?: boolean;
}) {
  const selected = useCatalogStore((s) => s.department);
  const setDepartment = useCatalogStore((s) => s.setDepartment);
  const setQuery = useCatalogStore((s) => s.setQuery);
  const search = useCatalogStore((s) => s.search);

  return (
    <aside
      className={`${
        compact ? "w-[188px]" : "w-[240px]"
      } hidden md:block shrink-0 bg-white border-r border-[#e5e5e5] h-full overflow-y-auto`}
    >
      <div className="py-3 px-2">
        <div className="flex items-center justify-between mb-1 px-2">
          <h2 className="text-[13px] font-bold text-[#1a1a1a]">
            Browse aisles
          </h2>
          {selected && (
            <button
              type="button"
              className="text-[11px] text-costco-blue font-bold hover:underline"
              onClick={() => {
                setDepartment(null);
                void search();
              }}
            >
              Clear
            </button>
          )}
        </div>
        <nav>
          <ul>
            {departments.map((dept) => {
              const active = selected === dept;
              return (
                <li key={dept}>
                  <button
                    type="button"
                    onClick={() => {
                      setDepartment(active ? null : dept);
                      setQuery("");
                      void search();
                    }}
                    className={`w-full text-left px-2 py-2 text-[13px] transition-colors border-l-[3px] flex items-center justify-between gap-1.5 ${
                      active
                        ? "border-costco-blue bg-[#e8f2fa] text-costco-blue font-bold"
                        : "border-transparent text-[#333] hover:bg-[#f6f6f6] hover:text-costco-blue"
                    }`}
                    title={aisleLabel(dept)}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      {!compact && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={aisleThumbs[dept]}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover bg-[#f3f3f3] border border-[#ececec] shrink-0"
                        />
                      )}
                      <span className="leading-snug line-clamp-2">
                        {aisleLabel(dept)}
                      </span>
                    </span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 shrink-0 ${
                        active ? "text-costco-blue" : "text-[#b0b0b0]"
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
