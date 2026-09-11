export type RecipeCourse = "Breakfast" | "Lunch" | "Dinner" | "Snacks";

export type Recipe = {
  id: string;
  title: string;
  minutes: number;
  servings: number;
  course: RecipeCourse;
  image: string;
  ingredientIds: string[];
  steps: string[];
};

export const recipes: Recipe[] = [
  {
    id: "berry-yogurt-bowl",
    title: "Yogurt granola breakfast bowl",
    minutes: 5,
    servings: 2,
    course: "Breakfast",
    image: "/products/recipe-yogurt.jpg?v=2",
    ingredientIds: ["8", "1"],
    steps: [
      "Spoon the Greek yogurt into two bowls.",
      "Top with Kirkland organic granola.",
      "Serve cold. Add a drizzle of honey if you keep some at home.",
    ],
  },
  {
    id: "tomato-frittata",
    title: "Tomato and egg frittata",
    minutes: 30,
    servings: 6,
    course: "Breakfast",
    image: "/products/recipe-eggs.jpg?v=2",
    ingredientIds: ["23", "3", "10"],
    steps: [
      "Heat the oven to 375°F. Whisk the eggs with salt and a splash of water.",
      "Warm Hunt’s diced tomatoes in an oven-safe skillet with Kirkland olive oil.",
      "Pour in the eggs, bake until just set, and slice into wedges.",
    ],
  },
  {
    id: "quinoa-chicken-bowl",
    title: "Tomato quinoa skillet",
    minutes: 20,
    servings: 4,
    course: "Lunch",
    image: "/products/recipe-quinoa.jpg?v=2",
    ingredientIds: ["11", "3", "10"],
    steps: [
      "Cook the quinoa per the bag, then fluff.",
      "Warm Hunt’s diced tomatoes in a skillet with Kirkland olive oil.",
      "Fold the quinoa through the tomatoes and serve family-style.",
    ],
  },
  {
    id: "tomato-basil-pasta",
    title: "Tomato basil pantry pasta",
    minutes: 25,
    servings: 6,
    course: "Dinner",
    image: "/products/recipe-pasta.jpg?v=1",
    ingredientIds: ["4", "3", "10"],
    steps: [
      "Warm Mutti tomato basil sauce with Hunt’s diced tomatoes.",
      "Simmer 10 minutes and finish with Kirkland olive oil.",
      "Toss with the pasta you already have and serve family-style.",
    ],
  },
  {
    id: "hummus-board",
    title: "Member snack board",
    minutes: 10,
    servings: 8,
    course: "Snacks",
    image: "/products/recipe-board.jpg?v=1",
    ingredientIds: ["5", "2", "12", "9"],
    steps: [
      "Spoon hummus into a shallow bowl and swirl the top.",
      "Pile mixed nuts and trail mix on the side.",
      "Add torn sourdough for dipping. Set out for the game or a party.",
    ],
  },
];

export const recipeCourses: Array<"All" | RecipeCourse> = [
  "All",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snacks",
];
