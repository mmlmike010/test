"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/data/products";
import { useCartStore } from "@/lib/store/cart";
import { useCatalogStore } from "@/lib/store/catalog";
import { Check, Minus, Plus } from "lucide-react";
import ProductDetailModal from "@/components/ProductDetailModal";

function AddControl({ product }: { product: Product }) {
  const qty = useCartStore(
    (s) => s.items.find((i) => i.product.id === product.id)?.quantity || 0
  );
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const [justAdded, setJustAdded] = useState(false);

  const add = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 900);
  };

  if (qty === 0) {
    return (
      <button
        type="button"
        onClick={add}
        aria-label={`Add ${product.name}`}
        className={`absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white border-[1.5px] shadow-[0_1px_4px_rgba(0,0,0,0.12)] flex items-center justify-center ${
          justAdded
            ? "border-green-600 text-green-600"
            : "border-costco-blue text-costco-blue hover:bg-[#e8f2fa]"
        }`}
      >
        {justAdded ? <Check className="w-4 h-4" /> : <Plus className="w-5 h-5" />}
      </button>
    );
  }

  return (
    <div
      className="absolute bottom-2 right-2 h-8 flex items-center rounded-full bg-costco-blue text-white shadow-[0_1px_4px_rgba(0,0,0,0.16)] overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="w-8 h-9 flex items-center justify-center hover:bg-costco-blue-hover"
        onClick={() => updateQuantity(product.id, qty - 1)}
        aria-label="Decrease quantity"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="min-w-[1.25rem] text-center text-sm font-bold tabular-nums">
        {qty}
      </span>
      <button
        type="button"
        className="w-8 h-9 flex items-center justify-center hover:bg-costco-blue-hover"
        onClick={add}
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function ProductCard({
  product,
  onOpen,
}: {
  product: Product;
  onOpen: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className="bg-white text-left cursor-pointer rounded-[16px] border border-[#e8e8e8] hover:shadow-[0_2px_10px_rgba(0,0,0,0.08)] transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-costco-blue/40 overflow-hidden"
    >
      <div className="relative aspect-square bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          className="absolute inset-0 w-full h-full object-contain p-2"
        />
        {product.savings > 0 && (
          <div className="absolute top-2 left-2 bg-costco-red text-white px-1.5 py-[3px] text-[11px] font-bold rounded-[4px] leading-none">
            ${product.savings.toFixed(2)} off
          </div>
        )}
        <AddControl product={product} />
      </div>
      <div className="px-2.5 pb-3 pt-1">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-[20px] font-bold text-[#1a1a1a] tabular-nums leading-none">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-[13px] text-[#8a8a8a]">each</span>
          <span className="text-[13px] text-[#8a8a8a] line-through tabular-nums">
            ${product.originalPrice.toFixed(2)}
          </span>
        </div>
        {product.savings > 0 && (
          <p className="text-[13px] font-semibold text-[#188038] mt-0.5">
            Save ${product.savings.toFixed(2)}
          </p>
        )}
        <p className="text-[13px] text-[#555] mt-1.5 leading-snug">
          {product.brand}
        </p>
        <h3 className="text-[14px] font-normal text-[#242424] leading-snug mt-0.5 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        <p className="text-[12px] text-[#188038] mt-0.5">
          {product.inStock ? "Many in stock" : "Out of stock"}
        </p>
      </div>
    </div>
  );
}

export default function ProductGrid() {
  const results = useCatalogStore((s) => s.results);
  const loading = useCatalogStore((s) => s.loading);
  const error = useCatalogStore((s) => s.error);
  const q = useCatalogStore((s) => s.q);
  const department = useCatalogStore((s) => s.department);
  const tag = useCatalogStore((s) => s.tag);
  const search = useCatalogStore((s) => s.search);
  const clearFilters = useCatalogStore((s) => s.clearFilters);
  const [selected, setSelected] = useState<Product | null>(null);

  useEffect(() => {
    void search();
  }, [search]);

  const filtered = results;
  const savings = filtered.filter((p) => p.savings > 0);
  const titleBits = [
    department,
    tag ? tag.replace(/^\w/, (c) => c.toUpperCase()) : null,
    q.trim() ? `“${q.trim()}”` : null,
  ].filter(Boolean);

  return (
    <div className="bg-[#f6f7f8] p-4 lg:px-5 lg:py-4">
      <div className="mb-3 flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-[22px] lg:text-[24px] font-bold text-[#1a1a1a] tracking-tight">
            {titleBits.length ? titleBits.join(" · ") : "Shop Weekly Savings"}
          </h2>
          <p className="text-[13px] text-[#666] mt-0.5">
            {loading
              ? "Searching…"
              : `${filtered.length} item${filtered.length === 1 ? "" : "s"}`}
            {department || tag || q ? "" : " · Prices higher than warehouse"}
          </p>
        </div>
        {(department || tag || q) && (
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
        )}
      </div>

      {error && (
        <div className="mb-4 border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
          {error}
        </div>
      )}

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
          {(savings.length ? savings : filtered).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpen={() => setSelected(product)}
            />
          ))}
        </div>
      )}

      {!department && !tag && !q.trim() && filtered.length > 0 && (
        <div className="mt-6 bg-white border border-[#e8e8e8] rounded-[16px] px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-costco-blue mb-1">
              Same-Day · Brooklyn
            </p>
            <h3 className="text-[20px] font-bold tracking-tight text-[#1a1a1a]">
              Costco favorites, delivered in as fast as 1 hour
            </h3>
            <p className="text-[#555] text-[13px] mt-1 max-w-xl">
              Ask Kirk to build a cart from this week’s savings, or shop
              departments on the left.
            </p>
          </div>
          <p className="text-[12px] text-[#666] shrink-0">
            $10 monthly credit · Executive · $150 min
          </p>
        </div>
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
