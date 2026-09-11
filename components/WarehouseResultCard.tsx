"use client";

import type { Product } from "@/lib/data/products";
import { useCatalogStore } from "@/lib/store/catalog";
import { productSize, warehouseItemNumber } from "@/lib/ui/packSize";
import AddControl from "@/components/AddControl";
import StarRating from "@/components/StarRating";

/** costco.com search-grid tile. UI only — never sent to Kirk. */
export default function WarehouseResultCard({
  product,
  density = "search",
}: {
  product: Product;
  density?: "search" | "featured";
}) {
  const inspect = useCatalogStore((s) => s.inspect);
  const size = productSize(product.id);
  const featured = density === "featured";

  return (
    <div className="flex flex-col border border-[#c4c4c4] bg-white rounded-[3px] overflow-hidden">
      <button
        type="button"
        onClick={() => inspect(product, "warehouse")}
        className="flex min-w-0 flex-1 flex-col text-left hover:bg-[#f7fbfe]"
      >
        <span
          className={`relative bg-white ${
            featured ? "h-[88px]" : "aspect-square"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt=""
            className={`absolute inset-0 h-full w-full object-contain ${
              featured ? "p-1.5" : "p-2.5"
            }`}
          />
        </span>
        <span className={`min-w-0 px-2 ${featured ? "pb-1 pt-0.5" : "pb-2 pt-1"}`}>
          <span
            className={`block font-bold leading-snug text-costco-blue hover:underline ${
              featured ? "text-[12px] line-clamp-1" : "text-[13px] line-clamp-2"
            }`}
          >
            {product.brand} {product.name}
          </span>
          {size ? (
            <span className="mt-0.5 block text-[11px] text-[#72767E]">{size}</span>
          ) : null}
          {featured ? null : (
            <span className="mt-0.5 block text-[11px] text-[#72767E]">
              Item {warehouseItemNumber(product.id)}
            </span>
          )}
          {featured ? null : (
            <span className="mt-0.5 block">
              <StarRating
                rating={product.rating}
                reviewCount={product.reviewCount}
                size="sm"
              />
            </span>
          )}
          <span className="mt-1 flex flex-wrap items-baseline gap-x-1 tabular-nums">
            <span
              className={`font-bold text-costco-red ${
                featured ? "text-[16px]" : "text-[18px]"
              }`}
            >
              ${product.price.toFixed(2)}
            </span>
            <span className="text-[11px] text-[#8a8a8a]">each</span>
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
          {featured ? null : (
            <span className="mt-1 block text-[11px] font-semibold text-[#188038]">
              Same-Day Delivery
            </span>
          )}
        </span>
      </button>
      <div className={`px-2 ${featured ? "pb-1.5" : "pb-2"}`}>
        <AddControl product={product} variant="inline" tone="warehouse" wide />
      </div>
    </div>
  );
}
