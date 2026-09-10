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
    <header className="bg-white border-b border-[#e5e5e5] sticky top-0 z-50 shrink-0">
      <div className="bg-[#f3f3f3] border-b border-[#e8e8e8]">
        <div className="max-w-[1800px] mx-auto px-3 sm:px-4 h-[28px] flex items-center justify-between text-[12px]">
          <a href="#" className="text-costco-blue font-semibold hover:underline">
            ← Back to Costco.com
          </a>
          <p className="hidden sm:block text-[#666]">
            Warehouse prices may differ · Membership required
          </p>
        </div>
      </div>
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
                <span className="text-[10px] text-[#6b6b6b] mt-0.5 tracking-wide">
                  Powered by Instacart
                </span>
              </span>
            </button>
            <nav className="hidden lg:flex items-center gap-5 text-[14px]">
              <a
                href="#"
                className="text-costco-blue font-bold border-b-[3px] border-costco-blue py-3"
              >
                Shop
              </a>
              <a href="#" className="text-[#333] hover:text-costco-blue py-3">
                Lists
              </a>
              <a href="#" className="text-[#333] hover:text-costco-blue py-3">
                Flyers
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#"
              className="hidden md:inline text-[13px] text-costco-blue font-semibold hover:underline"
            >
              Pricing & fees
            </a>
            <a
              href="#"
              className="hidden sm:inline text-[13px] text-costco-blue font-semibold hover:underline"
            >
              Join Costco Today
            </a>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-[#333] text-[13px] font-semibold hover:text-costco-blue"
            >
              <span className="w-7 h-7 rounded-full border border-[#c8c8c8] bg-white flex items-center justify-center">
                <User className="w-4 h-4" />
              </span>
              <span className="hidden sm:inline">Sign in</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#fafafa] border-b border-[#ececec]">
      <div className="max-w-[1800px] mx-auto px-3 sm:px-4 py-2">
        <div className="flex items-center gap-2.5">
          <form
            className="relative flex-1 min-w-0"
            onSubmit={(e) => {
              e.preventDefault();
              void search();
            }}
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8a8a] w-[18px] h-[18px]" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Costco..."
              className="w-full h-10 pl-11 pr-[6.75rem] bg-white border border-[#c4c4c4] rounded-full text-[15px] text-[#222] placeholder:text-[#8a8a8a] focus:outline-none focus:border-costco-blue focus:ring-2 focus:ring-costco-blue/15"
            />
            {q && (
              <button
                type="button"
                aria-label="Clear search"
                className="absolute right-[5.7rem] top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
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
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-3.5 bg-costco-red text-white text-[13px] font-bold rounded-full hover:bg-costco-red-hover"
            >
              Search
            </button>
          </form>

          <button
            type="button"
            onClick={onAskKirkClick}
            className="hidden sm:inline-flex items-center gap-1.5 h-10 px-3 bg-white border-2 border-costco-red text-costco-red rounded-full font-bold hover:bg-[#fff5f6] whitespace-nowrap"
          >
            <KirkMark size={22} />
            <span className="text-[13px]">Ask Kirk</span>
          </button>
          <button
            type="button"
            onClick={onAskKirkClick}
            className="sm:hidden h-10 w-10 rounded-full border-2 border-costco-red flex items-center justify-center"
            aria-label="Ask Kirk"
          >
            <KirkMark size={22} />
          </button>

          <button
            type="button"
            className="hidden lg:flex text-left items-center gap-1.5 px-1.5 py-0.5 rounded-md hover:bg-[#f6f6f6]"
          >
            <Clock className="w-[18px] h-[18px] text-costco-blue shrink-0" />
            <span>
              <span className="block text-[13px] text-[#333] leading-tight">
                <span className="text-[#666]">Delivery </span>
                <span className="font-bold">8:48–9:18pm</span>
              </span>
              <span className="block text-[12px] text-[#666] leading-tight">
                11217 · Brooklyn
              </span>
            </span>
            <ChevronDown className="w-4 h-4 text-[#666] shrink-0" />
          </button>

          <button
            type="button"
            onClick={openCart}
            aria-label={`View Cart. Items in cart: ${totalItems}`}
            className="relative inline-flex items-center gap-1.5 h-10 px-3 border border-[#c4c4c4] rounded-full hover:bg-[#f6f6f6] bg-white"
          >
            <ShoppingCart className="w-5 h-5 text-[#333]" />
            <span className="hidden sm:inline font-bold text-[13px] text-[#333]">
              View cart
            </span>
            <span className="absolute -top-1.5 -right-1 min-w-[20px] h-[20px] px-1 bg-costco-blue text-white text-[11px] font-bold rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          </button>
        </div>
      </div>
      </div>
    </header>
  );
}
