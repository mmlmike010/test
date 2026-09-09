"use client";

import { departments } from "@/lib/data/products";
import { useCatalogStore } from "@/lib/store/catalog";

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
          <h2 className="text-[13px] font-bold text-[#1a1a1a] tracking-wide uppercase">
            Shop
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
                    className={`w-full text-left block px-2.5 py-[7px] text-[13px] truncate transition-colors border-l-[3px] ${
                      active
                        ? "border-costco-blue bg-[#e8f2fa] text-costco-blue font-bold"
                        : "border-transparent text-[#333] hover:bg-[#f6f6f6] hover:text-costco-blue"
                    }`}
                    title={dept}
                  >
                    {dept}
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
