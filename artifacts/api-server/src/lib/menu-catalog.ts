type CategorySeed = {
  name: string;
  description: string;
  displayOrder: number;
};

type MenuItemSeed = {
  categoryName: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string | null;
  isPopular?: boolean;
  isFeatured?: boolean;
};

const breakfastItems: MenuItemSeed[] = [
  {
    categoryName: "Breakfast",
    name: "Plain Croissant",
    description: "A buttery croissant baked for a simple breakfast or coffee break.",
    price: "2.95",
    imageUrl: null,
  },
  {
    categoryName: "Breakfast",
    name: "Filled Croissant",
    description: "A fresh filled croissant from the breakfast counter.",
    price: "3.95",
    imageUrl: null,
    isPopular: true,
  },
  {
    categoryName: "Breakfast",
    name: "Bagel with Butter",
    description: "A toasted bagel served with butter.",
    price: "3.95",
    imageUrl: null,
  },
  {
    categoryName: "Breakfast",
    name: "Egg Salad Bagel",
    description: "Fresh egg salad served on a bagel.",
    price: "4.95",
    imageUrl: null,
  },
  {
    categoryName: "Breakfast",
    name: "Bagel with Cream Cheese",
    description: "A toasted bagel finished with cream cheese.",
    price: "4.95",
    imageUrl: null,
  },
  {
    categoryName: "Breakfast",
    name: "Omelette on a Kaiser",
    description: "A hot omelette sandwich on a fresh kaiser bun.",
    price: "7.95",
    imageUrl: null,
    isPopular: true,
  },
  {
    categoryName: "Breakfast",
    name: "Egg Salad Kaiser",
    description: "House egg salad served on a kaiser bun.",
    price: "7.95",
    imageUrl: null,
  },
  {
    categoryName: "Breakfast",
    name: "Omelette with Tomato",
    description: "A simple omelette finished with fresh tomato.",
    price: "9.95",
    imageUrl: null,
  },
];

const sandwichItems: MenuItemSeed[] = [
  {
    categoryName: "Sandwiches",
    name: "Breaded Veal Cutlet Sandwich",
    description: "A classic breaded veal sandwich served hot from the kitchen.",
    price: "13.95",
    imageUrl: null,
    isPopular: true,
  },
  {
    categoryName: "Sandwiches",
    name: "Breaded Chicken Sandwich",
    description: "Breaded chicken served in tomato sauce on a fresh bun.",
    price: "13.95",
    imageUrl: null,
    isPopular: true,
  },
  {
    categoryName: "Sandwiches",
    name: "Sausage Sandwich",
    description: "Homemade roasted sausage served on a fresh bun.",
    price: "10.95",
    imageUrl: null,
  },
  {
    categoryName: "Sandwiches",
    name: "Grilled Veggie Sandwich",
    description: "A hot grilled vegetable sandwich built for a quick lunch.",
    price: "12.95",
    imageUrl: null,
  },
  {
    categoryName: "Sandwiches",
    name: "Meatball Sandwich",
    description: "Italian meatballs in tomato sauce on a fresh bun.",
    price: "13.95",
    imageUrl: null,
  },
  {
    categoryName: "Sandwiches",
    name: "Eggplant Parm Sandwich",
    description: "Eggplant parmigiana served on a fresh sandwich bun.",
    price: "13.95",
    imageUrl: null,
  },
  {
    categoryName: "Sandwiches",
    name: "Falafel Wrap",
    description: "A falafel wrap prepared for a filling weekday lunch.",
    price: "13.95",
    imageUrl: null,
  },
  {
    categoryName: "Sandwiches",
    name: "Grilled Chicken Sandwich",
    description: "Grilled chicken prepared hot to order.",
    price: "14.95",
    imageUrl: null,
    isPopular: true,
  },
  {
    categoryName: "Sandwiches",
    name: "Club Sandwich on Kaiser",
    description: "A club sandwich served on a kaiser bun.",
    price: "15.95",
    imageUrl: null,
  },
  {
    categoryName: "Sandwiches",
    name: "Steak Sandwich",
    description: "A hot steak sandwich for a hearty lunch order.",
    price: "13.95",
    imageUrl: null,
  },
  {
    categoryName: "Sandwiches",
    name: "Add Hot Peppers",
    description: "A spicy sandwich add-on.",
    price: "1.50",
    imageUrl: null,
  },
  {
    categoryName: "Sandwiches",
    name: "Add Onions",
    description: "Add onions to any sandwich.",
    price: "1.50",
    imageUrl: null,
  },
  {
    categoryName: "Sandwiches",
    name: "Add Mushrooms",
    description: "Add mushrooms to any sandwich.",
    price: "1.50",
    imageUrl: null,
  },
  {
    categoryName: "Sandwiches",
    name: "Add Sweet Peppers",
    description: "Add sweet peppers to any sandwich.",
    price: "1.50",
    imageUrl: null,
  },
  {
    categoryName: "Sandwiches",
    name: "Add Lettuce",
    description: "Add lettuce to any sandwich.",
    price: "1.50",
    imageUrl: null,
  },
  {
    categoryName: "Sandwiches",
    name: "Add Tomato",
    description: "Add tomato to any sandwich.",
    price: "1.50",
    imageUrl: null,
  },
  {
    categoryName: "Sandwiches",
    name: "Add Cheese",
    description: "Add cheese to any sandwich.",
    price: "2.25",
    imageUrl: null,
  },
];

const saladItems: MenuItemSeed[] = [
  {
    categoryName: "Salads",
    name: "Italian Salad",
    description: "A fresh Italian salad prepared to order.",
    price: "11.95",
    imageUrl: null,
    isPopular: true,
  },
  {
    categoryName: "Salads",
    name: "Caesar Salad",
    description: "A classic Caesar salad prepared fresh.",
    price: "12.95",
    imageUrl: null,
    isPopular: true,
  },
  {
    categoryName: "Salads",
    name: "Greek Salad",
    description: "A Greek salad with the classic toppings from the counter.",
    price: "13.95",
    imageUrl: null,
  },
  {
    categoryName: "Salads",
    name: "Add Grilled Italian Sausage",
    description: "Add grilled Italian sausage to any salad.",
    price: "3.55",
    imageUrl: null,
  },
  {
    categoryName: "Salads",
    name: "Add Grilled Chicken",
    description: "Add grilled chicken to any salad.",
    price: "4.95",
    imageUrl: null,
  },
  {
    categoryName: "Salads",
    name: "Add Sauteed Jumbo Shrimp",
    description: "Add sauteed jumbo shrimp to any salad.",
    price: "6.95",
    imageUrl: null,
  },
  {
    categoryName: "Salads",
    name: "Add Halal Grilled Chicken",
    description: "Add halal grilled chicken to any salad.",
    price: "6.95",
    imageUrl: null,
  },
];

const riceBallAndSideItems: MenuItemSeed[] = [
  {
    categoryName: "Rice Balls & Sides",
    name: "Rice Ball - Mozzarella",
    description: "A crisp rice ball filled with mozzarella.",
    price: "4.95",
    imageUrl: null,
    isPopular: true,
  },
  {
    categoryName: "Rice Balls & Sides",
    name: "Rice Ball - Mozzarella and Ham",
    description: "A rice ball filled with mozzarella and ham.",
    price: "5.95",
    imageUrl: null,
  },
  {
    categoryName: "Rice Balls & Sides",
    name: "Rice Ball - Mozzarella Bolognese",
    description: "A rice ball filled with mozzarella and bolognese.",
    price: "5.95",
    imageUrl: null,
  },
  {
    categoryName: "Rice Balls & Sides",
    name: "French Fries",
    description: "Classic fries from the hot counter.",
    price: "5.95",
    imageUrl: null,
  },
  {
    categoryName: "Rice Balls & Sides",
    name: "Poutine",
    description: "A hot serving of poutine prepared to order.",
    price: "8.95",
    imageUrl: null,
  },
  {
    categoryName: "Rice Balls & Sides",
    name: "Meatballs",
    description: "A side order of Italian meatballs.",
    price: "3.95",
    imageUrl: null,
  },
];

const pizzaItems: MenuItemSeed[] = [
  {
    categoryName: "Pizza",
    name: 'Personal Pizza (12")',
    description: "A 12-inch personal pizza with one topping.",
    price: "10.95",
    imageUrl: null,
    isPopular: true,
  },
  {
    categoryName: "Pizza",
    name: 'Large Cheese Pizza (16")',
    description: "A large cheese pizza for sharing.",
    price: "20.95",
    imageUrl: null,
  },
  {
    categoryName: "Pizza",
    name: 'Large Pepperoni Pizza (16")',
    description: "A large pepperoni pizza from the lunch counter.",
    price: "26.95",
    imageUrl: null,
    isPopular: true,
  },
  {
    categoryName: "Pizza",
    name: 'Large Vegetarian Pizza (16")',
    description: "A large vegetarian pizza topped for a satisfying group lunch.",
    price: "28.95",
    imageUrl: null,
  },
  {
    categoryName: "Pizza",
    name: "Party Size Cheese Pizza",
    description: "A party-size cheese pizza for office lunches and gatherings.",
    price: "24.95",
    imageUrl: null,
  },
  {
    categoryName: "Pizza",
    name: "Party Size Pepperoni Pizza",
    description: "A party-size pepperoni pizza built for sharing.",
    price: "31.95",
    imageUrl: null,
  },
  {
    categoryName: "Pizza",
    name: "Party Size Vegetarian Pizza",
    description: "A party-size vegetarian pizza for group orders.",
    price: "33.95",
    imageUrl: null,
  },
  {
    categoryName: "Pizza",
    name: "Add Mushrooms",
    description: "Add mushrooms to your pizza.",
    price: "1.50",
    imageUrl: null,
  },
  {
    categoryName: "Pizza",
    name: "Add Hot Peppers",
    description: "Add hot peppers to your pizza.",
    price: "1.50",
    imageUrl: null,
  },
  {
    categoryName: "Pizza",
    name: "Add Chili Flakes",
    description: "Add chili flakes to your pizza.",
    price: "1.50",
    imageUrl: null,
  },
  {
    categoryName: "Pizza",
    name: "Add Olives",
    description: "Add olives to your pizza.",
    price: "1.50",
    imageUrl: null,
  },
  {
    categoryName: "Pizza",
    name: "Add Bacon",
    description: "Add bacon to your pizza.",
    price: "2.95",
    imageUrl: null,
  },
  {
    categoryName: "Pizza",
    name: "Add Ground Beef",
    description: "Add ground beef to your pizza.",
    price: "3.95",
    imageUrl: null,
  },
  {
    categoryName: "Pizza",
    name: "Add Extra Cheese",
    description: "Add extra cheese to your pizza.",
    price: "3.95",
    imageUrl: null,
  },
  {
    categoryName: "Pizza",
    name: "Dipping Sauce",
    description: "A dipping sauce on the side.",
    price: "2.00",
    imageUrl: null,
  },
];

const pastaSauceDescriptions: Record<string, string> = {
  "with Tomato Sauce": "Finished in classic tomato sauce.",
  "with Rose Sauce": "Finished in house rose sauce.",
  "with Alfredo Sauce": "Finished in a creamy Alfredo sauce.",
  "with Pesto Sauce": "Finished in basil pesto sauce.",
  Primavera: "Finished with the primavera preparation from the board.",
  "with Meat Bolognese": "Finished with meat bolognese.",
  "with Chicken Bolognese": "Finished with chicken bolognese.",
  "with Vodka Sauce": "Finished in vodka sauce.",
};

const pastaFamilies = [
  {
    name: "Penne",
    prices: {
      "with Tomato Sauce": "12.95",
      "with Rose Sauce": "13.95",
      "with Alfredo Sauce": "13.95",
      "with Pesto Sauce": "13.95",
      Primavera: "13.95",
      "with Meat Bolognese": "13.95",
      "with Chicken Bolognese": "14.95",
      "with Vodka Sauce": "14.95",
    },
  },
  {
    name: "Rigatoni",
    prices: {
      "with Tomato Sauce": "12.95",
      "with Rose Sauce": "13.95",
      "with Alfredo Sauce": "13.95",
      "with Pesto Sauce": "13.95",
      Primavera: "13.95",
      "with Meat Bolognese": "13.95",
      "with Chicken Bolognese": "14.95",
      "with Vodka Sauce": "14.95",
    },
  },
  {
    name: "Linguine",
    prices: {
      "with Tomato Sauce": "12.95",
      "with Rose Sauce": "13.95",
      "with Alfredo Sauce": "13.95",
      "with Pesto Sauce": "13.95",
      Primavera: "13.95",
      "with Meat Bolognese": "13.95",
      "with Chicken Bolognese": "14.95",
      "with Vodka Sauce": "14.95",
    },
  },
  {
    name: "Tortellini",
    prices: {
      "with Tomato Sauce": "13.95",
      "with Rose Sauce": "14.95",
      "with Alfredo Sauce": "14.95",
      "with Pesto Sauce": "14.95",
      Primavera: "14.95",
      "with Meat Bolognese": "14.95",
      "with Chicken Bolognese": "15.95",
      "with Vodka Sauce": "15.95",
    },
  },
  {
    name: "Gnocchi",
    prices: {
      "with Tomato Sauce": "13.95",
      "with Rose Sauce": "14.95",
      "with Alfredo Sauce": "14.95",
      "with Pesto Sauce": "14.95",
      Primavera: "14.95",
      "with Meat Bolognese": "14.95",
      "with Chicken Bolognese": "15.95",
      "with Vodka Sauce": "15.95",
    },
  },
];

const pastaItems: MenuItemSeed[] = pastaFamilies.flatMap((family) =>
  Object.entries(family.prices).map(([suffix, price]) => ({
    categoryName: "Pasta",
    name: `${family.name} ${suffix}`,
    description: `${family.name} ${pastaSauceDescriptions[suffix]}`,
    price,
    imageUrl: null,
    isPopular:
      (family.name === "Penne" && suffix === "with Rose Sauce") ||
      (family.name === "Rigatoni" && suffix === "with Meat Bolognese") ||
      (family.name === "Gnocchi" && suffix === "with Rose Sauce"),
  })),
);

const pastaSpecialties: MenuItemSeed[] = [
  {
    categoryName: "Pasta",
    name: "Veal Parmigiana with Pasta",
    description: "Veal parmigiana served with pasta.",
    price: "18.95",
    imageUrl: null,
  },
  {
    categoryName: "Pasta",
    name: "Chicken Parmigiana with Pasta",
    description: "Chicken parmigiana served with pasta.",
    price: "18.95",
    imageUrl: null,
    isPopular: true,
  },
  {
    categoryName: "Pasta",
    name: "Linguine with Clams in White Sauce",
    description: "Linguine with clams in white sauce.",
    price: "18.95",
    imageUrl: null,
  },
  {
    categoryName: "Pasta",
    name: "Linguine with Grilled Jumbo Shrimp in Rose Sauce",
    description: "Linguine with grilled jumbo shrimp in rose sauce.",
    price: "19.95",
    imageUrl: null,
  },
  {
    categoryName: "Pasta",
    name: "Seafood Linguine",
    description: "A seafood linguine for guests looking for a richer pasta option.",
    price: "22.95",
    imageUrl: null,
  },
];

export const MENU_CATEGORIES: CategorySeed[] = [
  {
    name: "Breakfast",
    description: "Fresh breakfast favourites for the morning rush.",
    displayOrder: 1,
  },
  {
    name: "Sandwiches",
    description: "Hot sandwiches and lunch add-ons from the kitchen.",
    displayOrder: 2,
  },
  {
    name: "Salads",
    description: "Fresh salads with optional proteins and add-ons.",
    displayOrder: 3,
  },
  {
    name: "Rice Balls & Sides",
    description: "Rice balls, fries, poutine, and other hot sides.",
    displayOrder: 4,
  },
  {
    name: "Pizza",
    description: "Personal, large, and party-size pizzas with toppings.",
    displayOrder: 5,
  },
  {
    name: "Pasta",
    description: "Italian pasta dishes, sauces, and hearty lunch entrees.",
    displayOrder: 6,
  },
];

export const MENU_ITEMS: MenuItemSeed[] = [
  ...breakfastItems,
  ...sandwichItems,
  ...saladItems,
  ...riceBallAndSideItems,
  ...pizzaItems,
  ...pastaItems,
  ...pastaSpecialties,
];

export const DEFAULT_SPECIAL = {
  title: "Rose Penne Pasta with Grilled Chicken",
  description:
    "Penne in house rose sauce with grilled chicken, served with garlic bread and a fresh side salad.",
  price: "18.95",
  imageUrl: "/food/special-penne-rose-chicken.png",
};

export type { CategorySeed, MenuItemSeed };
