import type { Product } from "@/lib/data/products";
import { aisleLabel } from "@/lib/ui/aisleLabels";

/** Composed leftover tiles. UI merch only — never sent to Kirk. */
export const COMPOSED_IDS = new Set(["1", "6", "7", "9", "13", "17"]);

/** Official packs printed on the composed circular. UI merch only. */
export const FLYER_DEAL_IDS = [
  "24",
  "2",
  "3",
  "10",
  "5",
  "11",
  "21",
  "12",
] as const;

export function officialPacksFirst(items: Product[]): Product[] {
  return [...items].sort((a, b) => {
    const left = COMPOSED_IDS.has(a.id) ? 1 : 0;
    const right = COMPOSED_IDS.has(b.id) ? 1 : 0;
    return left - right;
  });
}

/** Drop leftover photography from browse and search grids. Kirk's catalog is unchanged. */
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

const QUERY_STOP = new Set([
  "what",
  "whats",
  "the",
  "and",
  "for",
  "with",
  "can",
  "you",
  "my",
  "cart",
  "find",
  "add",
  "ask",
  "kirk",
  "to",
  "of",
  "in",
  "on",
  "it",
  "is",
  "or",
  "no",
  "week",
  "kids",
  "dinner",
  "cook",
  "build",
  "party",
  "recipe",
  "inspiration",
  "swaps",
]);

function tokenizeKirkQuery(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2 && !QUERY_STOP.has(token));
}

/** Client-side warehouse hits for a Kirk query. UI only — never sent to Kirk. */
export function kirkQueryPreview(
  items: Product[],
  query: string,
  n = 12
): Product[] {
  const tokens = tokenizeKirkQuery(query);
  if (!tokens.length) return [];

  const productTokens = tokens.filter((token) => token !== "kirkland");

  const scored = items
    .map((p) => {
      const hay = [p.brand, p.name, p.category, p.department, ...(p.tags || [])]
        .join(" ")
        .toLowerCase();
      const score = tokens.filter((token) => hay.includes(token)).length;
      const productScore = productTokens.filter((token) =>
        hay.includes(token)
      ).length;
      return { p, score, productScore };
    })
    .filter((row) => row.score > 0)
    .filter((row) => (productTokens.length ? row.productScore > 0 : true))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const left = COMPOSED_IDS.has(a.p.id) ? 1 : 0;
      const right = COMPOSED_IDS.has(b.p.id) ? 1 : 0;
      return left - right;
    });

  return hideComposedLeftovers(scored.map((row) => row.p)).slice(0, n);
}

/** Token Same-Day `filterProducts({ q })` can use — not the full ask sentence. */
export function storefrontQueryForKirk(query: string, hits: Product[]): string {
  if (!hits.length) return "";
  const tokens = tokenizeKirkQuery(query);
  const first = hits[0];
  const nameHay = first.name.toLowerCase();
  const fromName = tokens.find((token) => nameHay.includes(token));
  if (fromName) return fromName;
  const hay = [first.brand, first.name, first.category, first.department, ...(first.tags || [])]
    .join(" ")
    .toLowerCase();
  const fromAsk = tokens.find((token) => hay.includes(token));
  if (fromAsk) return fromAsk;
  const fallback = first.name
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .find((token) => token.length >= 4);
  return fallback || first.brand.toLowerCase();
}

/** costco.com search H1 — the token, not the ask sentence. UI only. */
export function warehouseSearchTitle(query: string, hits: Product[]): string {
  const token = storefrontQueryForKirk(query, hits);
  if (!token) return query;
  return token.replace(/\b[a-z]/g, (ch) => ch.toUpperCase());
}

/** Homepage Shop Now / department listing. UI only — never sent to Kirk. */
export function warehouseBrowsePreview(
  items: Product[],
  query: string,
  departmentCount: number
): Product[] {
  const token = query.trim();
  if (departmentCount > 0 || !token) {
    return hideComposedLeftovers(officialPacksFirst(items));
  }
  return kirkQueryPreview(items, token);
}

/** costco.com category / search H1 for homepage browse. UI only. */
export function warehouseBrowseTitle(
  query: string,
  departments: string[],
  hits: Product[]
): string {
  if (departments.length === 1) return departments[0];
  if (query.trim()) return warehouseSearchTitle(query, hits);
  return "Search Results";
}

const WEAK_RELATED_SEARCH = new Set([
  "what's new",
  "featured",
  "member savings",
  "trending",
  "weekly savings",
]);

/** costco.com Related Searches links. UI only — never changes chip text. */
export function relatedWarehouseSearches(
  query: string,
  hits: Product[],
  n = 8
): string[] {
  if (!hits.length) return [];
  const current = storefrontQueryForKirk(query, hits).toLowerCase();
  const seen = new Set<string>([current, query.toLowerCase().trim()]);
  const out: string[] = [];
  const add = (label: string) => {
    const trimmed = label.replace(/\s+/g, " ").trim();
    const key = trimmed.toLowerCase();
    if (!trimmed || key.length < 3 || seen.has(key) || WEAK_RELATED_SEARCH.has(key)) {
      return;
    }
    seen.add(key);
    out.push(trimmed);
  };

  if (
    hits.some((product) => product.brand === "Kirkland Signature") &&
    current !== "kirkland"
  ) {
    add("Kirkland Signature");
  }

  for (const product of hits) {
    add(aisleLabel(product.department));
    add(product.category);
    const first = product.name
      .split(/[^a-zA-Z0-9]+/)
      .find((token) => token.length >= 4);
    if (!first) continue;
    add(
      product.brand === "Kirkland Signature"
        ? `Kirkland ${first}`
        : `${product.brand} ${first}`
    );
  }
  return out.slice(0, n);
}

/** Fill a thin Same-Day search page. UI only — never sent to Kirk. */
/** Warehouse item-page Related Products. UI only — never sent to Kirk. */
export function warehouseRelatedProducts(
  current: Product,
  catalog: Product[],
  n = 8
): Product[] {
  const scored = relatedSearchItems([current], catalog, n);
  if (scored.length >= n) return officialPacksFirst(scored);
  const have = new Set([current.id, ...scored.map((product) => product.id)]);
  const pad = officialPacksFirst(
    hideComposedLeftovers(catalog).filter((product) => !have.has(product.id))
  ).slice(0, n - scored.length);
  return officialPacksFirst([...scored, ...pad]);
}

export function relatedSearchItems(
  hits: Product[],
  catalog: Product[],
  n = 8
): Product[] {
  if (!hits.length) return [];
  const hitIds = new Set(hits.map((hit) => hit.id));
  const depts = new Set(hits.map((hit) => hit.department));
  const cats = new Set(hits.map((hit) => hit.category));
  const tags = new Set(hits.flatMap((hit) => hit.tags || []));
  const weakDepts = new Set(["Trending", "What's New", "Weekly Savings"]);
  const weakTags = new Set([
    "trending",
    "new",
    "weekly",
    "treasure",
    "kirkland",
    "again",
  ]);
  return hideComposedLeftovers(catalog)
    .filter((product) => !hitIds.has(product.id))
    .map((product) => {
      let score = 0;
      if (depts.has(product.department) && !weakDepts.has(product.department)) {
        score += 3;
      }
      if (cats.has(product.category)) score += 3;
      for (const tag of product.tags || []) {
        if (tags.has(tag) && !weakTags.has(tag)) score += 1;
      }
      return { product, score };
    })
    .filter((row) => row.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || Number(a.product.id) - Number(b.product.id)
    )
    .map((row) => row.product)
    .slice(0, n);
}
