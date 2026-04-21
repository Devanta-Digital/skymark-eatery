export type StaticMenuItem = {
  name: string;
  description: string;
  price: string;
  featured?: boolean;
};

export type StaticPastaGroup = {
  title: string;
  items: StaticMenuItem[];
};

export type StaticMenuSection = {
  id: string;
  shortLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  note?: string;
  items?: StaticMenuItem[];
  addOnsTitle?: string;
  addOns?: StaticMenuItem[];
  pastaGroups?: StaticPastaGroup[];
  signatureItems?: StaticMenuItem[];
};

const item = (
  name: string,
  description: string,
  price: string,
  featured = false,
): StaticMenuItem => ({
  name,
  description,
  price,
  featured,
});

export const MAIN_MENU_SECTIONS: StaticMenuSection[] = [
  {
    id: "breakfast",
    shortLabel: "Breakfast",
    eyebrow: "Morning favourites",
    title: "Breakfast",
    description:
      "Fresh pastries, bagels, and hot breakfast sandwiches prepared for the morning rush.",
    note: "Available during weekday service hours.",
    items: [
      item(
        "Plain Croissant",
        "A buttery croissant baked for a simple breakfast or coffee break.",
        "$2.95",
      ),
      item(
        "Filled Croissant",
        "A fresh filled croissant from the breakfast counter.",
        "$3.95",
        true,
      ),
      item("Bagel with Butter", "A toasted bagel served with butter.", "$3.95"),
      item("Egg Salad Bagel", "Fresh egg salad served on a bagel.", "$4.95"),
      item(
        "Bagel with Cream Cheese",
        "A toasted bagel finished with cream cheese.",
        "$4.95",
      ),
      item(
        "Omelette on a Kaiser",
        "A hot omelette sandwich on a fresh kaiser bun.",
        "$7.95",
        true,
      ),
      item(
        "Egg Salad Kaiser",
        "House egg salad served on a kaiser bun.",
        "$7.95",
      ),
      item(
        "Omelette with Tomato",
        "A simple omelette finished with fresh tomato.",
        "$9.95",
      ),
    ],
  },
  {
    id: "sandwiches",
    shortLabel: "Sandwiches",
    eyebrow: "Hot lunch staples",
    title: "Sandwiches",
    description:
      "Classic hot sandwiches, hearty wraps, and quick lunch picks made for takeout and pickup.",
    items: [
      item(
        "Breaded Veal Cutlet Sandwich",
        "A classic breaded veal sandwich served hot from the kitchen.",
        "$13.95",
        true,
      ),
      item(
        "Breaded Chicken Sandwich",
        "Breaded chicken served in tomato sauce on a fresh bun.",
        "$13.95",
        true,
      ),
      item(
        "Sausage Sandwich",
        "Homemade roasted sausage served on a fresh bun.",
        "$10.95",
      ),
      item(
        "Grilled Veggie Sandwich",
        "A hot grilled vegetable sandwich built for a quick lunch.",
        "$12.95",
      ),
      item(
        "Meatball Sandwich",
        "Italian meatballs in tomato sauce on a fresh bun.",
        "$13.95",
      ),
      item(
        "Eggplant Parm Sandwich",
        "Eggplant parmigiana served on a fresh sandwich bun.",
        "$13.95",
      ),
      item(
        "Falafel Wrap",
        "A falafel wrap prepared for a filling weekday lunch.",
        "$13.95",
      ),
      item(
        "Grilled Chicken Sandwich",
        "Grilled chicken prepared hot to order.",
        "$14.95",
        true,
      ),
      item(
        "Club Sandwich on Kaiser",
        "A club sandwich served on a kaiser bun.",
        "$15.95",
      ),
      item(
        "Steak Sandwich",
        "A hot steak sandwich for a hearty lunch order.",
        "$13.95",
      ),
    ],
    addOnsTitle: "Sandwich add-ons",
    addOns: [
      item("Hot Peppers", "A spicy sandwich add-on.", "$1.50"),
      item("Onions", "Add onions to any sandwich.", "$1.50"),
      item("Mushrooms", "Add mushrooms to any sandwich.", "$1.50"),
      item("Sweet Peppers", "Add sweet peppers to any sandwich.", "$1.50"),
      item("Lettuce", "Add lettuce to any sandwich.", "$1.50"),
      item("Tomato", "Add tomato to any sandwich.", "$1.50"),
      item("Cheese", "Add cheese to any sandwich.", "$2.25"),
    ],
  },
  {
    id: "salads",
    shortLabel: "Salads",
    eyebrow: "Fresh counter picks",
    title: "Salads",
    description:
      "Lighter lunch options with protein add-ons for guests who want something fresh but still filling.",
    items: [
      item(
        "Italian Salad",
        "A fresh Italian salad prepared to order.",
        "$11.95",
        true,
      ),
      item(
        "Caesar Salad",
        "A classic Caesar salad prepared fresh.",
        "$12.95",
        true,
      ),
      item(
        "Greek Salad",
        "A Greek salad with the classic toppings from the counter.",
        "$13.95",
      ),
    ],
    addOnsTitle: "Protein add-ons",
    addOns: [
      item(
        "Grilled Italian Sausage",
        "Add grilled Italian sausage to any salad.",
        "$3.55",
      ),
      item("Grilled Chicken", "Add grilled chicken to any salad.", "$4.95"),
      item(
        "Sauteed Jumbo Shrimp",
        "Add sauteed jumbo shrimp to any salad.",
        "$6.95",
      ),
      item(
        "Halal Grilled Chicken",
        "Add halal grilled chicken to any salad.",
        "$6.95",
      ),
    ],
  },
  {
    id: "sides",
    shortLabel: "Sides",
    eyebrow: "Snacks and sides",
    title: "Rice Balls & Sides",
    description:
      "Hot counter favourites that work well as a side, quick snack, or add-on to lunch.",
    items: [
      item(
        "Rice Ball - Mozzarella",
        "A crisp rice ball filled with mozzarella.",
        "$4.95",
        true,
      ),
      item(
        "Rice Ball - Mozzarella and Ham",
        "A rice ball filled with mozzarella and ham.",
        "$5.95",
      ),
      item(
        "Rice Ball - Mozzarella Bolognese",
        "A rice ball filled with mozzarella and bolognese.",
        "$5.95",
      ),
      item("French Fries", "Classic fries from the hot counter.", "$5.95"),
      item("Poutine", "A hot serving of poutine prepared to order.", "$8.95"),
      item("Meatballs", "A side order of Italian meatballs.", "$3.95"),
    ],
  },
  {
    id: "pizza",
    shortLabel: "Pizza",
    eyebrow: "Personal to party size",
    title: "Pizza",
    description:
      "Personal pies, shareable large pizzas, and party-size options for office lunches and casual gatherings.",
    items: [
      item(
        'Personal Pizza (12")',
        "A 12-inch personal pizza with one topping.",
        "$10.95",
        true,
      ),
      item(
        'Large Cheese Pizza (16")',
        "A large cheese pizza for sharing.",
        "$20.95",
      ),
      item(
        'Large Pepperoni Pizza (16")',
        "A large pepperoni pizza from the lunch counter.",
        "$26.95",
        true,
      ),
      item(
        'Large Vegetarian Pizza (16")',
        "A large vegetarian pizza topped for a satisfying group lunch.",
        "$28.95",
      ),
      item(
        "Party Size Cheese Pizza",
        "A party-size cheese pizza for office lunches and gatherings.",
        "$24.95",
      ),
      item(
        "Party Size Pepperoni Pizza",
        "A party-size pepperoni pizza built for sharing.",
        "$31.95",
      ),
      item(
        "Party Size Vegetarian Pizza",
        "A party-size vegetarian pizza for group orders.",
        "$33.95",
      ),
    ],
    addOnsTitle: "Pizza add-ons",
    addOns: [
      item("Mushrooms", "Add mushrooms to your pizza.", "$1.50"),
      item("Hot Peppers", "Add hot peppers to your pizza.", "$1.50"),
      item("Chili Flakes", "Add chili flakes to your pizza.", "$1.50"),
      item("Olives", "Add olives to your pizza.", "$1.50"),
      item("Bacon", "Add bacon to your pizza.", "$2.95"),
      item("Ground Beef", "Add ground beef to your pizza.", "$3.95"),
      item("Extra Cheese", "Add extra cheese to your pizza.", "$3.95"),
      item("Dipping Sauce", "A dipping sauce on the side.", "$2.00"),
    ],
  },
  {
    id: "pasta",
    shortLabel: "Pasta",
    eyebrow: "House pasta and hot plates",
    title: "Pasta",
    description:
      "Choose a pasta shape, pick a sauce, or go with one of the house favourites for a fuller lunch.",
    note: "Rose sauce, meat bolognese, and chicken parm are among the most-ordered lunch picks.",
    pastaGroups: [
      {
        title: "Penne",
        items: [
          item(
            "Penne with Tomato Sauce",
            "Finished in classic tomato sauce.",
            "$12.95",
          ),
          item(
            "Penne with Rose Sauce",
            "Finished in house rose sauce.",
            "$13.95",
            true,
          ),
          item(
            "Penne with Alfredo Sauce",
            "Finished in a creamy Alfredo sauce.",
            "$13.95",
          ),
          item(
            "Penne with Pesto Sauce",
            "Finished in basil pesto sauce.",
            "$13.95",
          ),
          item(
            "Penne Primavera",
            "Finished with the primavera preparation from the board.",
            "$13.95",
          ),
          item(
            "Penne with Meat Bolognese",
            "Finished with meat bolognese.",
            "$13.95",
          ),
          item(
            "Penne with Chicken Bolognese",
            "Finished with chicken bolognese.",
            "$14.95",
          ),
          item("Penne with Vodka Sauce", "Finished in vodka sauce.", "$14.95"),
        ],
      },
      {
        title: "Rigatoni",
        items: [
          item(
            "Rigatoni with Tomato Sauce",
            "Finished in classic tomato sauce.",
            "$12.95",
          ),
          item(
            "Rigatoni with Rose Sauce",
            "Finished in house rose sauce.",
            "$13.95",
          ),
          item(
            "Rigatoni with Alfredo Sauce",
            "Finished in a creamy Alfredo sauce.",
            "$13.95",
          ),
          item(
            "Rigatoni with Pesto Sauce",
            "Finished in basil pesto sauce.",
            "$13.95",
          ),
          item(
            "Rigatoni Primavera",
            "Finished with the primavera preparation from the board.",
            "$13.95",
          ),
          item(
            "Rigatoni with Meat Bolognese",
            "Finished with meat bolognese.",
            "$13.95",
            true,
          ),
          item(
            "Rigatoni with Chicken Bolognese",
            "Finished with chicken bolognese.",
            "$14.95",
          ),
          item(
            "Rigatoni with Vodka Sauce",
            "Finished in vodka sauce.",
            "$14.95",
          ),
        ],
      },
      {
        title: "Linguine",
        items: [
          item(
            "Linguine with Tomato Sauce",
            "Finished in classic tomato sauce.",
            "$12.95",
          ),
          item(
            "Linguine with Rose Sauce",
            "Finished in house rose sauce.",
            "$13.95",
          ),
          item(
            "Linguine with Alfredo Sauce",
            "Finished in a creamy Alfredo sauce.",
            "$13.95",
          ),
          item(
            "Linguine with Pesto Sauce",
            "Finished in basil pesto sauce.",
            "$13.95",
          ),
          item(
            "Linguine Primavera",
            "Finished with the primavera preparation from the board.",
            "$13.95",
          ),
          item(
            "Linguine with Meat Bolognese",
            "Finished with meat bolognese.",
            "$13.95",
          ),
          item(
            "Linguine with Chicken Bolognese",
            "Finished with chicken bolognese.",
            "$14.95",
          ),
          item(
            "Linguine with Vodka Sauce",
            "Finished in vodka sauce.",
            "$14.95",
          ),
        ],
      },
      {
        title: "Tortellini",
        items: [
          item(
            "Tortellini with Tomato Sauce",
            "Finished in classic tomato sauce.",
            "$13.95",
          ),
          item(
            "Tortellini with Rose Sauce",
            "Finished in house rose sauce.",
            "$14.95",
          ),
          item(
            "Tortellini with Alfredo Sauce",
            "Finished in a creamy Alfredo sauce.",
            "$14.95",
          ),
          item(
            "Tortellini with Pesto Sauce",
            "Finished in basil pesto sauce.",
            "$14.95",
          ),
          item(
            "Tortellini Primavera",
            "Finished with the primavera preparation from the board.",
            "$14.95",
          ),
          item(
            "Tortellini with Meat Bolognese",
            "Finished with meat bolognese.",
            "$14.95",
          ),
          item(
            "Tortellini with Chicken Bolognese",
            "Finished with chicken bolognese.",
            "$15.95",
          ),
          item(
            "Tortellini with Vodka Sauce",
            "Finished in vodka sauce.",
            "$15.95",
          ),
        ],
      },
      {
        title: "Gnocchi",
        items: [
          item(
            "Gnocchi with Tomato Sauce",
            "Finished in classic tomato sauce.",
            "$13.95",
          ),
          item(
            "Gnocchi with Rose Sauce",
            "Finished in house rose sauce.",
            "$14.95",
            true,
          ),
          item(
            "Gnocchi with Alfredo Sauce",
            "Finished in a creamy Alfredo sauce.",
            "$14.95",
          ),
          item(
            "Gnocchi with Pesto Sauce",
            "Finished in basil pesto sauce.",
            "$14.95",
          ),
          item(
            "Gnocchi Primavera",
            "Finished with the primavera preparation from the board.",
            "$14.95",
          ),
          item(
            "Gnocchi with Meat Bolognese",
            "Finished with meat bolognese.",
            "$14.95",
          ),
          item(
            "Gnocchi with Chicken Bolognese",
            "Finished with chicken bolognese.",
            "$15.95",
          ),
          item(
            "Gnocchi with Vodka Sauce",
            "Finished in vodka sauce.",
            "$15.95",
          ),
        ],
      },
    ],
    signatureItems: [
      item(
        "Veal Parmigiana with Pasta",
        "Veal parmigiana served with pasta.",
        "$18.95",
      ),
      item(
        "Chicken Parmigiana with Pasta",
        "Chicken parmigiana served with pasta.",
        "$18.95",
        true,
      ),
      item(
        "Linguine with Clams in White Sauce",
        "Linguine with clams in white sauce.",
        "$18.95",
      ),
      item(
        "Linguine with Grilled Jumbo Shrimp in Rose Sauce",
        "Linguine with grilled jumbo shrimp in rose sauce.",
        "$19.95",
      ),
      item(
        "Seafood Linguine",
        "A seafood linguine for guests looking for a richer pasta option.",
        "$22.95",
      ),
    ],
  },
];

export const HOME_SIGNATURE_GROUPS = [
  {
    title: "Breakfast and pastry counter",
    description: "Good for an early office stop or an easy morning pickup.",
    sectionId: "breakfast",
    samples: ["Filled Croissant", "Omelette on a Kaiser", "Egg Salad Bagel"],
  },
  {
    title: "Lunch sandwiches and salads",
    description:
      "Hot sandwiches, lighter salads, and dependable weekday staples.",
    sectionId: "sandwiches",
    samples: [
      "Breaded Veal Cutlet Sandwich",
      "Grilled Chicken Sandwich",
      "Caesar Salad",
    ],
  },
  {
    title: "Pasta and pizza favourites",
    description:
      "Comforting pasta plates and shareable pizzas for solo lunches or team orders.",
    sectionId: "pasta",
    samples: [
      "Penne with Rose Sauce",
      "Chicken Parmigiana with Pasta",
      'Large Pepperoni Pizza (16")',
    ],
  },
];
