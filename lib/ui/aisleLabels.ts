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

export function aisleLabel(department: string): string {
  return aisleLabels[department] || department;
}
