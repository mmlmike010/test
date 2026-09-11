"use client";

import { ChevronDown, X, Minus, Plus, Star, ZoomIn } from "lucide-react";
import SaveHeart from "@/components/SaveHeart";
import { products, type Product } from "@/lib/data/products";
import { useCartStore } from "@/lib/store/cart";
import { useCatalogStore } from "@/lib/store/catalog";
import StarRating from "@/components/StarRating";
import ProductCard from "@/components/ProductCard";
import { hideComposedLeftovers, officialPacksFirst } from "@/lib/ui/merchOrder";
import { productSize, unitPriceLabel, warehouseItemNumber } from "@/lib/ui/packSize";
import { aisleLabel } from "@/lib/ui/aisleLabels";
import { storefrontOverlayClass, useSessionStore } from "@/lib/store/session";
import { useListStore } from "@/lib/store/lists";
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
  const [zoomed, setZoomed] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const qty = useCartStore(
    (s) => s.items.find((i) => i.product.id === current.id)?.quantity || 0
  );
  const scrollerRef = useRef<HTMLDivElement>(null);
  const kirkOpen = useSessionStore((s) => s.kirkOpen);
  const inspectTone = useCatalogStore((s) => s.inspectTone);
  const warehouse = inspectTone === "warehouse";
  const setQuery = useCatalogStore((s) => s.setQuery);
  const setTag = useCatalogStore((s) => s.setTag);
  const setDepartment = useCatalogStore((s) => s.setDepartment);
  const saved = useListStore((s) =>
    Boolean(
      s.lists
        .find((list) => list.id === "shopping")
        ?.productIds.includes(current.id)
    )
  );
  const toggleList = useListStore((s) => s.toggle);
  const size = productSize(current.id);
  const perUnit = unitPriceLabel(current.id, current.price);

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

  const related = officialPacksFirst(
    hideComposedLeftovers(
      products.filter(
        (p) =>
          p.id !== current.id &&
          (p.department === current.department ||
            p.category === current.category)
      )
    )
  ).slice(0, 4);

  const onAdd = () => {
    addItem(current);
  };

  const openRelated = (next: Product) => {
    setZoomed(false);
    setCurrent(next);
    scrollerRef.current?.scrollTo({ top: 0 });
  };

  return (
    <>
    <div
      className={`fixed z-[74] flex min-h-0 flex-col bg-white ${storefrontOverlayClass(kirkOpen)}`}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${current.brand} ${current.name}`}
        className="flex h-full min-h-0 flex-col"
      >
        <div
          className={`flex shrink-0 items-center justify-between px-4 py-3 ${
            warehouse
              ? "border-b border-[#c4c4c4] bg-white"
              : "border-b border-[#ececec] bg-white"
          }`}
        >
          <p className="truncate pr-3 text-[13px] font-bold text-[#1a1a1a]">
            {current.brand} {current.name}
          </p>
          <button
            type="button"
            onClick={onClose}
            className={`shrink-0 p-2 ${
              warehouse
                ? "rounded-[3px] hover:bg-[#f7fbfe]"
                : "rounded-full hover:bg-[#f6f6f6]"
            }`}
            aria-label="Close"
          >
            <X className="h-5 w-5 text-[#555]" />
          </button>
        </div>
        {warehouse ? (
          <div className="h-[3px] bg-gradient-to-r from-[#a3841c] via-[#f3e3a3] to-[#a3841c]" />
        ) : null}

        <div ref={scrollerRef} className="min-h-0 flex-1 overflow-y-auto">
          <div
            className={
              kirkOpen
                ? "xl:grid xl:grid-cols-2 xl:items-start"
                : "lg:grid lg:grid-cols-2 lg:items-start"
            }
          >
          <div
            className={
              kirkOpen ? "xl:border-r xl:border-[#eee]" : "lg:border-r lg:border-[#eee]"
            }
          >
            <div
              className={`relative aspect-square ${
                warehouse ? "bg-white" : "bg-[#f3f4f5]"
              }`}
            >
              <button
                type="button"
                onClick={() => setZoomed(true)}
                className="absolute inset-0"
                aria-label="Enlarge product image"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={current.image}
                  alt={`${current.brand} ${current.name}`}
                  className="absolute inset-0 h-full w-full object-contain p-8"
                />
              </button>
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
              <button
                type="button"
                onClick={() => setZoomed(true)}
                className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.16)] hover:bg-[#f6f6f6]"
                aria-label="Zoom product image"
              >
                <ZoomIn className="h-4 w-4 text-[#333]" />
              </button>
            </div>
            <div
              className={`flex justify-start gap-2 border-b border-[#eee] bg-white px-4 py-3 ${
                kirkOpen ? "xl:border-b-0" : "lg:border-b-0"
              }`}
            >
              <button
                type="button"
                onClick={() => setZoomed(true)}
                className={`relative h-14 w-14 overflow-hidden border-2 border-[#1a1a1a] bg-white ${
                  warehouse ? "rounded-[3px]" : "rounded-[8px]"
                }`}
                aria-label="Selected product photo"
                aria-current="true"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={current.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-contain p-1"
                />
              </button>
            </div>
          </div>
          <div className="flex flex-col p-5">
            <h2 className="text-[22px] font-bold text-[#1a1a1a] leading-snug">
              {current.brand} {current.name}
            </h2>
            {size ? (
              <p className="mt-1 text-[14px] text-[#242424]">• {size}</p>
            ) : null}
            {warehouse ? (
              <p className="mt-0.5 text-[13px] text-[#72767E]">
                Item {warehouseItemNumber(current.id)}
              </p>
            ) : null}
            {perUnit ? (
              <p className="mt-0.5 text-[14px] text-[#242424]">• {perUnit}</p>
            ) : null}
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
              <button
                type="button"
                onClick={shopAllBrand}
                className="w-fit text-[14px] font-bold text-costco-blue hover:underline"
              >
                Shop all {current.brand}
              </button>
              <button
                type="button"
                onClick={() => toggleList(current.id)}
                aria-pressed={saved}
                className="w-fit text-[14px] font-bold text-costco-blue hover:underline"
              >
                {saved ? "Saved to list" : "Add to list"}
              </button>
            </div>
            <div className="mt-2">
              <StarRating
                rating={current.rating}
                reviewCount={current.reviewCount}
                size="md"
              />
            </div>

            <div className="mt-4 flex items-baseline gap-2 flex-wrap">
              <span
                className={`text-[28px] font-bold tabular-nums leading-none ${
                  warehouse ? "text-costco-red" : "text-[#1a1a1a]"
                }`}
              >
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
            <p className="mt-0.5 text-[12px] text-[#666]">Sold by Costco</p>
            <div className="mt-5" key={current.id}>
              <ItemAccordion title="Details" defaultOpen>
                <p>
                  {aisleLabel(current.department)}
                  {current.category ? ` · ${current.category}` : ""}
                  {size ? ` · ${size}` : ""}
                </p>
                <p className="mt-1.5 text-[12px] text-[#888]">
                  {warehouse
                    ? "Kirkland Signature shopping help · Membership required · Prices higher than warehouse"
                    : "Same-Day price · Membership required · Prices higher than warehouse"}
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

        <div
          className={`shrink-0 border-t bg-white px-5 py-3 flex items-center gap-3 ${
            warehouse ? "border-[#c4c4c4]" : "border-[#eee]"
          }`}
        >
          <div className="min-w-0">
            <p
              className={`text-[20px] font-bold tabular-nums leading-none ${
                warehouse ? "text-costco-red" : "text-[#1a1a1a]"
              }`}
            >
              ${current.price.toFixed(2)}
            </p>
            <p className="text-[12px] text-[#8a8a8a] mt-0.5">each</p>
          </div>
          {warehouse ? (
            qty === 0 ? (
              <button
                type="button"
                onClick={onAdd}
                className="flex-1 h-12 font-bold transition-colors flex items-center justify-center gap-2 rounded-[3px] bg-costco-red text-white hover:bg-costco-red-hover"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            ) : (
              <div className="flex-1 h-12 flex items-center justify-between rounded-[3px] border border-[#c4c4c4] bg-white overflow-hidden">
                <button
                  type="button"
                  className="w-14 h-12 flex items-center justify-center text-costco-blue hover:bg-[#f7fbfe]"
                  onClick={() => updateQuantity(current.id, qty - 1)}
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-[16px] font-bold tabular-nums min-w-[1.5rem] text-center text-[#1a1a1a]">
                  {qty}
                </span>
                <button
                  type="button"
                  className="w-14 h-12 flex items-center justify-center text-costco-blue hover:bg-[#f7fbfe]"
                  onClick={onAdd}
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )
          ) : qty === 0 ? (
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
    {zoomed ? (
      <div
        className={`fixed z-[80] flex items-center justify-center bg-black/70 p-4 ${storefrontOverlayClass(kirkOpen)}`}
        onClick={() => setZoomed(false)}
        role="dialog"
        aria-modal="true"
        aria-label="Enlarged product image"
      >
        <button
          type="button"
          className="absolute top-4 right-4 bg-white text-[#1a1a1a] px-3 py-1.5 text-sm font-bold shadow"
          onClick={() => setZoomed(false)}
        >
          Close
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.image}
          alt={`${current.brand} ${current.name} enlarged`}
          className="max-h-[90vh] max-w-[min(920px,96vw)] shadow-2xl object-contain bg-white"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    ) : null}
    </>
  );
}
