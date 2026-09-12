"use client";

import { LayoutGrid, List } from "lucide-react";
import { products, type Product } from "@/lib/data/products";
import { useCartStore } from "@/lib/store/cart";
import { useCatalogStore } from "@/lib/store/catalog";
import { useSessionStore } from "@/lib/store/session";
import {
  kirklandWarehousePreview,
  relatedWarehouseSearches,
  warehouseRelatedAisle,
  warehouseSearchTitle,
} from "@/lib/ui/merchOrder";
import { instantSavingsText } from "@/lib/ui/instantSavings";
import { productSize, warehouseItemNumber, warehousePackSrc } from "@/lib/ui/packSize";
import CostcoLogo from "@/components/CostcoLogo";
import WarehouseAisleScroller from "@/components/WarehouseAisleScroller";
import {
  applyWarehouseFacets,
  EMPTY_WAREHOUSE_FACETS,
  sortWarehouseItems,
  warehouseSelectionChips,
  type WarehouseSort,
} from "@/lib/ui/warehouseSearch";
import WarehouseFilterRail from "@/components/WarehouseFilterRail";
import WarehouseFulfillmentChips from "@/components/WarehouseFulfillmentChips";
import WarehouseResultCard from "@/components/WarehouseResultCard";

/** costco.com search / category results. UI only — does not call Kirk. */
export default function WarehouseSearchResults({
  query,
  unfilteredHits,
  title,
  breadcrumb,
  resultKey,
  onReset,
  onRelatedSearch,
  relatedEnabled = true,
  relatedLoading = false,
  kirkFiltersOpen,
  setKirkFiltersOpen,
  kirkResultsView,
  setKirkResultsView,
  kirkCompareIds,
  setKirkCompareIds,
}: {
  query: string;
  unfilteredHits: Product[];
  title?: string;
  breadcrumb?: string;
  resultKey: string;
  onReset: () => void;
  onRelatedSearch?: (term: string) => void;
  relatedEnabled?: boolean;
  relatedLoading?: boolean;
  kirkFiltersOpen: boolean;
  setKirkFiltersOpen: (open: boolean | ((value: boolean) => boolean)) => void;
  kirkResultsView: "grid" | "list";
  setKirkResultsView: (view: "grid" | "list") => void;
  kirkCompareIds: string[];
  setKirkCompareIds: (ids: string[] | ((value: string[]) => string[])) => void;
}) {
  const warehouseFacets = useCatalogStore((s) => s.warehouseFacets);
  const setWarehouseFacets = useCatalogStore((s) => s.setWarehouseFacets);
  const warehouseSort = useCatalogStore((s) => s.warehouseSort);
  const setWarehouseSort = useCatalogStore((s) => s.setWarehouseSort);
  const cartItems = useCartStore((s) => s.items);
  const cartCount = useCartStore((s) => s.getTotalItems());
  const cartSubtotal = useCartStore((s) => s.getSubtotal());
  const openCart = useCartStore((s) => s.openCart);
  const setSheet = useSessionStore((s) => s.setSheet);
  const inspect = useCatalogStore((s) => s.inspect);
  const hits = sortWarehouseItems(
    applyWarehouseFacets(unfilteredHits, warehouseFacets),
    warehouseSort
  );
  const preview = hits.slice(0, 12);
  const facetEmpty = unfilteredHits.length > 0 && hits.length === 0;
  const selectionChips = warehouseSelectionChips(warehouseFacets);
  const relatedTerms = relatedWarehouseSearches(query, unfilteredHits);
  const relatedMerch = hits.length
    ? warehouseRelatedAisle(hits, products, 8)
    : kirklandWarehousePreview(products, 8);
  const cartAsk = query.trim() === "What's in my cart?";
  const heading = cartAsk
    ? "Shopping Cart"
    : title ||
      (unfilteredHits.length
        ? warehouseSearchTitle(query, unfilteredHits)
        : "Search Results");
  const crumb = cartAsk
    ? "Shopping Cart"
    : breadcrumb || "Search Results";

  return (
    <div className="space-y-2">
      <div className="bg-white px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-x-1.5 text-[11px] text-[#555]"
          >
            <button
              type="button"
              onClick={onReset}
              className="font-bold text-costco-blue hover:underline"
            >
              Home
            </button>
            <span aria-hidden="true">›</span>
            <span className="text-[#1a1a1a]">{crumb}</span>
          </nav>
          <button
            type="button"
            onClick={onReset}
            className="text-[12px] font-bold text-costco-blue hover:underline"
            title="Reset"
          >
            Reset
          </button>
        </div>
        <h1 className="mt-0.5 text-[28px] font-bold leading-snug text-[#1a1a1a]">
          {heading}
        </h1>
        {hits.length > 0 ? (
          <>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 -mx-4 border-y border-[#e5e5e5] bg-[#eee] px-4 py-2">
              <p className="text-[13px] font-bold text-[#1a1a1a]">
                Showing 1 - {preview.length} of {hits.length} Results
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <label className="inline-flex items-center gap-1.5 text-[13px] text-[#555]">
                  <span className="font-semibold">Sort By</span>
                  <select
                    aria-label="Sort items"
                    value={warehouseSort}
                    onChange={(e) =>
                      setWarehouseSort(e.target.value as WarehouseSort)
                    }
                    className="h-8 rounded-[3px] border border-[#c4c4c4] bg-white px-1.5 text-[13px] font-bold text-[#1a1a1a] focus:border-costco-blue focus:outline-none"
                  >
                    <option value="relevance">Best Match</option>
                    <option value="price">Price (Low to High)</option>
                    <option value="priceDesc">Price (High to Low)</option>
                    <option value="rating">Ratings (High to Low)</option>
                  </select>
                </label>
                <div
                  className="inline-flex items-center gap-0.5"
                  role="group"
                  aria-label="View"
                >
                  <span className="mr-1 text-[13px] font-semibold text-[#555]">
                    View
                  </span>
                  <button
                    type="button"
                    aria-pressed={kirkResultsView === "grid"}
                    aria-label="Grid view"
                    onClick={() => setKirkResultsView("grid")}
                    className={`flex h-8 w-8 items-center justify-center rounded-[3px] border ${
                      kirkResultsView === "grid"
                        ? "border-costco-blue bg-[#f7fbfe] text-costco-blue"
                        : "border-[#c4c4c4] bg-white text-[#555] hover:border-costco-blue"
                    }`}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-pressed={kirkResultsView === "list"}
                    aria-label="List view"
                    onClick={() => setKirkResultsView("list")}
                    className={`flex h-8 w-8 items-center justify-center rounded-[3px] border ${
                      kirkResultsView === "list"
                        ? "border-costco-blue bg-[#f7fbfe] text-costco-blue"
                        : "border-[#c4c4c4] bg-white text-[#555] hover:border-costco-blue"
                    }`}
                  >
                    <List className="h-3.5 w-3.5" />
                  </button>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[13px] text-[#555]">
                  <span className="font-semibold">Show</span>
                  <span className="inline-flex h-8 items-center rounded-[3px] border border-[#c4c4c4] bg-white px-2 text-[13px] font-bold text-[#1a1a1a]">
                    24
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setKirkFiltersOpen((open) => !open)}
                  className="text-[13px] font-bold text-costco-blue hover:underline lg:hidden"
                >
                  {kirkFiltersOpen ? "Hide Filters" : "Filter Results"}
                </button>
              </div>
            </div>
            <div className="mt-2.5">
              <WarehouseFulfillmentChips count={hits.length} />
            </div>
          </>
        ) : null}
      </div>
      {selectionChips.length > 0 ? (
        <div className="bg-white py-2">
          <p className="text-[12px] font-bold text-[#1a1a1a]">Your Selections</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1">
            {selectionChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => setWarehouseFacets(chip.clear)}
                className="inline-flex items-center gap-1 rounded-[3px] border border-[#c4c4c4] bg-[#f7fbfe] px-1.5 py-0.5 text-[11px] font-semibold text-costco-blue hover:border-costco-blue"
              >
                {chip.label}
                <span aria-hidden="true">×</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setWarehouseFacets(EMPTY_WAREHOUSE_FACETS)}
              className="text-[11px] font-bold text-costco-blue hover:underline"
            >
              Clear All
            </button>
          </div>
        </div>
      ) : null}
      {kirkFiltersOpen || hits.length > 0 || facetEmpty ? (
        <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start lg:gap-6">
          <div className={kirkFiltersOpen ? undefined : "hidden lg:block"}>
              <WarehouseFilterRail
                id="kirk-filter-results"
                items={unfilteredHits}
                facets={warehouseFacets}
                onChange={setWarehouseFacets}
              />
          </div>
          {hits.length > 0 ? (
            <div className="min-w-0 space-y-2">
              <div
                className={
                  kirkResultsView === "grid"
                    ? "grid grid-cols-2 gap-x-5 gap-y-7 lg:grid-cols-3 xl:grid-cols-4"
                    : "space-y-2"
                }
              >
                {preview.map((product) => (
                  <WarehouseResultCard
                    key={`${resultKey}-${product.id}`}
                    product={product}
                    density={kirkResultsView === "grid" ? "catalog" : "list"}
                    compareChecked={kirkCompareIds.includes(product.id)}
                    onCompare={(checked) =>
                      setKirkCompareIds((ids) => {
                        if (checked) {
                          return ids.includes(product.id) || ids.length >= 4
                            ? ids
                            : [...ids, product.id];
                        }
                        return ids.filter((id) => id !== product.id);
                      })
                    }
                  />
                ))}
              </div>
              <nav
                aria-label="Pagination"
                className="flex flex-wrap items-center justify-end gap-3 border-t border-[#ececec] bg-white py-4"
              >
                <p className="text-[13px] font-semibold text-[#555]">
                  Page 1 of 1
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-[#c4c4c4]">
                    Previous
                  </span>
                  <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-[3px] border border-costco-blue bg-[#f7fbfe] px-2 text-[13px] font-bold text-costco-blue">
                    1
                  </span>
                  <span className="text-[13px] font-bold text-[#c4c4c4]">
                    Next
                  </span>
                </div>
              </nav>
            </div>
          ) : facetEmpty ? (
            <section className="border border-[#c4c4c4] bg-white px-3 py-8 text-center">
              <p className="text-[16px] font-bold text-[#1a1a1a]">
                We&apos;re sorry
              </p>
              <p className="mt-1 text-[13px] text-[#555]">
                No items match these filters.
              </p>
              <button
                type="button"
                className="mt-3 text-[13px] font-bold text-costco-blue hover:underline"
                onClick={() => setWarehouseFacets(EMPTY_WAREHOUSE_FACETS)}
              >
                See all results
              </button>
            </section>
          ) : null}
        </div>
      ) : null}
      {cartAsk ? (
        <section className="overflow-hidden border border-[#c4c4c4] bg-white">
          <div className="border-b border-[#ececec] bg-[#f6f7f8] px-4 py-2 text-[12px] font-bold text-[#666]">
            <p>
              {cartCount} item{cartCount === 1 ? "" : "s"}
            </p>
            {cartItems.length ? (
              <div className="mt-2 hidden grid-cols-[minmax(0,1fr)_88px_72px_80px] gap-2 sm:grid">
                <span>Item</span>
                <span className="text-right">Item Price</span>
                <span className="text-center">Qty</span>
                <span className="text-right">Total</span>
              </div>
            ) : null}
          </div>
          {cartItems.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-[17px] font-bold text-[#1a1a1a]">
                Your shopping cart is empty
              </p>
              <p className="mt-1.5 text-[13px] text-[#555]">
                Add items to get started, or ask Kirk to build a cart.
              </p>
              <button
                type="button"
                onClick={onReset}
                className="mt-4 text-[13px] font-bold text-costco-blue hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {cartItems.map(({ product, quantity }) => (
                <div
                  key={`cart-ask-${product.id}`}
                  className="border-b border-[#f0f0f0] px-4 py-3.5 last:border-b-0"
                >
                  <div className="flex flex-wrap items-end justify-between gap-3 sm:grid sm:grid-cols-[minmax(0,1fr)_88px_72px_80px] sm:items-start sm:gap-2">
                    <div className="flex w-full min-w-0 gap-3 sm:w-auto">
                      <button
                        type="button"
                        onClick={() => inspect(product, "warehouse")}
                        className="relative h-[96px] w-[96px] shrink-0 overflow-hidden border border-[#eee] bg-white"
                        aria-label={`View ${product.brand} ${product.name}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={warehousePackSrc(product)}
                          alt=""
                          className="absolute inset-0 h-full w-full object-contain p-1"
                        />
                      </button>
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => inspect(product, "warehouse")}
                          className="text-left text-[14px] font-bold leading-snug text-costco-blue line-clamp-2 hover:underline"
                        >
                          {product.brand} {product.name}
                        </button>
                        {productSize(product.id) ? (
                          <p className="mt-0.5 text-[13px] text-[#72767E]">
                            {productSize(product.id)}
                          </p>
                        ) : null}
                        <p className="mt-0.5 text-[12px] text-[#72767E]">
                          Item {warehouseItemNumber(product.id)}
                        </p>
                        {instantSavingsText(product.savings) ? (
                          <p className="mt-1 text-[12px] font-semibold leading-snug text-[#188038]">
                            {instantSavingsText(product.savings)}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <p className="text-[15px] font-bold tabular-nums text-[#1a1a1a] sm:text-right">
                      ${product.price.toFixed(2)}
                    </p>
                    <p className="text-[15px] font-bold tabular-nums text-[#1a1a1a] sm:text-center">
                      {quantity}
                    </p>
                    <p className="text-[15px] font-bold tabular-nums text-[#1a1a1a] sm:text-right">
                      ${(product.price * quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <p className="text-[13px] font-semibold text-[#555]">
                  Subtotal ({cartCount} item{cartCount === 1 ? "" : "s"}){" "}
                  <span className="font-bold tabular-nums text-[#1a1a1a]">
                    ${cartSubtotal.toFixed(2)}
                  </span>
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => openCart("warehouse")}
                    className="text-[13px] font-bold text-costco-blue hover:underline"
                  >
                    View Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => setSheet("checkout", "warehouse")}
                    className="rounded-[3px] bg-costco-red px-4 py-2 text-[13px] font-bold text-white hover:bg-costco-red-hover"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      ) : null}
      {!unfilteredHits.length && !cartAsk ? (
        <section className="border border-[#c4c4c4] bg-white px-6 py-10 text-center">
          <div className="flex justify-center">
            <CostcoLogo compact />
          </div>
          <p className="mt-4 text-[28px] font-bold text-[#1a1a1a]">
            We&apos;re sorry
          </p>
          <p className="mt-1 text-[13px] text-[#555]">
            We were unable to find a match.
          </p>
          <button
            type="button"
            onClick={onReset}
            className="mt-4 text-[13px] font-bold text-costco-blue hover:underline"
          >
            Continue Shopping
          </button>
        </section>
      ) : null}
      {relatedMerch.length > 0 ? (
        <WarehouseAisleScroller
          title="Related Products"
          products={relatedMerch}
          onShowAll={() => {
            useSessionStore.getState().setKirkShopPage(true);
            useCatalogStore.setState({
              q: "kirkland",
              warehouseFacets: EMPTY_WAREHOUSE_FACETS,
              listTone: "warehouse",
            });
          }}
        />
      ) : null}
      {relatedEnabled && relatedTerms.length > 0 ? (
        <div className="border-t border-[#ececec] bg-white px-1 py-6">
          <p className="text-[20px] font-bold text-[#1a1a1a]">Related Searches</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
            {relatedTerms.map((term) => (
              <button
                key={`${resultKey}-${term}`}
                type="button"
                onClick={() => onRelatedSearch?.(term)}
                disabled={relatedLoading || !onRelatedSearch}
                className="text-left text-[12px] font-bold leading-tight text-costco-blue hover:underline disabled:opacity-50"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
