"use client";

import { create } from "zustand";

export type ShopList = {
  id: string;
  name: string;
  productIds: string[];
};

const KEY = "costco-sameday-lists";
const SHOPPING_ID = "shopping";

const fallback: ShopList[] = [
  { id: SHOPPING_ID, name: "Shopping list", productIds: [] },
];

function readLists(): ShopList[] {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as ShopList[];
    if (!Array.isArray(parsed) || parsed.length === 0) return fallback;
    return parsed.every((list) => list.id && list.name && Array.isArray(list.productIds))
      ? parsed
      : fallback;
  } catch {
    return fallback;
  }
}

function writeLists(lists: ShopList[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(lists));
}

type ListState = {
  lists: ShopList[];
  toggle: (productId: string, listId?: string) => void;
  createList: (name: string) => void;
  removeList: (listId: string) => void;
};

export const useListStore = create<ListState>((set, get) => ({
  lists: fallback,
  toggle: (productId, listId = SHOPPING_ID) => {
    const lists = get().lists.map((list) => {
      if (list.id !== listId) return list;
      const has = list.productIds.includes(productId);
      return {
        ...list,
        productIds: has
          ? list.productIds.filter((id) => id !== productId)
          : [...list.productIds, productId],
      };
    });
    writeLists(lists);
    set({ lists });
  },
  createList: (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const lists = [
      ...get().lists,
      {
        id: `list-${get().lists.length + 1}`,
        name: trimmed,
        productIds: [],
      },
    ];
    writeLists(lists);
    set({ lists });
  },
  removeList: (listId) => {
    if (listId === SHOPPING_ID) return;
    const lists = get().lists.filter((list) => list.id !== listId);
    writeLists(lists);
    set({ lists });
  },
}));

export function hydrateLists() {
  useListStore.setState({ lists: readLists() });
}

export const SHOPPING_LIST_ID = SHOPPING_ID;
