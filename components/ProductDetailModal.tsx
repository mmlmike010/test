"use client";

import { X, Minus, Plus, Star } from "lucide-react";
import SaveHeart from "@/components/SaveHeart";
import { products, type Product } from "@/lib/data/products";
import { useCartStore } from "@/lib/store/cart";
import StarRating from "@/components/StarRating";
import ProductCard from "@/components/ProductCard";
import { productSize } from "@/lib/ui/packSize";
import { aisleLabel } from "@/lib/ui/aisleLabels";
import { storefrontOverlayClass, useSessionStore } from "@/lib/store/session";
import { useRef, useState } from "react";

export default function ProductDetailModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(product);
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const qty = useCartStore(
    (s) => s.items.find((i) => i.product.id === current.id)?.quantity || 0
  );
  const scrollerRef = useRef<HTMLDivElement>(null);
  const kirkOpen = useSessionStore((s) => s.kirkOpen);

  const related = products
    .filter(
      (p) =>
        p.id !== current.id &&
        (p.department === current.department ||
          p.category === current.category)
    )
    .slice(0, 4);

  const onAdd = () => {
    addItem(current);
  };

  const openRelated = (next: Product) => {
    setCurrent(next);
    scrollerRef.current?.scrollTo({ top: 0 });
  };

  return (
    <div
      className={`fixed z-[70] flex justify-end ${storefrontOverlayClass(kirkOpen)}`}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close product"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${current.brand} ${current.name}`}
        className="relative w-full max-w-[480px] h-full bg-white shadow-2xl flex flex-col"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-[#ececec] bg-white shrink-0">
          <p className="text-[13px] font-bold text-[#1a1a1a] truncate pr-3">
            {current.brand} {current.name}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#f6f6f6] shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-[#555]" />
          </button>
        </div>

        <div ref={scrollerRef} className="flex-1 overflow-y-auto min-h-0">
          <div className="relative aspect-square bg-white border-b border-[#eee]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.image}
              alt={`${current.brand} ${current.name}`}
              className="absolute inset-0 w-full h-full object-contain p-8"
            />
            {current.savings > 0 && (
              <div className="absolute top-3 left-3 bg-costco-red text-white px-2 py-1 text-[12px] font-bold rounded-[4px]">
                ${current.savings.toFixed(2)} off
              </div>
            )}
            <SaveHeart
              productId={current.id}
              productName={current.name}
              className="absolute top-3 right-3 w-9 h-9"
            />
          </div>
          <div className="p-5 flex flex-col">
            <h2 className="text-[22px] font-bold text-[#1a1a1a] leading-snug">
              {current.brand} {current.name}
            </h2>
            {productSize(current.id) && (
              <p className="text-[14px] text-[#6b6b6b] mt-1">
                {productSize(current.id)}
              </p>
            )}
            <div className="mt-2">
              <StarRating
                rating={current.rating}
                reviewCount={current.reviewCount}
                size="md"
              />
            </div>

            <div className="mt-4 flex items-baseline gap-2 flex-wrap">
              <span className="text-[28px] font-bold text-[#1a1a1a] tabular-nums leading-none">
                ${current.price.toFixed(2)}
              </span>
              <span className="text-[15px] text-[#8a8a8a]">each</span>
              <span className="text-sm text-[#888] line-through tabular-nums">
                ${current.originalPrice.toFixed(2)}
              </span>
            </div>
            {current.savings > 0 && (
              <p className="text-[13px] font-bold text-[#2e7d32] mt-1">
                Save ${current.savings.toFixed(2)}
              </p>
            )}
            <p className="text-[12px] text-[#188038] mt-2">
              {current.inStock ? "Many in stock" : "Out of stock"}
              <span className="text-[#666]">
                {" "}
                · {aisleLabel(current.department)}
              </span>
            </p>
            <div className="mt-5 pt-4 border-t border-[#eee]">
              <h3 className="text-[15px] font-bold text-[#1a1a1a]">Details</h3>
              <p className="text-[13px] text-[#555] mt-1.5 leading-snug">
                {aisleLabel(current.department)}
                {current.category ? ` · ${current.category}` : ""}
                {productSize(current.id) ? ` · ${productSize(current.id)}` : ""}
              </p>
              <p className="text-[12px] text-[#888] mt-1.5">
                Same-Day price · Membership required · Prices higher than
                warehouse
              </p>
            </div>
          </div>

        {related.length > 0 && (
          <div className="px-5 pb-5">
            <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-2.5">
              Related products
            </h3>
            <div className="flex gap-2.5 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1">
              {related.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  compact
                  onOpen={() => openRelated(item)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="px-5 pb-6 pt-4 border-t border-[#eee]">
          <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-1">
            Member reviews
          </h3>
          <p className="text-[12px] text-[#666] mb-4">
            Based on {current.reviewCount.toLocaleString()} ratings
          </p>
          <ul className="space-y-3">
            {current.reviews.map((r, idx) => (
              <li
                key={`${r.author}-${idx}`}
                className="border-b border-[#f0f0f0] pb-3"
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

        <div className="shrink-0 border-t border-[#eee] bg-white px-5 py-3 flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-[20px] font-bold text-[#1a1a1a] tabular-nums leading-none">
              ${current.price.toFixed(2)}
            </p>
            <p className="text-[12px] text-[#8a8a8a] mt-0.5">each</p>
          </div>
          {qty === 0 ? (
            <button
              type="button"
              onClick={onAdd}
              className="flex-1 h-12 font-bold transition-colors flex items-center justify-center gap-2 rounded-full bg-[#0AAD0A] text-white hover:bg-[#099809]"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          ) : (
            <div className="flex-1 h-12 flex items-center justify-between rounded-full bg-[#0AAD0A] text-white overflow-hidden">
              <button
                type="button"
                className="w-14 h-12 flex items-center justify-center hover:bg-[#099809]"
                onClick={() => updateQuantity(current.id, qty - 1)}
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-[16px] font-bold tabular-nums min-w-[1.5rem] text-center">
                {qty}
              </span>
              <button
                type="button"
                className="w-14 h-12 flex items-center justify-center hover:bg-[#099809]"
                onClick={onAdd}
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
