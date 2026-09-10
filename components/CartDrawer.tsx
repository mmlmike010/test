"use client";

import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { productSize } from "@/lib/ui/packSize";
import {
  deliveryWindow,
  formatAddress,
  storefrontOverlayClass,
  useSessionStore,
} from "@/lib/store/session";

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const items = useCartStore((s) => s.items);
  const closeCart = useCartStore((s) => s.closeCart);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const totalItems = useCartStore((s) => s.getTotalItems());
  const setSheet = useSessionStore((s) => s.setSheet);
  const kirkOpen = useSessionStore((s) => s.kirkOpen);
  const windowId = useSessionStore((s) => s.windowId);
  const address = useSessionStore((s) => s.address);
  const specialRequest = useSessionStore((s) => s.specialRequest);
  const slot = deliveryWindow(windowId);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-[72] flex justify-end ${storefrontOverlayClass(kirkOpen)}`}
    >
      <button
        type="button"
        aria-label="Close cart backdrop"
        className="absolute inset-0 bg-black/40"
        onClick={closeCart}
      />
      <aside className="relative w-full max-w-[400px] h-full bg-white shadow-2xl flex flex-col">
        <div className="px-4 py-3.5 border-b border-[#ececec] flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-bold text-[#1a1a1a] text-[18px] leading-none">
              Cart
            </h2>
            <p className="text-[12px] text-[#188038] font-semibold mt-1.5">
              {totalItems} item{totalItems === 1 ? "" : "s"} · Delivery{" "}
              {slot.label} · {formatAddress(address)}
            </p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="p-2 rounded-full hover:bg-[#f6f6f6]"
            aria-label="Close cart"
          >
            <X className="w-5 h-5 text-[#555]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 bg-white">
          {items.length === 0 ? (
            <div className="flex flex-col items-center text-center pt-16 px-6">
              <span className="w-16 h-16 rounded-full bg-[#f6f6f6] flex items-center justify-center">
                <ShoppingCart className="w-7 h-7 text-[#8a8a8a]" />
              </span>
              <p className="font-bold text-[#1a1a1a] text-[17px] mt-4">
                Your cart is empty
              </p>
              <p className="text-[13px] text-[#666] mt-1.5 leading-snug">
                Add items to get started, or ask Kirk to build a cart.
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-3 py-3.5 border-b border-[#f0f0f0]"
                >
                  <div className="relative w-[72px] h-[72px] overflow-hidden bg-white border border-[#eee] rounded-[12px] shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={`${product.brand} ${product.name}`}
                      className="absolute inset-0 w-full h-full object-contain p-1"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[14px] text-[#242424] leading-snug line-clamp-2">
                        {product.brand} {product.name}
                      </p>
                      <p className="text-[15px] font-bold text-[#1a1a1a] tabular-nums shrink-0">
                        ${(product.price * quantity).toFixed(2)}
                      </p>
                    </div>
                    {productSize(product.id) && (
                      <p className="text-[13px] text-[#72767E] mt-0.5">
                        {productSize(product.id)}
                      </p>
                    )}
                    <p className="text-[13px] text-[#8a8a8a] mt-0.5 tabular-nums">
                      ${product.price.toFixed(2)} each
                    </p>
                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <div className="flex items-center rounded-full overflow-hidden h-9 bg-[#0AAD0A] text-white">
                        <button
                          type="button"
                          className="w-9 h-9 flex items-center justify-center hover:bg-[#099809]"
                          onClick={() =>
                            updateQuantity(product.id, quantity - 1)
                          }
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-1 text-sm font-bold min-w-[1.5rem] text-center tabular-nums">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          className="w-9 h-9 flex items-center justify-center hover:bg-[#099809]"
                          onClick={() =>
                            updateQuantity(product.id, quantity + 1)
                          }
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
              ))}
              {specialRequest && (
                <p className="mt-3 text-[12px] text-[#555] leading-snug">
                  Special request: {specialRequest}
                </p>
              )}
              <button
                type="button"
                onClick={closeCart}
                className="mt-3 text-[13px] font-bold text-costco-blue hover:underline"
              >
                Add more items
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-[#ececec] p-4 bg-white shrink-0 space-y-3">
          <div className="flex items-end justify-between">
            <span className="text-[#555] text-[13px] font-semibold">
              Estimated total
            </span>
            <span className="font-bold text-[#1a1a1a] text-[24px] tabular-nums leading-none">
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-[13px] font-bold text-costco-blue hover:underline shrink-0"
              >
                Clear cart
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (!items.length) {
                  closeCart();
                  return;
                }
                closeCart();
                setSheet("checkout");
              }}
              className="flex-1 py-3 bg-[#0AAD0A] text-white rounded-full font-bold hover:bg-[#099809] text-[15px]"
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
