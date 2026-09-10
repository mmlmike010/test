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
  "25": "1 ct",
  "26": "1 ct",
  "27": "1 ct",
  "28": "4-piece",
};

export function productSize(id: string): string | undefined {
  return PRODUCT_SIZES[id];
}
