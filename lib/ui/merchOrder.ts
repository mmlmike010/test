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
  n = 4
): Product[] {
  const tokens = tokenizeKirkQuery(query);
  if (!tokens.length) return [];

  const scored = items
    .map((p) => {
      const hay = [p.brand, p.name, p.category, p.department, ...(p.tags || [])]
        .join(" ")
        .toLowerCase();
      const score = tokens.filter((token) => hay.includes(token)).length;
      return { p, score };
    })
    .filter((row) => row.score > 0)
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
