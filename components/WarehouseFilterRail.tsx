"use client";

import { useState, type ReactNode } from "react";
import type { Product } from "@/lib/data/products";
import { warehouseAisleLabel } from "@/lib/ui/aisleLabels";
import {
  applyWarehouseFacets,
  facetCounts,
  WAREHOUSE_NAV,
  WAREHOUSE_PRICE_BUCKETS,
  type WarehouseFacets,
} from "@/lib/ui/warehouseSearch";

function FacetSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mt-3 border-t border-[#e0e0e0] pt-3">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="text-[13px] font-bold text-[#1a1a1a]">{title}</span>
        <span className="text-[18px] font-bold leading-none text-[#555]" aria-hidden="true">
          {open ? "–" : "+"}
        </span>
      </button>
      {open ? <div className="mt-1">{children}</div> : null}
    </div>
  );
}

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function FacetCheck({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2 rounded-[3px] px-0.5 py-1 hover:bg-[#f7fbfe]">
      <span className="flex min-w-0 items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="accent-costco-blue"
        />
        <span
          className={`text-[12px] leading-tight ${
            checked ? "font-bold text-costco-blue" : "text-[#1a1a1a]"
          }`}
        >
          {label}
        </span>
      </span>
      <span className="shrink-0 text-[12px] text-[#72767E]">{count}</span>
    </label>
  );
}

/** costco.com Filter Results rail. Local UI — does not change Kirk catalog filters. */
export default function WarehouseFilterRail({
  items,
  facets,
  onChange,
  id = "warehouse-filter-results",
  compact = false,
}: {
  items: Product[];
  facets: WarehouseFacets;
  onChange: (next: WarehouseFacets) => void;
  id?: string;
  compact?: boolean;
}) {
  const departmentCounts = new Map(
    facetCounts(items, warehouseAisleLabel)
  );
  const departments = WAREHOUSE_NAV.map((label) => [
    label,
    departmentCounts.get(label) || 0,
  ] as const)
    .filter(([, count]) => count > 0)
    .filter(
      ([label]) =>
        facets.departments.length !== 1 || facets.departments.includes(label)
    );
  const afterDepartment = applyWarehouseFacets(items, {
    ...facets,
    brands: [],
    priceId: null,
    minRating: 0,
  });
  const brands = facetCounts(afterDepartment, (product) => product.brand);
  const prices = WAREHOUSE_PRICE_BUCKETS.map((bucket) => ({
    ...bucket,
    count: afterDepartment.filter(
      (product) => product.price >= bucket.min && product.price < bucket.max
    ).length,
  })).filter((bucket) => bucket.count > 0);
  const ratings = (
    [
      [4, "4 Stars & Up"],
      [3, "3 Stars & Up"],
    ] as const
  )
    .map(([min, label]) => ({
      min,
      label,
      count: afterDepartment.filter((product) => product.rating >= min).length,
    }))
    .filter((row) => row.count > 0);

  return (
    <aside
      id={id}
      className={
        compact
          ? "rounded-[3px] border border-[#c4c4c4] bg-white px-2.5 py-2"
          : "mb-4 border-r border-[#e5e5e5] bg-white pr-4 lg:mb-0 lg:sticky lg:top-0"
      }
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[14px] font-bold text-[#1a1a1a]">Filter Results</p>
        {facets.departments.length ||
        facets.brands.length ||
        facets.priceId ||
        facets.minRating > 0 ? (
          <button
            type="button"
            onClick={() =>
              onChange({
                departments: [],
                brands: [],
                priceId: null,
                minRating: 0,
              })
            }
            className="text-[12px] font-bold text-costco-blue hover:underline"
          >
            Clear
          </button>
        ) : null}
      </div>

      <FacetSection title="Delivery Method">
        <label className="flex items-center gap-2 text-[12px] text-[#1a1a1a]">
          <input
            type="checkbox"
            checked
            readOnly
            className="accent-costco-blue"
          />
          Same-Day Delivery
          <span className="ml-auto text-[#72767E]">{afterDepartment.length}</span>
        </label>
      </FacetSection>

      {departments.length > 0 ? (
        <FacetSection title="Department">
          <div className="space-y-0.5">
            {departments.map(([label, count]) => (
              <FacetCheck
                key={label}
                label={label}
                count={count}
                checked={facets.departments.includes(label)}
                onChange={() =>
                  onChange({
                    ...facets,
                    departments: toggleValue(facets.departments, label),
                  })
                }
              />
            ))}
          </div>
        </FacetSection>
      ) : null}

      {brands.length > 0 ? (
        <FacetSection title="Brand">
          <div className="space-y-0.5">
            {brands.map(([label, count]) => (
              <FacetCheck
                key={label}
                label={label}
                count={count}
                checked={facets.brands.includes(label)}
                onChange={() =>
                  onChange({
                    ...facets,
                    brands: toggleValue(facets.brands, label),
                  })
                }
              />
            ))}
          </div>
        </FacetSection>
      ) : null}

      {prices.length > 0 ? (
        <FacetSection title="Price">
          <div className="space-y-0.5">
            {prices.map((bucket) => (
              <FacetCheck
                key={bucket.id}
                label={bucket.label}
                count={bucket.count}
                checked={facets.priceId === bucket.id}
                onChange={() =>
                  onChange({
                    ...facets,
                    priceId: facets.priceId === bucket.id ? null : bucket.id,
                  })
                }
              />
            ))}
          </div>
        </FacetSection>
      ) : null}

      {ratings.length > 0 ? (
        <FacetSection title="Customer Ratings">
          <div className="space-y-0.5">
            {ratings.map((row) => (
              <FacetCheck
                key={row.min}
                label={row.label}
                count={row.count}
                checked={facets.minRating === row.min}
                onChange={() =>
                  onChange({
                    ...facets,
                    minRating: facets.minRating === row.min ? 0 : row.min,
                  })
                }
              />
            ))}
          </div>
        </FacetSection>
      ) : null}
    </aside>
  );
}
