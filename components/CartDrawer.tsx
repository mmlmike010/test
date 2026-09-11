"use client";

import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useCatalogStore } from "@/lib/store/catalog";
import WarehouseQtySelect from "@/components/WarehouseQtySelect";
import { productSize, unitPriceLabel, warehouseItemNumber } from "@/lib/ui/packSize";
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
  const inspect = useCatalogStore((s) => s.inspect);
  const cartTone = useCartStore((s) => s.cartTone);
  const warehouse = cartTone === "warehouse";
  const kirkOpen = useSessionStore((s) => s.kirkOpen);
  const windowId = useSessionStore((s) => s.windowId);
  const address = useSessionStore((s) => s.address);
  const specialRequest = useSessionStore((s) => s.specialRequest);
  const slot = deliveryWindow(windowId);

  if (!isOpen) return null;

  const goCheckout = () => {
    if (!items.length) {
      closeCart();
      return;
    }
    closeCart();
    setSheet("checkout");
  };

  if (warehouse) {
    return (
      <div
        className={`fixed z-[72] flex min-h-0 flex-col bg-[#e8eaed] ${storefrontOverlayClass(kirkOpen)}`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#c4c4c4] bg-white px-4 py-3.5">
          <div>
            <h2 className="text-[18px] font-bold leading-none text-[#1a1a1a]">
              Shopping Cart
            </h2>
            <p className="mt-1.5 text-[12px] font-semibold text-[#555]">
              {totalItems} item{totalItems === 1 ? "" : "s"} · Delivery to{" "}
              {address.line1}, {formatAddress(address)}
            </p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-[3px] p-2 hover:bg-[#f7fbfe]"
            aria-label="Close cart"
          >
            <X className="h-5 w-5 text-[#555]" />
          </button>
        </div>
        <div className="h-[3px] bg-gradient-to-r from-[#a3841c] via-[#f3e3a3] to-[#a3841c]" />

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="rounded-[3px] border border-[#c4c4c4] bg-white px-6 py-16 text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-[3px] border border-[#c4c4c4] bg-[#f7fbfe]">
                <ShoppingCart className="h-7 w-7 text-[#8a8a8a]" />
              </span>
              <p className="mt-4 text-[17px] font-bold text-[#1a1a1a]">
                Your shopping cart is empty
              </p>
              <p className="mt-1.5 text-[13px] leading-snug text-[#666]">
                Add items to get started, or ask Kirk to build a cart.
              </p>
              <button
                type="button"
                onClick={closeCart}
                className="mt-5 text-[13px] font-bold text-costco-blue hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-3 xl:grid xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start xl:gap-4 xl:space-y-0">
              <div className="space-y-3">
              <div className="overflow-hidden rounded-[3px] border border-[#c4c4c4] bg-white">
                <div className="border-b border-[#ececec] bg-[#f6f7f8] px-4 py-2 text-[12px] font-bold text-[#666]">
                  <p>
                    {totalItems} item{totalItems === 1 ? "" : "s"} · {slot.when}{" "}
                    {slot.label}
                  </p>
                  <div className="mt-2 hidden grid-cols-[minmax(0,1fr)_88px_104px_80px] gap-2 sm:grid">
                    <span>Item</span>
                    <span className="text-right">Item Price</span>
                    <span className="text-center">Quantity</span>
                    <span className="text-right">Total</span>
                  </div>
                </div>
                {items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="border-b border-[#f0f0f0] px-4 py-3.5 last:border-b-0"
                  >
                    <div className="flex flex-wrap items-end justify-between gap-3 sm:grid sm:grid-cols-[minmax(0,1fr)_88px_104px_80px] sm:items-start sm:gap-2">
                      <div className="flex w-full min-w-0 gap-3 sm:w-auto">
                        <button
                          type="button"
                          onClick={() => inspect(product, "warehouse")}
                          className="relative h-[96px] w-[96px] shrink-0 overflow-hidden rounded-[3px] border border-[#eee] bg-white"
                          aria-label={`View ${product.brand} ${product.name}`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={product.image}
                            alt=""
                            className="absolute inset-0 h-full w-full object-contain p-1"
                          />
                        </button>
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => inspect(product, "warehouse")}
                            className="text-left text-[14px] font-bold leading-snug text-costco-blue line-clamp-2 hover:underline"
                          >
                            {product.brand} {product.name}
                          </button>
                          {productSize(product.id) ? (
                            <p className="mt-0.5 text-[13px] text-[#72767E]">
                              {productSize(product.id)}
                            </p>
                          ) : null}
                          <p className="mt-0.5 text-[12px] text-[#72767E]">
                            Item {warehouseItemNumber(product.id)}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeItem(product.id)}
                            className="mt-2 text-[13px] font-bold text-costco-blue hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#666] sm:hidden">
                          Item Price
                        </p>
                        <p className="mt-0.5 text-[15px] font-bold tabular-nums text-[#1a1a1a] sm:mt-0 sm:text-right">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="sm:justify-self-center">
                        <WarehouseQtySelect
                          value={quantity}
                          onChange={(n) => updateQuantity(product.id, n)}
                          max={20}
                          labelled={false}
                          compact
                        />
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#666] sm:hidden">
                          Total
                        </p>
                        <p className="mt-0.5 text-[15px] font-bold tabular-nums text-[#1a1a1a] sm:mt-0">
                          ${(product.price * quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {specialRequest ? (
                <p className="px-1 text-[12px] leading-snug text-[#555]">
                  Special request: {specialRequest}
                </p>
              ) : null}
              <button
                type="button"
                onClick={closeCart}
                className="text-[13px] font-bold text-costco-blue hover:underline"
              >
                Continue Shopping
              </button>
              </div>
              <div className="rounded-[3px] border border-[#c4c4c4] bg-white px-4 py-4 xl:sticky xl:top-0">
                <p className="text-[15px] font-bold text-[#1a1a1a]">
                  Order Summary
                </p>
                <div className="mt-3 flex items-center justify-between text-[13px] text-[#555]">
                  <span>
                    Subtotal ({totalItems} item{totalItems === 1 ? "" : "s"})
                  </span>
                  <span className="tabular-nums">${subtotal.toFixed(2)}</span>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <span className="text-[13px] font-semibold text-[#555]">
                    Estimated Total
                  </span>
                  <span className="text-[24px] font-bold leading-none tabular-nums text-[#1a1a1a]">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={goCheckout}
                  className="mt-4 w-full rounded-[3px] bg-costco-red py-3 text-[15px] font-bold text-white hover:bg-costco-red-hover"
                >
                  Checkout
                </button>
                <button
                  type="button"
                  onClick={clearCart}
                  className="mt-3 w-full text-center text-[13px] font-bold text-costco-blue hover:underline"
                >
                  Clear cart
                </button>
                <p className="mt-3 text-center text-[11px] leading-snug text-[#888]">
                  Service, delivery, and tax calculated at checkout · Membership
                  required · Prices higher than warehouse
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

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
      <aside className="relative flex h-full w-full max-w-[400px] flex-col bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-[#ececec] px-4 py-3.5">
          <div>
            <h2 className="text-[18px] font-bold leading-none text-[#1a1a1a]">
              Cart
            </h2>
            <p className="mt-1.5 text-[12px] font-semibold text-[#188038]">
              {totalItems} item{totalItems === 1 ? "" : "s"} · Delivery{" "}
              {slot.label} · {formatAddress(address)}
            </p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-full p-2 hover:bg-[#f6f6f6]"
            aria-label="Close cart"
          >
            <X className="h-5 w-5 text-[#555]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-white px-4 py-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center px-6 pt-16 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f6f6f6]">
                <ShoppingCart className="h-7 w-7 text-[#8a8a8a]" />
              </span>
              <p className="mt-4 text-[17px] font-bold text-[#1a1a1a]">
                Your cart is empty
              </p>
              <p className="mt-1.5 text-[13px] leading-snug text-[#666]">
                Add items to get started, or ask Kirk to build a cart.
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-3 border-b border-[#f0f0f0] py-3.5"
                >
                  <button
                    type="button"
                    onClick={() => inspect(product)}
                    className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[12px] border border-[#eee] bg-white"
                    aria-label={`View ${product.brand} ${product.name}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-contain p-1"
                    />
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => inspect(product)}
                        className="line-clamp-2 text-left text-[14px] leading-snug text-[#242424] hover:underline"
                      >
                        {product.brand} {product.name}
                      </button>
                      <p className="shrink-0 text-[15px] font-bold tabular-nums text-[#1a1a1a]">
                        ${(product.price * quantity).toFixed(2)}
                      </p>
                    </div>
                    {productSize(product.id) && (
                      <p className="mt-0.5 text-[13px] text-[#72767E]">
                        {productSize(product.id)}
                      </p>
                    )}
                    {unitPriceLabel(product.id, product.price) ? (
                      <p className="mt-0.5 text-[13px] text-[#72767E]">
                        {unitPriceLabel(product.id, product.price)}
                      </p>
                    ) : null}
                    <p className="mt-0.5 text-[13px] tabular-nums text-[#8a8a8a]">
                      ${product.price.toFixed(2)} each
                    </p>
                    <p className="mt-0.5 text-[12px] text-[#666]">Sold by Costco</p>
                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <div className="flex h-9 items-center overflow-hidden rounded-full bg-[#0AAD0A] text-white">
                        <button
                          type="button"
                          className="flex h-9 w-9 items-center justify-center hover:bg-[#099809]"
                          onClick={() =>
                            updateQuantity(product.id, quantity - 1)
                          }
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-[1.5rem] px-1 text-center text-sm font-bold tabular-nums">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          className="flex h-9 w-9 items-center justify-center hover:bg-[#099809]"
                          onClick={() =>
                            updateQuantity(product.id, quantity + 1)
                          }
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        className="p-1.5 text-[#777] hover:text-costco-red"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {specialRequest && (
                <p className="mt-3 text-[12px] leading-snug text-[#555]">
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

        <div className="shrink-0 space-y-3 border-t border-[#ececec] bg-white p-4">
          <div className="flex items-end justify-between">
            <span className="text-[13px] font-semibold text-[#555]">
              Estimated total
            </span>
            <span className="text-[24px] font-bold leading-none tabular-nums text-[#1a1a1a]">
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="shrink-0 text-[13px] font-bold text-costco-blue hover:underline"
              >
                Clear cart
              </button>
            )}
            <button
              type="button"
              onClick={goCheckout}
              className="flex-1 rounded-full bg-[#0AAD0A] py-3 text-[15px] font-bold text-white hover:bg-[#099809]"
            >
              {items.length ? "Go to checkout" : "Browse products"}
            </button>
          </div>
          <p className="text-center text-[11px] leading-snug text-[#888]">
            Service, delivery, and tax calculated at checkout · Membership
            required · Prices higher than warehouse
          </p>
        </div>
      </aside>
    </div>
  );
}
