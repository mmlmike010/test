"use client";

import Image from "next/image";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
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
    <div className="fixed inset-0 z-[60] flex justify-end">
      <button
        type="button"
        aria-label="Close cart backdrop"
        className="absolute inset-0 bg-black/35"
        onClick={closeCart}
      />
      <aside className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#0060A9]" />
            <div>
              <h2 className="font-bold text-gray-900 text-sm">Your cart</h2>
              <p className="text-[11px] text-gray-500">
                {totalItems} item{totalItems === 1 ? "" : "s"} · Same-Day
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Close cart"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {items.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 text-center">
              <p className="font-semibold text-gray-900 mb-1">Cart is empty</p>
              <p className="text-sm text-gray-500">
                Ask Kirk to build a cart, or tap Add on any product.
              </p>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-xl p-3 flex gap-3"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <Image
                    src={product.image}
                    alt={`${product.brand} ${product.name}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-[#0060A9] font-medium">
                    {product.brand}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                    {product.name}
                  </p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">
                    ${product.price.toFixed(2)}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        className="p-1.5 hover:bg-gray-50"
                        onClick={() =>
                          updateQuantity(product.id, quantity - 1)
                        }
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 text-sm font-semibold min-w-[1.5rem] text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        className="p-1.5 hover:bg-gray-50"
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
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
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

        <div className="border-t border-gray-200 p-4 bg-white shrink-0 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-bold text-gray-900 text-lg">
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="px-3 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={closeCart}
              className="flex-1 py-2.5 bg-[#0060A9] text-white rounded-xl font-semibold hover:bg-blue-800"
            >
              {items.length ? "Continue shopping" : "Browse products"}
            </button>
          </div>
          <p className="text-[10px] text-gray-400 text-center">
            Ask Kirk can add, remove, and open this cart
          </p>
        </div>
      </aside>
    </div>
  );
}
