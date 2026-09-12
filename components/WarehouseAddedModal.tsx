"use client";

import { Check, X } from "lucide-react";
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
  const cartCount = useCartStore((s) => s.getTotalItems());
  const cartSubtotal = useCartStore((s) => s.getSubtotal());

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
        <div className="flex items-center justify-between border-b border-[#c4c4c4] bg-[#f6f7f8] px-4 py-3.5">
          <h2 className="flex items-center gap-2 text-[18px] font-bold leading-none text-[#1a1a1a]">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#188038] text-white">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
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
            <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.06em] text-[#555]">
              Your Price
            </p>
            <p className="text-[18px] font-bold tabular-nums text-[#1a1a1a]">
              ${line.toFixed(2)}
            </p>
            <p className="mt-0.5 text-[13px] text-[#555]">Qty {quantity}</p>
            {instantSavingsText(product.savings) ? (
              <p className="mt-0.5 text-[12px] font-semibold text-[#188038]">
                {instantSavingsText(product.savings)}
              </p>
            ) : null}
          </div>
        </div>
        <div className="mx-4 mb-3 flex items-center justify-between border border-[#c4c4c4] bg-[#f6f7f8] px-3 py-2">
          <p className="text-[13px] font-semibold text-[#555]">
            Cart Subtotal ({cartCount} item{cartCount === 1 ? "" : "s"})
          </p>
          <p className="text-[16px] font-bold tabular-nums text-[#1a1a1a]">
            ${cartSubtotal.toFixed(2)}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 px-4">
          <button
            type="button"
            onClick={viewCart}
            className="rounded-[3px] border border-[#c4c4c4] bg-white py-2.5 text-[14px] font-bold text-costco-blue hover:bg-[#f7fbfe]"
          >
            View Cart
          </button>
          <button
            type="button"
            onClick={checkout}
            className="rounded-[3px] bg-costco-red py-2.5 text-[14px] font-bold text-white hover:bg-costco-red-hover"
          >
            Checkout
          </button>
        </div>
        <button
          type="button"
          onClick={clearAdded}
          className="mt-2 mb-4 w-full text-center text-[13px] font-bold text-costco-blue hover:underline"
        >
          Continue Shopping
        </button>
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
