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
    image: "/products/recipe-pasta.jpg?v=2",
    ingredientIds: ["4", "3", "10"],
    steps: [
      "Warm Mutti tomato basil sauce with Hunt’s diced tomatoes.",
      "Simmer 10 minutes and finish with Kirkland olive oil.",
      "Toss with the pasta you already have and serve family-style.",
    ],
  },
  {
    id: "tomato-soup",
    title: "Pantry tomato soup",
    minutes: 20,
    servings: 4,
    course: "Lunch",
    image: "/products/recipe-soup.jpg?v=1",
    ingredientIds: ["3", "4", "10"],
    steps: [
      "Warm Hunt’s diced tomatoes with Mutti tomato basil sauce.",
      "Simmer 12 minutes, then finish with Kirkland olive oil.",
      "Blend until smooth if you like it creamy. Serve hot.",
    ],
  },
  {
    id: "tomato-bruschetta",
    title: "Tomato sourdough bruschetta",
    minutes: 15,
    servings: 6,
    course: "Snacks",
    image: "/products/recipe-bruschetta.jpg?v=1",
    ingredientIds: ["3", "9", "10"],
    steps: [
      "Toast Jason’s sourdough and brush with Kirkland olive oil.",
      "Spoon drained Hunt’s diced tomatoes over the toast.",
      "Finish with salt and serve warm.",
    ],
  },
  {
    id: "hummus-board",
    title: "Member snack board",
    minutes: 10,
    servings: 8,
    course: "Snacks",
    image: "/products/recipe-board.jpg?v=2",
    ingredientIds: ["5", "2", "12", "9"],
    steps: [
      "Spoon hummus into a shallow bowl and swirl the top.",
      "Pile mixed nuts and trail mix on the side.",
      "Add torn sourdough for dipping. Set out for the game or a party.",
    ],
  },
  {
    id: "deviled-eggs",
    title: "Paprika deviled eggs",
    minutes: 25,
    servings: 12,
    course: "Snacks",
    image: "/products/recipe-deviled.jpg?v=1",
    ingredientIds: ["23"],
    steps: [
      "Hard-boil the Kirkland eggs, cool, and halve.",
      "Mash the yolks with a pinch of salt and a splash of water.",
      "Pipe back into the whites and dust with paprika.",
    ],
  },
  {
    id: "trail-mix-bowl",
    title: "Mixed nut trail bowl",
    minutes: 2,
    servings: 8,
    course: "Snacks",
    image: "/products/recipe-trail.jpg?v=1",
    ingredientIds: ["2", "12"],
    steps: [
      "Pour Kirkland mixed nuts into a serving bowl.",
      "Fold in the trail mix.",
      "Set out for snacking — no cooking.",
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
