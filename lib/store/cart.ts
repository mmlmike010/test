"use client";

import { create } from "zustand";
import { Product } from "../data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

export type CartSnapshotItem = {
  id: string;
  brand: string;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
};

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getSnapshot: () => {
    items: CartSnapshotItem[];
    totalItems: number;
    subtotal: number;
  };
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  addItem: (product, qty = 1) =>
    set((state) => {
      const n = Math.max(1, Math.floor(qty));
      const existingItem = state.items.find(
        (item) => item.product.id === product.id
      );
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + n }
              : item
          ),
        };
      }
      return { items: [...state.items, { product, quantity: n }] };
    }),
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    })),
  updateQuantity: (productId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return {
          items: state.items.filter((item) => item.product.id !== productId),
        };
      }
      return {
        items: state.items.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        ),
      };
    }),
  clearCart: () => set({ items: [] }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
  getTotalItems: () =>
    get().items.reduce((total, item) => total + item.quantity, 0),
  getSubtotal: () =>
    get().items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    ),
  getSnapshot: () => {
    const items = get().items.map((item) => ({
      id: item.product.id,
      brand: item.product.brand,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      lineTotal: Number((item.product.price * item.quantity).toFixed(2)),
    }));
    return {
      items,
      totalItems: items.reduce((n, i) => n + i.quantity, 0),
      subtotal: Number(
        items.reduce((n, i) => n + i.lineTotal, 0).toFixed(2)
      ),
    };
  },
}));
