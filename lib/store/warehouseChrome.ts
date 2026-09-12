"use client";

import { create } from "zustand";
import type { Product } from "@/lib/data/products";

type Added = {
  product: Product;
  quantity: number;
};

type WarehouseChrome = {
  added: Added | null;
  showAdded: (product: Product, quantity?: number) => void;
  clearAdded: () => void;
};

/** UI only — never sent to Kirk. */
export const useWarehouseChrome = create<WarehouseChrome>((set) => ({
  added: null,
  showAdded: (product, quantity = 1) =>
    set({ added: { product, quantity: Math.max(1, quantity) } }),
  clearAdded: () => set({ added: null }),
}));
