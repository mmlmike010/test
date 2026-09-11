"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, Heart, ListPlus, ShoppingCart } from "lucide-react";
import { filterProducts, products, type Product } from "@/lib/data/products";
import { useCatalogStore } from "@/lib/store/catalog";
import { useCartStore } from "@/lib/store/cart";
import { hydrateLists, useListStore } from "@/lib/store/lists";
import ProductCard from "@/components/ProductCard";

function resolveProducts(ids: string[]): Product[] {
  return ids
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));
}

function ListThumbStack({ items }: { items: Product[] }) {
  const shown = items.slice(0, 4);
  if (shown.length === 0) {
    return (
      <div className="flex h-[88px] items-center">
        <span className="flex h-[76px] w-[76px] items-center justify-center rounded-full border border-dashed border-[#d8d8d8] bg-[#fafafa]">
          <Heart className="h-6 w-6 text-[#c4c4c4]" />
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-[96px] items-center">
      {shown.map((product, index) => (
        <span
          key={product.id}
          className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-full bg-[#f0f0f0] shadow-[0_1px_4px_rgba(0,0,0,0.16)] ring-2 ring-[#e4e4e4]"
          style={{
            zIndex: shown.length - index,
            marginLeft: index === 0 ? 0 : -34,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover scale-[1.2]"
          />
        </span>
      ))}
    </div>
  );
}

function ListPreviewCard({
  href,
  title,
  items,
  cta,
  onCta,
  showHeart = false,
}: {
  href: string;
  title: string;
  items: Product[];
  cta: string;
  onCta: () => void;
  showHeart?: boolean;
}) {
  const empty = items.length === 0;

  return (
    <div className="flex flex-col rounded-[16px] border border-[#ececec] bg-white px-4 pt-3.5 pb-3.5 hover:shadow-[0_2px_10px_rgba(0,0,0,0.07)]">
      <a href={href} className="min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[16px] font-bold text-[#1a1a1a] truncate">
              {title}
            </p>
            <p className="mt-0.5 text-[13px] text-[#666]">
              {items.length} item{items.length === 1 ? "" : "s"}
            </p>
          </div>
          {showHeart ? (
            <Heart
              className="h-[18px] w-[18px] shrink-0 fill-costco-red text-costco-red"
              aria-hidden="true"
            />
          ) : null}
        </div>
        <div className="mt-3">
          <ListThumbStack items={items} />
        </div>
      </a>
      <button
        type="button"
        onClick={onCta}
        className={`mt-3.5 h-10 w-full rounded-full text-[13px] font-bold ${
          empty
            ? "border border-[#d0d0d0] bg-white text-[#1a1a1a] hover:bg-[#f6f6f6]"
            : "bg-[#0AAD0A] text-white hover:bg-[#099809]"
        }`}
      >
        {cta}
      </button>
    </div>
  );
}

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

  const addProducts = (items: Product[]) => {
    for (const product of items) addItem(product);
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
        <ListPreviewCard
          href="#buy-it-again"
          title="Buy it again"
          items={again}
          cta="Buy again"
          onCta={() => addProducts(again)}
        />
        {lists.map((list) => {
          const items = resolveProducts(list.productIds);
          return (
            <ListPreviewCard
              key={list.id}
              href={`#list-${list.id}`}
              title={list.name}
              items={items}
              cta={items.length === 0 ? "Continue shopping" : "Buy again"}
              onCta={items.length === 0 ? goShop : () => addProducts(items)}
              showHeart
            />
          );
        })}
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
              onClick={() => addProducts(again)}
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
        const items = resolveProducts(list.productIds);
        return (
          <section key={list.id} id={`list-${list.id}`} className="mb-7">
            <div className="mb-3 flex items-end justify-between gap-3 flex-wrap">
              <div>
                <h2 className="text-[18px] lg:text-[20px] font-bold text-[#1a1a1a] tracking-tight">
                  {list.name}
                </h2>
                <p className="text-[13px] text-[#666] mt-0.5">
                  {items.length} item{items.length === 1 ? "" : "s"} · Tap the
                  heart on any tile to save
                </p>
              </div>
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={() => addProducts(items)}
                  className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-full bg-[#0AAD0A] text-white text-[13px] font-bold hover:bg-[#099809]"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add all
                </button>
              )}
            </div>
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
