import type { Product } from "@/lib/data/products";
import { warehouseAisleLabel } from "@/lib/ui/aisleLabels";
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

export const EMPTY_WAREHOUSE_FACETS: WarehouseFacets = {
  departments: [],
  brands: [],
  priceId: null,
  minRating: 0,
};

/** costco.com-style department row. Labels match warehouseAisleLabel() — local UI only. */
export const WAREHOUSE_NAV = [
  "Kirkland Signature",
  "Dairy & Eggs",
  "Bakery",
  "Coffee",
  "Household",
  "Baby",
  "Clothing",
  "Wine & spirits",
  "Member savings",
] as const;

/** Official pack thumbs for the Shop mega menu. UI only — never sent to Kirk. */
export const WAREHOUSE_NAV_TILES: {
  label: (typeof WAREHOUSE_NAV)[number];
  image: string;
  /** 16:10 fill crop for Shop by Department. Mega menu still uses `image`. */
  mosaic: string;
}[] = [
  {
    label: "Kirkland Signature",
    image: "/products/banner-10.png?v=1",
    mosaic: "/products/mosaic-10.png?v=1",
  },
  {
    label: "Dairy & Eggs",
    image: "/products/banner-23.png?v=1",
    mosaic: "/products/mosaic-23.png?v=1",
  },
  {
    label: "Bakery",
    image: "/products/banner-15.png?v=1",
    mosaic: "/products/mosaic-15.png?v=1",
  },
  {
    label: "Coffee",
    image: "/products/banner-21.png?v=1",
    mosaic: "/products/mosaic-21.png?v=1",
  },
  {
    label: "Household",
    image: "/products/banner-19.png?v=1",
    mosaic: "/products/mosaic-19.png?v=1",
  },
  {
    label: "Baby",
    image: "/products/banner-14.png?v=1",
    mosaic: "/products/mosaic-14.png?v=1",
  },
  {
    label: "Clothing",
    image: "/products/banner-20.png?v=1",
    mosaic: "/products/mosaic-20.png?v=1",
  },
  {
    label: "Wine & spirits",
    image: "/products/banner-16.png?v=1",
    mosaic: "/products/mosaic-16.png?v=1",
  },
  {
    label: "Member savings",
    image: "/products/banner-2.png?v=1",
    mosaic: "/products/mosaic-2.png?v=1",
  },
];

export function warehouseSelectionChips(facets: WarehouseFacets): {
  key: string;
  label: string;
  clear: WarehouseFacets;
}[] {
  const chips: { key: string; label: string; clear: WarehouseFacets }[] = [];
  for (const department of facets.departments) {
    chips.push({
      key: `dept:${department}`,
      label: department,
      clear: {
        ...facets,
        departments: facets.departments.filter((item) => item !== department),
      },
    });
  }
  for (const brand of facets.brands) {
    chips.push({
      key: `brand:${brand}`,
      label: brand,
      clear: {
        ...facets,
        brands: facets.brands.filter((item) => item !== brand),
      },
    });
  }
  if (facets.priceId) {
    const bucket = WAREHOUSE_PRICE_BUCKETS.find(
      (item) => item.id === facets.priceId
    );
    chips.push({
      key: `price:${facets.priceId}`,
      label: bucket?.label || facets.priceId,
      clear: { ...facets, priceId: null },
    });
  }
  if (facets.minRating > 0) {
    chips.push({
      key: `rating:${facets.minRating}`,
      label: `${facets.minRating} Stars & Up`,
      clear: { ...facets, minRating: 0 },
    });
  }
  return chips;
}

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
      !facets.departments.includes(warehouseAisleLabel(product))
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
