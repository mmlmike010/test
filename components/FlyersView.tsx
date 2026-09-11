"use client";

import { useState } from "react";
import { ChevronLeft, X } from "lucide-react";
import { filterProducts } from "@/lib/data/products";
import { useCatalogStore } from "@/lib/store/catalog";
import { storefrontOverlayClass, useSessionStore } from "@/lib/store/session";
import ProductCard from "@/components/ProductCard";

const pages = [
  {
    src: "/products/flyer-page-1.jpg?v=4",
    label: "Page 1 · Coupon book",
  },
  {
    src: "/products/flyer-page-2.jpg?v=4",
    label: "Page 2 · Flyer deals",
  },
] as const;

export default function FlyersView() {
  const clearFilters = useCatalogStore((s) => s.clearFilters);
  const search = useCatalogStore((s) => s.search);
  const kirkOpen = useSessionStore((s) => s.kirkOpen);
  const inspect = useCatalogStore((s) => s.inspect);
  const [page, setPage] = useState<(typeof pages)[number] | null>(null);
  const deals = filterProducts({ tag: "weekly" });

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          clearFilters();
          void search();
          document.querySelector("main")?.scrollTo({ top: 0 });
        }}
        className="mb-3 inline-flex items-center gap-0.5 text-[13px] font-bold text-costco-blue hover:underline"
      >
        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        Shop
      </button>

      <div className="mb-4">
        <h1 className="text-[22px] lg:text-[24px] font-bold text-[#1a1a1a] tracking-tight">
          Weekly Ad
        </h1>
        <p className="text-[13px] text-[#666] mt-0.5">
          Valid 8/24/26 – 9/21/26 · Costco · 11217 Brooklyn
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide mb-6">
        {pages.map((item) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setPage(item)}
            className="shrink-0 w-[168px] sm:w-[200px] text-left group"
          >
            <span className="relative block aspect-[850/1100] rounded-[8px] overflow-hidden bg-white border border-[#e0e0e0] shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt=""
                className="absolute inset-0 w-full h-full object-cover group-hover:opacity-95"
              />
            </span>
            <span className="mt-1.5 block text-[12px] font-bold text-[#333]">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-[18px] lg:text-[20px] font-bold text-[#1a1a1a] tracking-tight">
            Flyer deals Aug 24–Sep 21
          </h2>
          <p className="text-[13px] text-[#666] mt-0.5">
            {deals.length} item{deals.length === 1 ? "" : "s"} · Same-Day · 11217
            Brooklyn
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
        {deals.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onOpen={() => inspect(product)}
          />
        ))}
      </div>

      {page && (
        <div
          className={`fixed z-[70] flex items-center justify-center bg-black/70 p-4 ${storefrontOverlayClass(kirkOpen)}`}
        >
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Close flyer page"
            onClick={() => setPage(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={page.label}
            className="relative max-h-[92vh] max-w-[min(720px,96vw)]"
          >
            <button
              type="button"
              onClick={() => setPage(null)}
              className="absolute -top-11 right-0 inline-flex items-center gap-1 bg-white text-[#1a1a1a] px-3 py-1.5 text-[13px] font-bold rounded-full"
            >
              <X className="w-4 h-4" />
              Close
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={page.src}
              alt={page.label}
              className="max-h-[92vh] w-auto max-w-full shadow-2xl bg-white"
            />
          </div>
        </div>
      )}

    </div>
  );
}
