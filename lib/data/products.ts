export interface ProductReview {
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  department: string;
  price: number;
  originalPrice: number;
  savings: number;
  image: string;
  inStock: boolean;
  tags?: string[];
  /** 1–5 member rating, Costco-style */
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
}

export const products: Product[] = [
  {
    id: "1",
    name: "Organic Mixed Berry Granola",
    brand: "Kirkland Signature",
    category: "breakfast cereals",
    department: "What's New",
    price: 5.29,
    originalPrice: 6.83,
    savings: 1.54,
    image: "/products/1.png?v=6",
    inStock: true,
    tags: ["weekly", "trending"],
    rating: 4.2,
    reviewCount: 433,
    reviews: [
      {
        author: "J. Chen",
        rating: 4,
        title: "Decent pick",
        body: "Solid everyday pick. Would buy again.",
        date: "2026-02-11",
      },
      {
        author: "K. Nguyen",
        rating: 3,
        title: "Pretty good",
        body: "Great member price for the quality.",
        date: "2026-01-16",
      },
      {
        author: "A. Patel",
        rating: 3,
        title: "Pretty good",
        body: "Solid everyday pick. Would buy again.",
        date: "2026-07-10",
      },
    ],
  },
  {
    id: "2",
    name: "Mixed Nuts",
    brand: "Kirkland Signature",
    category: "nuts",
    department: "Weekly Savings",
    price: 3.81,
    originalPrice: 5.14,
    savings: 1.33,
    image: "/products/2.png?v=2",
    inStock: true,
    tags: ["weekly", "treasure", "snacks"],
    rating: 4.9,
    reviewCount: 412,
    reviews: [
      {
        author: "S. Brooks",
        rating: 4,
        title: "Solid quality",
        body: "Exactly what we wanted for meal prep.",
        date: "2026-04-16",
      },
      {
        author: "T. Morales",
        rating: 5,
        title: "Good for the price",
        body: "Better than the grocery-store alternative.",
        date: "2026-06-03",
      },
    ],
  },
  {
    id: "3",
    name: "Diced Tomatoes",
    brand: "Hunt's",
    category: "canned tomatoes",
    department: "Weekly Savings",
    price: 4.4,
    originalPrice: 5.42,
    savings: 1.02,
    image: "/products/3.png",
    inStock: true,
    tags: ["weekly", "pantry"],
    rating: 4.0,
    reviewCount: 316,
    reviews: [
      {
        author: "M. Rivera",
        rating: 3,
        title: "Decent pick",
        body: "Solid everyday pick. Would buy again.",
        date: "2026-05-20",
      },
      {
        author: "L. Kim",
        rating: 3,
        title: "Decent pick",
        body: "Solid everyday pick. Would buy again.",
        date: "2026-11-02",
      },
    ],
  },
  {
    id: "4",
    name: "Tomato Basil Sauce",
    brand: "Mutti",
    category: "pasta sauce",
    department: "Trending",
    price: 4.07,
    originalPrice: 5.82,
    savings: 1.75,
    image: "/products/4.png",
    inStock: true,
    tags: ["trending", "pantry"],
    rating: 4.7,
    reviewCount: 142,
    reviews: [
      {
        author: "M. Rivera",
        rating: 5,
        title: "As expected",
        body: "Exactly what we wanted for meal prep.",
        date: "2026-05-26",
      },
      {
        author: "S. Brooks",
        rating: 5,
        title: "Member favorite",
        body: "Consistent quality and a fair member price.",
        date: "2026-08-11",
      },
    ],
  },
  {
    id: "5",
    name: "Hummus Classic",
    brand: "Sabra",
    category: "dips",
    department: "Trending",
    price: 4.05,
    originalPrice: 5.5,
    savings: 1.45,
    image: "/products/5.png",
    inStock: true,
    tags: ["trending", "catering", "again", "snacks"],
    rating: 4.3,
    reviewCount: 423,
    reviews: [
      {
        author: "K. Nguyen",
        rating: 5,
        title: "As expected",
        body: "Staple in our pantry. Easy Same-Day add.",
        date: "2026-05-05",
      },
      {
        author: "L. Kim",
        rating: 5,
        title: "As expected",
        body: "Better than the grocery-store alternative.",
        date: "2026-11-20",
      },
      {
        author: "A. Patel",
        rating: 5,
        title: "As expected",
        body: "Better than the grocery-store alternative.",
        date: "2026-11-02",
      },
    ],
  },
  {
    id: "6",
    name: "Cooked Lentils and Chickpeas",
    brand: "Kirkland Signature",
    category: "canned beans",
    department: "What's New",
    price: 4.53,
    originalPrice: 6.2,
    savings: 1.67,
    image: "/products/6.png?v=5",
    inStock: true,
    tags: ["new", "pantry"],
    rating: 4.9,
    reviewCount: 204,
    reviews: [
      {
        author: "A. Patel",
        rating: 5,
        title: "Will buy again",
        body: "Consistent quality and a fair member price.",
        date: "2026-03-12",
      },
      {
        author: "A. Patel",
        rating: 4,
        title: "Great value",
        body: "Kids liked it. No complaints on quality.",
        date: "2026-07-22",
      },
      {
        author: "S. Brooks",
        rating: 5,
        title: "Good for the price",
        body: "Better than the grocery-store alternative.",
        date: "2026-12-12",
      },
    ],
  },
  {
    id: "7",
    name: "Five Bean Salad",
    brand: "Kirkland Signature",
    category: "canned beans",
    department: "Weekly Savings",
    price: 3.17,
    originalPrice: 4.5,
    savings: 1.33,
    image: "/products/7.png?v=5",
    inStock: true,
    tags: ["weekly", "pantry"],
    rating: 4.7,
    reviewCount: 337,
    reviews: [
      {
        author: "L. Kim",
        rating: 5,
        title: "Will buy again",
        body: "Kids liked it. No complaints on quality.",
        date: "2026-03-06",
      },
      {
        author: "K. Nguyen",
        rating: 5,
        title: "As expected",
        body: "Staple in our pantry. Easy Same-Day add.",
        date: "2026-05-05",
      },
    ],
  },
  {
    id: "8",
    name: "Greek Yogurt Plain",
    brand: "Chobani",
    category: "yogurt",
    department: "Dairy & Eggs",
    price: 3.59,
    originalPrice: 5.2,
    savings: 1.61,
    image: "/products/8.png",
    inStock: true,
    tags: ["dairy", "again"],
    rating: 3.9,
    reviewCount: 406,
    reviews: [
      {
        author: "T. Morales",
        rating: 4,
        title: "Decent pick",
        body: "Great member price for the quality.",
        date: "2026-02-26",
      },
      {
        author: "K. Nguyen",
        rating: 3,
        title: "Works for us",
        body: "Does what it should. No issues with packaging.",
        date: "2026-09-24",
      },
    ],
  },
  {
    id: "9",
    name: "Sourdough Grains & Seeds",
    brand: "Jason's",
    category: "bread",
    department: "Bakery & Desserts",
    price: 2.71,
    originalPrice: 4.0,
    savings: 1.29,
    image: "/products/9.png?v=29",
    inStock: true,
    tags: ["bakery"],
    rating: 3.9,
    reviewCount: 263,
    reviews: [
      {
        author: "A. Patel",
        rating: 3,
        title: "Decent pick",
        body: "Solid everyday pick. Would buy again.",
        date: "2026-11-11",
      },
      {
        author: "M. Rivera",
        rating: 3,
        title: "Works for us",
        body: "Does what it should. No issues with packaging.",
        date: "2026-09-06",
      },
      {
        author: "A. Patel",
        rating: 3,
        title: "Decent pick",
        body: "Great member price for the quality.",
        date: "2026-11-17",
      },
    ],
  },
  {
    id: "10",
    name: "Organic Extra Virgin Olive Oil",
    brand: "Kirkland Signature",
    category: "cooking oil",
    department: "Kirkland Signature",
    price: 18.99,
    originalPrice: 24.99,
    savings: 6.0,
    image: "/products/10.png",
    inStock: true,
    tags: ["kirkland", "treasure", "again", "pantry"],
    rating: 4.9,
    reviewCount: 1842,
    reviews: [
      {
        author: "M. Rivera",
        rating: 5,
        title: "Everyday staple",
        body: "We go through a tin a month. Clean taste, great for salads and roasting.",
        date: "2026-05-05",
      },
      {
        author: "A. Patel",
        rating: 5,
        title: "Best value EVOO",
        body: "Better than grocery brands at twice the price. Always keep one in the cart.",
        date: "2026-07-25",
      },
      {
        author: "S. Brooks",
        rating: 5,
        title: "Member favorite for a reason",
        body: "Smooth, not bitter. Perfect drizzle on bread and pasta.",
        date: "2026-08-11",
      },
    ],
  },
  {
    id: "11",
    name: "Organic Quinoa",
    brand: "Kirkland Signature",
    category: "grains",
    department: "Kirkland Signature",
    price: 12.99,
    originalPrice: 16.99,
    savings: 4.0,
    image: "/products/11.png",
    inStock: true,
    tags: ["kirkland", "pantry"],
    rating: 4.9,
    reviewCount: 102,
    reviews: [
      {
        author: "T. Morales",
        rating: 5,
        title: "Good for the price",
        body: "Better than the grocery-store alternative.",
        date: "2026-06-21",
      },
      {
        author: "R. Foster",
        rating: 5,
        title: "Member favorite",
        body: "Kids liked it. No complaints on quality.",
        date: "2026-08-14",
      },
    ],
  },
  {
    id: "12",
    name: "Trail Mix",
    brand: "Kirkland Signature",
    category: "snacks",
    department: "Kirkland Signature",
    price: 9.99,
    originalPrice: 13.99,
    savings: 4.0,
    image: "/products/12.png",
    inStock: true,
    tags: ["kirkland", "snacks"],
    rating: 4.9,
    reviewCount: 161,
    reviews: [
      {
        author: "T. Morales",
        rating: 5,
        title: "Member favorite",
        body: "Tastes fresh and the size lasts the week.",
        date: "2026-02-17",
      },
      {
        author: "J. Chen",
        rating: 5,
        title: "Member favorite",
        body: "Consistent quality and a fair member price.",
        date: "2026-02-20",
      },
    ],
  },
  {
    id: "13",
    name: "Car Seat Protector",
    brand: "Costco",
    category: "auto",
    department: "Auto Accessories",
    price: 24.99,
    originalPrice: 29.99,
    savings: 5.0,
    image: "/products/13.png?v=4",
    inStock: true,
    tags: ["auto"],
    rating: 4.9,
    reviewCount: 215,
    reviews: [
      {
        author: "T. Morales",
        rating: 5,
        title: "Good for the price",
        body: "Better than the grocery-store alternative.",
        date: "2026-06-12",
      },
      {
        author: "A. Patel",
        rating: 4,
        title: "Great value",
        body: "Kids liked it. No complaints on quality.",
        date: "2026-07-22",
      },
      {
        author: "L. Kim",
        rating: 5,
        title: "Will buy again",
        body: "Consistent quality and a fair member price.",
        date: "2026-03-12",
      },
    ],
  },
  {
    id: "14",
    name: "Baby Wipes 12-Pack",
    brand: "Kirkland Signature",
    category: "baby",
    department: "Babies",
    price: 19.99,
    originalPrice: 24.99,
    savings: 5.0,
    image: "/products/14.png",
    inStock: true,
    tags: ["babies", "kirkland", "treasure"],
    rating: 4.7,
    reviewCount: 236,
    reviews: [
      {
        author: "L. Kim",
        rating: 5,
        title: "Will buy again",
        body: "Tastes fresh and the size lasts the week.",
        date: "2026-03-27",
      },
      {
        author: "K. Nguyen",
        rating: 5,
        title: "As expected",
        body: "Exactly what we wanted for meal prep.",
        date: "2026-05-26",
      },
    ],
  },
  {
    id: "15",
    name: "Chocolate Croissants 12ct",
    brand: "Kirkland Signature",
    category: "bakery",
    department: "Bakery & Desserts",
    price: 8.99,
    originalPrice: 11.99,
    savings: 3.0,
    image: "/products/15.png?v=2",
    inStock: true,
    tags: ["bakery", "kirkland"],
    rating: 3.9,
    reviewCount: 155,
    reviews: [
      {
        author: "J. Chen",
        rating: 4,
        title: "Works for us",
        body: "Great member price for the quality.",
        date: "2026-06-18",
      },
      {
        author: "R. Foster",
        rating: 4,
        title: "Decent pick",
        body: "Does what it should. No issues with packaging.",
        date: "2026-08-05",
      },
    ],
  },
  {
    id: "16",
    name: "Cabernet Sauvignon 1.5L",
    brand: "Kirkland Signature",
    category: "wine",
    department: "Beer, Wine & Spirits",
    price: 9.99,
    originalPrice: 12.99,
    savings: 3.0,
    image: "/products/16.png",
    inStock: true,
    tags: ["spirits", "kirkland"],
    rating: 4.4,
    reviewCount: 209,
    reviews: [
      {
        author: "M. Rivera",
        rating: 5,
        title: "As expected",
        body: "Staple in our pantry. Easy Same-Day add.",
        date: "2026-05-05",
      },
      {
        author: "A. Patel",
        rating: 4,
        title: "Great value",
        body: "Tastes fresh and the size lasts the week.",
        date: "2026-07-16",
      },
    ],
  },
  {
    id: "17",
    name: "Bestseller Hardcover Mix",
    brand: "Costco",
    category: "books",
    department: "Books",
    price: 14.99,
    originalPrice: 19.99,
    savings: 5.0,
    image: "/products/17.png?v=5",
    inStock: true,
    tags: ["books"],
    rating: 4.0,
    reviewCount: 401,
    reviews: [
      {
        author: "L. Kim",
        rating: 3,
        title: "Decent pick",
        body: "Solid everyday pick. Would buy again.",
        date: "2026-11-02",
      },
      {
        author: "K. Nguyen",
        rating: 3,
        title: "Decent pick",
        body: "Great member price for the quality.",
        date: "2026-05-26",
      },
    ],
  },
  {
    id: "18",
    name: "4K Action Camera Bundle",
    brand: "GoPro",
    category: "cameras",
    department: "Cameras & Camcorders",
    price: 249.99,
    originalPrice: 299.99,
    savings: 50.0,
    image: "/products/18.png",
    inStock: true,
    tags: ["cameras"],
    rating: 4.4,
    reviewCount: 156,
    reviews: [
      {
        author: "S. Brooks",
        rating: 5,
        title: "Good for the price",
        body: "Better than the grocery-store alternative.",
        date: "2026-12-21",
      },
      {
        author: "L. Kim",
        rating: 5,
        title: "Will buy again",
        body: "Kids liked it. No complaints on quality.",
        date: "2026-03-24",
      },
    ],
  },
  {
    id: "19",
    name: "Laundry Detergent 170 loads",
    brand: "Kirkland Signature",
    category: "cleaning",
    department: "Cleaning",
    price: 17.99,
    originalPrice: 22.99,
    savings: 5.0,
    image: "/products/19.png?v=3",
    inStock: true,
    tags: ["cleaning", "kirkland", "treasure"],
    rating: 3.8,
    reviewCount: 218,
    reviews: [
      {
        author: "T. Morales",
        rating: 4,
        title: "Pretty good",
        body: "Solid everyday pick. Would buy again.",
        date: "2026-10-19",
      },
      {
        author: "J. Chen",
        rating: 4,
        title: "Works for us",
        body: "Does what it should. No issues with packaging.",
        date: "2026-06-06",
      },
    ],
  },
  {
    id: "20",
    name: "Merino Crew Socks 6-Pack",
    brand: "Kirkland Signature",
    category: "apparel",
    department: "Clothing & Shoes",
    price: 16.99,
    originalPrice: 21.99,
    savings: 5.0,
    image: "/products/20.png",
    inStock: true,
    tags: ["clothing", "kirkland"],
    rating: 4.7,
    reviewCount: 157,
    reviews: [
      {
        author: "M. Rivera",
        rating: 5,
        title: "As expected",
        body: "Better than the grocery-store alternative.",
        date: "2026-05-20",
      },
      {
        author: "J. Chen",
        rating: 4,
        title: "Solid quality",
        body: "Staple in our pantry. Easy Same-Day add.",
        date: "2026-10-13",
      },
    ],
  },
  {
    id: "21",
    name: "Colombian Coffee 3lb",
    brand: "Kirkland Signature",
    category: "coffee",
    department: "Coffee",
    price: 18.49,
    originalPrice: 22.99,
    savings: 4.5,
    image: "/products/21.png",
    inStock: true,
    tags: ["coffee", "kirkland", "treasure"],
    rating: 4.0,
    reviewCount: 365,
    reviews: [
      {
        author: "A. Patel",
        rating: 3,
        title: "Pretty good",
        body: "Does what it should. No issues with packaging.",
        date: "2026-07-22",
      },
      {
        author: "R. Foster",
        rating: 4,
        title: "Works for us",
        body: "Does what it should. No issues with packaging.",
        date: "2026-12-15",
      },
    ],
  },
  {
    id: "22",
    name: "14\" Laptop Sleeve",
    brand: "Incase",
    category: "computers",
    department: "Computers",
    price: 29.99,
    originalPrice: 39.99,
    savings: 10.0,
    image: "/products/22.png?v=3",
    inStock: true,
    tags: ["computers"],
    rating: 3.9,
    reviewCount: 273,
    reviews: [
      {
        author: "S. Brooks",
        rating: 4,
        title: "Pretty good",
        body: "Does what it should. No issues with packaging.",
        date: "2026-04-13",
      },
      {
        author: "T. Morales",
        rating: 4,
        title: "Works for us",
        body: "Solid everyday pick. Would buy again.",
        date: "2026-06-12",
      },
    ],
  },
  {
    id: "23",
    name: "Organic Large Eggs 24ct",
    brand: "Kirkland Signature",
    category: "eggs",
    department: "Dairy & Eggs",
    price: 7.99,
    originalPrice: 9.99,
    savings: 2.0,
    image: "/products/23.png",
    inStock: true,
    tags: ["dairy", "kirkland", "again"],
    rating: 4.9,
    reviewCount: 35,
    reviews: [
      {
        author: "K. Nguyen",
        rating: 5,
        title: "Will buy again",
        body: "Kids liked it. No complaints on quality.",
        date: "2026-09-15",
      },
      {
        author: "J. Chen",
        rating: 4,
        title: "Solid quality",
        body: "Staple in our pantry. Easy Same-Day add.",
        date: "2026-10-04",
      },
    ],
  },
  {
    id: "24",
    name: "Rotisserie Chicken",
    brand: "Costco",
    category: "prepared foods",
    department: "Prepared Foods",
    price: 4.99,
    originalPrice: 6.99,
    savings: 2.0,
    image: "/products/24.png",
    inStock: true,
    tags: ["weekly", "trending", "catering", "recipes", "again"],
    rating: 4.9,
    reviewCount: 12847,
    reviews: [
      {
        author: "T. Morales",
        rating: 5,
        title: "Weeknight hero",
        body: "Hot, juicy, and ready when we walk out. Shreds for tacos, salads, and soup all week.",
        date: "2026-08-02",
      },
      {
        author: "L. Kim",
        rating: 5,
        title: "Never miss it",
        body: "Best $5 in the warehouse. Seasoning is spot on every time.",
        date: "2026-06-18",
      },
      {
        author: "J. Chen",
        rating: 5,
        title: "Family favorite",
        body: "Kids ask for it by name. We grab two whenever they're out.",
        date: "2026-09-01",
      },
    ],
  },
];

export const departments = [
  "What's New",
  "Weekly Savings",
  "Trending",
  "Kirkland Signature",
  "Auto Accessories",
  "Babies",
  "Bakery & Desserts",
  "Beer, Wine & Spirits",
  "Books",
  "Cameras & Camcorders",
  "Cleaning",
  "Clothing & Shoes",
  "Coffee",
  "Computers",
  "Dairy & Eggs",
  "Prepared Foods",
];

export type ShopCategory = {
  id: string;
  name: string;
  image: string;
  tag?: string;
  department?: string;
};

export const categories: ShopCategory[] = [
  {
    id: "again",
    name: "Buy it again",
    image: "/products/cat-again.jpg?v=3",
    tag: "again",
  },
  {
    id: "kirkland",
    name: "Kirkland Signature",
    image: "/products/cat-kirkland.jpg?v=3",
    tag: "kirkland",
  },
  {
    id: "weekly",
    name: "Member savings",
    image: "/products/cat-weekly.jpg?v=3",
    tag: "weekly",
  },
  {
    id: "dairy",
    name: "Dairy & Eggs",
    image: "/products/cat-dairy.jpg?v=1",
    department: "Dairy & Eggs",
  },
  {
    id: "bakery",
    name: "Bakery",
    image: "/products/cat-bakery.jpg?v=2",
    department: "Bakery & Desserts",
  },
  {
    id: "prepared",
    name: "Prepared foods",
    image: "/products/cat-prepared.jpg?v=1",
    department: "Prepared Foods",
  },
  {
    id: "coffee",
    name: "Coffee",
    image: "/products/cat-coffee.jpg?v=1",
    department: "Coffee",
  },
  {
    id: "wine",
    name: "Wine & spirits",
    image: "/products/cat-wine.jpg?v=1",
    department: "Beer, Wine & Spirits",
  },
  {
    id: "household",
    name: "Household",
    image: "/products/cat-household.jpg?v=2",
    department: "Cleaning",
  },
  {
    id: "babies",
    name: "Baby",
    image: "/products/cat-baby.jpg?v=1",
    department: "Babies",
  },
  {
    id: "auto",
    name: "Auto",
    image: "/products/cat-auto.jpg?v=1",
    department: "Auto Accessories",
  },
  {
    id: "books",
    name: "Books",
    image: "/products/cat-books.jpg?v=1",
    department: "Books",
  },
  {
    id: "cameras",
    name: "Cameras",
    image: "/products/cat-cameras.jpg?v=1",
    department: "Cameras & Camcorders",
  },
  {
    id: "clothing",
    name: "Clothing",
    image: "/products/cat-clothing.jpg?v=1",
    department: "Clothing & Shoes",
  },
  {
    id: "computers",
    name: "Computers",
    image: "/products/cat-computers.jpg?v=1",
    department: "Computers",
  },
];

export type ProductFilters = {
  q?: string;
  department?: string;
  tag?: string;
};

export function filterProducts(filters: ProductFilters = {}): Product[] {
  const q = (filters.q || "").trim().toLowerCase();
  const department = (filters.department || "").trim();
  const tag = (filters.tag || "").trim().toLowerCase();

  return products.filter((p) => {
    if (department && p.department !== department) return false;

    if (tag) {
      const tags = (p.tags || []).map((t) => t.toLowerCase());
      if (tag === "treasure") return tags.includes("treasure");
      if (tag === "trending")
        return p.department === "Trending" || tags.includes("trending");
      if (tag === "new") return p.department === "What's New" || tags.includes("new");
      if (tag === "weekly")
        // id 1 is composed Mixed Berry — keep it off weekly so flyer pages stay the four printed deals.
        return (
          p.id !== "1" &&
          (p.department === "Weekly Savings" || tags.includes("weekly"))
        );
      if (tag === "kirkland")
        return (
          p.department === "Kirkland Signature" ||
          p.brand === "Kirkland Signature" ||
          tags.includes("kirkland")
        );
      if (tag === "recipes")
        return (
          tags.includes("recipes") ||
          ["pasta sauce", "cooking oil", "grains", "canned tomatoes"].includes(
            p.category
          )
        );
      if (tag === "catering")
        return (
          tags.includes("catering") ||
          ["dips", "nuts", "snacks", "bakery"].includes(p.category)
        );
      if (tag === "again") return tags.includes("again");
      return tags.includes(tag) || p.department.toLowerCase().includes(tag);
    }

    if (q) {
      const hay = [
        p.brand,
        p.name,
        p.category,
        p.department,
        ...(p.tags || []),
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }

    return true;
  });
}
