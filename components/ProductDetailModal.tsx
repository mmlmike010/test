"use client";

import Image from "next/image";
import { X } from "lucide-react";
import type { Product } from "@/lib/data/products";
import { useCartStore } from "@/lib/store/cart";
import StarRating from "@/components/StarRating";
import { useState } from "react";
import { Check, Plus, Star } from "lucide-react";

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
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center">
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
        className="relative w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto bg-white sm:rounded-2xl shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white/95 backdrop-blur">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Item details
          </p>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-0">
          <div className="relative aspect-square bg-gray-50 border-b sm:border-b-0 sm:border-r border-gray-100">
            <Image
              src={product.image}
              alt={`${product.brand} ${product.name}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 320px"
            />
          </div>
          <div className="p-5 flex flex-col">
            <p className="text-sm font-medium text-[#0060A9]">{product.brand}</p>
            <h2 className="text-xl font-bold text-gray-900 mt-0.5 leading-snug">
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
              <span className="text-2xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
              {product.savings > 0 && (
                <span className="inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded text-[11px] font-semibold">
                  ${product.savings.toFixed(2)} OFF
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1 capitalize">
              {product.department} · {product.category}
              {product.inStock ? " · In stock" : " · Out of stock"}
            </p>

            <button
              type="button"
              onClick={onAdd}
              className={`mt-5 w-full py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
                justAdded
                  ? "bg-green-600 text-white"
                  : "bg-[#0060A9] text-white hover:bg-blue-800"
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
                  {qty > 0 ? `Add · ${qty} in cart` : "Add to cart"}
                </>
              )}
            </button>
          </div>
        </div>

        <div className="px-5 pb-6 pt-2 border-t border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-1">
            Member reviews
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Based on {product.reviewCount.toLocaleString()} ratings
          </p>
          <ul className="space-y-3">
            {product.reviews.map((r, idx) => (
              <li
                key={`${r.author}-${idx}`}
                className="rounded-xl border border-gray-200 bg-gray-50/80 px-3.5 py-3"
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
                  <span className="text-[10px] text-gray-400">{r.date}</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{r.title}</p>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                  {r.body}
                </p>
                <p className="text-[11px] text-gray-500 mt-1.5">{r.author}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
