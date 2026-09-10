"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, Clock, Search } from "lucide-react";
import { recipeCourses, recipes, type Recipe, type RecipeCourse } from "@/lib/data/recipes";
import { useCatalogStore } from "@/lib/store/catalog";
import RecipeDetailDrawer from "@/components/RecipeDetailDrawer";

export default function RecipesView() {
  const clearFilters = useCatalogStore((s) => s.clearFilters);
  const search = useCatalogStore((s) => s.search);
  const [q, setQ] = useState("");
  const [course, setCourse] = useState<"All" | RecipeCourse>("All");
  const [open, setOpen] = useState<Recipe | null>(null);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return recipes.filter((recipe) => {
      if (course !== "All" && recipe.course !== course) return false;
      if (!needle) return true;
      return (
        recipe.title.toLowerCase().includes(needle) ||
        recipe.course.toLowerCase().includes(needle)
      );
    });
  }, [q, course]);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          clearFilters();
          void search();
          document.querySelector("main")?.scrollTo({ top: 0 });
        }}
        className="mb-3 inline-flex items-center gap-0.5 text-[13px] font-bold text-costco-blue hover:underline"
      >
        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        Shop
      </button>

      <div className="mb-4">
        <h1 className="text-[22px] lg:text-[24px] font-bold text-[#1a1a1a] tracking-tight">
          Meals
        </h1>
        <p className="text-[13px] text-[#666] mt-0.5">
          Shop ingredients for member meals · Same-Day · 11217 Brooklyn
        </p>
      </div>

      <form
        className="relative mb-3"
        onSubmit={(e) => e.preventDefault()}
      >
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a8a8a] w-[18px] h-[18px]" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search recipes"
          className="w-full h-11 pl-11 pr-4 bg-white border border-[#d8d8d8] rounded-full text-[15px] text-[#222] placeholder:text-[#8a8a8a] focus:outline-none focus:border-costco-blue focus:ring-2 focus:ring-costco-blue/15"
        />
      </form>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-5">
        {recipeCourses.map((label) => {
          const active = course === label;
          return (
            <button
              key={label}
              type="button"
              aria-pressed={active}
              onClick={() => setCourse(label)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[13px] border ${
                active
                  ? "bg-[#e8f2fa] border-costco-blue text-costco-blue font-bold"
                  : "bg-white border-[#d0d0d0] text-[#333] hover:bg-[#f6f6f6]"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <div className="flex flex-col items-center text-center pt-10 pb-12 px-6">
          <span className="w-16 h-16 rounded-full bg-white border border-[#eee] flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
            <Search className="w-7 h-7 text-[#8a8a8a]" aria-hidden="true" />
          </span>
          <p className="font-bold text-[#1a1a1a] text-[18px] mt-4">
            {q.trim()
              ? `We didn’t find any recipes for “${q.trim()}”`
              : `We didn’t find any ${course.toLowerCase()} recipes`}
          </p>
          <p className="text-[13px] text-[#666] mt-1.5 leading-snug max-w-[28rem]">
            Try another course or ask Kirk for recipe inspiration.
          </p>
          <button
            type="button"
            className="mt-5 px-5 py-2.5 bg-[#0AAD0A] text-white text-[14px] font-bold rounded-full hover:bg-[#099809]"
            onClick={() => {
              setQ("");
              setCourse("All");
            }}
          >
            Browse recipes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {shown.map((recipe) => (
            <button
              key={recipe.id}
              type="button"
              onClick={() => setOpen(recipe)}
              className="text-left group"
            >
              <span className="relative block aspect-[4/3] rounded-[16px] overflow-hidden bg-[#f3f3f3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={recipe.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </span>
              <span className="block mt-2 text-[15px] sm:text-[16px] font-bold text-[#1a1a1a] leading-snug">
                {recipe.title}
              </span>
              <span className="mt-0.5 flex items-center gap-1.5 text-[12px] text-[#666]">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                {recipe.minutes} min
                <span aria-hidden="true">·</span>
                {recipe.course}
              </span>
            </button>
          ))}
        </div>
      )}

      {open && (
        <RecipeDetailDrawer recipe={open} onClose={() => setOpen(null)} />
      )}
    </div>
  );
}
