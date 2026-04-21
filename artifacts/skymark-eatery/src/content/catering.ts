export type CateringPackage = {
  legacyName: string;
  publicName: string;
  pricePerPerson: string;
  minimumOrder: string;
  feeds: string;
  summary: string;
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
  "Perfect for office lunches, events, and family gatherings. Choose from curated Italian buffet packages prepared fresh by Skymark Eatery in Mississauga.";

export const CATERING_OVERVIEW = [
  {
    title: "Buffet packages",
    text: "Curated per-person menus with salads, pasta, mains, bread, and classic Italian sides.",
  },
  {
    title: "Tray catering",
    text: "Order lasagna, pasta, salads, seafood, sides, and desserts by tray for flexible group service.",
  },
  {
    title: "Office-ready platters",
    text: "Cold sandwich trays, hot sandwich platters, party pizzas, pastries, and service extras for easy hosting.",
  },
];

export const BUFFET_PACKAGES: CateringPackage[] = [
  {
    legacyName: "Menu #1",
    publicName: "Classic Lasagna Feast",
    pricePerPerson: "$16.75 per person",
    minimumOrder: "Minimum 8 guests",
    feeds: "Feeds 8-12 people",
    summary: "A comforting Italian spread built around house lasagna, salad, and fresh bread.",
    includedDishes: ["Lasagna", "Italian or Caesar salad", "Homemade bread and butter", "Parmesan"],
  },
  {
    legacyName: "Menu #2",
    publicName: "Cannelloni Duo Feast",
    pricePerPerson: "$16.75 per person",
    minimumOrder: "Minimum 12 guests",
    feeds: "Feeds 12-16 people",
    summary: "A hearty buffet with meat and cheese cannelloni, salad, and fresh bread.",
    includedDishes: ["Meat cannelloni", "Cheese cannelloni", "Italian or Caesar salad", "Homemade bread and butter", "Parmesan"],
  },
  {
    legacyName: "Menu #3",
    publicName: "Italian Roast Chicken Feast",
    pricePerPerson: "$18.45 per person",
    minimumOrder: "Minimum 10 guests",
    feeds: "Feeds 10-14 people",
    summary: "A crowd-pleasing buffet with roasted chicken or sausage, pasta, salad, and bread.",
    includedDishes: ["Roasted chicken or roasted sausage", "Pasta in tomato sauce", "Salad", "Bread and butter", "Parmesan"],
  },
  {
    legacyName: "Menu #4",
    publicName: "Classic Chicken Parmigiana Buffet",
    pricePerPerson: "$19.60 per person",
    minimumOrder: "Minimum 8 guests",
    feeds: "Feeds 8-12 people",
    summary: "A classic comfort-food buffet with chicken parmigiana, pasta, salad, and bread.",
    includedDishes: ["Chicken parmigiana", "Pasta in tomato sauce", "Salad", "Bread and butter", "Parmesan"],
  },
  {
    legacyName: "Menu #5",
    publicName: "Veal Parmigiana Dinner",
    pricePerPerson: "$21.90 per person",
    minimumOrder: "Minimum 8 guests",
    feeds: "Feeds 8-12 people",
    summary: "A more elevated Italian dinner with veal parmigiana, pasta, salad, and house bread.",
    includedDishes: ["Veal parmigiana", "Pasta in tomato sauce", "Salad", "Bread and butter", "Parmesan"],
  },
  {
    legacyName: "Menu #6",
    publicName: "Chicken Scaloppina Dinner",
    pricePerPerson: "$25.40 per person",
    minimumOrder: "Minimum 8 guests",
    feeds: "Feeds 8-12 people",
    summary: "An entree-style dinner with chicken scaloppina, vegetables, potatoes, and homemade bread.",
    includedDishes: ["Chicken scaloppina", "Potatoes", "Vegetables", "Homemade bread and butter"],
  },
  {
    legacyName: "Menu #7",
    publicName: "Scaloppina Marsala Dinner",
    pricePerPerson: "$30.00 per person",
    minimumOrder: "Minimum 8 guests",
    feeds: "Feeds 8-12 people",
    summary: "A premium Italian dinner with veal scaloppina Marsala, vegetables, potatoes, and house bread.",
    includedDishes: ["Veal scaloppina Marsala", "Potatoes", "Vegetables", "Homemade bread and butter"],
  },
  {
    legacyName: "Menu #8",
    publicName: "Chef's Italian Selection",
    pricePerPerson: "$30.00 per person",
    minimumOrder: "Minimum 8 guests",
    feeds: "Feeds 8-12 people",
    summary: "A chef-selected spread with puttanesca, roasted chicken, rice, vegetables, salad, and house bread.",
    includedDishes: ["Puttanesca", "Roasted chicken", "Mediterranean rice", "Carrots and green beans", "Salad", "Homemade bread and butter"],
  },
];

export const CATERING_SECTIONS: CateringSection[] = [
  {
    id: "appetizers",
    title: "Appetizers & Hors d'oeuvres",
    description: "Perfect for receptions, mingling events, and lighter office gatherings. Minimum counts apply on select items.",
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
        description: "Fresh bocconcini and cherry tomatoes on easy grab-and-go skewers.",
        price: "$2.15 each",
        serving: "Minimum 24 pieces or $51.70 per platter",
        dietary: ["Vegetarian", "Gluten free"],
      },
    ],
  },
  {
    id: "platters",
    title: "Party Platters",
    description: "Easy group catering for meetings, open houses, client hosting, and casual events.",
    items: [
      {
        name: "Assorted Sliced Cold Meat & Cheese Platter",
        description: "A deli-style platter arranged for grazing, sandwich building, or office sharing.",
        price: '$72.75 / $109.15 / $145.50 / $181.95',
        serving: '12" / 14" / 16" / 18"',
      },
      {
        name: "Cold Sandwich Platter",
        description: "Choose from ham, turkey, prosciutto, capiccollo, salami, or caprese with your preferred cheese selections.",
        price: "$12.15 each",
        serving: "Minimum 10 sandwiches",
      },
      {
        name: "Hot Sandwich Platter",
        description: "Includes favourites such as veal, chicken, halal chicken, grilled veal, grilled chicken, meatballs, sausage, caprese, or grilled vegetables.",
        price: "$9.00 to $17.00 each",
        serving: "Minimum 8 sandwiches",
      },
    ],
  },
  {
    id: "pasta-baked",
    title: "Pasta, Lasagna & Baked Dishes",
    description: "Flexible tray catering for office lunches, family-style gatherings, and larger celebrations.",
    items: [
      {
        name: "Lasagna",
        description: "Available in meat, vegetable, spinach and ricotta, three cheese, or chicken and red pepper.",
        price: "$32.00 / $47.00 / $79.00 / $174.00",
        serving: "Small / medium / large / extra large trays",
      },
      {
        name: "Gluten-Free Lasagna",
        description: "The same tray sizes, prepared for gluten-free requests.",
        price: "$34.00 / $52.00 / $84.00 / $187.00",
        serving: "Small / medium / large / extra large trays",
        dietary: ["Gluten free"],
      },
      {
        name: "Eggplant Parmigiana",
        description: "A hearty baked eggplant tray finished with tomato sauce and cheese.",
        price: "$34.00 / $52.00 / $84.00 / $187.00",
        serving: "Small / medium / large / extra large trays",
        dietary: ["Vegetarian"],
      },
      {
        name: "Cannelloni",
        description: "Available with beef or spinach and ricotta.",
        price: "$29.00 / $58.00 / $114.85",
        serving: "Medium 6 pieces / large 12 pieces / extra large 24 pieces",
      },
      {
        name: "Tortellini, Ravioli, or Gnocchi in Tomato Sauce",
        description: "A classic tomato sauce option for crowd-friendly pasta trays.",
        price: "$28.90 / $57.00 / $79.00 / $109.00",
        serving: "Small / medium / large / extra large trays",
      },
      {
        name: "Tortellini, Ravioli, or Gnocchi in Rose Sauce",
        description: "Finished in Skymark's creamy rose sauce.",
        price: "$29.95 / $58.00 / $82.00 / $113.00",
        serving: "Small / medium / large / extra large trays",
      },
      {
        name: "Tortellini, Ravioli, or Gnocchi in Alfredo Sauce",
        description: "A richer Alfredo tray for comfort-food catering.",
        price: "$30.85 / $59.00 / $85.00 / $117.00",
        serving: "Small / medium / large / extra large trays",
      },
      {
        name: "Penne, Rigatoni, Spaghetti, Linguine, or Fettuccine",
        description: "Choose tomato, rose, Alfredo, aglio e olio, arrabbiata, or pesto. Extras and tray-size pricing are available for larger orders.",
        price: "$22.00 to $26.00 base",
        serving: "Sauce and add-on pricing available by pasta selection",
      },
    ],
  },
  {
    id: "seafood",
    title: "Seafood",
    description: "Prepared for more substantial catering orders. Select seafood items may be subject to market pricing.",
    items: [
      {
        name: "Grilled Salmon Fillet",
        description: "Individually portioned grilled salmon for plated or buffet service.",
        price: "$16.75 each",
        dietary: ["Pescatarian", "Gluten free"],
      },
      {
        name: "Gamberi al Pomodoro",
        description: "Jumbo shrimp in tomato, white wine, and garlic sauce.",
        price: "$87.00 / $175.00 / $260.00",
        serving: "Medium / large / extra large trays",
        dietary: ["Pescatarian"],
      },
      {
        name: "Zuppa di Mare",
        description: "Shrimp, scallops, calamari, and mussels in a seafood tray for larger gatherings.",
        price: "$105.00 / $210.00 / $315.00",
        serving: "Medium / large / extra large trays",
        dietary: ["Pescatarian"],
      },
    ],
  },
  {
    id: "sides",
    title: "Vegetables & Sides",
    description: "Simple, dependable accompaniments that pair well with buffet packages and tray catering.",
    items: [
      {
        name: "Mediterranean Rice with Vegetables",
        description: "A versatile side for buffet service and plated group meals.",
        price: "$25.00 / $50.00 / $101.00",
        serving: "Medium / large / extra large trays",
        dietary: ["Vegetarian"],
      },
      {
        name: "Roasted Parisienne Potatoes",
        description: "Roasted potatoes prepared for buffet and family-style service.",
        price: "$23.00 / $46.00 / $92.00",
        serving: "Medium / large / extra large trays",
        dietary: ["Vegetarian", "Gluten free"],
      },
    ],
  },
  {
    id: "salads",
    title: "Salads",
    description: "Fresh tray salads sized for small gatherings, office spreads, and larger catered events.",
    items: [
      {
        name: "Italian Salad",
        description: "A fresh house salad option that pairs easily with pasta and buffet packages.",
        price: "$21.90 / $28.85 / $43.35 / $57.20 / $68.75",
        serving: "Family / large / XXL shallow / extra large / extra large deep",
        dietary: ["Vegetarian"],
      },
      {
        name: "Caesar Salad",
        description: "A classic Caesar salad for tray catering and buffet service.",
        price: "$21.90 / $28.85 / $43.35 / $57.20 / $68.75",
        serving: "Family / large / XXL shallow / extra large / extra large deep",
      },
      {
        name: "Greek Salad",
        description: "A brighter salad option with a Mediterranean profile.",
        price: "$25.95 / $29.95 / $47.95 / $60.00 / $70.00",
        serving: "Family / large / XXL shallow / extra large / extra large deep",
        dietary: ["Vegetarian", "Gluten free"],
      },
    ],
  },
  {
    id: "pizza",
    title: "Gourmet Pizza",
    description: "Party-size pizza trays for casual events, office lunches, and easy group catering.",
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
        description: "Cacciatore sausage, mushrooms, red peppers, and green peppers.",
        price: "$50.80",
        serving: "Party size",
      },
      {
        name: "Vegetarian Delight Party Pizza",
        description: "Sweet peppers, mushrooms, olives, onions, and sliced tomato.",
        price: "$50.80",
        serving: "Party size",
        dietary: ["Vegetarian"],
      },
    ],
  },
  {
    id: "desserts",
    title: "Desserts & Pastries",
    description: "Finish the table with classic Italian sweets and easy office-friendly dessert trays.",
    items: [
      {
        name: "Assorted Small Pastries",
        description: "Cannoli, cream puffs, panna cotta, and tiramisu squares.",
        price: "$4.40 each",
        serving: "Minimum 12 pieces",
      },
      {
        name: "Homemade Italian Cookies",
        description: "A cookie assortment sized for dessert tables and coffee service.",
        price: "$51.95 / $78.50 / $130.50",
        serving: '12" / 14" / 18" trays',
      },
      {
        name: "Homemade Tiramisu",
        description: "A house-made tiramisu option for smaller gatherings or larger dessert service.",
        price: "$28.85 / $80.80",
        serving: "Small serves up to 6 / large serves up to 18",
      },
    ],
  },
  {
    id: "extras",
    title: "Beverages & Catering Extras",
    description: "Add the finishing details for smooth event service, from drinks to disposables.",
    items: [
      {
        name: "Homemade Bread",
        description: "Fresh bread served alongside buffet and tray orders.",
        price: "$5.20 small / $8.85 large",
      },
      {
        name: "Assorted Dinner Rolls",
        description: "A simple add-on for plated service, buffet tables, or sandwich spreads.",
        price: "$0.95 each",
      },
      {
        name: "Assorted Bottled Pop, Brio, and Water",
        description: "Includes spring water, San Pellegrino, San Pellegrino flavoured beverages, bottled pop, and Brio.",
        price: "$1.95 to $3.75",
      },
      {
        name: "Disposable Plates, Napkins & Cutlery",
        description: "Convenient disposable settings for office lunches and events.",
        price: "$1.05 per person",
      },
      {
        name: "Serving Utensils",
        description: "Serving utensils available for buffet and tray service.",
        price: "$3.67 per utensil",
      },
      {
        name: "Topping Trays",
        description: "Extra toppings arranged by tray size for sandwiches, platters, and catered spreads.",
        price: "$31.15 / $60.65 / $90.80 / $115.30",
        serving: "Medium / large / XL shallow / extra large",
      },
    ],
  },
];

export const DIETARY_BADGES = ["Halal options", "Gluten-free options", "Lactose-free options", "Nut-free options", "Pescatarian options", "Vegan options", "Vegetarian options"];

export const CATERING_NOTES = [
  "Catering is available buffet style, with boxed lunches or pre-portioned meals available on request.",
  "Minimum quantities vary by section. Appetizers may require 12 to 24 pieces, while sandwich platters begin at 8 to 10 sandwiches.",
  "Seafood pricing and select larger-format items may change with market conditions.",
  "For office lunches, private events, and recurring catering needs, Skymark Eatery can help you build the right mix of packages, trays, platters, and extras.",
];
