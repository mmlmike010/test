import type { Product } from "@/lib/data/products";

/** Composed leftover tiles. UI merch only — never sent to Kirk. */
export const COMPOSED_IDS = new Set(["1", "6", "7", "9", "13", "17"]);

export function officialPacksFirst(items: Product[]): Product[] {
  return [...items].sort((a, b) => {
    const left = COMPOSED_IDS.has(a.id) ? 1 : 0;
    const right = COMPOSED_IDS.has(b.id) ? 1 : 0;
    return left - right;
  });
}

/** Drop leftover photography from browse. Search / Kirk still see the SKUs. */
export function hideComposedLeftovers(
  items: Product[],
  allow: Iterable<string> = []
): Product[] {
  const keep = new Set(allow);
  return items.filter((p) => !COMPOSED_IDS.has(p.id) || keep.has(p.id));
}

/** Idle Kirk rail merch. UI only — never sent to Kirk. */
export function kirklandWarehousePreview(
  items: Product[],
  n = 4
): Product[] {
  return hideComposedLeftovers(
    officialPacksFirst(
      items.filter((p) => p.brand === "Kirkland Signature")
    )
  ).slice(0, n);
}
