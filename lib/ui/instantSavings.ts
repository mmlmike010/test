/** costco.com Instant Savings line. UI copy only — never sent to Kirk. */
export function instantSavingsText(savings: number): string | null {
  if (savings <= 0) return null;
  return `After $${savings.toFixed(2)} OFF Instant Savings`;
}
