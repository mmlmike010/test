import type { Product } from "@/lib/data/products";

/** Same-Day aisle names for UI only. Do not change product.department. */
const aisleLabels: Record<string, string> = {
  "What's New": "What's new",
  "Weekly Savings": "Member savings",
  Trending: "Featured",
  "Kirkland Signature": "Kirkland Signature",
  "Auto Accessories": "Auto",
  Babies: "Baby",
  "Bakery & Desserts": "Bakery",
  "Beer, Wine & Spirits": "Wine & spirits",
  Books: "Books",
  "Cameras & Camcorders": "Cameras",
  Cleaning: "Household",
  "Clothing & Shoes": "Clothing",
  Coffee: "Coffee",
  Computers: "Computers",
  "Dairy & Eggs": "Dairy & Eggs",
  "Prepared Foods": "Prepared foods",
};

/** costco.com warehouse departments. UI only — Same-Day still uses aisleLabel(). */
const WAREHOUSE_AISLES = new Set([
  "Kirkland Signature",
  "Dairy & Eggs",
  "Bakery",
  "Coffee",
  "Household",
  "Baby",
  "Clothing",
  "Wine & spirits",
  "Member savings",
]);

export function aisleLabel(department: string): string {
  return aisleLabels[department] || department;
}

/** Fold leftover Same-Day aisles into warehouse nav. UI only — never sent to Kirk. */
export function warehouseAisleLabel(product: Product): string {
  const label = aisleLabel(product.department);
  if (WAREHOUSE_AISLES.has(label)) return label;
  if (product.brand === "Kirkland Signature") return "Kirkland Signature";
  return "Member savings";
}
