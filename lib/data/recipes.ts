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
    title: "Berry yogurt breakfast bowl",
    minutes: 5,
    servings: 2,
    course: "Breakfast",
    image: "/products/recipe-yogurt.jpg?v=1",
    ingredientIds: ["8", "1"],
    steps: [
      "Spoon the Greek yogurt into two bowls.",
      "Top with Kirkland organic granola.",
      "Serve cold. Add a drizzle of honey if you keep some at home.",
    ],
  },
  {
    id: "egg-toast",
    title: "Grains & seeds egg toast",
    minutes: 15,
    servings: 4,
    course: "Breakfast",
    image: "/products/recipe-eggs.jpg?v=1",
    ingredientIds: ["23", "9", "10"],
    steps: [
      "Toast thick slices of the sourdough.",
      "Fry or scramble the eggs in a slick of Kirkland olive oil.",
      "Stack eggs on the toast and finish with salt and pepper.",
    ],
  },
  {
    id: "quinoa-bean-bowl",
    title: "Quinoa and five-bean lunch bowl",
    minutes: 20,
    servings: 4,
    course: "Lunch",
    image: "/products/recipe-quinoa.jpg?v=1",
    ingredientIds: ["11", "7", "10", "23"],
    steps: [
      "Cook the quinoa per the bag, then fluff and cool slightly.",
      "Fold in the five-bean salad and a hard-boiled egg per bowl.",
      "Dress with Kirkland extra virgin olive oil.",
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
    id: "rotisserie-jambalaya",
    title: "Rotisserie chicken rice bowl",
    minutes: 20,
    servings: 6,
    course: "Dinner",
    image: "/products/recipe-chicken.jpg?v=1",
    ingredientIds: ["24", "11", "6", "10"],
    steps: [
      "Shred the Costco rotisserie chicken, discarding the skin if you prefer.",
      "Warm quinoa and the lentils, then fold in the chicken.",
      "Finish with olive oil and black pepper. Dinner in one bowl.",
    ],
  },
  {
    id: "hummus-board",
    title: "Hummus snack board",
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
