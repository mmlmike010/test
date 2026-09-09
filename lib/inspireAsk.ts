/** True when the member is asking for recipe / meal inspiration (typo-tolerant). */
export function wantsInspiration(text: string): boolean {
  const t = (text || "").toLowerCase();
  if (!t.trim()) return false;

  // Common typos: reccipe, recipie, receipe
  if (/rec+ipes?|recipie|receipe|dinner|meal|cook(?:ing)?|inspire|plating|snack board|mezze/.test(t)) {
    return true;
  }
  // "what (kind of) ... can/should I make/cook/eat"
  if (/what(?:\s+kind\s+of)?[\s\w,]*\b(?:can|should)\s+i\s+(?:make|cook|eat|prepare)/.test(t)) {
    return true;
  }
  // ingredient pairing asks that imply a dish
  if (/\b(?:with|using)\b/.test(t) && /\b(?:hummus|quinoa|nuts?|trail mix|tomato)/.test(t) && /\b(?:make|cook|recipe|dish|idea)/.test(t)) {
    return true;
  }
  if (/hummus/.test(t) && /\bnuts?\b|trail mix/.test(t) && /make|cook|recipe|idea|with/.test(t)) {
    return true;
  }
  return false;
}
