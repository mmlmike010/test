"use client";

import { useEffect, useRef, useState } from "react";
import { useCartStore } from "@/lib/store/cart";
import { useCatalogStore } from "@/lib/store/catalog";
import { ChevronDown, Clock, Search, ShoppingCart, User, X } from "lucide-react";
import CostcoLogo from "@/components/CostcoLogo";
import KirkMark from "@/components/KirkMark";
import InstacartMark from "@/components/InstacartMark";
import GoldStarMark from "@/components/GoldStarMark";
import {
  deliveryWindow,
  formatAddress,
  useSessionStore,
} from "@/lib/store/session";
import {
  EMPTY_WAREHOUSE_FACETS,
  WAREHOUSE_NAV,
} from "@/lib/ui/warehouseSearch";
import WarehouseShopMenu from "@/components/WarehouseShopMenu";

interface HeaderProps {
  onAskKirkClick: () => void;
}

export default function Header({ onAskKirkClick }: HeaderProps) {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const openCart = useCartStore((state) => state.openCart);
  const q = useCatalogStore((s) => s.q);
  const setQuery = useCatalogStore((s) => s.setQuery);
  const setListTone = useCatalogStore((s) => s.setListTone);
  const search = useCatalogStore((s) => s.search);
  const setTag = useCatalogStore((s) => s.setTag);
  const setDepartment = useCatalogStore((s) => s.setDepartment);
  const clearFilters = useCatalogStore((s) => s.clearFilters);
  const department = useCatalogStore((s) => s.department);
  const tag = useCatalogStore((s) => s.tag);
  const listTone = useCatalogStore((s) => s.listTone);
  const warehouseFacets = useCatalogStore((s) => s.warehouseFacets);
  const setWarehouseFacets = useCatalogStore((s) => s.setWarehouseFacets);
  const warehouseDepts = warehouseFacets?.departments ?? [];
  const warehouseSearch = listTone === "warehouse" && Boolean(q.trim());
  const chromeTone = warehouseSearch ? "warehouse" : "sameday";
  const onRecipes = tag === "recipes";
  const onFlyers = tag === "flyers";
  const onLists = tag === "lists";
  const onShop = !onRecipes && !onFlyers && !onLists;
  const setSheet = useSessionStore((s) => s.setSheet);
  const signedIn = useSessionStore((s) => s.signedIn);
  const displayName = useSessionStore((s) => s.displayName);
  const membershipAdded = useSessionStore((s) => s.membershipAdded);
  const membershipNumber = useSessionStore((s) => s.membershipNumber);
  const windowId = useSessionStore((s) => s.windowId);
  const address = useSessionStore((s) => s.address);
  const slot = deliveryWindow(windowId);
  const tabClass = (active: boolean) =>
    active
      ? "h-full text-costco-blue font-bold border-b-[3px] border-costco-blue"
      : "h-full text-[#333] hover:text-costco-blue border-b-[3px] border-transparent";
  const scrollShop = () => {
    document.querySelector("main")?.scrollTo({ top: 0 });
  };
  const goShop = () => {
    clearFilters();
    void search();
    scrollShop();
  };
  const goTab = (next: "flyers" | "lists" | "recipes") => {
    setQuery("");
    setTag(next);
    void search();
    scrollShop();
  };
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shopRef = useRef<HTMLDivElement>(null);
  const [shopOpen, setShopOpen] = useState(false);
  if (!warehouseSearch && shopOpen) {
    setShopOpen(false);
  }

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      void search();
    }, 250);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [q, department, tag, search]);

  useEffect(() => {
    if (!shopOpen) return;
    const onDoc = (event: MouseEvent) => {
      if (!shopRef.current?.contains(event.target as Node)) {
        setShopOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [shopOpen]);

  return (
    <header className="bg-white border-b border-[#e5e5e5] sticky top-0 z-[75] shrink-0">
      <div className="border-b border-[#ececec]">
        <div className="max-w-[1800px] mx-auto px-3 sm:px-4 h-[52px] flex items-center justify-between gap-3">
          <div className="flex items-center gap-4 min-w-0">
            <button
              type="button"
              className="flex items-center gap-2.5 leading-none text-left shrink-0"
              onClick={() => {
                clearFilters();
                void search();
              }}
              title="Show all products"
            >
              <CostcoLogo compact />
              <span className="hidden sm:flex flex-col pl-2.5 border-l border-[#d8d8d8]">
                <span className="text-[15px] font-bold text-costco-blue leading-none">
                  Same-Day
                </span>
                <span className="text-[10px] text-[#6b6b6b] mt-0.5 tracking-wide inline-flex items-center gap-1">
                  <InstacartMark size={14} />
                  Powered by Instacart
                </span>
              </span>
            </button>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {warehouseSearch ? (
              <>
                <button
                  type="button"
                  className="hidden sm:inline-flex items-center gap-1 text-[13px] font-semibold text-costco-blue hover:underline"
                  onClick={() => setSheet("membership", chromeTone)}
                >
                  {membershipAdded ? (
                    <>
                      <GoldStarMark size={14} />
                      Gold Star
                      <span className="hidden xl:inline">
                        {" "}
                        · {membershipNumber}
                      </span>
                    </>
                  ) : (
                    "Membership"
                  )}
                </button>
                <button
                  type="button"
                  className="text-[13px] font-semibold text-costco-blue hover:underline"
                  onClick={() => setSheet("signin", chromeTone)}
                >
                  {signedIn ? displayName : "Sign In / Register"}
                </button>
                <span className="hidden text-[#ccc] sm:inline" aria-hidden="true">
                  |
                </span>
                <button
                  type="button"
                  className="hidden sm:inline text-[13px] font-semibold text-costco-blue hover:underline"
                  onClick={() => setSheet("signin", chromeTone)}
                >
                  Orders & Returns
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="hidden md:inline text-[13px] text-costco-blue font-semibold hover:underline"
                  onClick={() => setSheet("pricing", "sameday")}
                >
                  Pricing & fees
                </button>
                <button
                  type="button"
                  className="hidden sm:inline-flex items-center gap-1 text-[13px] text-costco-blue font-semibold hover:underline"
                  onClick={() => setSheet("membership", "sameday")}
                >
                  {membershipAdded ? (
                    <>
                      <GoldStarMark size={14} />
                      Gold Star
                      <span className="hidden xl:inline">
                        {" "}
                        · {membershipNumber}
                      </span>
                    </>
                  ) : (
                    "Add membership"
                  )}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-[#333] text-[13px] font-semibold hover:text-costco-blue"
                  onClick={() => setSheet("signin", "sameday")}
                >
                  <span className="w-7 h-7 rounded-full border border-[#c8c8c8] bg-white flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </span>
                  <span className="hidden sm:inline">
                    {signedIn ? displayName : "Sign In / Register"}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-[#ececec]">
      <div className="max-w-[1800px] mx-auto px-3 sm:px-4 py-2">
        <div className="flex items-center gap-2.5">
          <form
            className={
              warehouseSearch
                ? "flex h-11 min-w-0 flex-1"
                : "relative flex-1 min-w-0"
            }
            onSubmit={(e) => {
              e.preventDefault();
              void search();
            }}
          >
            {warehouseSearch ? (
              <label className="relative shrink-0">
                <span className="sr-only">Department</span>
                <select
                  aria-label="Department"
                  value={
                    warehouseDepts.length === 1 ? warehouseDepts[0] : ""
                  }
                  onChange={(e) => {
                    const label = e.target.value;
                    setWarehouseFacets(
                      label
                        ? {
                            ...EMPTY_WAREHOUSE_FACETS,
                            departments: [label],
                          }
                        : EMPTY_WAREHOUSE_FACETS
                    );
                  }}
                  className="h-11 w-[7.25rem] appearance-none rounded-l-[3px] border border-r-0 border-[#c4c4c4] bg-[#f6f6f6] pl-3 pr-8 text-[13px] font-bold text-[#1a1a1a] focus:border-costco-blue focus:outline-none focus:ring-2 focus:ring-costco-blue/15"
                >
                  <option value="">All</option>
                  {WAREHOUSE_NAV.map((label) => (
                    <option key={label} value={label}>
                      {label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666]"
                  aria-hidden="true"
                />
              </label>
            ) : (
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8a8a] w-[18px] h-[18px]" />
            )}
            <div className={warehouseSearch ? "relative min-w-0 flex-1" : ""}>
              <input
                type="search"
                value={q}
                onChange={(e) => {
                  const next = e.target.value;
                  if (next.trim() && (tag || department)) {
                    setTag(null);
                    setDepartment(null);
                  }
                  setQuery(next);
                  setListTone("sameday");
                }}
                placeholder={
                  warehouseSearch ? "Search Costco" : "Search products"
                }
                className={
                  warehouseSearch
                    ? "h-11 w-full border border-[#c4c4c4] bg-white pl-3 pr-10 text-[15px] text-[#222] placeholder:text-[#8a8a8a] focus:border-costco-blue focus:outline-none focus:ring-2 focus:ring-costco-blue/15"
                    : "w-full h-11 pl-11 pr-10 bg-[#f6f6f6] border border-[#d8d8d8] rounded-full text-[15px] text-[#222] placeholder:text-[#8a8a8a] focus:outline-none focus:bg-white focus:border-costco-blue focus:ring-2 focus:ring-costco-blue/15"
                }
              />
              {q ? (
                <button
                  type="button"
                  aria-label="Clear search"
                  className={`absolute top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 ${
                    warehouseSearch
                      ? "right-2 rounded-[3px]"
                      : "right-3 rounded-full"
                  }`}
                  onClick={() => {
                    setQuery("");
                    setListTone("sameday");
                    void search();
                  }}
                >
                  <X className="w-4 h-4 text-[#666]" />
                </button>
              ) : null}
            </div>
            {warehouseSearch ? (
              <button
                type="submit"
                className="h-11 shrink-0 rounded-r-[3px] bg-costco-red px-4 text-[14px] font-bold text-white hover:bg-costco-red-hover"
              >
                Search
              </button>
            ) : null}
          </form>

          <button
            type="button"
            onClick={onAskKirkClick}
            className={`hidden sm:inline-flex items-center gap-1.5 h-10 px-3 bg-white border-2 border-costco-red text-costco-red font-bold hover:bg-[#fff5f6] whitespace-nowrap ${
              warehouseSearch ? "rounded-[3px]" : "rounded-full"
            }`}
          >
            <KirkMark size={22} />
            <span className="text-[13px]">Ask Kirk</span>
          </button>
          <button
            type="button"
            onClick={onAskKirkClick}
            className={`sm:hidden h-10 w-10 border-2 border-costco-red flex items-center justify-center ${
              warehouseSearch ? "rounded-[3px]" : "rounded-full"
            }`}
            aria-label="Ask Kirk"
          >
            <KirkMark size={22} />
          </button>

          <button
            type="button"
            className={`hidden lg:flex text-left items-center gap-1.5 px-1.5 py-0.5 hover:bg-[#f6f6f6] ${
              warehouseSearch ? "rounded-[3px]" : "rounded-md"
            }`}
            onClick={() => setSheet("delivery", chromeTone)}
          >
            <Clock className="w-[18px] h-[18px] text-costco-blue shrink-0" />
            <span>
              <span className="block text-[13px] text-[#333] leading-tight">
                <span className="text-[#666]">Delivery </span>
                <span className="font-bold">{slot.label}</span>
              </span>
              <span className="block text-[12px] text-[#666] leading-tight">
                {formatAddress(address)}
              </span>
            </span>
            <ChevronDown className="w-4 h-4 text-[#666] shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => openCart(chromeTone)}
            aria-label={`View Cart. Items in cart: ${totalItems}`}
            className={`relative inline-flex items-center gap-1.5 h-10 px-3 border border-[#c4c4c4] hover:bg-[#f6f6f6] bg-white ${
              warehouseSearch ? "rounded-[3px]" : "rounded-full"
            }`}
          >
            <ShoppingCart className="w-5 h-5 text-[#333]" />
            <span className="hidden sm:inline font-bold text-[13px] text-[#333]">
              Cart
            </span>
            <span
              className={`absolute -top-1.5 -right-1 min-w-[20px] h-[20px] px-1 text-white text-[11px] font-bold flex items-center justify-center ${
                warehouseSearch
                  ? "rounded-[3px] bg-costco-red"
                  : "rounded-full bg-[#0AAD0A]"
              }`}
            >
              {totalItems}
            </span>
          </button>
        </div>
      </div>
      </div>

      <div className="bg-white border-b border-[#ececec]">
        {warehouseSearch ? (
          <div className="relative max-w-[1800px] mx-auto px-3 sm:px-4">
            <div className="flex h-[40px] items-center gap-5 text-[14px]">
              <div ref={shopRef} className="relative h-full shrink-0">
                <button
                  type="button"
                  aria-expanded={shopOpen}
                  aria-current={warehouseDepts.length === 0 ? "page" : undefined}
                  className={`${tabClass(warehouseDepts.length === 0)} inline-flex items-center gap-0.5`}
                  onClick={() => setShopOpen((open) => !open)}
                >
                  Shop
                  <ChevronDown
                    className={`h-3.5 w-3.5 ${shopOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
                {shopOpen ? (
                  <WarehouseShopMenu
                    onPick={(label) => {
                      setWarehouseFacets(
                        label
                          ? {
                              ...EMPTY_WAREHOUSE_FACETS,
                              departments: [label],
                            }
                          : EMPTY_WAREHOUSE_FACETS
                      );
                      setShopOpen(false);
                    }}
                  />
                ) : null}
              </div>
              <nav
                className="flex h-full min-w-0 flex-1 items-center gap-5 overflow-x-auto scrollbar-hide"
                aria-label="Departments"
              >
                {WAREHOUSE_NAV.map((label) => {
                  const active = warehouseDepts.includes(label);
                  return (
                    <button
                      key={label}
                      type="button"
                      aria-current={active ? "page" : undefined}
                      className={tabClass(active)}
                      onClick={() =>
                        setWarehouseFacets({
                          ...EMPTY_WAREHOUSE_FACETS,
                          departments: active ? [] : [label],
                        })
                      }
                    >
                      {label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        ) : (
          <nav
            className="max-w-[1800px] mx-auto px-3 sm:px-4 h-[40px] flex items-center gap-5 overflow-x-auto scrollbar-hide text-[14px]"
            aria-label="Same-Day sections"
          >
            <button
              type="button"
              aria-current={onShop ? "page" : undefined}
              className={tabClass(onShop)}
              onClick={goShop}
            >
              Shop
            </button>
            <button
              type="button"
              aria-current={onFlyers ? "page" : undefined}
              className={tabClass(onFlyers)}
              onClick={() => goTab("flyers")}
            >
              Flyers
            </button>
            <button
              type="button"
              aria-current={onLists ? "page" : undefined}
              className={tabClass(onLists)}
              onClick={() => goTab("lists")}
            >
              Lists
            </button>
            <button
              type="button"
              aria-current={onRecipes ? "page" : undefined}
              className={tabClass(onRecipes)}
              onClick={() => goTab("recipes")}
            >
              Meals
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
