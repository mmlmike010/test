"use client";

import { create } from "zustand";
import { products as catalog } from "@/lib/data/products";
import type { Product } from "@/lib/data/products";

type CatalogState = {
  q: string;
  department: string | null;
  tag: string | null;
  results: Product[];
  loading: boolean;
  error: string | null;
  inspecting: Product | null;
  openList: string | null;
  setQuery: (q: string) => void;
  setDepartment: (department: string | null) => void;
  setTag: (tag: string | null) => void;
  setOpenList: (openList: string | null) => void;
  inspect: (product: Product | null) => void;
  clearFilters: () => void;
  search: () => Promise<void>;
};

export const useCatalogStore = create<CatalogState>((set, get) => ({
  q: "",
  department: null,
  tag: null,
  results: catalog,
  loading: false,
  error: null,
  inspecting: null,
  openList: null,
  setQuery: (q) => set({ q }),
  setDepartment: (department) => set({ department, tag: null, openList: null }),
  setTag: (tag) => set({ tag, department: null, openList: null }),
  setOpenList: (openList) => set({ openList }),
  inspect: (inspecting) => set({ inspecting }),
  clearFilters: () => set({ q: "", department: null, tag: null, openList: null }),
  search: async () => {
    const { q, department, tag } = get();
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (department) params.set("department", department);
      if (tag) params.set("tag", tag);
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Search failed");
      set({ results: data.products || [], loading: false });
    } catch (e) {
      set({
        loading: false,
        error: e instanceof Error ? e.message : "Search failed",
      });
    }
  },
}));
