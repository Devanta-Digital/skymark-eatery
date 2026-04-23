export type CateringPackage = {
  legacyName: string;
  publicName: string;
  pricePerPerson: string;
  minimumOrder: string;
  feeds: string;
  summary: string;
  /** One logistics / portion line — must not repeat `feeds` or the generic blurb across cards. */
  atAGlance: string;
  includedDishes: string[];
};

export type CateringItem = {
  name: string;
  description: string;
  price: string;
  serving?: string;
  dietary?: string[];
};

export type CateringSection = {
  id: string;
  title: string;
  description: string;
  items: CateringItem[];
};

export const CATERING_INTRO =
  "Buffet packages, hot trays, and platters for Mississauga offices — cooked on Skymark Ave with per-person pricing, guest minimums, and portion notes you can paste into a PO.";

export const CATERING_OVERVIEW = [
  {
    title: "Buffet packages",
    text: "Fixed per-guest menus with one quote line: mains, salad, bread, and sides scaled to your headcount.",
  },
  {
    title: "Tray catering",
    text: "Build-a-meal from hot pasta trays, baked dishes, seafood, and sides — portions are for groups, not single lunch plates.",
  },
  {
    title: "Office-ready platters",
    text: "Cold cuts, sandwich boards, and party pies cut for conference rooms — minimums are built in so ordering stays predictable.",
  },
];

export const BUFFET_PACKAGES: CateringPackage[] = [
  {
    legacyName: "Menu #1",
    publicName: "Classic Lasagna Feast",
    pricePerPerson: "$16.75 per person",
    minimumOrder: "Minimum 8 guests",
    feeds: "Feeds 8-12 people",
    summary:
      "A comforting Italian spread built around house lasagna, salad, and fresh bread.",
    atAGlance:
      "Lasagna-first buffet: easy to portion on disposable or rental chafers; add extra bread if headcount is at the top of the range.",
    includedDishes: [
      "Lasagna",
      "Italian or Caesar salad",
      "Homemade bread and butter",
      "Parmesan",
    ],
  },
  {
    legacyName: "Menu #2",
    publicName: "Cannelloni Duo Feast",
    pricePerPerson: "$16.75 per person",
    minimumOrder: "Minimum 12 guests",
    feeds: "Feeds 12-16 people",
    summary:
      "A hearty buffet with meat and cheese cannelloni, salad, and fresh bread.",
    atAGlance:
      "Dual cannelloni trays stretch further when you pair with extra salad — ideal when vegetarians and meat-eaters share the same table.",
    includedDishes: [
      "Meat cannelloni",
      "Cheese cannelloni",
      "Italian or Caesar salad",
      "Homemade bread and butter",
      "Parmesan",
    ],
  },
  {
    legacyName: "Menu #3",
    publicName: "Italian Roast Chicken Feast",
    pricePerPerson: "$18.45 per person",
    minimumOrder: "Minimum 10 guests",
    feeds: "Feeds 10-14 people",
    summary:
      "Roast chicken or sausage with a tomato-sauced pasta tray, salad, and bread — built for mixed appetites at one table.",
    atAGlance:
      "Choose chicken or sausage before pickup so the kitchen can roast in one batch — pasta tray scales linearly with guest count.",
    includedDishes: [
      "Roasted chicken or roasted sausage",
      "Pasta in tomato sauce",
      "Salad",
      "Bread and butter",
      "Parmesan",
    ],
  },
  {
    legacyName: "Menu #4",
    publicName: "Classic Chicken Parmigiana Buffet",
    pricePerPerson: "$19.60 per person",
    minimumOrder: "Minimum 8 guests",
    feeds: "Feeds 8-12 people",
    summary:
      "Crispy chicken parm with sauced pasta, salad, and bread — the office-friendly crowd default when you need a sure hit.",
    atAGlance:
      "Crispy parm holds best when sauced on-site — we pack sauce separately on request for drives past 20 minutes.",
    includedDishes: [
      "Chicken parmigiana",
      "Pasta in tomato sauce",
      "Salad",
      "Bread and butter",
      "Parmesan",
    ],
  },
  {
    legacyName: "Menu #5",
    publicName: "Veal Parmigiana Dinner",
    pricePerPerson: "$21.90 per person",
    minimumOrder: "Minimum 8 guests",
    feeds: "Feeds 8-12 people",
    summary:
      "A more elevated Italian dinner with veal parmigiana, pasta, salad, and house bread.",
    atAGlance:
      "Veal portions are trimmed for plated pickup; if you need buffet-style self-serve, note it in the inquiry so we slice for trays.",
    includedDishes: [
      "Veal parmigiana",
      "Pasta in tomato sauce",
      "Salad",
      "Bread and butter",
      "Parmesan",
    ],
  },
  {
    legacyName: "Menu #6",
    publicName: "Chicken Scaloppina Dinner",
    pricePerPerson: "$25.40 per person",
    minimumOrder: "Minimum 8 guests",
    feeds: "Feeds 8-12 people",
    summary:
      "An entree-style dinner with chicken scaloppina, vegetables, potatoes, and homemade bread.",
    atAGlance:
      "Plated mains route: fewer moving parts than a pasta buffet — best when you want a sit-down feel without full table service.",
    includedDishes: [
      "Chicken scaloppina",
      "Potatoes",
      "Vegetables",
      "Homemade bread and butter",
    ],
  },
  {
    legacyName: "Menu #7",
    publicName: "Scaloppina Marsala Dinner",
    pricePerPerson: "$30.00 per person",
    minimumOrder: "Minimum 8 guests",
    feeds: "Feeds 8-12 people",
    summary:
      "A premium Italian dinner with veal scaloppina Marsala, vegetables, potatoes, and house bread.",
    atAGlance:
      "Marsala sauce is finished with wine in-house — confirm delivery distance so we can adjust packaging for heat retention.",
    includedDishes: [
      "Veal scaloppina Marsala",
      "Potatoes",
      "Vegetables",
      "Homemade bread and butter",
    ],
  },
  {
    legacyName: "Menu #8",
    publicName: "Chef's Italian Selection",
    pricePerPerson: "$30.00 per person",
    minimumOrder: "Minimum 8 guests",
    feeds: "Feeds 8-12 people",
    summary:
      "A chef-selected spread with puttanesca, roasted chicken, rice, vegetables, salad, and house bread.",
    atAGlance:
      "Most components tray separately so guests can build plates; tell us if you need vegetarian-only puttanesca on the line.",
    includedDishes: [
      "Puttanesca",
      "Roasted chicken",
      "Mediterranean rice",
      "Carrots and green beans",
      "Salad",
      "Homemade bread and butter",
    ],
  },
];

export const CATERING_SECTIONS: CateringSection[] = [
  {
    id: "appetizers",
    title: "Appetizers & Hors d'oeuvres",
    description:
      "Passed bites and skewers — not on the weekday lunch board. Every line below is priced for platter or piece minimums (see each line).",
    items: [
      {
        name: "Bruschetta",
        description: "Tomato-topped crostini prepared for easy passing.",
        price: "$2.05 each",
        serving: "Minimum 12 pieces or $24.60 per platter",
        dietary: ["Vegetarian"],
      },
      {
        name: "Bruschetta with Cheese",
        description: "Bruschetta finished with cheese for a richer bite.",
        price: "$5.50 each",
        serving: "Minimum 6 pieces or $33.10 per platter",
        dietary: ["Vegetarian"],
      },
      {
        name: "Garlic Bread",
        description: "House-style garlic bread cut for platter service.",
        price: "$1.26 each",
        serving: "Minimum 12 pieces or $15.15 per platter",
        dietary: ["Vegetarian"],
      },
      {
        name: "Garlic Bread with Cheese",
        description: "Garlic bread baked with melted cheese.",
        price: "$4.05 each",
        serving: "Minimum 12 pieces or $48.55 per platter",
        dietary: ["Vegetarian"],
      },
      {
        name: "Breaded Chicken with Plum Sauce",
        description: "Breaded chicken pieces served with plum sauce.",
        price: "$4.05 each",
        serving: "Minimum 12 pieces or $48.55 per platter",
      },
      {
        name: "Breaded Shrimp with Seafood Dip",
        description: "Crisp breaded shrimp with a creamy seafood dip.",
        price: "$2.45 each",
        serving: "Minimum 24 pieces or $57.99 per platter",
        dietary: ["Pescatarian"],
      },
      {
        name: "Italian Meatball in Tomato Sauce",
        description: "Classic meatballs finished in tomato sauce.",
        price: "$4.05 each",
        serving: "Minimum 12 pieces or $48.55 per platter",
      },
      {
        name: "Mini Bocconcini & Cherry Tomato Skewers",
        description:
          "Fresh bocconcini and cherry tomatoes on easy grab-and-go skewers.",
        price: "$2.15 each",
        serving: "Minimum 24 pieces or $51.70 per platter",
        dietary: ["Vegetarian", "Gluten free"],
      },
    ],
  },
  {
    id: "platters",
    title: "Party Platters",
    description:
      "Deli boards and sandwich spreads sized for headcount — different SKUs and minimums than ordering single sandwiches at the counter.",
    items: [
      {
        name: "Assorted Sliced Cold Meat & Cheese Platter",
        description:
          "A deli-style platter arranged for grazing, sandwich building, or office sharing.",
        price: "$109.15 / $145.50",
        serving: 'Medium 14" / large 16" platters',
      },
      {
        name: "Cold Sandwich Platter",
        description:
          "Choose from ham, turkey, prosciutto, capiccollo, salami, or caprese with your preferred cheese selections.",
        price: "$12.15 each",
        serving: "Minimum 10 sandwiches",
      },
      {
        name: "Hot Sandwich Platter",
        description:
          "Includes favourites such as veal, chicken, halal chicken, grilled veal, grilled chicken, meatballs, sausage, caprese, or grilled vegetables.",
        price: "$9.00 to $17.00 each",
        serving: "Minimum 8 sandwiches",
      },
    ],
  },
  {
    id: "pasta-baked",
    title: "Pasta, Lasagna & Baked Dishes",
    description:
      "Tray and bake formats only — same kitchen as the pasta line, but portioning and medium / large tray sizes are for groups. Counter pasta plates stay on the menu.",
    items: [
      {
        name: "Lasagna",
        description:
          "Available in meat, vegetable, spinach and ricotta, three cheese, or chicken and red pepper.",
        price: "$47.00 / $79.00",
        serving: "Medium / large trays",
      },
      {
        name: "Gluten-Free Lasagna",
        description: "The same tray sizes, prepared for gluten-free requests.",
        price: "$52.00 / $84.00",
        serving: "Medium / large trays",
        dietary: ["Gluten free"],
      },
      {
        name: "Eggplant Parmigiana",
        description:
          "A hearty baked eggplant tray finished with tomato sauce and cheese.",
        price: "$52.00 / $84.00",
        serving: "Medium / large trays",
        dietary: ["Vegetarian"],
      },
      {
        name: "Cannelloni",
        description: "Available with beef or spinach and ricotta.",
        price: "$58.00 / $114.85",
        serving: "Medium 6 pieces / large 12 pieces",
      },
      {
        name: "Tortellini, Ravioli, or Gnocchi in Tomato Sauce",
        description:
          "A classic tomato sauce option for crowd-friendly pasta trays.",
        price: "$57.00 / $79.00",
        serving: "Medium / large trays",
      },
      {
        name: "Tortellini, Ravioli, or Gnocchi in Rose Sauce",
        description: "Finished in Skymark's creamy rose sauce.",
        price: "$58.00 / $82.00",
        serving: "Medium / large trays",
      },
      {
        name: "Tortellini, Ravioli, or Gnocchi in Alfredo Sauce",
        description: "A richer Alfredo tray for comfort-food catering.",
        price: "$59.00 / $85.00",
        serving: "Medium / large trays",
      },
      {
        name: "Penne, Rigatoni, Spaghetti, Linguine, or Fettuccine",
        description:
          "Bulk tray build: pick shape and sauce for the group — pricing scales by medium or large tray and add-ons, not by the single-plate menu board.",
        price: "$22.00 to $26.00 base",
        serving: "Sauce and add-on pricing quoted by tray selection (medium or large)",
      },
    ],
  },
  {
    id: "seafood",
    title: "Seafood",
    description:
      "Catering-scale fish and shellfish — fillets and trays are portioned for buffets and hosted meals, not the same as adding shrimp to a counter salad.",
    items: [
      {
        name: "Grilled Salmon Fillet",
        description:
          "Per-fillet catering add-on for plated service or buffet lines — ordered by count for the kitchen to grill in one run.",
        price: "$16.75 each",
        dietary: ["Pescatarian", "Gluten free"],
      },
      {
        name: "Gamberi al Pomodoro",
        description: "Jumbo shrimp in tomato, white wine, and garlic sauce.",
        price: "$87.00 / $175.00",
        serving: "Medium / large trays",
        dietary: ["Pescatarian"],
      },
      {
        name: "Zuppa di Mare",
        description:
          "Shrimp, scallops, calamari, and mussels in a seafood tray for larger gatherings.",
        price: "$105.00 / $210.00",
        serving: "Medium / large trays",
        dietary: ["Pescatarian"],
      },
    ],
  },
  {
    id: "sides",
    title: "Vegetables & Sides",
    description:
      "Rice and potato trays that anchor a buffet — medium and large sizes so you can match starch to headcount.",
    items: [
      {
        name: "Mediterranean Rice with Vegetables",
        description:
          "A versatile side for buffet service and plated group meals.",
        price: "$25.00 / $50.00",
        serving: "Medium / large trays",
        dietary: ["Vegetarian"],
      },
      {
        name: "Roasted Parisienne Potatoes",
        description:
          "Roasted potatoes prepared for buffet and family-style service.",
        price: "$23.00 / $46.00",
        serving: "Medium / large trays",
        dietary: ["Vegetarian", "Gluten free"],
      },
    ],
  },
  {
    id: "salads",
    title: "Salads",
    description:
      "Catering salad trays in medium and large — not the same price grid as Italian / Caesar / Greek bowls on the takeout menu.",
    items: [
      {
        name: "Italian Salad",
        description:
          "House Italian mix in disposable or rental pans — best as a buffet side beside pasta or parm trays.",
        price: "$28.85 / $43.35",
        serving: "Medium / large",
        dietary: ["Vegetarian"],
      },
      {
        name: "Caesar Salad",
        description:
          "Classic Caesar in catering depths — good when you want a familiar green that holds dressing on a long service window.",
        price: "$28.85 / $43.35",
        serving: "Medium / large",
      },
      {
        name: "Greek Salad",
        description:
          "Feta-forward tray for brighter tables — works when half the room wants something lighter next to hot mains.",
        price: "$29.95 / $47.95",
        serving: "Medium / large",
        dietary: ["Vegetarian", "Gluten free"],
      },
    ],
  },
  {
    id: "pizza",
    title: "Gourmet Pizza",
    description:
      "Party-size gourmet pies below — counter personal and 16\" pies stay on the menu for individual pickup.",
    items: [
      {
        name: "Margherita Party Pizza",
        description: "Tomato sauce, fresh basil, olive oil, and bocconcini.",
        price: "$43.35",
        serving: "Party size",
        dietary: ["Vegetarian"],
      },
      {
        name: "Pepperoni Party Pizza",
        description: "Tomato sauce, mozzarella, and cacciatore sausage.",
        price: "$46.15",
        serving: "Party size",
      },
      {
        name: "Deluxe Party Pizza",
        description:
          "Cacciatore sausage, mushrooms, red peppers, and green peppers.",
        price: "$50.80",
        serving: "Party size",
      },
      {
        name: "Vegetarian Delight Party Pizza",
        description:
          "Sweet peppers, mushrooms, olives, onions, and sliced tomato.",
        price: "$50.80",
        serving: "Party size",
        dietary: ["Vegetarian"],
      },
    ],
  },
  {
    id: "desserts",
    title: "Desserts & Pastries",
    description:
      "Tray desserts and pastry counts for coffee service — not mirrored item-for-item on the breakfast pastry list.",
    items: [
      {
        name: "Assorted Small Pastries",
        description: "Cannoli, cream puffs, panna cotta, and tiramisu squares.",
        price: "$4.40 each",
        serving: "Minimum 12 pieces",
      },
      {
        name: "Homemade Italian Cookies",
        description:
          "A cookie assortment sized for dessert tables and coffee service.",
        price: "$78.50 / $130.50",
        serving: 'Medium 14" / large 18" trays',
      },
      {
        name: "Homemade Tiramisu",
        description:
          "A house-made tiramisu option for smaller gatherings or larger dessert service.",
        price: "$28.85 / $80.80",
        serving: "Medium serves up to 10 / large serves up to 18",
      },
    ],
  },
  {
    id: "extras",
    title: "Beverages & Catering Extras",
    description:
      "Disposables, bread add-ons, drinks, and topping trays — logistics layer on top of food, quoted per head or per piece.",
    items: [
      {
        name: "Homemade Bread",
        description: "Fresh bread served alongside buffet and tray orders.",
        price: "$5.20 medium / $8.85 large",
      },
      {
        name: "Assorted Dinner Rolls",
        description:
          "A simple add-on for plated service, buffet tables, or sandwich spreads.",
        price: "$0.95 each",
      },
      {
        name: "Assorted Bottled Pop, Brio, and Water",
        description:
          "Includes spring water, San Pellegrino, San Pellegrino flavoured beverages, bottled pop, and Brio.",
        price: "$1.95 to $3.75",
      },
      {
        name: "Disposable Plates, Napkins & Cutlery",
        description:
          "Convenient disposable settings for office lunches and events.",
        price: "$1.05 per person",
      },
      {
        name: "Serving Utensils",
        description: "Serving utensils available for buffet and tray service.",
        price: "$3.67 per utensil",
      },
      {
        name: "Topping Trays",
        description:
          "Extra toppings arranged by tray size for sandwiches, platters, and catered spreads.",
        price: "$60.65 / $90.80",
        serving: "Medium / large",
      },
    ],
  },
];

export const DIETARY_BADGES = [
  "Halal options",
  "Gluten-free options",
  "Lactose-free options",
  "Nut-free options",
  "Pescatarian options",
  "Vegan options",
  "Vegetarian options",
];

export const CATERING_NOTES = [
  "Service styles: buffet lines, tray drop-off, or boxed / pre-portioned meals on request — say which you need in the inquiry.",
  "Minimums are per line item (e.g. 12–24 pieces on bites, 8–10 sandwiches on platters). We confirm counts when we reply.",
  "Some seafood and market items may re-quote if your event date is far out.",
];
