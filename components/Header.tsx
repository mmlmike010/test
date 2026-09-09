"use client";

import { useEffect, useRef } from "react";
import { useCartStore } from "@/lib/store/cart";
import { useCatalogStore } from "@/lib/store/catalog";
import { Search, ShoppingCart, X } from "lucide-react";

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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="border-b border-gray-200">
        <div className="max-w-[1800px] mx-auto px-4 py-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <button
              type="button"
              className="leading-none text-left"
              onClick={() => {
                clearFilters();
                void search();
              }}
              title="Show all products"
            >
              <span className="text-[26px] font-black tracking-tight text-[#CC0000]">
                Costco
              </span>
              <span className="block text-[10px] font-semibold tracking-[0.2em] text-[#CC0000] -mt-0.5">
                WHOLESALE
              </span>
            </button>
            <nav className="flex items-center gap-4 ml-8">
              <a
                href="#"
                className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
              >
                Same-Day
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600">
                Costco Warehouse
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600">
                Costco Spirits
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600">
                More
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-600">Powered by Instacart</span>
            <button className="px-4 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700">
              Back to Costco.com
            </button>
            <button className="px-4 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700">
              Pricing & Return Policy
            </button>
            <button className="text-gray-700 text-xs hover:text-blue-600">
              Sign In / Register
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="flex-1 flex items-center gap-3">
            <form
              className="relative flex-1 max-w-2xl"
              onSubmit={(e) => {
                e.preventDefault();
                void search();
              }}
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Costco..."
                className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-[#0060A9]"
              />
              {q && (
                <button
                  type="button"
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
                  onClick={() => {
                    setQuery("");
                    void search();
                  }}
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </form>
            <button
              onClick={onAskKirkClick}
              className="px-5 py-2.5 bg-[#CC0000] text-white rounded-full font-semibold hover:bg-[#b00000] whitespace-nowrap shadow-sm"
            >
              Ask Kirk
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">🕐 Delivery</span>
                <span className="font-semibold">8:48-9:18pm</span>
              </div>
              <div className="text-xs text-gray-500">11217 · Brooklyn</div>
            </div>
            <button type="button" onClick={openCart} className="relative flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50 bg-white">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              <span className="font-medium text-sm">View cart</span>
              <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 bg-[#0060A9] text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
