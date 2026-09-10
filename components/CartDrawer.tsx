"use client";

import { Minus, Plus, Trash2, X } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const items = useCartStore((s) => s.items);
  const closeCart = useCartStore((s) => s.closeCart);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const totalItems = useCartStore((s) => s.getTotalItems());

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex justify-end">
      <button
        type="button"
        aria-label="Close cart backdrop"
        className="absolute inset-0 bg-black/40"
        onClick={closeCart}
      />
      <aside className="relative w-full max-w-[400px] h-full bg-white shadow-2xl flex flex-col">
        <div className="px-4 py-3 border-b border-[#e5e5e5] flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-bold text-[#1a1a1a] text-[17px]">Cart</h2>
            <p className="text-[12px] text-[#666]">
              {totalItems} item{totalItems === 1 ? "" : "s"} · Delivery 8:48–9:18pm
            </p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Close cart"
          >
            <X className="w-5 h-5 text-[#555]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-white">
          {items.length === 0 ? (
            <div className="border border-dashed border-[#ccc] p-8 text-center mt-6">
              <p className="font-bold text-[#1a1a1a] mb-1">Your cart is empty</p>
              <p className="text-sm text-[#666]">
                Ask Kirk to build a cart, or tap + on any product.
              </p>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex gap-3 pb-4 border-b border-[#eee]"
              >
                <div className="relative w-[72px] h-[72px] overflow-hidden bg-[#f7f7f7] border border-[#eee] rounded-[8px] shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={`${product.brand} ${product.name}`}
                    className="absolute inset-0 w-full h-full object-contain p-1"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-[#666]">{product.brand}</p>
                  <p className="text-[14px] text-[#1a1a1a] leading-snug line-clamp-2">
                    {product.name}
                  </p>
                  <p className="text-[15px] font-bold text-[#1a1a1a] mt-1 tabular-nums">
                    ${product.price.toFixed(2)}{" "}
                    <span className="text-[12px] font-normal text-[#8a8a8a]">
                      each
                    </span>
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="flex items-center border border-[#c8c8c8] rounded-full overflow-hidden h-8">
                      <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-1 text-sm font-bold min-w-[1.5rem] text-center tabular-nums">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      className="p-1.5 text-[#777] hover:text-costco-red"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-costco-border p-4 bg-white shrink-0 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[#555] text-sm">Subtotal</span>
            <span className="font-bold text-[#1a1a1a] text-[22px] tabular-nums">
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="px-3 py-2.5 text-sm font-bold text-[#333] border border-[#c8c8c8] rounded-[3px] hover:bg-gray-50"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={closeCart}
              className="flex-1 py-3 bg-costco-red text-white rounded-full font-bold hover:bg-costco-red-hover text-[15px]"
            >
              {items.length ? "Go to checkout" : "Browse products"}
            </button>
          </div>
          <p className="text-[11px] text-[#888] text-center leading-snug">
            Service, delivery, and tax calculated at checkout · Membership
            required · Prices higher than warehouse
          </p>
        </div>
      </aside>
    </div>
  );
}
