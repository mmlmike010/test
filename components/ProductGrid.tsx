"use client";

import { useEffect, useState } from "react";
import { categories, filterProducts } from "@/lib/data/products";
import type { Product } from "@/lib/data/products";
import { useCatalogStore } from "@/lib/store/catalog";
import ProductCard from "@/components/ProductCard";
import ProductDetailModal from "@/components/ProductDetailModal";

type Aisle = {
  title: string;
  items: Product[];
  onShowAll: () => void;
};

function AisleRow({
  title,
  items,
  onShowAll,
  onOpen,
}: {
  title: string;
  items: Product[];
  onShowAll: () => void;
  onOpen: (product: Product) => void;
}) {
  if (items.length < 2) return null;

  return (
    <section className="mb-5">
      <div className="mb-2 flex items-end justify-between gap-3 px-0.5">
        <h2 className="text-[20px] lg:text-[22px] font-bold text-[#1a1a1a] tracking-tight">
          {title}
        </h2>
        <button
          type="button"
          className="text-[14px] text-costco-blue font-bold hover:underline shrink-0"
          onClick={onShowAll}
        >
          Show all
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
        {items.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            compact
            onOpen={() => onOpen(product)}
          />
        ))}
      </div>
    </section>
  );
}

export default function ProductGrid() {
  const loading = useCatalogStore((s) => s.loading);
  const error = useCatalogStore((s) => s.error);
  const q = useCatalogStore((s) => s.q);
  const department = useCatalogStore((s) => s.department);
  const tag = useCatalogStore((s) => s.tag);
  const search = useCatalogStore((s) => s.search);
  const setDepartment = useCatalogStore((s) => s.setDepartment);
  const setTag = useCatalogStore((s) => s.setTag);
  const setQuery = useCatalogStore((s) => s.setQuery);
  const clearFilters = useCatalogStore((s) => s.clearFilters);
  const [selected, setSelected] = useState<Product | null>(null);

  useEffect(() => {
    void search();
  }, [search]);

  const filteredView = Boolean(department || tag || q.trim());
  const filtered = filterProducts({
    q,
    department: department || undefined,
    tag: tag || undefined,
  });
  const tagLabel = tag
    ? categories.find((c) => c.id === tag)?.name || tag
    : null;
  const titleBits = [
    department,
    tagLabel,
    q.trim() ? `“${q.trim()}”` : null,
  ].filter(Boolean);

  const showAisle = (next: { department?: string; tag?: string }) => {
    setQuery("");
    if (next.tag) setTag(next.tag);
    else if (next.department) setDepartment(next.department);
    void search();
  };

  const aisles: Aisle[] = [
    {
      title: "Weekly Savings",
      items: filtered.filter(
        (p) => p.department === "Weekly Savings" || p.tags?.includes("weekly")
      ),
      onShowAll: () => showAisle({ tag: "weekly" }),
    },
    {
      title: "Kirkland Signature",
      items: filtered.filter(
        (p) =>
          p.brand === "Kirkland Signature" ||
          p.department === "Kirkland Signature" ||
          p.tags?.includes("kirkland")
      ),
      onShowAll: () => showAisle({ tag: "kirkland" }),
    },
    {
      title: "What's New",
      items: filtered.filter(
        (p) => p.department === "What's New" || p.tags?.includes("new")
      ),
      onShowAll: () => showAisle({ tag: "new" }),
    },
    {
      title: "Trending",
      items: filtered.filter(
        (p) => p.department === "Trending" || p.tags?.includes("trending")
      ),
      onShowAll: () => showAisle({ tag: "trending" }),
    },
    {
      title: "Treasure Hunt",
      items: filtered.filter((p) => p.tags?.includes("treasure")),
      onShowAll: () => showAisle({ tag: "treasure" }),
    },
    {
      title: "Bakery & Desserts",
      items: filtered.filter((p) => p.department === "Bakery & Desserts"),
      onShowAll: () => showAisle({ department: "Bakery & Desserts" }),
    },
  ];

  return (
    <div className="bg-[#f6f7f8] p-4 lg:px-5 lg:py-4">
      {error && (
        <div className="mb-4 border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
          {error}
        </div>
      )}

      {!filteredView && (
        <>
          <section className="mb-5 grid grid-cols-2 xl:grid-cols-4 gap-3">
            {[
              {
                title: "Weekly Savings",
                image: "/products/hero-weekly.jpg?v=2",
                onClick: () => showAisle({ tag: "weekly" }),
              },
              {
                title: "Kirkland Signature",
                image: "/products/hero-kirkland.jpg?v=2",
                onClick: () => showAisle({ tag: "kirkland" }),
              },
              {
                title: "What's New",
                image: "/products/hero-new.jpg?v=2",
                onClick: () => showAisle({ tag: "new" }),
              },
              {
                title: "Treasure Hunt",
                image: "/products/hero-treasure.jpg?v=2",
                onClick: () => showAisle({ tag: "treasure" }),
              },
            ].map((tile) => (
              <button
                key={tile.title}
                type="button"
                onClick={tile.onClick}
                className="relative h-[168px] sm:h-[200px] rounded-[16px] overflow-hidden text-left group bg-[#f3f3f3]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tile.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-300"
                />
                <span className="absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute bottom-3 left-3 right-3 text-[18px] sm:text-[21px] font-bold text-white leading-tight drop-shadow">
                  {tile.title}
                </span>
              </button>
            ))}
          </section>

          {aisles.map((aisle) => (
            <AisleRow
              key={aisle.title}
              title={aisle.title}
              items={aisle.items}
              onShowAll={aisle.onShowAll}
              onOpen={setSelected}
            />
          ))}
        </>
      )}

      {filteredView && (
        <>
          <div className="mb-3 flex items-end justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-[22px] lg:text-[24px] font-bold text-[#1a1a1a] tracking-tight">
                {titleBits.join(" · ")}
              </h2>
              <p className="text-[13px] text-[#666] mt-0.5">
                {`${filtered.length} item${filtered.length === 1 ? "" : "s"}`}
                {loading ? " · Updating…" : ""}
              </p>
            </div>
            <button
              type="button"
              className="text-sm text-costco-blue font-bold hover:underline"
              onClick={() => {
                clearFilters();
                void search();
              }}
            >
              Clear filters
            </button>
          </div>

          {!loading && filtered.length === 0 ? (
            <div className="bg-white border border-dashed border-[#ccc] p-10 text-center">
              <p className="text-[#1a1a1a] font-bold mb-1">No products found</p>
              <p className="text-sm text-[#666] mb-4">
                Try another department or a broader search.
              </p>
              <button
                type="button"
                className="px-5 py-2 bg-costco-blue text-white text-sm font-bold rounded-[3px]"
                onClick={() => {
                  clearFilters();
                  void search();
                }}
              >
                Show all
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpen={() => setSelected(product)}
                />
              ))}
            </div>
          )}
        </>
      )}

      <footer className="mt-8 pt-4 border-t border-[#e0e0e0] text-[11px] text-[#777] flex flex-wrap items-center justify-between gap-2">
        <p>
          Same-Day Delivery powered by Instacart · Costco membership required
        </p>
        <p>Prices, fees, and availability for 11217 Brooklyn</p>
      </footer>

      {selected && (
        <ProductDetailModal
          product={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
