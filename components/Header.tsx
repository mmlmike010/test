"use client";

import { useEffect, useRef } from "react";
import { useCartStore } from "@/lib/store/cart";
import { useCatalogStore } from "@/lib/store/catalog";
import { ChevronDown, Clock, Search, ShoppingCart, User, X } from "lucide-react";
import CostcoLogo from "@/components/CostcoLogo";
import KirkMark from "@/components/KirkMark";

interface HeaderProps {
  onAskKirkClick: () => void;
}

export default function Header({ onAskKirkClick }: HeaderProps) {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const openCart = useCartStore((state) => state.openCart);
  const q = useCatalogStore((s) => s.q);
  const setQuery = useCatalogStore((s) => s.setQuery);
  const search = useCatalogStore((s) => s.search);
  const clearFilters = useCatalogStore((s) => s.clearFilters);
  const department = useCatalogStore((s) => s.department);
  const tag = useCatalogStore((s) => s.tag);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      void search();
    }, 250);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [q, department, tag, search]);

  return (
    <header className="bg-white border-b border-costco-border sticky top-0 z-50 shrink-0">
      <div className="border-b border-[#e8e8e8]">
        <div className="max-w-[1800px] mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 min-w-0">
            <button
              type="button"
              className="leading-none text-left shrink-0"
              onClick={() => {
                clearFilters();
                void search();
              }}
              title="Show all products"
            >
              <CostcoLogo height={44} />
            </button>
            <nav className="hidden md:flex items-center gap-5 text-[14px]">
              <a
                href="#"
                className="text-costco-blue font-bold border-b-[3px] border-costco-blue py-3"
              >
                Same-Day
              </a>
              <a href="#" className="text-[#333] hover:text-costco-blue py-3">
                Costco Warehouse
              </a>
              <a href="#" className="text-[#333] hover:text-costco-blue py-3">
                Costco Spirits
              </a>
              <a
                href="#"
                className="text-[#333] hover:text-costco-blue py-3 inline-flex items-center gap-0.5"
              >
                More
                <ChevronDown className="w-3.5 h-3.5" />
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden lg:inline text-[11px] text-[#666] uppercase tracking-[0.12em]">
              Powered by Instacart
            </span>
            <button
              type="button"
              className="hidden sm:inline-flex px-3 py-1.5 bg-costco-blue text-white rounded-[3px] text-xs font-bold hover:bg-costco-blue-hover"
            >
              Back to Costco.com
            </button>
            <button
              type="button"
              className="hidden md:inline-flex px-3 py-1.5 bg-costco-blue text-white rounded-[3px] text-xs font-bold hover:bg-costco-blue-hover"
            >
              Pricing & Return Policy
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-[#333] text-xs font-semibold hover:text-costco-blue"
            >
              <span className="w-7 h-7 rounded-full border border-[#bbb] bg-white flex items-center justify-center">
                <User className="w-4 h-4" />
              </span>
              <span className="hidden sm:inline">Sign In / Register</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          <form
            className="relative flex-1 min-w-0"
            onSubmit={(e) => {
              e.preventDefault();
              void search();
            }}
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888] w-[18px] h-[18px]" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Costco..."
              className="w-full h-11 pl-11 pr-[7.5rem] bg-white border border-[#c8c8c8] rounded-full text-[15px] text-[#222] placeholder:text-[#888] focus:outline-none focus:border-costco-blue focus:ring-2 focus:ring-costco-blue/20"
            />
            {q && (
              <button
                type="button"
                aria-label="Clear search"
                className="absolute right-[6.4rem] top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
                onClick={() => {
                  setQuery("");
                  void search();
                }}
              >
                <X className="w-4 h-4 text-[#666]" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-9 px-4 bg-costco-red text-white text-sm font-bold rounded-full hover:bg-costco-red-hover"
            >
              Search
            </button>
          </form>

          <button
            type="button"
            onClick={onAskKirkClick}
            className="hidden sm:inline-flex items-center gap-2 h-11 px-3.5 bg-white border-2 border-costco-red text-costco-red rounded-full font-bold hover:bg-[#fff5f6] whitespace-nowrap"
          >
            <KirkMark size={26} />
            <span className="text-sm">Ask Kirk</span>
          </button>
          <button
            type="button"
            onClick={onAskKirkClick}
            className="sm:hidden h-11 w-11 rounded-full border-2 border-costco-red flex items-center justify-center"
            aria-label="Ask Kirk"
          >
            <KirkMark size={26} />
          </button>

          <button
            type="button"
            className="hidden xl:flex text-left items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-50"
          >
            <Clock className="w-5 h-5 text-costco-blue shrink-0" />
            <span>
              <span className="block text-[13px] text-[#333]">
                <span className="text-[#666]">Delivery </span>
                <span className="font-bold">8:48–9:18pm</span>
              </span>
              <span className="block text-[12px] text-[#666]">
                11217 · Brooklyn
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={openCart}
            aria-label={`View Cart. Items in cart: ${totalItems}`}
            className="relative inline-flex items-center gap-2 h-11 px-3.5 border border-[#c8c8c8] rounded-full hover:bg-gray-50 bg-white"
          >
            <ShoppingCart className="w-5 h-5 text-[#333]" />
            <span className="hidden sm:inline font-bold text-sm text-[#333]">
              View cart
            </span>
            <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 bg-costco-blue text-white text-[11px] font-bold rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
