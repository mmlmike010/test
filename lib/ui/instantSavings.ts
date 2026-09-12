/** costco.com Instant Savings line. UI copy only — never sent to Kirk. */
export function instantSavingsText(savings: number): string | null {
  if (savings <= 0) return null;
  return `After $${savings.toFixed(2)} OFF Instant Savings`;
}

/** Line or cart Instant Savings dollars. UI only — never sent to Kirk. */
export function instantSavingsAmount(savings: number, quantity = 1): number {
  if (!(savings > 0) || !(quantity > 0)) return 0;
  return Number((savings * quantity).toFixed(2));
}
