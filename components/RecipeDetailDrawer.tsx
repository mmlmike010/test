"use client";

import { useState } from "react";
import { Check, ChevronRight, Clock, Users, X } from "lucide-react";
import { products } from "@/lib/data/products";
import type { Recipe } from "@/lib/data/recipes";
import { useCartStore } from "@/lib/store/cart";
import type { Product } from "@/lib/data/products";
import { useCatalogStore } from "@/lib/store/catalog";
import { productSize } from "@/lib/ui/packSize";
import { storefrontOverlayClass, useSessionStore } from "@/lib/store/session";

export default function RecipeDetailDrawer({
  recipe,
  onClose,
}: {
  recipe: Recipe;
  onClose: () => void;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const inspect = useCatalogStore((s) => s.inspect);
  const [justAdded, setJustAdded] = useState(false);
  const kirkOpen = useSessionStore((s) => s.kirkOpen);

  const ingredients = recipe.ingredientIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
  const total = ingredients.reduce((sum, p) => sum + p.price, 0);

  const addAll = () => {
    for (const product of ingredients) addItem(product);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <div
      className={`fixed z-[74] flex min-h-0 flex-col bg-white ${storefrontOverlayClass(kirkOpen)}`}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={recipe.title}
        className="flex h-full min-h-0 flex-col"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#ececec] bg-white px-4 py-3">
          <p className="truncate pr-3 text-[13px] font-bold text-[#1a1a1a]">
            {recipe.title}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full p-2 hover:bg-[#f6f6f6]"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-[#555]" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div
            className={
              kirkOpen
                ? "xl:grid xl:grid-cols-2 xl:items-start"
                : "lg:grid lg:grid-cols-2 lg:items-start"
            }
          >
            <div
              className={`relative aspect-[4/3] bg-[#f3f3f3] ${
                kirkOpen
                  ? "xl:aspect-square xl:border-r xl:border-[#eee]"
                  : "lg:aspect-square lg:border-r lg:border-[#eee]"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={recipe.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="p-5">
              <p className="text-[12px] font-bold uppercase tracking-wide text-costco-blue">
                {recipe.course}
              </p>
              <h2 className="mt-1 text-[22px] font-bold leading-snug text-[#1a1a1a]">
                {recipe.title}
              </h2>
              <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[#666]">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {recipe.minutes} min
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" aria-hidden="true" />
                  {recipe.servings} servings
                </span>
              </p>
              <p className="mt-3 text-[13px] leading-snug text-[#555]">
                Shop the Same-Day ingredients, then follow the steps. Membership
                required · Prices higher than warehouse.
              </p>
              <div className="mt-5">
                <h3 className="text-[15px] font-bold text-[#1a1a1a]">
                  Ingredients to shop
                </h3>
                <p className="mt-0.5 text-[12px] text-[#666]">
                  {ingredients.length} Same-Day item
                  {ingredients.length === 1 ? "" : "s"} · ${total.toFixed(2)}
                </p>
                <div className="mt-2.5 space-y-1.5">
                  {ingredients.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => inspect(product)}
                      className="flex w-full items-center gap-2.5 rounded-[12px] border border-[#e8e8e8] bg-white px-2 py-2 text-left hover:bg-[#fafafa]"
                    >
                      <span className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[12px] border border-[#eee] bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.image}
                          alt=""
                          className="absolute inset-0 h-full w-full object-contain p-1"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] leading-snug text-[#242424] line-clamp-2">
                          {product.brand} {product.name}
                        </span>
                        {productSize(product.id) ? (
                          <span className="mt-0.5 block text-[12px] text-[#72767E]">
                            {productSize(product.id)}
                          </span>
                        ) : null}
                        <span className="mt-0.5 block text-[14px] font-bold tabular-nums text-[#1a1a1a]">
                          ${product.price.toFixed(2)}{" "}
                          <span className="font-normal text-[#8a8a8a]">
                            each
                          </span>
                        </span>
                        {product.savings > 0 ? (
                          <span className="mt-0.5 block text-[12px] font-semibold text-[#188038]">
                            Save ${product.savings.toFixed(2)}
                          </span>
                        ) : null}
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-costco-blue" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#eee] px-5 py-5">
            <h3 className="text-[16px] font-bold text-[#1a1a1a]">
              Directions
            </h3>
            <ol className="mt-2 space-y-2">
              {recipe.steps.map((step, index) => (
                <li
                  key={step}
                  className="flex gap-2.5 text-[14px] leading-snug text-[#333]"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e8f2fa] text-[11px] font-bold text-costco-blue">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="shrink-0 border-t border-[#ececec] bg-white px-4 py-3">
          <button
            type="button"
            onClick={addAll}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0AAD0A] text-[15px] font-bold text-white hover:bg-[#099809]"
          >
            {justAdded ? (
              <>
                <Check className="h-5 w-5" aria-hidden="true" />
                Added to cart
              </>
            ) : (
              `Add all ingredients · $${total.toFixed(2)}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
