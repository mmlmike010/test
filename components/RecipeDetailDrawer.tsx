"use client";

import { useState } from "react";
import { Check, Clock, Users, X } from "lucide-react";
import { products } from "@/lib/data/products";
import type { Recipe } from "@/lib/data/recipes";
import { useCartStore } from "@/lib/store/cart";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/data/products";
import { useCatalogStore } from "@/lib/store/catalog";
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
      className={`fixed z-[70] flex justify-end ${storefrontOverlayClass(kirkOpen)}`}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close recipe"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={recipe.title}
        className="relative w-full max-w-[480px] h-full bg-white shadow-2xl flex flex-col"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-[#ececec] bg-white shrink-0">
          <p className="text-[13px] font-bold text-[#1a1a1a] truncate pr-3">
            {recipe.title}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#f6f6f6] shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-[#555]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="relative aspect-[4/3] bg-[#f3f3f3]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={recipe.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="p-5">
            <p className="text-[12px] font-bold uppercase tracking-wide text-costco-blue">
              {recipe.course}
            </p>
            <h2 className="text-[22px] font-bold text-[#1a1a1a] leading-snug mt-1">
              {recipe.title}
            </h2>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[#666]">
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                {recipe.minutes} min
              </span>
              <span className="inline-flex items-center gap-1">
                <Users className="w-3.5 h-3.5" aria-hidden="true" />
                {recipe.servings} servings
              </span>
            </p>

            <h3 className="mt-5 text-[16px] font-bold text-[#1a1a1a]">
              Ingredients to shop
            </h3>
            <p className="text-[13px] text-[#666] mt-0.5">
              {ingredients.length} Same-Day items · ${total.toFixed(2)}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {ingredients.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpen={() => inspect(product)}
                />
              ))}
            </div>

            <h3 className="mt-6 text-[16px] font-bold text-[#1a1a1a]">
              Directions
            </h3>
            <ol className="mt-2 space-y-2">
              {recipe.steps.map((step, index) => (
                <li
                  key={step}
                  className="flex gap-2.5 text-[14px] text-[#333] leading-snug"
                >
                  <span className="w-5 h-5 rounded-full bg-[#e8f2fa] text-costco-blue text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
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
            className="w-full h-12 rounded-full bg-[#0AAD0A] hover:bg-[#099809] text-white text-[15px] font-bold inline-flex items-center justify-center gap-2"
          >
            {justAdded ? (
              <>
                <Check className="w-5 h-5" aria-hidden="true" />
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
