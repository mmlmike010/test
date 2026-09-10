"use client";

import { useState } from "react";
import { Check, Heart, Minus, Plus } from "lucide-react";
import type { Product } from "@/lib/data/products";
import { useCartStore } from "@/lib/store/cart";
import { productSize } from "@/lib/ui/packSize";

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
        aria-label={`Add 1 ct ${product.name}`}
        className={`absolute bottom-2 right-2 w-10 h-10 rounded-full bg-white border-[1.5px] shadow-[0_1px_4px_rgba(0,0,0,0.12)] flex items-center justify-center ${
          justAdded
            ? "border-[#0AAD0A] text-[#0AAD0A]"
            : "border-[#0AAD0A] text-[#0AAD0A] hover:bg-[#e8f8e8]"
        }`}
      >
        {justAdded ? <Check className="w-4 h-4" /> : <Plus className="w-5 h-5" />}
      </button>
    );
  }

  return (
    <div
      className="absolute bottom-2 right-2 h-10 flex items-center rounded-full bg-[#0AAD0A] text-white shadow-[0_1px_4px_rgba(0,0,0,0.16)] overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="w-9 h-10 flex items-center justify-center hover:bg-[#099809]"
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
        className="w-9 h-10 flex items-center justify-center hover:bg-[#099809]"
        onClick={add}
        aria-label="Increase quantity"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function ProductCard({
  product,
  onOpen,
  compact = false,
}: {
  product: Product;
  onOpen: () => void;
  compact?: boolean;
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
      className={`bg-white text-left cursor-pointer rounded-[12px] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-costco-blue/40 overflow-hidden ${
        compact ? "w-[188px] shrink-0" : ""
      }`}
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
        <span
          className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/90 border border-[#eee] flex items-center justify-center text-[#8a8a8a]"
          aria-hidden="true"
        >
          <Heart className="w-3.5 h-3.5" />
        </span>
        <AddControl product={product} />
      </div>
      <div className="px-2.5 pb-3 pt-1">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span
            className={`${
              compact ? "text-[18px]" : "text-[20px]"
            } font-bold text-[#1a1a1a] tabular-nums leading-none`}
          >
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
        <h3 className="text-[14px] font-normal text-[#242424] leading-snug mt-1.5 line-clamp-3">
          {product.brand} {product.name}
        </h3>
        {productSize(product.id) && (
          <p className="text-[14px] leading-[18px] text-[#72767E] mt-0.5">
            {productSize(product.id)}
          </p>
        )}
        <p className="text-[12px] text-[#188038] mt-0.5">
          {product.inStock ? "Many in stock" : "Out of stock"}
        </p>
      </div>
    </div>
  );
}
