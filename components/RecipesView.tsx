"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Search, Users } from "lucide-react";
import { recipeCourses, recipes, type RecipeCourse } from "@/lib/data/recipes";
import { useCatalogStore } from "@/lib/store/catalog";
import { useSessionStore } from "@/lib/store/session";
import RecipeDetailDrawer from "@/components/RecipeDetailDrawer";

export default function RecipesView() {
  const clearFilters = useCatalogStore((s) => s.clearFilters);
  const search = useCatalogStore((s) => s.search);
  const openRecipeId = useCatalogStore((s) => s.openRecipe);
  const setOpenRecipe = useCatalogStore((s) => s.setOpenRecipe);
  const [q, setQ] = useState("");
  const [course, setCourse] = useState<"All" | RecipeCourse>("All");
  const kirkOpen = useSessionStore((s) => s.kirkOpen);
  const open = recipes.find((recipe) => recipe.id === openRecipeId) || null;

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
  const featured =
    !q.trim() && course === "All"
      ? shown.find((recipe) => recipe.id === "tomato-basil-pasta") || null
      : null;
  const gridRecipes = featured
    ? shown.filter((recipe) => recipe.id !== featured.id)
    : shown;

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

      {featured && (
        <button
          type="button"
          onClick={() => {
            setOpenRecipe(featured.id);
            document.querySelector("main")?.scrollTo({ top: 0 });
          }}
          className="mb-4 w-full text-left group rounded-[16px] bg-white border border-[#ececec] overflow-hidden hover:shadow-[0_2px_10px_rgba(0,0,0,0.07)]"
        >
          <span
            className={`relative block bg-[#f3f3f3] ${
              kirkOpen ? "h-[168px] sm:h-[188px]" : "aspect-[16/9]"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={featured.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
            <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/65 to-transparent" />
            <span className="absolute left-3 top-3 rounded-full bg-white px-2 py-1 text-[11px] font-bold text-[#1a1a1a] shadow-[0_1px_3px_rgba(0,0,0,0.12)]">
              Featured meal
            </span>
            <span className="absolute bottom-3 left-3 right-3">
              <span className="block text-[20px] sm:text-[24px] font-bold text-white leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]">
                {featured.title}
              </span>
              <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-semibold text-white/95">
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  {featured.minutes} min
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" aria-hidden="true" />
                  {featured.servings} servings
                </span>
                <span>{featured.course}</span>
              </span>
              <span className="mt-2 inline-flex items-center gap-0.5 text-[13px] font-bold text-white">
                Shop ingredients
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </span>
            </span>
          </span>
        </button>
      )}

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {gridRecipes.map((recipe) => (
            <button
              key={recipe.id}
              type="button"
              onClick={() => {
                setOpenRecipe(recipe.id);
                document.querySelector("main")?.scrollTo({ top: 0 });
              }}
              className="text-left group rounded-[16px] bg-white border border-[#ececec] overflow-hidden hover:shadow-[0_2px_10px_rgba(0,0,0,0.07)]"
            >
              <span className="relative block aspect-[4/3] bg-[#f3f3f3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={recipe.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                />
                <span className="absolute left-2.5 top-2.5 rounded-full bg-white px-2 py-1 text-[11px] font-bold text-[#1a1a1a] shadow-[0_1px_3px_rgba(0,0,0,0.12)]">
                  {recipe.course}
                </span>
                <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-black/65 px-2 py-1 text-[11px] font-bold text-white">
                  <Clock className="w-3 h-3" aria-hidden="true" />
                  {recipe.minutes} min
                </span>
              </span>
              <span className="block px-3.5 pt-3 pb-3.5">
                <span className="block text-[16px] font-bold text-[#1a1a1a] leading-snug">
                  {recipe.title}
                </span>
                <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#666]">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                    {recipe.minutes} min
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" aria-hidden="true" />
                    {recipe.servings} servings
                  </span>
                  <span>{recipe.course}</span>
                </span>
                <span className="mt-2.5 inline-flex items-center gap-0.5 text-[13px] font-bold text-[#0AAD0A]">
                  Shop ingredients
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </span>
              </span>
            </button>
          ))}
        </div>
      )}

      {open && (
        <RecipeDetailDrawer
          recipe={open}
          onClose={() => setOpenRecipe(null)}
        />
      )}
    </div>
  );
}
