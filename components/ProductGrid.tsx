"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { categories, filterProducts, products } from "@/lib/data/products";
import { aisleLabel } from "@/lib/ui/aisleLabels";
import {
  hideComposedLeftovers,
  officialPacksFirst,
  relatedSearchItems,
} from "@/lib/ui/merchOrder";
import type { Product } from "@/lib/data/products";
import { useCatalogStore } from "@/lib/store/catalog";
import ProductCard from "@/components/ProductCard";
import WarehouseResultCard from "@/components/WarehouseResultCard";
import ProductDetailModal from "@/components/ProductDetailModal";
import CategoryScroller from "@/components/CategoryScroller";
import InstacartMark from "@/components/InstacartMark";
import CostcoLogo from "@/components/CostcoLogo";
import RecipesView from "@/components/RecipesView";
import FlyersView from "@/components/FlyersView";
import ListsView from "@/components/ListsView";
import { formatAddress, useSessionStore } from "@/lib/store/session";

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
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const syncArrows = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 12);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 12);
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    syncArrows();
    const ro = new ResizeObserver(syncArrows);
    ro.observe(el);
    el.addEventListener("scroll", syncArrows, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", syncArrows);
    };
  }, [items.length]);

  const nudge = (dir: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir * Math.min(560, el.clientWidth * 0.85),
      behavior: "smooth",
    });
  };

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
      <div className="relative">
        {canPrev && (
          <button
            type="button"
            aria-label={`Scroll ${title} left`}
            onClick={() => nudge(-1)}
            className="hidden md:flex absolute left-0 top-[42%] -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white border border-[#e8e8e8] shadow-[0_2px_10px_rgba(0,0,0,0.14)] text-[#1a1a1a] hover:bg-[#f6f6f6]"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>
        )}
        <div
          ref={scrollerRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1"
        >
          {items.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              compact
              onOpen={() => onOpen(product)}
            />
          ))}
        </div>
        {canNext && (
          <button
            type="button"
            aria-label={`Scroll ${title} right`}
            onClick={() => nudge(1)}
            className="hidden md:flex absolute right-0 top-[42%] -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white border border-[#e8e8e8] shadow-[0_2px_10px_rgba(0,0,0,0.14)] text-[#1a1a1a] hover:bg-[#f6f6f6]"
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        )}
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
  const inspecting = useCatalogStore((s) => s.inspecting);
  const inspect = useCatalogStore((s) => s.inspect);
  const listTone = useCatalogStore((s) => s.listTone);
  const warehouseList = listTone === "warehouse" && Boolean(q.trim());
  const [sort, setSort] = useState<"relevance" | "price">("relevance");
  const setSheet = useSessionStore((s) => s.setSheet);
  const address = useSessionStore((s) => s.address);
  const kirkOpen = useSessionStore((s) => s.kirkOpen);

  useEffect(() => {
    void search();
  }, [search]);

  const recipesView = tag === "recipes" && !q.trim();
  const flyersView = tag === "flyers" && !q.trim();
  const listsView = tag === "lists" && !q.trim();
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
    recipes: "Meals",
    pantry: "Pantry",
    snacks: "Snacks",
  };
  const collectionTiles = [
    {
      tag: "weekly",
      title: "Member Only Savings",
      subtitle: "8/24/26 – 9/21/26",
      badge: "Sale ends in 10 days",
      image: "/products/hero-weekly.jpg?v=22",
      tile: "/products/hero-weekly-tile.jpg?v=2",
      wash: "#7a3a3c",
    },
    {
      tag: "kirkland",
      title: "Kirkland Signature",
      image: "/products/hero-kirkland.jpg?v=22",
      tile: "/products/hero-kirkland-tile.jpg?v=2",
      wash: "#3d5470",
    },
    {
      tag: "trending",
      title: "This week's featured items",
      image: "/products/hero-new.jpg?v=22",
      tile: "/products/hero-new-tile.jpg?v=2",
      wash: "#7a6d52",
    },
    {
      tag: "treasure",
      title: "Discounts on household favorites",
      image: "/products/hero-treasure.jpg?v=22",
      tile: "/products/hero-treasure-tile.jpg?v=2",
      wash: "#5a443c",
    },
  ] as const;
  const activeCollection = collectionTiles.find((tile) => tile.tag === tag);
  const tagLabel = tag
    ? liveCollectionName[tag] ||
      categories.find((c) => c.id === tag)?.name ||
      tag
    : null;
  const titleBits = [
    department ? aisleLabel(department) : null,
    tagLabel,
    q.trim() ? `“${q.trim()}”` : null,
  ].filter(Boolean);

  const shown = useMemo(() => {
    const allow: string[] = [];
    if (!q.trim()) {
      if (department === "Bakery & Desserts") allow.push("9");
    }
    const merch = hideComposedLeftovers(filtered, allow);
    if (sort === "price") {
      return [...merch].sort((a, b) => a.price - b.price);
    }
    return officialPacksFirst(merch);
  }, [filtered, sort, q, department]);
  const related = q.trim() && shown.length > 0 && shown.length < 6
    ? relatedSearchItems(shown, products)
    : [];
  const searchGridClass = kirkOpen
    ? "grid grid-cols-2 xl:grid-cols-3 gap-3"
    : "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3";

  const showAisle = (next: { department?: string; tag?: string }) => {
    setQuery("");
    if (next.tag) setTag(next.tag);
    else if (next.department) setDepartment(next.department);
    void search();
  };

  const aisles: Aisle[] = [
    {
      title: "Buy it again",
      items: officialPacksFirst(
        hideComposedLeftovers(filtered.filter((p) => p.tags?.includes("again")))
      ),
      onShowAll: () => showAisle({ tag: "again" }),
    },
    {
      title: "Member Only Savings",
      items: officialPacksFirst(
        hideComposedLeftovers(
          filtered.filter(
            (p) =>
              p.department === "Weekly Savings" || p.tags?.includes("weekly")
          )
        )
      ),
      onShowAll: () => showAisle({ tag: "weekly" }),
    },
    {
      title: "Kirkland Signature",
      items: officialPacksFirst(
        hideComposedLeftovers(
          filtered.filter(
            (p) =>
              p.brand === "Kirkland Signature" ||
              p.department === "Kirkland Signature" ||
              p.tags?.includes("kirkland")
          )
        )
      ),
      onShowAll: () => showAisle({ tag: "kirkland" }),
    },
    {
      title: "What's New",
      items: officialPacksFirst(
        hideComposedLeftovers(
          filtered.filter(
            (p) => p.department === "What's New" || p.tags?.includes("new")
          )
        )
      ),
      onShowAll: () => showAisle({ tag: "new" }),
    },
    {
      title: "This week's featured items",
      items: officialPacksFirst(
        hideComposedLeftovers(
          filtered.filter(
            (p) => p.department === "Trending" || p.tags?.includes("trending")
          )
        )
      ),
      onShowAll: () => showAisle({ tag: "trending" }),
    },
    {
      title: "Discounts on household favorites",
      items: officialPacksFirst(
        hideComposedLeftovers(
          filtered.filter((p) => p.tags?.includes("treasure"))
        )
      ),
      onShowAll: () => showAisle({ tag: "treasure" }),
    },
    {
      title: "Dairy & Eggs",
      items: officialPacksFirst(
        hideComposedLeftovers(
          filtered.filter((p) => p.department === "Dairy & Eggs")
        )
      ),
      onShowAll: () => showAisle({ department: "Dairy & Eggs" }),
    },
    {
      title: "Pantry",
      items: officialPacksFirst(
        hideComposedLeftovers(
          filtered.filter((p) => p.tags?.includes("pantry"))
        )
      ),
      onShowAll: () => showAisle({ tag: "pantry" }),
    },
    {
      title: "Snacks",
      items: officialPacksFirst(
        hideComposedLeftovers(
          filtered.filter((p) => p.tags?.includes("snacks"))
        )
      ),
      onShowAll: () => showAisle({ tag: "snacks" }),
    },
    {
      title: "Bakery",
      items: officialPacksFirst(
        hideComposedLeftovers(
          filtered.filter((p) => p.department === "Bakery & Desserts"),
          ["9"]
        )
      ),
      onShowAll: () => showAisle({ department: "Bakery & Desserts" }),
    },
  ];

  return (
    <div
      className={`p-4 lg:px-5 lg:py-4 ${
        warehouseList ? "bg-[#e8eaed]" : "bg-[#f6f7f8]"
      }`}
    >
      {error && (
        <div className="mb-4 border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
          {error}
        </div>
      )}

      {!filteredView && (
        <>
          <div className="-mx-4 lg:-mx-5 mb-4">
            <CategoryScroller />
          </div>

          <section className="mb-5 grid grid-cols-2 gap-3">
            {collectionTiles.map((tile) => (
              <button
                key={tile.title}
                type="button"
                onClick={() => showAisle({ tag: tile.tag })}
                className="relative aspect-video rounded-[16px] overflow-hidden text-left group bg-[#f3f3f3]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tile.tile}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-[center_30%] group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute inset-x-0 bottom-0 h-[36%] bg-gradient-to-t from-black/70 via-black/28 to-transparent" />
                {"badge" in tile && tile.badge && (
                  <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-white px-2 py-1 text-[11px] font-bold text-costco-red shadow-[0_1px_3px_rgba(0,0,0,0.12)]">
                    {tile.badge}
                  </span>
                )}
                <span className="absolute inset-x-3.5 bottom-3 flex flex-col">
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

          {aisles.map((aisle) => (
            <AisleRow
              key={aisle.title}
              title={aisle.title}
              items={aisle.items}
              onShowAll={aisle.onShowAll}
              onOpen={inspect}
            />
          ))}
        </>
      )}

      {recipesView && <RecipesView />}
      {flyersView && <FlyersView />}
      {listsView && <ListsView />}

      {filteredView && !recipesView && !flyersView && !listsView && (
        <>
          <button
            type="button"
            onClick={() => {
              clearFilters();
              void search();
            }}
            className="mb-3 inline-flex items-center gap-0.5 text-[13px] font-bold text-costco-blue hover:underline"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            Shop
          </button>
          {activeCollection && (
            <div
              className="relative mb-4 h-[220px] sm:h-[280px] lg:h-[320px] rounded-[16px] overflow-hidden"
              style={{ background: activeCollection.wash }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeCollection.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              {"badge" in activeCollection && activeCollection.badge && (
                <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-white px-2 py-1 text-[11px] font-bold text-costco-red shadow-[0_1px_3px_rgba(0,0,0,0.12)]">
                  {activeCollection.badge}
                </span>
              )}
            </div>
          )}
          <div className="mb-3 flex items-end justify-between gap-3 flex-wrap">
            <div>
              {q.trim() ? (
                <h2 className="text-[22px] lg:text-[24px] font-bold text-[#1a1a1a] tracking-tight">
                  {warehouseList
                    ? `${shown.length} Result${shown.length === 1 ? "" : "s"}`
                    : `${shown.length} result${shown.length === 1 ? "" : "s"} for “${q.trim()}”`}
                </h2>
              ) : (
                <h2 className="text-[22px] lg:text-[24px] font-bold text-[#1a1a1a] tracking-tight">
                  {activeCollection
                    ? activeCollection.title
                    : titleBits.join(" · ")}
                </h2>
              )}
              {activeCollection &&
              "subtitle" in activeCollection &&
              activeCollection.subtitle ? (
                <p className="text-[13px] font-semibold text-[#666] mt-0.5">
                  {activeCollection.subtitle}
                </p>
              ) : null}
              <p className="text-[13px] text-[#666] mt-0.5">
                {q.trim()
                  ? loading
                    ? "Updating…"
                    : warehouseList
                      ? "Kirkland Signature shopping help · 11217 Brooklyn"
                      : "Same-Day · 11217 Brooklyn"
                  : `${shown.length} item${shown.length === 1 ? "" : "s"}${
                      loading ? " · Updating…" : ""
                    }`}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[12px] font-bold text-[#666]">Sort</span>
              <div
                className={`inline-flex items-center border bg-white p-0.5 ${
                  warehouseList
                    ? "rounded-[3px] border-[#c4c4c4]"
                    : "rounded-full border-[#d8d8d8]"
                }`}
                role="group"
                aria-label="Sort items"
              >
                {(
                  [
                    ["relevance", warehouseList ? "Best Match" : "Best match"],
                    ["price", "Price"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={sort === value}
                    onClick={() => setSort(value)}
                    className={`px-3 py-1.5 text-[12px] font-bold ${
                      warehouseList ? "rounded-[3px]" : "rounded-full"
                    } ${
                      sort === value
                        ? warehouseList
                          ? "bg-[#f7fbfe] text-costco-blue"
                          : "bg-[#e8f2fa] text-costco-blue"
                        : warehouseList
                          ? "text-[#555] hover:bg-[#f7fbfe]"
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
                Clear all
              </button>
            </div>
          </div>
          {!q.trim() && (
            <div className="-mx-4 lg:-mx-5 mb-4">
              <CategoryScroller />
            </div>
          )}

          {!loading && shown.length === 0 ? (
            <div className="flex flex-col items-center text-center pt-10 pb-12 px-6">
              <span className="w-16 h-16 rounded-full bg-white border border-[#eee] flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                <Search className="w-7 h-7 text-[#8a8a8a]" aria-hidden="true" />
              </span>
              <p className="font-bold text-[#1a1a1a] text-[18px] mt-4">
                {q.trim()
                  ? `We didn’t find any results for “${q.trim()}”`
                  : tagLabel
                    ? `We didn’t find any items in ${tagLabel}`
                    : department
                      ? `We didn’t find any items in ${aisleLabel(department)}`
                      : "We didn’t find any results"}
              </p>
              <p className="text-[13px] text-[#666] mt-1.5 leading-snug max-w-[28rem]">
                Try checking your spelling or using more general terms.
              </p>
              <div className="mt-5 flex flex-col items-center gap-2.5">
                <button
                  type="button"
                  className={`px-5 py-2.5 text-[14px] font-bold text-white ${
                    warehouseList
                      ? "rounded-[3px] bg-costco-red hover:bg-costco-red-hover"
                      : "rounded-full bg-[#0AAD0A] hover:bg-[#099809]"
                  }`}
                  onClick={() => {
                    clearFilters();
                    void search();
                  }}
                >
                  Browse store
                </button>
                <button
                  type="button"
                  className="text-[13px] text-costco-blue font-bold hover:underline"
                  onClick={() => setSheet("request")}
                >
                  Add a special request
                </button>
              </div>
            </div>
          ) : (
            <>
            <div className={searchGridClass}>
              {shown.map((product) =>
                warehouseList ? (
                  <WarehouseResultCard
                    key={product.id}
                    product={product}
                    density="catalog"
                  />
                ) : (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpen={() => inspect(product)}
                  />
                )
              )}
            </div>
            {related.length > 0 ? (
              <section className="mt-8">
                <h3 className="mb-3 text-[20px] lg:text-[22px] font-bold text-[#1a1a1a] tracking-tight">
                  {warehouseList ? "Related Products" : "Related products"}
                </h3>
                <div className={searchGridClass}>
                  {related.map((product) =>
                    warehouseList ? (
                      <WarehouseResultCard
                        key={`related-${product.id}`}
                        product={product}
                        density="catalog"
                      />
                    ) : (
                      <ProductCard
                        key={`related-${product.id}`}
                        product={product}
                        onOpen={() => inspect(product)}
                      />
                    )
                  )}
                </div>
              </section>
            ) : null}
            </>
          )}
        </>
      )}

      {q.trim() ? null : (
      <footer className="mt-10 -mx-4 lg:-mx-5 bg-white border-t border-[#e5e5e5]">
        <div className="px-4 lg:px-5 py-6 grid gap-6 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <CostcoLogo compact />
              <span className="pl-2.5 border-l border-[#d8d8d8]">
                <span className="block text-[14px] font-bold text-costco-blue leading-none">
                  Same-Day
                </span>
                <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-[#6b6b6b]">
                  <InstacartMark size={12} />
                  Powered by Instacart
                </span>
              </span>
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-[#666]">
              Delivery to {formatAddress(address)}. Costco membership required.
              Item prices are higher than warehouse.
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-[0.12em] text-[#888] uppercase">
              Shop
            </p>
            <div className="mt-2 flex flex-col items-start gap-1.5">
              <button
                type="button"
                className="text-[13px] text-costco-blue font-semibold hover:underline"
                onClick={() => {
                  clearFilters();
                  void search();
                  document.querySelector("main")?.scrollTo({ top: 0 });
                }}
              >
                Shop
              </button>
              <button
                type="button"
                className="text-[13px] text-costco-blue font-semibold hover:underline"
                onClick={() => {
                  setQuery("");
                  setTag("flyers");
                  void search();
                  document.querySelector("main")?.scrollTo({ top: 0 });
                }}
              >
                Flyers
              </button>
              <button
                type="button"
                className="text-[13px] text-costco-blue font-semibold hover:underline"
                onClick={() => {
                  setQuery("");
                  setTag("lists");
                  void search();
                  document.querySelector("main")?.scrollTo({ top: 0 });
                }}
              >
                Lists
              </button>
              <button
                type="button"
                className="text-[13px] text-costco-blue font-semibold hover:underline"
                onClick={() => {
                  setQuery("");
                  setTag("recipes");
                  void search();
                  document.querySelector("main")?.scrollTo({ top: 0 });
                }}
              >
                Meals
              </button>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-[0.12em] text-[#888] uppercase">
              Help
            </p>
            <div className="mt-2 flex flex-col items-start gap-1.5">
              <button
                type="button"
                className="text-[13px] text-costco-blue font-semibold hover:underline"
                onClick={() => setSheet("pricing")}
              >
                Pricing & fees
              </button>
              <button
                type="button"
                className="text-[13px] text-costco-blue font-semibold hover:underline"
                onClick={() => setSheet("departments")}
              >
                Departments
              </button>
              <button
                type="button"
                className="text-[13px] text-costco-blue font-semibold hover:underline"
                onClick={() => setSheet("membership")}
              >
                Membership
              </button>
              <button
                type="button"
                className="text-[13px] text-costco-blue font-semibold hover:underline"
                onClick={() => setSheet("delivery")}
              >
                Delivery windows
              </button>
            </div>
          </div>
        </div>
        <div className="px-4 lg:px-5 py-3 border-t border-[#ececec] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#777]">
          <p>© 2026 Costco Wholesale Corporation · Same-Day Delivery</p>
          <p>Prices, fees, and availability for {formatAddress(address)}</p>
        </div>
      </footer>
      )}

      {inspecting && (
        <ProductDetailModal
          key={inspecting.id}
          product={inspecting}
          onClose={() => inspect(null)}
        />
      )}
    </div>
  );
}
