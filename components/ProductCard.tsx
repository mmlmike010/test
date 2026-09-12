"use client";

import type { Product } from "@/lib/data/products";
import { productSize, unitPriceLabel } from "@/lib/ui/packSize";
import AddControl from "@/components/AddControl";
import SaveHeart from "@/components/SaveHeart";

export default function ProductCard({
  product,
  onOpen,
  compact = false,
}: {
  product: Product;
  onOpen: () => void;
  compact?: boolean;
}) {
  const size = productSize(product.id);
  const unit = unitPriceLabel(product.id, product.price);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className={`bg-white text-left cursor-pointer rounded-[12px] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-costco-blue/40 overflow-hidden ${
        compact ? "w-[188px] shrink-0" : ""
      }`}
    >
      <div className="relative aspect-square bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          className="absolute inset-0 w-full h-full object-contain p-2"
        />
        {product.savings > 0 && (
          <div className="absolute top-2 left-2 bg-costco-red text-white px-1.5 py-[3px] text-[11px] font-bold rounded-[4px] leading-none">
            ${product.savings.toFixed(2)} off
          </div>
        )}
        <SaveHeart productId={product.id} productName={product.name} />
        <AddControl product={product} />
      </div>
      <div className="px-2.5 pb-3 pt-1">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span
            className={`${
              compact ? "text-[18px]" : "text-[20px]"
            } font-bold text-[#1a1a1a] tabular-nums leading-none`}
          >
            ${product.price.toFixed(2)}
          </span>
          <span className="text-[13px] text-[#8a8a8a]">each</span>
          <span className="text-[13px] text-[#8a8a8a] line-through tabular-nums">
            ${product.originalPrice.toFixed(2)}
          </span>
        </div>
        {product.savings > 0 && (
          <p className="text-[13px] font-semibold text-[#188038] mt-0.5">
            Save ${product.savings.toFixed(2)}
          </p>
        )}
        <h3 className="text-[14px] font-normal text-[#242424] leading-snug mt-1.5 line-clamp-3">
          {product.brand} {product.name}
        </h3>
        {size ? (
          <p className="text-[14px] leading-[18px] text-[#72767E] mt-0.5">
            {size}
          </p>
        ) : null}
        {unit ? (
          <p className="text-[13px] leading-[18px] text-[#72767E]">{unit}</p>
        ) : null}
        <p className="text-[12px] text-[#188038] mt-0.5">
          {product.inStock ? "Many in stock" : "Out of stock"}
        </p>
      </div>
    </div>
  );
}
