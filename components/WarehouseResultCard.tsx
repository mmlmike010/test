"use client";

import type { Product } from "@/lib/data/products";
import { useCatalogStore } from "@/lib/store/catalog";
import { productSize, warehouseItemNumber } from "@/lib/ui/packSize";
import { isLimitedOffer } from "@/lib/ui/warehouseSearch";
import AddControl from "@/components/AddControl";
import LimitedTimeOfferBadge from "@/components/LimitedTimeOfferBadge";
import StarRating from "@/components/StarRating";

/** costco.com search-grid tile. UI only — never sent to Kirk. */
export default function WarehouseResultCard({
  product,
  density = "search",
  compareChecked = false,
  onCompare,
}: {
  product: Product;
  density?: "search" | "featured" | "preview" | "catalog";
  compareChecked?: boolean;
  onCompare?: (checked: boolean) => void;
}) {
  const inspect = useCatalogStore((s) => s.inspect);
  const size = productSize(product.id);
  const featured = density === "featured";
  const preview = density === "preview";
  const catalog = density === "catalog";
  const chrome = !featured;

  return (
    <div className="flex flex-col border border-[#c4c4c4] bg-white rounded-[3px] overflow-hidden">
      <button
        type="button"
        onClick={() => inspect(product, "warehouse")}
        className="flex min-w-0 flex-1 flex-col text-left hover:bg-[#f7fbfe]"
      >
        <span
          className={`relative bg-white ${
            featured
              ? "h-[88px]"
              : preview
                ? "h-[112px]"
                : catalog
                  ? "h-[180px]"
                  : "aspect-square"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt=""
            className={`absolute inset-0 h-full w-full object-contain ${
              featured || preview ? "p-1.5" : "p-2.5"
            }`}
          />
          {chrome && isLimitedOffer(product) ? (
            <LimitedTimeOfferBadge compact={featured || preview} />
          ) : null}
        </span>
        <span className={`min-w-0 px-2 ${featured ? "pb-1 pt-0.5" : "pb-2 pt-1"}`}>
          <span
            className={`block font-bold leading-snug text-costco-blue hover:underline ${
              featured
                ? "text-[12px] line-clamp-1"
                : preview
                  ? "text-[12px] line-clamp-2"
                  : "text-[13px] line-clamp-2"
            }`}
          >
            {product.brand} {product.name}
          </span>
          {size ? (
            <span className="mt-0.5 block text-[11px] text-[#72767E]">{size}</span>
          ) : null}
          {chrome ? (
            <span className="mt-0.5 block text-[11px] text-[#72767E]">
              Item {warehouseItemNumber(product.id)}
            </span>
          ) : null}
          {chrome ? (
            <span className="mt-0.5 block">
              <StarRating
                rating={product.rating}
                reviewCount={product.reviewCount}
                size="sm"
                showCount={!preview}
              />
            </span>
          ) : null}
          <span className="mt-1 flex flex-wrap items-baseline gap-x-1 tabular-nums">
            <span
              className={`font-bold text-[#1a1a1a] ${
                featured || preview ? "text-[16px]" : "text-[18px]"
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
          {product.savings > 0 ? (
            <span className="mt-0.5 block text-[11px] font-semibold text-[#188038]">
              Save ${product.savings.toFixed(2)}
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
        {catalog && onCompare ? (
          <label
            className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#555]"
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
      </div>
    </div>
  );
}
