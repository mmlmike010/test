import type { Product } from "@/lib/data/products";
import { aisleLabel } from "@/lib/ui/aisleLabels";
import { COMPOSED_IDS, FLYER_DEAL_IDS } from "@/lib/ui/merchOrder";

/** Advertised warehouse deals only. UI chrome — never sent to Kirk. */
export function isLimitedOffer(product: Product): boolean {
  if (COMPOSED_IDS.has(product.id)) return false;
  if ((FLYER_DEAL_IDS as readonly string[]).includes(product.id)) return true;
  return Boolean(product.tags?.includes("weekly"));
}

export type WarehouseSort = "relevance" | "price" | "priceDesc" | "rating";

export const WAREHOUSE_PRICE_BUCKETS = [
  { id: "0-25", label: "$0 – $25", min: 0, max: 25 },
  { id: "25-50", label: "$25 – $50", min: 25, max: 50 },
  { id: "50-100", label: "$50 – $100", min: 50, max: 100 },
  { id: "100-200", label: "$100 – $200", min: 100, max: 200 },
  { id: "200+", label: "$200+", min: 200, max: Number.POSITIVE_INFINITY },
] as const;

export type WarehousePriceId = (typeof WAREHOUSE_PRICE_BUCKETS)[number]["id"];

export type WarehouseFacets = {
  departments: string[];
  brands: string[];
  priceId: string | null;
  minRating: number;
};

export function applyWarehouseFacets(
  items: Product[],
  facets: WarehouseFacets
): Product[] {
  const price = WAREHOUSE_PRICE_BUCKETS.find(
    (bucket) => bucket.id === facets.priceId
  );
  return items.filter((product) => {
    if (
      facets.departments.length &&
      !facets.departments.includes(aisleLabel(product.department))
    ) {
      return false;
    }
    if (facets.brands.length && !facets.brands.includes(product.brand)) {
      return false;
    }
    if (price && !(product.price >= price.min && product.price < price.max)) {
      return false;
    }
    if (facets.minRating > 0 && product.rating < facets.minRating) {
      return false;
    }
    return true;
  });
}

export function sortWarehouseItems(
  items: Product[],
  sort: WarehouseSort
): Product[] {
  if (sort === "price") {
    return [...items].sort((a, b) => a.price - b.price);
  }
  if (sort === "priceDesc") {
    return [...items].sort((a, b) => b.price - a.price);
  }
  if (sort === "rating") {
    return [...items].sort(
      (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount
    );
  }
  return items;
}

export function facetCounts(
  items: Product[],
  pick: (product: Product) => string
): [string, number][] {
  const counts = new Map<string, number>();
  for (const product of items) {
    const key = pick(product);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
  );
}
