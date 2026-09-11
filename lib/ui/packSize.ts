/** Display-only pack sizes. Not part of Product / Kirk catalog. */
export const PRODUCT_SIZES: Record<string, string> = {
  "1": "3.5 lb",
  "2": "36 oz",
  "3": "8 x 14.5 oz",
  "4": "3 x 24 oz",
  "5": "32 oz",
  "6": "17 oz",
  "7": "15 oz",
  "8": "32 oz",
  "9": "24 oz",
  "10": "2 L",
  "11": "4.5 lb",
  "12": "4 lb",
  "13": "1 ct",
  "14": "6 ct",
  "15": "12 ct",
  "16": "1.5 L",
  "17": "2 ct",
  "18": "1 ct",
  "19": "170 loads",
  "20": "4 pairs",
  "21": "2 x 2.5 lb",
  "22": "14 in",
  "23": "24 ct",
  "24": "1 ct",
};

export function productSize(id: string): string | undefined {
  return PRODUCT_SIZES[id];
}

/** Same-Day item-page unit price. UI only — never sent to Kirk. */
export function unitPriceLabel(
  id: string,
  price: number
): string | undefined {
  const size = PRODUCT_SIZES[id];
  if (!size || !(price > 0)) return undefined;

  const multi = size.match(/^(\d+)\s*x\s*(\d+(?:\.\d+)?)\s*(oz|lb)$/i);
  if (multi) {
    const qty = Number(multi[1]) * Number(multi[2]);
    return `$${(price / qty).toFixed(2)}/${multi[3].toLowerCase()}`;
  }

  const simple = size.match(/^(\d+(?:\.\d+)?)\s*(oz|lb|L|ct)$/i);
  if (simple) {
    const qty = Number(simple[1]);
    const raw = simple[2];
    const unit = raw.toLowerCase() === "l" ? "L" : raw.toLowerCase();
    if (unit === "ct" && qty <= 1) return undefined;
    return `$${(price / qty).toFixed(2)}/${unit}`;
  }

  const loads = size.match(/^(\d+)\s*loads$/i);
  if (loads) return `$${(price / Number(loads[1])).toFixed(2)}/load`;

  const pairs = size.match(/^(\d+)\s*pairs$/i);
  if (pairs) return `$${(price / Number(pairs[1])).toFixed(2)}/pair`;

  return undefined;
}
