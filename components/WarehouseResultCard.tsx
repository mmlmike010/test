"use client";

import { Heart } from "lucide-react";
import type { Product } from "@/lib/data/products";
import { useCatalogStore } from "@/lib/store/catalog";
import { useListStore } from "@/lib/store/lists";
import { instantSavingsText } from "@/lib/ui/instantSavings";
import { productSize, unitPriceLabel, warehouseItemNumber } from "@/lib/ui/packSize";
import { isLimitedOffer } from "@/lib/ui/warehouseSearch";
import AddControl from "@/components/AddControl";
import LimitedTimeOfferBadge from "@/components/LimitedTimeOfferBadge";
import StarRating from "@/components/StarRating";

function AddToListLink({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const saved = useListStore((s) =>
    Boolean(
      s.lists
        .find((list) => list.id === "shopping")
        ?.productIds.includes(productId)
    )
  );
  const toggle = useListStore((s) => s.toggle);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        toggle(productId);
      }}
      className="inline-flex items-center gap-1 text-[11px] font-bold text-costco-blue hover:underline"
      aria-pressed={saved}
      aria-label={
        saved
          ? `Remove ${productName} from shopping list`
          : `Add ${productName} to list`
      }
    >
      <Heart className={`h-3 w-3 ${saved ? "fill-current" : ""}`} />
      {saved ? "Saved to List" : "Add to List"}
    </button>
  );
}

/** costco.com search-grid tile. UI only — never sent to Kirk. */
export default function WarehouseResultCard({
  product,
  density = "search",
  compareChecked = false,
  onCompare,
  onOpen,
}: {
  product: Product;
  density?: "search" | "featured" | "preview" | "catalog" | "list";
  compareChecked?: boolean;
  onCompare?: (checked: boolean) => void;
  onOpen?: () => void;
}) {
  const inspect = useCatalogStore((s) => s.inspect);
  const openItem = () => {
    if (onOpen) onOpen();
    else inspect(product, "warehouse");
  };
  const size = productSize(product.id);
  const featured = density === "featured";
  const preview = density === "preview";
  const catalog = density === "catalog";
  const list = density === "list";
  const chrome = !preview;

  if (list) {
    return (
      <div className="overflow-hidden rounded-[3px] border border-[#c4c4c4] bg-white">
        {isLimitedOffer(product) ? (
          <span className="block bg-costco-red py-0.5 text-center text-[9px] font-bold uppercase tracking-wide text-white">
            Limited-Time Offers
          </span>
        ) : null}
        <div className="flex gap-2.5 px-2 py-2">
          <button
            type="button"
            onClick={openItem}
            className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[3px] border border-[#eee] bg-[#f6f6f6] hover:bg-[#f7fbfe]"
            aria-label={`View ${product.brand} ${product.name}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt=""
              className="absolute inset-0 h-full w-full object-contain p-1.5"
            />
          </button>
          <div className="min-w-0 flex-1">
            <button
              type="button"
              onClick={openItem}
              className="block w-full text-left"
            >
              <span className="block text-[13px] font-bold leading-snug text-costco-blue line-clamp-2 hover:underline">
                {product.brand} {product.name}
              </span>
              <span className="mt-0.5 block text-[11px] text-[#72767E]">
                {size ? `${size} · ` : ""}Item {warehouseItemNumber(product.id)}
              </span>
              <span className="mt-0.5 block">
                <StarRating
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  size="sm"
                  showCount={false}
                />
              </span>
              <span className="mt-1 flex flex-wrap items-baseline gap-x-1.5 tabular-nums">
                <span className="text-[18px] font-bold text-[#1a1a1a]">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice > product.price ? (
                  <span className="text-[12px] text-[#888] line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                ) : null}
              </span>
              {instantSavingsText(product.savings) ? (
                <span className="mt-0.5 block text-[11px] font-semibold leading-snug text-[#188038]">
                  {instantSavingsText(product.savings)}
                </span>
              ) : null}
              <span className="mt-0.5 block text-[11px] font-semibold text-[#188038]">
                Delivery
              </span>
            </button>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <AddControl product={product} variant="inline" tone="warehouse" />
              {onCompare ? (
                <label
                  className="flex items-center gap-1.5 text-[11px] text-[#555]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={compareChecked}
                    onChange={(e) => onCompare(e.target.checked)}
                    className="accent-costco-blue"
                  />
                  Compare Product
                </label>
              ) : null}
              <AddToListLink productId={product.id} productName={product.name} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col border border-[#c4c4c4] bg-white rounded-[3px] overflow-hidden">
      {featured && isLimitedOffer(product) ? (
        <span className="block bg-costco-red py-0.5 text-center text-[9px] font-bold uppercase tracking-wide text-white">
          Limited-Time Offers
        </span>
      ) : null}
      <button
        type="button"
        onClick={openItem}
        className="flex min-w-0 flex-1 flex-col text-left hover:bg-[#f7fbfe]"
      >
        <span
          className={`relative ${
            featured
              ? "h-[140px] bg-[#f6f6f6]"
              : preview
                ? "h-[112px] bg-white"
                : catalog
                  ? "h-[180px] bg-white"
                  : "h-[150px] bg-white"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt=""
            className={`absolute inset-0 h-full w-full object-contain ${
              featured
                ? "p-2"
                : preview
                  ? "p-1.5"
                  : catalog
                    ? "p-2.5"
                    : "p-2"
            }`}
          />
          {chrome && !featured && isLimitedOffer(product) ? (
            <LimitedTimeOfferBadge compact={preview || !catalog} />
          ) : null}
          {chrome && onCompare ? (
            <label
              className="absolute right-1.5 top-1.5 z-10 flex items-center gap-1 rounded-[2px] bg-white/95 px-1 py-0.5 text-[11px] text-[#555] shadow-[0_1px_2px_rgba(0,0,0,0.12)]"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                checked={compareChecked}
                onChange={(e) => onCompare(e.target.checked)}
                className="accent-costco-blue"
              />
              Compare Product
            </label>
          ) : null}
        </span>
        <span className={`min-w-0 px-2 ${featured ? "pb-1 pt-1" : "pb-2 pt-1"}`}>
          <span
            className={`block font-bold leading-snug text-costco-blue hover:underline ${
              featured || preview
                ? "text-[12px] line-clamp-2"
                : "text-[13px] line-clamp-2"
            }`}
          >
            {product.brand} {product.name}
          </span>
          {featured ? (
            <span className="mt-0.5 block text-[11px] text-[#72767E]">
              {size ? `${size} · ` : ""}Item {warehouseItemNumber(product.id)}
            </span>
          ) : (
            <>
              {size ? (
                <span className="mt-0.5 block text-[11px] text-[#72767E]">
                  {size}
                </span>
              ) : null}
              {chrome ? (
                <span className="mt-0.5 block text-[11px] text-[#72767E]">
                  Item {warehouseItemNumber(product.id)}
                </span>
              ) : null}
            </>
          )}
          {chrome ? (
            <span className="mt-0.5 block">
              <StarRating
                rating={product.rating}
                reviewCount={product.reviewCount}
                size="sm"
                showCount={!featured && !preview}
              />
            </span>
          ) : null}
          {chrome && !preview ? (
            <span className="mt-1 block text-[11px] font-bold uppercase tracking-[0.06em] text-[#555]">
              Your Price
            </span>
          ) : null}
          <span className="mt-1 flex flex-wrap items-baseline gap-x-1 tabular-nums">
            <span
              className={`font-bold text-[#1a1a1a] ${
                featured || preview ? "text-[16px]" : "text-[20px]"
              }`}
            >
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice > product.price ? (
              <span className="text-[12px] text-[#888] line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            ) : null}
          </span>
          {chrome && !featured && !preview && unitPriceLabel(product.id, product.price) ? (
            <span className="mt-0.5 block text-[11px] text-[#72767E]">
              {unitPriceLabel(product.id, product.price)}
            </span>
          ) : null}
          {instantSavingsText(product.savings) ? (
            <span className="mt-0.5 block text-[11px] font-semibold leading-snug text-[#188038]">
              {instantSavingsText(product.savings)}
            </span>
          ) : null}
          {chrome && !preview ? (
            <span className="mt-0.5 block text-[11px] font-semibold text-[#188038]">
              Delivery
            </span>
          ) : null}
        </span>
      </button>
      <div className={`px-2 ${featured ? "pb-1.5" : "pb-2"}`}>
        <AddControl product={product} variant="inline" tone="warehouse" wide />
        {chrome ? (
          <div className="mt-1.5">
            <AddToListLink productId={product.id} productName={product.name} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
