"use client";

import type { Product } from "@/lib/data/products";
import { useCatalogStore } from "@/lib/store/catalog";
import { productSize, unitPriceLabel } from "@/lib/ui/packSize";
import AddControl from "@/components/AddControl";

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

  return (
    <div
      className={`flex w-full items-center gap-2.5 border border-[#e8e8e8] bg-white px-2 py-2 ${
        warehouse ? "rounded-[3px]" : "rounded-[12px]"
      }`}
    >
      <button
        type="button"
        onClick={() => inspect(product)}
        className={`flex min-w-0 flex-1 items-center gap-2.5 text-left hover:bg-[#fafafa] ${
          warehouse ? "rounded-[3px]" : "rounded-[10px]"
        }`}
      >
        <span
          className={`relative h-[72px] w-[72px] shrink-0 overflow-hidden border border-[#eee] bg-white ${
            warehouse ? "rounded-[3px]" : "rounded-[12px]"
          }`}
        >
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
            <span className="font-normal text-[#8a8a8a]">each</span>
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
