"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, Heart, ListPlus, ShoppingCart } from "lucide-react";
import { filterProducts, products, type Product } from "@/lib/data/products";
import { useCatalogStore } from "@/lib/store/catalog";
import { useCartStore } from "@/lib/store/cart";
import { hydrateLists, useListStore } from "@/lib/store/lists";
import ProductCard from "@/components/ProductCard";

export default function ListsView() {
  const clearFilters = useCatalogStore((s) => s.clearFilters);
  const search = useCatalogStore((s) => s.search);
  const lists = useListStore((s) => s.lists);
  const createList = useListStore((s) => s.createList);
  const addItem = useCartStore((s) => s.addItem);
  const inspect = useCatalogStore((s) => s.inspect);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const again = filterProducts({ tag: "again" });

  useEffect(() => {
    hydrateLists();
  }, []);

  const goShop = () => {
    clearFilters();
    void search();
    document.querySelector("main")?.scrollTo({ top: 0 });
  };

  const addAgain = () => {
    for (const product of again) addItem(product);
  };

  return (
    <div>
      <button
        type="button"
        onClick={goShop}
        className="mb-3 inline-flex items-center gap-0.5 text-[13px] font-bold text-costco-blue hover:underline"
      >
        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        Shop
      </button>

      <div className="mb-4 flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-[22px] lg:text-[24px] font-bold text-[#1a1a1a] tracking-tight">
            Lists
          </h1>
          <p className="text-[13px] text-[#666] mt-0.5">
            Buy it again and saved items · Same-Day · 11217 Brooklyn
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-full border border-[#d0d0d0] bg-white text-[13px] font-bold text-[#1a1a1a] hover:bg-[#f6f6f6]"
        >
          <ListPlus className="w-4 h-4" />
          Create a list
        </button>
      </div>

      {creating && (
        <form
          className="mb-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            createList(newName);
            setNewName("");
            setCreating(false);
          }}
        >
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="List name"
            className="flex-1 h-10 px-3.5 bg-white border border-[#d8d8d8] rounded-full text-[14px] focus:outline-none focus:border-costco-blue focus:ring-2 focus:ring-costco-blue/15"
          />
          <button
            type="submit"
            disabled={!newName.trim()}
            className="h-10 px-4 rounded-full bg-[#0AAD0A] text-white text-[13px] font-bold disabled:opacity-50"
          >
            Save
          </button>
          <button
            type="button"
            className="h-10 px-3 text-[13px] font-bold text-[#555]"
            onClick={() => {
              setCreating(false);
              setNewName("");
            }}
          >
            Cancel
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <a
          href="#buy-it-again"
          className="rounded-[12px] bg-white border border-[#ececec] px-4 py-3.5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
        >
          <p className="text-[15px] font-bold text-[#1a1a1a]">Buy it again</p>
          <p className="text-[13px] text-[#666] mt-0.5">
            {again.length} item{again.length === 1 ? "" : "s"} from this warehouse
          </p>
        </a>
        {lists.map((list) => (
          <a
            key={list.id}
            href={`#list-${list.id}`}
            className="rounded-[12px] bg-white border border-[#ececec] px-4 py-3.5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
          >
            <p className="text-[15px] font-bold text-[#1a1a1a]">{list.name}</p>
            <p className="text-[13px] text-[#666] mt-0.5">
              {list.productIds.length} item
              {list.productIds.length === 1 ? "" : "s"}
            </p>
          </a>
        ))}
      </div>

      <section id="buy-it-again" className="mb-7">
        <div className="mb-3 flex items-end justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-[18px] lg:text-[20px] font-bold text-[#1a1a1a] tracking-tight">
              Buy it again
            </h2>
            <p className="text-[13px] text-[#666] mt-0.5">
              {again.length} item{again.length === 1 ? "" : "s"} · Gold Star member
            </p>
          </div>
          {again.length > 0 && (
            <button
              type="button"
              onClick={addAgain}
              className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-full bg-[#0AAD0A] text-white text-[13px] font-bold hover:bg-[#099809]"
            >
              <ShoppingCart className="w-4 h-4" />
              Add all
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          {again.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpen={() => inspect(product)}
            />
          ))}
        </div>
      </section>

      {lists.map((list) => {
        const items = list.productIds
          .map((id) => products.find((p) => p.id === id))
          .filter((p): p is Product => Boolean(p));
        return (
          <section key={list.id} id={`list-${list.id}`} className="mb-7">
            <h2 className="text-[18px] lg:text-[20px] font-bold text-[#1a1a1a] tracking-tight">
              {list.name}
            </h2>
            <p className="text-[13px] text-[#666] mt-0.5 mb-3">
              {items.length} item{items.length === 1 ? "" : "s"} · Tap the heart
              on any tile to save
            </p>
            {items.length === 0 ? (
              <div className="flex flex-col items-center text-center pt-8 pb-10 px-6 bg-white rounded-[12px] border border-[#ececec]">
                <span className="w-14 h-14 rounded-full bg-[#f6f6f6] flex items-center justify-center">
                  <Heart className="w-6 h-6 text-[#8a8a8a]" />
                </span>
                <p className="font-bold text-[#1a1a1a] text-[16px] mt-3">
                  This list is empty
                </p>
                <p className="text-[13px] text-[#666] mt-1.5 max-w-[22rem]">
                  Save items from Shop with the heart, or ask Kirk to build a
                  cart.
                </p>
                <button
                  type="button"
                  onClick={goShop}
                  className="mt-4 px-5 py-2.5 bg-[#0AAD0A] text-white text-[14px] font-bold rounded-full hover:bg-[#099809]"
                >
                  Browse store
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                {items.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpen={() => inspect(product)}
                  />
                ))}
              </div>
            )}
          </section>
        );
      })}

    </div>
  );
}
