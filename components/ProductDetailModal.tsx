"use client";

import { ChevronDown, X, Minus, Plus, Star, ZoomIn } from "lucide-react";
import SaveHeart from "@/components/SaveHeart";
import { products, type Product } from "@/lib/data/products";
import { useCartStore } from "@/lib/store/cart";
import { useCatalogStore } from "@/lib/store/catalog";
import StarRating from "@/components/StarRating";
import ProductCard from "@/components/ProductCard";
import WarehouseResultCard from "@/components/WarehouseResultCard";
import WarehouseQtySelect from "@/components/WarehouseQtySelect";
import GoldStarMark from "@/components/GoldStarMark";
import { warehouseRelatedProducts } from "@/lib/ui/merchOrder";
import { useWarehouseChrome } from "@/lib/store/warehouseChrome";
import { instantSavingsText } from "@/lib/ui/instantSavings";
import { productSize, unitPriceLabel, warehouseItemNumber } from "@/lib/ui/packSize";
import { isLimitedOffer } from "@/lib/ui/warehouseSearch";
import LimitedTimeOfferBadge from "@/components/LimitedTimeOfferBadge";
import WarehouseFooter from "@/components/WarehouseFooter";
import { aisleLabel } from "@/lib/ui/aisleLabels";
import { useStorefrontOverlayClass, useSessionStore } from "@/lib/store/session";
import { useListStore } from "@/lib/store/lists";
import { useRef, useState, type ReactNode } from "react";

/** Visual Costco rating mix from the catalog average. UI only. */
function ratingBarPercents(avg: number): number[] {
  const weights = [1, 2, 3, 4, 5].map((star) =>
    Math.max(0.03, 1.15 - Math.abs(star - avg) * 0.58)
  );
  const sum = weights.reduce((a, b) => a + b, 0);
  return weights.map((w) => (w / sum) * 100);
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <th className="w-[42%] border border-[#c4c4c4] bg-[#f6f7f8] px-3 py-2 text-left font-bold text-[#555]">
        {label}
      </th>
      <td className="border border-[#c4c4c4] px-3 py-2 text-[#1a1a1a]">{value}</td>
    </tr>
  );
}

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
  const [buyQty, setBuyQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const openCart = useCartStore((s) => s.openCart);
  const qty = useCartStore(
    (s) => s.items.find((i) => i.product.id === current.id)?.quantity || 0
  );
  const scrollerRef = useRef<HTMLDivElement>(null);
  const kirkOpen = useSessionStore((s) => s.kirkOpen);
  const overlayClass = useStorefrontOverlayClass(kirkOpen);
  const inspectTone = useCatalogStore((s) => s.inspectTone);
  const warehouse = inspectTone === "warehouse";
  const setQuery = useCatalogStore((s) => s.setQuery);
  const setTag = useCatalogStore((s) => s.setTag);
  const setDepartment = useCatalogStore((s) => s.setDepartment);
  const setListTone = useCatalogStore((s) => s.setListTone);
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
    setTag(null);
    setDepartment(null);
    const token =
      current.brand === "Kirkland Signature" ? "kirkland" : current.brand;
    setQuery(token);
    setListTone(warehouse ? "warehouse" : "sameday");
    onClose();
  };

  const related = warehouseRelatedProducts(current, products, 8);

  const onAdd = () => {
    addItem(current, warehouse ? buyQty : 1);
    if (warehouse) {
      useWarehouseChrome.getState().showAdded(current, buyQty);
      setJustAdded(true);
      window.setTimeout(() => setJustAdded(false), 900);
    }
  };

  const openRelated = (next: Product) => {
    setZoomed(false);
    setCurrent(next);
    scrollerRef.current?.scrollTo({ top: 0 });
  };

  return (
    <>
    <div
      className={`fixed z-[74] flex min-h-0 flex-col bg-white ${overlayClass}`}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${current.brand} ${current.name}`}
        className="flex h-full min-h-0 flex-col"
      >
        {warehouse ? null : (
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
        )}

        <div
          ref={scrollerRef}
          className={`min-h-0 flex-1 overflow-y-auto ${
            warehouse ? "pb-8" : ""
          }`}
        >
          {warehouse ? (
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-x-1.5 px-4 pt-4 text-[11px] text-[#555] lg:px-6"
            >
              <button
                type="button"
                onClick={onClose}
                className="font-bold text-costco-blue hover:underline"
              >
                Home
              </button>
              <span aria-hidden="true">›</span>
              <span>
                {current.brand === "Kirkland Signature"
                  ? "Kirkland Signature"
                  : aisleLabel(current.department)}
              </span>
              <span aria-hidden="true">›</span>
              <span className="line-clamp-1 text-[#1a1a1a]">
                {current.brand} {current.name}
              </span>
            </nav>
          ) : null}
          <div className="lg:grid lg:grid-cols-2 lg:items-start">
          <div
            className={
              warehouse
                ? "bg-white lg:sticky lg:top-0 lg:border-r lg:border-[#eee]"
                : "lg:border-r lg:border-[#eee]"
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
              {warehouse && isLimitedOffer(current) ? (
                <LimitedTimeOfferBadge />
              ) : !warehouse && current.savings > 0 ? (
                <div className="absolute left-3 top-3 rounded-[4px] bg-costco-red px-2 py-1 text-[12px] font-bold text-white">
                  ${current.savings.toFixed(2)} off
                </div>
              ) : null}
              {warehouse ? null : (
                <SaveHeart
                  productId={current.id}
                  productName={current.name}
                  className="absolute right-3 top-3 h-9 w-9"
                />
              )}
              <button
                type="button"
                onClick={() => setZoomed(true)}
                className={`absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center bg-white shadow-[0_1px_4px_rgba(0,0,0,0.16)] hover:bg-[#f6f6f6] ${
                  warehouse ? "rounded-[3px]" : "rounded-full"
                }`}
                aria-label="Zoom product image"
              >
                <ZoomIn className="h-4 w-4 text-[#333]" />
              </button>
            </div>
            {warehouse ? null : (
            <div
              className={`flex justify-start gap-2 border-b border-[#eee] bg-white px-4 py-3 ${
                  "lg:border-b-0"
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
            )}
          </div>
          <div className={`flex flex-col p-5 ${warehouse ? "bg-white" : ""}`}>
            <h1
              className={`font-bold leading-snug ${
                warehouse
                  ? "text-[24px] text-costco-blue"
                  : "text-[22px] text-[#1a1a1a]"
              }`}
            >
              {current.brand} {current.name}
            </h1>
            {size ? (
              <p className="mt-1 text-[14px] text-[#242424]">
                {warehouse ? size : `• ${size}`}
              </p>
            ) : null}
            {warehouse ? (
              <p className="mt-0.5 text-[13px] text-[#72767E]">
                Item {warehouseItemNumber(current.id)}
                {perUnit ? ` · ${perUnit}` : ""}
              </p>
            ) : null}
            {perUnit && !warehouse ? (
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

            {warehouse ? (
              <div className="mt-4 rounded-[3px] border border-[#c4c4c4] bg-white px-3.5 py-3.5">
                <p className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.06em] text-[#555]">
                  Your Price
                  <span className="inline-flex items-center gap-1 normal-case tracking-normal text-costco-blue">
                    <GoldStarMark size={12} />
                    Member
                  </span>
                </p>
                <div className="mt-1 flex flex-wrap items-baseline gap-2">
                  <span className="text-[28px] font-bold tabular-nums leading-none text-[#1a1a1a]">
                    ${current.price.toFixed(2)}
                  </span>
                  {current.originalPrice > current.price ? (
                    <span className="text-sm text-[#888] line-through tabular-nums">
                      ${current.originalPrice.toFixed(2)}
                    </span>
                  ) : null}
                </div>
                {instantSavingsText(current.savings) ? (
                  <p className="mt-1 text-[13px] font-bold leading-snug text-[#188038]">
                    {instantSavingsText(current.savings)}
                  </p>
                ) : null}
                <div className="mt-3 flex items-end gap-2">
                  <WarehouseQtySelect value={buyQty} onChange={setBuyQty} />
                  <button
                    type="button"
                    onClick={onAdd}
                    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[3px] bg-costco-red text-[15px] font-bold text-white hover:bg-costco-red-hover"
                  >
                    {justAdded ? "Added" : "Add to Cart"}
                  </button>
                </div>
                {qty > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      openCart("warehouse");
                    }}
                    className="mt-2 text-[13px] font-bold text-costco-blue hover:underline"
                  >
                    {qty} in cart · View Cart
                  </button>
                ) : null}
                <div className="mt-3 rounded-[3px] border-2 border-costco-blue bg-[#f7fbfe] px-3.5 py-3">
                  <p className="flex items-center gap-2 text-[13px] font-bold text-[#1a1a1a]">
                    <span
                      className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-costco-blue"
                      aria-hidden="true"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-costco-blue" />
                    </span>
                    Delivery
                  </p>
                  <p className="mt-1 text-[13px] font-semibold text-[#188038]">
                    Same-Day Delivery ·{" "}
                    {current.inStock ? "In Stock" : "Out of stock"}
                  </p>
                  <p className="mt-0.5 text-[12px] leading-snug text-[#666]">
                    Membership required · Prices higher than warehouse
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="mt-4 flex flex-wrap items-baseline gap-2">
                  <span className="text-[28px] font-bold tabular-nums leading-none text-[#1a1a1a]">
                    ${current.price.toFixed(2)}
                  </span>
                  <span className="text-[15px] text-[#8a8a8a]">each</span>
                  <span className="text-sm text-[#888] line-through tabular-nums">
                    ${current.originalPrice.toFixed(2)}
                  </span>
                </div>
                {current.savings > 0 ? (
                  <p className="mt-1 text-[13px] font-bold text-[#2e7d32]">
                    Save ${current.savings.toFixed(2)}
                  </p>
                ) : null}
                <p className="mt-2 text-[12px] text-[#188038]">
                  {current.inStock ? "Many in stock" : "Out of stock"}
                  <span className="text-[#666]">
                    {" "}
                    · {aisleLabel(current.department)}
                  </span>
                </p>
                <p className="mt-0.5 text-[12px] text-[#666]">Sold by Costco</p>
              </>
            )}
            <div className="mt-5" key={current.id}>
              {warehouse ? (
                <>
                  <ItemAccordion title="Features" defaultOpen>
                    <ul className="list-disc space-y-1 pl-5">
                      <li>{current.brand}</li>
                      {size ? <li>{size}</li> : null}
                      {current.category ? <li>{current.category}</li> : null}
                      <li>Same-Day Delivery</li>
                      <li>Membership required</li>
                      {isLimitedOffer(current) ? (
                        <li>Limited-Time Offer</li>
                      ) : null}
                    </ul>
                  </ItemAccordion>
                  <ItemAccordion title="Specifications" defaultOpen>
                    <table className="w-full border-collapse text-[13px]">
                      <tbody>
                        <SpecRow label="Brand" value={current.brand} />
                        <SpecRow
                          label="Item Number"
                          value={warehouseItemNumber(current.id)}
                        />
                        {size ? <SpecRow label="Size" value={size} /> : null}
                        {perUnit ? (
                          <SpecRow label="Unit Price" value={perUnit} />
                        ) : null}
                        {current.category ? (
                          <SpecRow label="Category" value={current.category} />
                        ) : null}
                        <SpecRow
                          label="Department"
                          value={aisleLabel(current.department)}
                        />
                        <SpecRow
                          label="Availability"
                          value={current.inStock ? "In Stock" : "Out of stock"}
                        />
                        <SpecRow
                          label="Delivery"
                          value="Same-Day Delivery"
                        />
                        <SpecRow label="Sold By" value="Costco" />
                        <SpecRow label="Membership" value="Required" />
                      </tbody>
                    </table>
                  </ItemAccordion>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
          </div>

        {related.length > 0 && (
          <div
            className={`px-5 pb-5 ${
              warehouse ? "mx-4 mb-3 bg-white pt-6" : ""
            }`}
          >
            <h3
              className={`mb-2.5 font-bold text-[#1a1a1a] ${
                warehouse ? "text-[20px]" : "text-[15px]"
              }`}
            >
              {warehouse ? "Related Products" : "Related products"}
            </h3>
            {warehouse ? (
              <div className="grid grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-3 xl:grid-cols-4">
                {related.map((item) => (
                  <WarehouseResultCard
                    key={item.id}
                    product={item}
                    density="catalog"
                  />
                ))}
              </div>
            ) : (
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
            )}
          </div>
        )}

        <div
          className={`px-5 pb-6 pt-4 ${
            warehouse
              ? "mx-4 mb-4 border-t border-[#ececec] bg-white"
              : "border-t border-[#eee]"
          }`}
        >
          <h3
            className={`mb-1 font-bold text-[#1a1a1a] ${
              warehouse ? "text-[20px]" : "text-[15px]"
            }`}
          >
            {warehouse ? "Reviews" : "Member reviews"}
          </h3>
          <p className="text-[12px] text-[#666] mb-4">
            Based on {current.reviewCount.toLocaleString()} ratings
          </p>
          {warehouse ? (
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="shrink-0">
                <p className="text-[32px] font-bold leading-none tabular-nums text-[#1a1a1a]">
                  {current.rating.toFixed(1)}
                </p>
                <div className="mt-1">
                  <StarRating
                    rating={current.rating}
                    reviewCount={current.reviewCount}
                    size="md"
                    showCount={false}
                  />
                </div>
                <p className="mt-1 text-[12px] text-[#666]">
                  {current.reviewCount.toLocaleString()} ratings
                </p>
              </div>
              <ul className="min-w-0 flex-1 space-y-1">
                {ratingBarPercents(current.rating)
                  .map((pct, idx) => ({ star: idx + 1, pct }))
                  .reverse()
                  .map(({ star, pct }) => (
                    <li
                      key={star}
                      className="grid grid-cols-[52px_minmax(0,1fr)_40px] items-center gap-2 text-[12px] text-[#555]"
                    >
                      <span>{star} star{star === 1 ? "" : "s"}</span>
                      <span className="h-2.5 overflow-hidden rounded-[2px] bg-[#e8eaed]">
                        <span
                          className="block h-full bg-[#F6C344]"
                          style={{ width: `${Math.max(2, pct)}%` }}
                        />
                      </span>
                      <span className="tabular-nums text-right text-[#72767E]">
                        {Math.round((pct / 100) * current.reviewCount)}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          ) : null}
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
        {warehouse ? <WarehouseFooter className="mt-8" /> : null}
        </div>

        <div
          className={`shrink-0 border-t bg-white px-5 py-3 flex items-center gap-3 ${
            warehouse ? "border-[#c4c4c4]" : "border-[#eee]"
          }`}
        >
          <div className="min-w-0">
            <p
              className="text-[20px] font-bold tabular-nums leading-none text-[#1a1a1a]"
            >
              ${current.price.toFixed(2)}
            </p>
            <p className="text-[12px] text-[#8a8a8a] mt-0.5">
              {warehouse ? "Your Price" : "each"}
            </p>
          </div>
          {warehouse ? (
            <div className="flex flex-1 items-center gap-2">
              <WarehouseQtySelect
                value={buyQty}
                onChange={setBuyQty}
                labelled={false}
              />
              <button
                type="button"
                onClick={onAdd}
                className="flex h-12 flex-1 items-center justify-center rounded-[3px] bg-costco-red text-[15px] font-bold text-white hover:bg-costco-red-hover"
              >
                {justAdded ? "Added" : "Add to Cart"}
              </button>
            </div>
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
        className={`fixed z-[80] flex items-center justify-center bg-black/70 p-4 ${overlayClass}`}
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
