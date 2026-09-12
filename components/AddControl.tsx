"use client";

import { useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import type { Product } from "@/lib/data/products";
import { useCartStore } from "@/lib/store/cart";
import { useWarehouseChrome } from "@/lib/store/warehouseChrome";

export default function AddControl({
  product,
  variant = "overlay",
  tone = "sameday",
  wide = false,
  addQty = 1,
}: {
  product: Product;
  variant?: "overlay" | "inline";
  tone?: "sameday" | "warehouse";
  wide?: boolean;
  addQty?: number;
}) {
  const qty = useCartStore(
    (s) => s.items.find((i) => i.product.id === product.id)?.quantity || 0
  );
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const [justAdded, setJustAdded] = useState(false);
  const warehouse = tone === "warehouse";
  const place =
    variant === "overlay" ? "absolute bottom-2 right-2" : "relative shrink-0";

  const add = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, warehouse ? addQty : 1);
    if (warehouse) {
      useWarehouseChrome.getState().showAdded(product, addQty);
    }
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 900);
  };

  if (warehouse) {
    return (
      <button
        type="button"
        onClick={add}
        aria-label={`Add ${addQty} ct ${product.name}`}
        className={`${place} h-9 ${wide ? "w-full" : "min-w-[72px] flex-1"} px-3 rounded-[3px] bg-costco-red text-white text-[13px] font-bold hover:bg-costco-red-hover ${
          justAdded ? "bg-costco-red-hover" : ""
        }`}
      >
        {justAdded ? "Added" : wide ? "Add to Cart" : "Add"}
      </button>
    );
  }

  if (qty === 0) {
    return (
      <button
        type="button"
        onClick={add}
        aria-label={`Add 1 ct ${product.name}`}
        className={`${place} w-10 h-10 rounded-full bg-white border-[1.5px] shadow-[0_1px_4px_rgba(0,0,0,0.12)] flex items-center justify-center ${
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
      className={`${place} h-10 flex items-center rounded-full bg-[#0AAD0A] text-white shadow-[0_1px_4px_rgba(0,0,0,0.16)] overflow-hidden`}
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
