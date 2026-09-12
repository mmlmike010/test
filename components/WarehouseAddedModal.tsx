"use client";

import { X } from "lucide-react";
import { products } from "@/lib/data/products";
import { useCartStore } from "@/lib/store/cart";
import { useCatalogStore } from "@/lib/store/catalog";
import { useSessionStore } from "@/lib/store/session";
import { useWarehouseChrome } from "@/lib/store/warehouseChrome";
import { warehouseRelatedProducts } from "@/lib/ui/merchOrder";
import { instantSavingsText } from "@/lib/ui/instantSavings";
import { productSize, warehouseItemNumber } from "@/lib/ui/packSize";
import { useStorefrontOverlayClass } from "@/lib/store/session";
import WarehouseResultCard from "@/components/WarehouseResultCard";

/** costco.com “Item Added to Cart” confirm. UI only. */
export default function WarehouseAddedModal() {
  const added = useWarehouseChrome((s) => s.added);
  const clearAdded = useWarehouseChrome((s) => s.clearAdded);
  const kirkOpen = useSessionStore((s) => s.kirkOpen);
  const overlayClass = useStorefrontOverlayClass(kirkOpen);
  const setSheet = useSessionStore((s) => s.setSheet);
  const inspect = useCatalogStore((s) => s.inspect);
  const openCart = useCartStore((s) => s.openCart);
  const closeCart = useCartStore((s) => s.closeCart);

  if (!added) return null;

  const { product, quantity } = added;
  const line = product.price * quantity;
  const related = warehouseRelatedProducts(product, products, 4);

  const viewCart = () => {
    clearAdded();
    inspect(null);
    openCart("warehouse");
  };

  const checkout = () => {
    clearAdded();
    inspect(null);
    openCart("warehouse");
    closeCart();
    setSheet("checkout", "warehouse");
  };

  return (
    <div
      className={`fixed z-[76] flex items-end justify-center sm:items-center sm:p-4 ${overlayClass}`}
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/40"
        onClick={clearAdded}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Item Added to Cart"
        className="relative w-full max-w-[640px] overflow-hidden rounded-t-[3px] bg-white shadow-2xl sm:rounded-[3px]"
      >
        <div className="flex items-center justify-between border-b border-[#c4c4c4] px-4 py-3.5">
          <h2 className="text-[18px] font-bold leading-none text-[#1a1a1a]">
            Item Added to Cart
          </h2>
          <button
            type="button"
            onClick={clearAdded}
            className="rounded-[3px] p-2 hover:bg-[#f7fbfe]"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-[#555]" />
          </button>
        </div>
        <div className="flex gap-3 px-4 py-4">
          <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-[3px] border border-[#eee] bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt=""
              className="absolute inset-0 h-full w-full object-contain p-1"
            />
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-bold leading-snug text-costco-blue">
              {product.brand} {product.name}
            </p>
            {productSize(product.id) ? (
              <p className="mt-0.5 text-[12px] text-[#72767E]">
                {productSize(product.id)}
              </p>
            ) : null}
            <p className="mt-0.5 text-[12px] text-[#72767E]">
              Item {warehouseItemNumber(product.id)}
            </p>
            <p className="mt-1 text-[13px] text-[#555]">
              Qty {quantity} ·{" "}
              <span className="font-bold tabular-nums text-[#1a1a1a]">
                ${line.toFixed(2)}
              </span>
            </p>
            {instantSavingsText(product.savings) ? (
              <p className="mt-0.5 text-[12px] font-semibold text-[#188038]">
                {instantSavingsText(product.savings)}
              </p>
            ) : null}
          </div>
        </div>
        <div className="space-y-2 px-4 pb-4">
          <button
            type="button"
            onClick={viewCart}
            className="w-full rounded-[3px] border border-[#c4c4c4] bg-white py-2.5 text-[14px] font-bold text-costco-blue hover:bg-[#f7fbfe]"
          >
            View Cart
          </button>
          <button
            type="button"
            onClick={checkout}
            className="w-full rounded-[3px] bg-costco-red py-2.5 text-[14px] font-bold text-white hover:bg-costco-red-hover"
          >
            Checkout
          </button>
          <button
            type="button"
            onClick={clearAdded}
            className="w-full text-center text-[13px] font-bold text-costco-blue hover:underline"
          >
            Continue Shopping
          </button>
        </div>
        {related.length > 0 ? (
          <div className="border-t border-[#ececec] px-4 py-3">
            <p className="text-[13px] font-bold text-[#1a1a1a]">
              Related Products
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {related.map((item) => (
                <WarehouseResultCard
                  key={item.id}
                  product={item}
                  density="preview"
                  onOpen={() => {
                    clearAdded();
                    inspect(item, "warehouse");
                  }}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
