"use client";

import { ChevronDown, X, Minus, Plus, Star } from "lucide-react";
import SaveHeart from "@/components/SaveHeart";
import { products, type Product } from "@/lib/data/products";
import { useCartStore } from "@/lib/store/cart";
import { useCatalogStore } from "@/lib/store/catalog";
import StarRating from "@/components/StarRating";
import ProductCard from "@/components/ProductCard";
import { productSize } from "@/lib/ui/packSize";
import { aisleLabel } from "@/lib/ui/aisleLabels";
import { storefrontOverlayClass, useSessionStore } from "@/lib/store/session";
import { useRef, useState, type ReactNode } from "react";

function ItemAccordion({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#e8e8e8]">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-3.5 text-left"
      >
        <span className="text-[15px] font-bold text-[#1a1a1a]">{title}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-[#555] transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>
      {open ? (
        <div className="pb-3.5 text-[13px] leading-relaxed text-[#555]">
          {children}
        </div>
      ) : null}
    </div>
  );
}

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
  const setQuery = useCatalogStore((s) => s.setQuery);
  const setTag = useCatalogStore((s) => s.setTag);
  const setDepartment = useCatalogStore((s) => s.setDepartment);
  const size = productSize(current.id);

  const shopAllBrand = () => {
    if (current.brand === "Kirkland Signature") {
      setQuery("");
      setTag("kirkland");
    } else {
      setTag(null);
      setDepartment(null);
      setQuery(current.brand);
    }
    onClose();
  };

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
      className={`fixed z-[70] flex min-h-0 flex-col bg-white ${storefrontOverlayClass(kirkOpen)}`}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${current.brand} ${current.name}`}
        className="flex h-full min-h-0 flex-col"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#ececec] bg-white px-4 py-3">
          <p className="truncate pr-3 text-[13px] font-bold text-[#1a1a1a]">
            {current.brand} {current.name}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full p-2 hover:bg-[#f6f6f6]"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-[#555]" />
          </button>
        </div>

        <div ref={scrollerRef} className="min-h-0 flex-1 overflow-y-auto">
          <div className="lg:grid lg:grid-cols-2 lg:items-start">
          <div className="relative aspect-square border-b border-[#eee] bg-white lg:border-b-0 lg:border-r">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.image}
              alt={`${current.brand} ${current.name}`}
              className="absolute inset-0 h-full w-full object-contain p-8"
            />
            {current.savings > 0 && (
              <div className="absolute left-3 top-3 rounded-[4px] bg-costco-red px-2 py-1 text-[12px] font-bold text-white">
                ${current.savings.toFixed(2)} off
              </div>
            )}
            <SaveHeart
              productId={current.id}
              productName={current.name}
              className="absolute right-3 top-3 h-9 w-9"
            />
          </div>
          <div className="flex flex-col p-5">
            <h2 className="text-[22px] font-bold text-[#1a1a1a] leading-snug">
              {current.brand} {current.name}
            </h2>
            {size ? (
              <p className="mt-1 text-[14px] text-[#242424]">• {size}</p>
            ) : null}
            <button
              type="button"
              onClick={shopAllBrand}
              className="mt-2 w-fit text-[14px] font-bold text-costco-blue hover:underline"
            >
              Shop all {current.brand}
            </button>
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
            <div className="mt-5" key={current.id}>
              <ItemAccordion title="Details" defaultOpen>
                <p>
                  {aisleLabel(current.department)}
                  {current.category ? ` · ${current.category}` : ""}
                  {size ? ` · ${size}` : ""}
                </p>
                <p className="mt-1.5 text-[12px] text-[#888]">
                  Same-Day price · Membership required · Prices higher than
                  warehouse
                </p>
              </ItemAccordion>
              <ItemAccordion title="Ingredients">
                <p>See the warehouse package for the full ingredient list.</p>
              </ItemAccordion>
              <ItemAccordion title="Directions">
                <p>See the warehouse package for preparation and storage.</p>
              </ItemAccordion>
            </div>
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
