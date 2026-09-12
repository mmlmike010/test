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
      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="border border-[#c4c4c4] bg-[#f6f7f8]">
          <p className="border-b border-[#c4c4c4] px-3 py-2 text-[12px] font-bold uppercase tracking-[0.08em] text-[#555]">
            Your lists
          </p>
          <div className="flex flex-col">
            {lists.map((list) => (
              <button
                key={list.id}
                type="button"
                onClick={() => setActiveId(list.id)}
                className={`border-l-[3px] px-3 py-2.5 text-left text-[13px] font-bold ${
                  list.id === active?.id
                    ? "border-l-costco-blue bg-white text-costco-blue"
                    : "border-l-transparent text-[#1a1a1a] hover:bg-white hover:text-costco-blue"
                }`}
              >
                {list.name}
                <span className="mt-0.5 block text-[11px] font-semibold text-[#72767E]">
                  {list.productIds.length} item
                  {list.productIds.length === 1 ? "" : "s"}
                </span>
              </button>
            ))}
          </div>
          <form
            className="border-t border-[#c4c4c4] p-3"
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
              className="h-9 w-full border border-[#c4c4c4] bg-white px-2.5 text-[13px] text-[#1a1a1a] placeholder:text-[#8a8a8a] focus:border-costco-blue focus:outline-none focus:ring-2 focus:ring-costco-blue/15"
            />
            <button
              type="submit"
              className="mt-2 h-9 w-full bg-costco-red text-[13px] font-bold text-white hover:bg-costco-red-hover"
            >
              Create
            </button>
          </form>
        </aside>
        <div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-[20px] font-bold text-[#1a1a1a]">
                {active?.name ?? "Lists"}
              </h2>
              <p className="mt-0.5 text-[13px] text-[#555]">
                {items.length} item{items.length === 1 ? "" : "s"}
              </p>
            </div>
            {items.length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  for (const product of items) addItem(product);
                }}
                className="h-10 bg-costco-red px-4 text-[13px] font-bold text-white hover:bg-costco-red-hover"
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
            <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-7 xl:grid-cols-3">
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
        </div>
      </div>
    </StoreSheet>
  );
}
