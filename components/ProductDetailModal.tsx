"use client";

import { X, Check, Plus, Star } from "lucide-react";
import type { Product } from "@/lib/data/products";
import { useCartStore } from "@/lib/store/cart";
import StarRating from "@/components/StarRating";
import { useState } from "react";

export default function ProductDetailModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const qty = useCartStore(
    (s) => s.items.find((i) => i.product.id === product.id)?.quantity || 0
  );
  const [justAdded, setJustAdded] = useState(false);

  const onAdd = () => {
    addItem(product);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close product"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${product.brand} ${product.name}`}
        className="relative w-full max-w-[480px] h-full overflow-y-auto bg-white shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-costco-border bg-white">
          <p className="text-[13px] font-bold text-[#1a1a1a]">Item details</p>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-[#555]" />
          </button>
        </div>

        <div>
          <div className="relative aspect-square bg-white border-b border-[#eee]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={`${product.brand} ${product.name}`}
              className="absolute inset-0 w-full h-full object-contain p-8"
            />
            {product.savings > 0 && (
              <div className="absolute top-3 left-3 bg-costco-red text-white px-2 py-1 text-[12px] font-bold rounded-[4px]">
                ${product.savings.toFixed(2)} off
              </div>
            )}
          </div>
          <div className="p-5 flex flex-col">
            <p className="text-[13px] text-[#555]">{product.brand}</p>
            <h2 className="text-[22px] font-bold text-[#1a1a1a] mt-0.5 leading-snug">
              {product.name}
            </h2>
            <div className="mt-2">
              <StarRating
                rating={product.rating}
                reviewCount={product.reviewCount}
                size="md"
              />
            </div>

            <div className="mt-4 flex items-baseline gap-2 flex-wrap">
              <span className="text-[28px] font-bold text-[#1a1a1a] tabular-nums leading-none">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-[15px] text-[#8a8a8a]">each</span>
              <span className="text-sm text-[#888] line-through tabular-nums">
                ${product.originalPrice.toFixed(2)}
              </span>
            </div>
            {product.savings > 0 && (
              <p className="text-[13px] font-bold text-[#2e7d32] mt-1">
                Save ${product.savings.toFixed(2)}
              </p>
            )}
            <p className="text-[12px] text-[#188038] mt-2">
              {product.inStock ? "Many in stock" : "Out of stock"}
              <span className="text-[#666]">
                {" "}
                · {product.department}
              </span>
            </p>
            <div className="mt-5 pt-4 border-t border-[#eee]">
              <h3 className="text-[15px] font-bold text-[#1a1a1a]">Details</h3>
              <p className="text-[13px] text-[#555] mt-1.5 leading-snug">
                {product.department}
                {product.category ? ` · ${product.category}` : ""}
              </p>
            </div>

            <button
              type="button"
              onClick={onAdd}
              className={`mt-5 w-full py-3 font-bold transition-colors flex items-center justify-center gap-2 rounded-full ${
                justAdded
                  ? "bg-green-600 text-white"
                  : "bg-costco-blue text-white hover:bg-costco-blue-hover"
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  Added{qty > 0 ? ` · ${qty} in cart` : ""}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  {qty > 0 ? `Add · ${qty} in cart` : "Add"}
                </>
              )}
            </button>
          </div>
        </div>

        <div className="px-5 pb-6 pt-4 border-t border-[#eee]">
          <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-1">
            Member reviews
          </h3>
          <p className="text-[12px] text-[#666] mb-4">
            Based on {product.reviewCount.toLocaleString()} ratings
          </p>
          <ul className="space-y-3">
            {product.reviews.map((r, idx) => (
              <li
                key={`${r.author}-${idx}`}
                className="border border-[#e8e8e8] bg-[#fafafa] rounded-[12px] px-3.5 py-3"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < r.rating
                            ? "fill-[#F6C344] text-[#E5A800]"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#999]">{r.date}</span>
                </div>
                <p className="text-sm font-bold text-[#1a1a1a]">{r.title}</p>
                <p className="text-[13px] text-[#555] mt-0.5 leading-relaxed">
                  {r.body}
                </p>
                <p className="text-[11px] text-[#777] mt-1.5">{r.author}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
