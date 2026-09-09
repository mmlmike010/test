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
        compact ? "w-48" : "w-56"
      } shrink-0 bg-white border-r border-gray-200 h-[calc(100vh-132px)] overflow-y-auto sticky top-[132px]`}
    >
      <div className="p-3">
        <div className="flex items-center justify-between mb-3 px-2">
          <h2 className="text-base font-bold text-gray-900">Departments</h2>
          {selected && (
            <button
              type="button"
              className="text-[11px] text-[#0060A9] font-medium"
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
          <ul className="space-y-0.5">
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
                    className={`w-full text-left block px-2 py-1.5 text-[13px] rounded truncate transition-colors ${
                      active
                        ? "bg-[#0060A9] text-white font-semibold"
                        : "text-gray-700 hover:bg-blue-50 hover:text-[#0060A9]"
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
