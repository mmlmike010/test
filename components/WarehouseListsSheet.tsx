"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import StoreSheet from "@/components/StoreSheet";
import WarehouseResultCard from "@/components/WarehouseResultCard";
import { products, type Product } from "@/lib/data/products";
import { useCartStore } from "@/lib/store/cart";
import { useCatalogStore } from "@/lib/store/catalog";
import { hydrateLists, useListStore } from "@/lib/store/lists";
import { useSessionStore } from "@/lib/store/session";

function resolveProducts(ids: string[]): Product[] {
  return ids
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));
}

/** costco.com Lists page. UI only — never sent to Kirk. */
export default function WarehouseListsSheet() {
  const closeSheet = useSessionStore((s) => s.closeSheet);
  const lists = useListStore((s) => s.lists);
  const createList = useListStore((s) => s.createList);
  const addItem = useCartStore((s) => s.addItem);
  const inspect = useCatalogStore((s) => s.inspect);
  const [activeId, setActiveId] = useState(lists[0]?.id ?? "shopping");
  const [newName, setNewName] = useState("");

  useEffect(() => {
    hydrateLists();
  }, []);

  const active = lists.find((list) => list.id === activeId) ?? lists[0];
  const items = active ? resolveProducts(active.productIds) : [];

  return (
    <StoreSheet title="Lists" onClose={closeSheet} tone="warehouse" page>
      <div className="flex flex-wrap items-center gap-2">
        {lists.map((list) => (
          <button
            key={list.id}
            type="button"
            onClick={() => setActiveId(list.id)}
            className={`h-9 rounded-[3px] border px-3 text-[13px] font-bold ${
              list.id === active?.id
                ? "border-costco-blue bg-[#f7fbfe] text-costco-blue"
                : "border-[#c4c4c4] bg-white text-[#1a1a1a] hover:border-costco-blue"
            }`}
          >
            {list.name}
          </button>
        ))}
      </div>
      <form
        className="mt-3 flex max-w-[420px]"
        onSubmit={(event) => {
          event.preventDefault();
          createList(newName);
          setNewName("");
        }}
      >
        <label className="sr-only" htmlFor="warehouse-new-list">
          Create a list
        </label>
        <input
          id="warehouse-new-list"
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          placeholder="Create a list"
          className="h-10 min-w-0 flex-1 rounded-l-[3px] border border-[#c4c4c4] px-3 text-[13px] text-[#1a1a1a] placeholder:text-[#8a8a8a] focus:border-costco-blue focus:outline-none focus:ring-2 focus:ring-costco-blue/15"
        />
        <button
          type="submit"
          className="h-10 rounded-r-[3px] bg-costco-red px-3 text-[13px] font-bold text-white hover:bg-costco-red-hover"
        >
          Create
        </button>
      </form>
      <div className="mt-5 flex items-end justify-between gap-3">
        <p className="text-[13px] text-[#555]">
          {items.length} item{items.length === 1 ? "" : "s"}
          {active ? ` · ${active.name}` : ""}
        </p>
        {items.length > 0 ? (
          <button
            type="button"
            onClick={() => {
              for (const product of items) addItem(product);
            }}
            className="h-10 rounded-[3px] bg-costco-red px-4 text-[13px] font-bold text-white hover:bg-costco-red-hover"
          >
            Add all to Cart
          </button>
        ) : null}
      </div>
      {items.length === 0 ? (
        <div className="mt-4 flex flex-col items-center border border-[#c4c4c4] bg-[#f6f7f8] px-6 py-10 text-center">
          <Heart className="h-8 w-8 text-[#c4c4c4]" />
          <p className="mt-3 text-[16px] font-bold text-[#1a1a1a]">
            This list is empty
          </p>
          <p className="mt-1 max-w-[22rem] text-[13px] text-[#555]">
            Save items with Add to List, then come back to shop them.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-3 xl:grid-cols-4">
          {items.map((product) => (
            <WarehouseResultCard
              key={product.id}
              product={product}
              density="catalog"
              onOpen={() => {
                closeSheet();
                inspect(product, "warehouse");
              }}
            />
          ))}
        </div>
      )}
    </StoreSheet>
  );
}
