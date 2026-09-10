"use client";

import { ChevronRight } from "lucide-react";
import { departments } from "@/lib/data/products";
import { useCatalogStore } from "@/lib/store/catalog";

export function MobileAisles() {
  const selected = useCatalogStore((s) => s.department);
  const setDepartment = useCatalogStore((s) => s.setDepartment);
  const setQuery = useCatalogStore((s) => s.setQuery);
  const search = useCatalogStore((s) => s.search);

  return (
    <div className="md:hidden bg-white border-b border-[#ececec] px-3 py-2">
      <p className="text-[12px] font-bold text-[#1a1a1a] mb-1.5 px-0.5">
        Browse aisles
      </p>
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
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
              {dept}
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
        compact ? "w-[184px]" : "w-[220px]"
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
                    className={`w-full text-left px-2.5 py-[7px] text-[13px] transition-colors border-l-[3px] flex items-center justify-between gap-1 ${
                      active
                        ? "border-costco-blue bg-[#e8f2fa] text-costco-blue font-bold"
                        : "border-transparent text-[#333] hover:bg-[#f6f6f6] hover:text-costco-blue"
                    }`}
                    title={dept}
                  >
                    <span className="truncate">{dept}</span>
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
