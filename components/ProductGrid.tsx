"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { categories, filterProducts } from "@/lib/data/products";
import type { Product } from "@/lib/data/products";
import { useCatalogStore } from "@/lib/store/catalog";
import ProductCard from "@/components/ProductCard";
import ProductDetailModal from "@/components/ProductDetailModal";
import CategoryScroller from "@/components/CategoryScroller";
import InstacartMark from "@/components/InstacartMark";

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
          className="inline-flex items-center gap-0.5 text-[14px] text-costco-blue font-bold hover:underline shrink-0"
          onClick={onShowAll}
        >
          Show all
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
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
  const [sort, setSort] = useState<"relevance" | "price">("relevance");

  useEffect(() => {
    void search();
  }, [search]);

  const filteredView = Boolean(department || tag || q.trim());
  const filtered = filterProducts({
    q,
    department: department || undefined,
    tag: tag || undefined,
  });
  const liveCollectionName: Record<string, string> = {
    weekly: "Member Only Savings",
    trending: "This week's featured items",
    treasure: "Discounts on household favorites",
    kirkland: "Kirkland Signature",
    new: "What's New",
    again: "Buy it again",
  };
  const tagLabel = tag
    ? liveCollectionName[tag] ||
      categories.find((c) => c.id === tag)?.name ||
      tag
    : null;
  const titleBits = [
    department,
    tagLabel,
    q.trim() ? `“${q.trim()}”` : null,
  ].filter(Boolean);

  const shown = useMemo(() => {
    if (sort === "price") {
      return [...filtered].sort((a, b) => a.price - b.price);
    }
    return filtered;
  }, [filtered, sort]);

  const showAisle = (next: { department?: string; tag?: string }) => {
    setQuery("");
    if (next.tag) setTag(next.tag);
    else if (next.department) setDepartment(next.department);
    void search();
  };

  const aisles: Aisle[] = [
    {
      title: "Buy it again",
      items: filtered.filter((p) => p.tags?.includes("again")),
      onShowAll: () => showAisle({ tag: "again" }),
    },
    {
      title: "Member Only Savings",
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
      title: "This week's featured items",
      items: filtered.filter(
        (p) => p.department === "Trending" || p.tags?.includes("trending")
      ),
      onShowAll: () => showAisle({ tag: "trending" }),
    },
    {
      title: "Discounts on household favorites",
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
          <section className="mb-5 grid grid-cols-2 gap-3">
            {(
              [
                {
                  title: "Member Only Savings",
                  subtitle: "7/27/26 – 8/23/26",
                  badge: "Sale ends in 14 days",
                  image: "/products/hero-weekly.jpg?v=13",
                  onClick: () => showAisle({ tag: "weekly" }),
                },
                {
                  title: "Kirkland Signature",
                  image: "/products/hero-kirkland.jpg?v=13",
                  onClick: () => showAisle({ tag: "kirkland" }),
                },
                {
                  title: "This week's featured items",
                  image: "/products/hero-new.jpg?v=13",
                  onClick: () => showAisle({ tag: "trending" }),
                },
                {
                  title: "Discounts on household favorites",
                  image: "/products/hero-treasure.jpg?v=13",
                  onClick: () => showAisle({ tag: "treasure" }),
                },
              ] as const
            ).map((tile) => (
              <button
                key={tile.title}
                type="button"
                onClick={tile.onClick}
                className="relative h-[220px] sm:h-[260px] lg:h-[280px] rounded-[16px] overflow-hidden text-left group bg-[#f3f3f3]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tile.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-black/62 via-black/20 to-transparent" />
                {"badge" in tile && tile.badge && (
                  <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-white px-2 py-1 text-[11px] font-bold text-costco-red shadow-[0_1px_3px_rgba(0,0,0,0.12)]">
                    {tile.badge}
                  </span>
                )}
                <span className="absolute bottom-3.5 left-3.5 right-3.5">
                  <span className="block text-[20px] sm:text-[24px] font-bold text-white leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]">
                    {tile.title}
                  </span>
                  {"subtitle" in tile && tile.subtitle && (
                    <span className="mt-0.5 block text-[12px] font-semibold text-white/90">
                      {tile.subtitle}
                    </span>
                  )}
                  <span className="mt-1 inline-flex items-center gap-0.5 text-[13px] font-bold text-white">
                    Shop
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </span>
                </span>
              </button>
            ))}
          </section>

          <div className="-mx-4 lg:-mx-5 mb-5">
            <CategoryScroller />
          </div>

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
          <div className="-mx-4 lg:-mx-5 mb-4">
            <CategoryScroller />
          </div>
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
            <div className="flex items-center gap-2 flex-wrap">
              <div
                className="inline-flex items-center rounded-full border border-[#d8d8d8] bg-white p-0.5"
                role="group"
                aria-label="Sort items"
              >
                {(
                  [
                    ["relevance", "Relevance"],
                    ["price", "Price"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={sort === value}
                    onClick={() => setSort(value)}
                    className={`px-3 py-1.5 text-[12px] font-bold rounded-full ${
                      sort === value
                        ? "bg-[#e8f2fa] text-costco-blue"
                        : "text-[#555] hover:bg-[#f6f6f6]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
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
              {shown.map((product) => (
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

      <footer className="mt-8 pt-5 border-t border-[#e0e0e0] text-[12px] text-[#666]">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-2">
          <a href="#" className="text-costco-blue font-semibold hover:underline">
            Pricing & fees
          </a>
          <a href="#" className="text-costco-blue font-semibold hover:underline">
            Departments
          </a>
          <a href="#" className="text-costco-blue font-semibold hover:underline">
            Flyers
          </a>
          <a href="#" className="text-costco-blue font-semibold hover:underline">
            Lists
          </a>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#777]">
          <p className="inline-flex items-center gap-1.5">
            <InstacartMark size={12} />
            Same-Day Delivery powered by Instacart · Costco membership required
          </p>
          <p>Prices, fees, and availability for 11217 Brooklyn</p>
        </div>
      </footer>

      {selected && (
        <ProductDetailModal
          key={selected.id}
          product={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
