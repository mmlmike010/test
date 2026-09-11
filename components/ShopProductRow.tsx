"use client";

import type { Product } from "@/lib/data/products";
import { useCatalogStore } from "@/lib/store/catalog";
import { productSize, unitPriceLabel } from "@/lib/ui/packSize";
import AddControl from "@/components/AddControl";
import StarRating from "@/components/StarRating";

/** Same-Day shoppable row used in Meals and Ask Kirk. UI only. */
export default function ShopProductRow({
  product,
  tone = "sameday",
}: {
  product: Product;
  tone?: "sameday" | "warehouse";
}) {
  const inspect = useCatalogStore((s) => s.inspect);
  const size = productSize(product.id);
  const unit = unitPriceLabel(product.id, product.price);
  const warehouse = tone === "warehouse";

  if (warehouse) {
    return (
      <div className="flex w-full items-center gap-2 border border-[#c4c4c4] bg-white px-2 py-1.5 rounded-[3px]">
        <button
          type="button"
          onClick={() => inspect(product)}
          className="flex min-w-0 flex-1 items-center gap-2 text-left rounded-[3px] hover:bg-[#f7fbfe]"
        >
          <span className="relative h-14 w-14 shrink-0 overflow-hidden border border-[#eee] bg-white rounded-[3px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt=""
              className="absolute inset-0 h-full w-full object-contain p-0.5"
            />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-bold leading-snug text-costco-blue line-clamp-2 hover:underline">
              {product.brand} {product.name}
            </span>
            <span className="mt-0.5 flex items-center gap-1.5 min-w-0">
              {size ? (
                <span className="text-[11px] text-[#72767E] shrink-0">{size}</span>
              ) : null}
              <StarRating
                rating={product.rating}
                reviewCount={product.reviewCount}
                size="sm"
                showCount={false}
              />
            </span>
            <span className="mt-0.5 block tabular-nums">
              <span className="text-[16px] font-bold text-costco-red">
                ${product.price.toFixed(2)}
              </span>{" "}
              <span className="font-normal text-[#8a8a8a] text-[11px]">each</span>
              {product.originalPrice > product.price ? (
                <span className="ml-1 text-[12px] text-[#888] line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              ) : null}
              {product.savings > 0 ? (
                <span className="ml-1.5 text-[11px] font-semibold text-[#188038]">
                  Save ${product.savings.toFixed(2)}
                </span>
              ) : null}
            </span>
          </span>
        </button>
        <AddControl product={product} variant="inline" tone="warehouse" />
      </div>
    );
  }

  return (
    <div className="flex w-full items-center gap-2.5 border border-[#e8e8e8] bg-white px-2 py-2 rounded-[12px]">
      <button
        type="button"
        onClick={() => inspect(product)}
        className="flex min-w-0 flex-1 items-center gap-2.5 text-left rounded-[10px] hover:bg-[#fafafa]"
      >
        <span className="relative h-[72px] w-[72px] shrink-0 overflow-hidden border border-[#eee] bg-white rounded-[12px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt=""
            className="absolute inset-0 h-full w-full object-contain p-1"
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] leading-snug text-[#242424] line-clamp-2">
            {product.brand} {product.name}
          </span>
          {size ? (
            <span className="mt-0.5 block text-[12px] text-[#72767E]">{size}</span>
          ) : null}
          {unit ? (
            <span className="mt-0.5 block text-[12px] text-[#72767E]">{unit}</span>
          ) : null}
          <span className="mt-0.5 block text-[14px] font-bold tabular-nums text-[#1a1a1a]">
            ${product.price.toFixed(2)}{" "}
            <span className="font-normal text-[#8a8a8a] text-[12px]">each</span>
          </span>
          {product.savings > 0 ? (
            <span className="mt-0.5 block text-[12px] font-semibold text-[#188038]">
              Save ${product.savings.toFixed(2)}
            </span>
          ) : null}
        </span>
      </button>
      <AddControl product={product} variant="inline" />
    </div>
  );
}
