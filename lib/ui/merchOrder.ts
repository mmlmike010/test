import type { Product } from "@/lib/data/products";

/** Composed leftover tiles. Sort only — never sent to Kirk. */
const COMPOSED_IDS = new Set(["1", "6", "7", "9", "13", "17"]);

export function officialPacksFirst(items: Product[]): Product[] {
  return [...items].sort((a, b) => {
    const left = COMPOSED_IDS.has(a.id) ? 1 : 0;
    const right = COMPOSED_IDS.has(b.id) ? 1 : 0;
    return left - right;
  });
}
