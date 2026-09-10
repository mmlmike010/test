"use client";

import { useCatalogStore } from "@/lib/store/catalog";

export default function PromoBanner() {
  const setQuery = useCatalogStore((s) => s.setQuery);
  const setTag = useCatalogStore((s) => s.setTag);
  const search = useCatalogStore((s) => s.search);

  return (
    <div className="bg-[#eef5fb] border-b border-[#d4e3f0] text-[#1a1a1a] shrink-0">
      <div className="max-w-[1800px] mx-auto px-3 sm:px-4 h-[40px] flex items-center justify-between gap-4 text-[13px]">
        <button
          type="button"
          className="font-bold tracking-tight truncate text-costco-blue text-left hover:underline"
          onClick={() => {
            setQuery("");
            setTag("flyers");
            void search();
            document.querySelector("main")?.scrollTo({ top: 0 });
          }}
        >
          Member Only Savings · 8/24/26 – 9/21/26 · Sale ends in 10 days
        </button>
        <p className="hidden sm:block text-[#555] shrink-0">
          <span className="font-bold text-[#1a1a1a]">$10 monthly credit</span>
          <span>
            {" "}
            · For Executive members ($150 min spend) · Same-Day requires a
            Costco membership
          </span>
        </p>
      </div>
    </div>
  );
}
