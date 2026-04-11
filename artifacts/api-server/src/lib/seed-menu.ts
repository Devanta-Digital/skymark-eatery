import { db } from "@workspace/db";
import { categoriesTable, menuItemsTable, specialsTable } from "@workspace/db";
import { eq, count, like } from "drizzle-orm";
import { logger } from "./logger.js";

const CATEGORIES = [
  { name: "Breakfast", description: "Morning favourites to start your day", displayOrder: 1 },
  { name: "Coffee & Espresso", description: "Freshly brewed Italian coffees", displayOrder: 2 },
  { name: "Drinks", description: "Cold drinks and refreshments", displayOrder: 3 },
  { name: "Pizza & Focaccia", description: "Stone-baked pizzas and focaccia", displayOrder: 4 },
  { name: "Pasta", description: "Classic Italian pasta dishes", displayOrder: 5 },
  { name: "Sandwiches & Wraps", description: "Fresh Italian-style sandwiches and wraps", displayOrder: 6 },
  { name: "Salads", description: "Fresh seasonal salads", displayOrder: 7 },
  { name: "Sides & Arancini", description: "Sides, starters, and arancini (rice balls)", displayOrder: 8 },
  { name: "Catering", description: "Group packages and catering options", displayOrder: 9 },
];

type MenuItemSeed = {
  categoryName: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  isPopular?: boolean;
  isFeatured?: boolean;
};

const MENU_ITEMS: MenuItemSeed[] = [
  // Breakfast
  { categoryName: "Breakfast", name: "Croissant — Plain", description: "Buttery Italian-style croissant, lightly flaky and golden", price: "3.45", imageUrl: "/food/croissant.png", isPopular: true },
  { categoryName: "Breakfast", name: "Croissant — Italian Cream", description: "Flaky croissant filled with rich Italian pastry cream", price: "3.45", imageUrl: "/food/croissant.png", isPopular: true },
  { categoryName: "Breakfast", name: "Croissant — Apricot", description: "Buttery croissant filled with smooth apricot preserve", price: "3.45", imageUrl: "/food/croissant.png" },
  { categoryName: "Breakfast", name: "Croissant — Chocolate", description: "Classic croissant filled with smooth chocolate cream", price: "3.45", imageUrl: "/food/croissant-chocolate.png", isPopular: true },
  { categoryName: "Breakfast", name: "Bagel", description: "Fresh-baked bagel served plain or with your choice of topping. Add cream cheese, tuna, egg salad, and more.", price: "2.25", imageUrl: "/food/bagel.png" },
  // Coffee & Espresso
  { categoryName: "Coffee & Espresso", name: "Coffee / Tea", description: "Freshly brewed coffee or premium tea selection", price: "2.25", imageUrl: "/food/coffee.png", isPopular: true },
  { categoryName: "Coffee & Espresso", name: "Espresso", description: "Double shot of rich Italian espresso", price: "2.75", imageUrl: "/food/espresso.png", isPopular: true },
  { categoryName: "Coffee & Espresso", name: "Cappuccino", description: "Espresso with velvety steamed milk foam", price: "3.25", imageUrl: "/food/cappuccino.png", isPopular: true },
  { categoryName: "Coffee & Espresso", name: "Latte / Caffè Moka", description: "Smooth espresso with steamed milk, or mocha-style with chocolate", price: "3.25", imageUrl: "/food/latte.png", isPopular: true },
  { categoryName: "Coffee & Espresso", name: "Latte Macchiato", description: "Steamed milk gently marked with a shot of espresso", price: "3.35", imageUrl: "/food/latte.png" },
  { categoryName: "Coffee & Espresso", name: "Americano", description: "Espresso diluted with hot water for a long, smooth coffee", price: "3.25", imageUrl: "/food/espresso.png" },
  { categoryName: "Coffee & Espresso", name: "Decaf Espresso", description: "Full-flavour decaffeinated espresso, smooth and aromatic", price: "3.50", imageUrl: "/food/espresso.png" },
  { categoryName: "Coffee & Espresso", name: "Hot Chocolate", description: "Rich and creamy Italian-style hot chocolate", price: "3.25", imageUrl: "/food/hot-chocolate.png" },
  // Drinks
  { categoryName: "Drinks", name: "Water", description: "Bottled still water", price: "2.25", imageUrl: "/food/sparkling-water.png" },
  { categoryName: "Drinks", name: "San Pellegrino", description: "Premium Italian sparkling mineral water", price: "2.75", imageUrl: "/food/sparkling-water.png", isPopular: true },
  { categoryName: "Drinks", name: "Brio", description: "Classic Italian-style sparkling chinotto citrus drink", price: "2.75", imageUrl: "/food/brio.png" },
  { categoryName: "Drinks", name: "Orangina", description: "Sparkling orange drink with real fruit pulp", price: "3.25", imageUrl: "/food/orangina.png" },
  { categoryName: "Drinks", name: "Pop / Soft Drink", description: "Assorted carbonated soft drinks", price: "3.25", imageUrl: "/food/gatorade.png" },
  { categoryName: "Drinks", name: "Gatorade", description: "Sports drink, assorted flavours", price: "3.75", imageUrl: "/food/gatorade.png" },
  // Pizza & Focaccia
  { categoryName: "Pizza & Focaccia", name: "Personal Pizza", description: "Fresh stone-baked personal pizza with tomato sauce and mozzarella. Toppings available.", price: "9.95", imageUrl: "/food/pizza-personal.png", isPopular: true },
  { categoryName: "Pizza & Focaccia", name: "Gluten-Free Personal Pizza", description: "Personal pizza on a gluten-free crust — same great flavour", price: "19.00", imageUrl: "/food/pizza-personal.png" },
  { categoryName: "Pizza & Focaccia", name: "Focaccia Slice", description: "Freshly baked Italian focaccia by the slice, seasoned with olive oil and herbs", price: "6.95", imageUrl: "/food/focaccia.png", isPopular: true },
  { categoryName: "Pizza & Focaccia", name: "Focaccia Whole", description: "Full-size freshly baked focaccia loaf — perfect for sharing or catering", price: "21.95", imageUrl: "/food/focaccia.png" },
  { categoryName: "Pizza & Focaccia", name: "Party Pizza — Cheese", description: "Large party pizza with classic tomato sauce and mozzarella cheese", price: "29.95", imageUrl: "/food/pizza-personal.png" },
  { categoryName: "Pizza & Focaccia", name: "Party Pizza — Pepperoni", description: "Large party pizza loaded with pepperoni and mozzarella", price: "35.95", imageUrl: "/food/pizza-pepperoni.png" },
  { categoryName: "Pizza & Focaccia", name: "Party Pizza — Veggie", description: "Large party pizza with roasted vegetables and mozzarella", price: "39.95", imageUrl: "/food/pizza-veggie.png" },
  // Pasta
  { categoryName: "Pasta", name: "Gnocchi — Tomato / Pesto", description: "House-made gnocchi in your choice of classic tomato sauce or fresh basil pesto", price: "11.95", imageUrl: "/food/gnocchi-tomato.png", isPopular: true },
  { categoryName: "Pasta", name: "Gnocchi — Rosé Sauce", description: "Pillowy gnocchi in a creamy tomato rosé sauce", price: "12.95", imageUrl: "/food/gnocchi-rose.png", isPopular: true },
  { categoryName: "Pasta", name: "Gnocchi — Bolognese / Alfredo / Primavera", description: "Gnocchi in your choice of meat Bolognese, creamy Alfredo, or fresh Primavera", price: "13.95", imageUrl: "/food/gnocchi-tomato.png" },
  { categoryName: "Pasta", name: "Penne — Tomato / Pesto", description: "Penne pasta with classic tomato sauce or fragrant basil pesto", price: "10.95", imageUrl: "/food/penne-tomato.png", isPopular: true },
  { categoryName: "Pasta", name: "Penne — Rosé Sauce", description: "Penne in a velvety tomato cream rosé sauce", price: "11.95", imageUrl: "/food/penne-rose.png", isPopular: true },
  { categoryName: "Pasta", name: "Penne — Alfredo", description: "Penne tossed in a rich, creamy Alfredo sauce", price: "12.95", imageUrl: "/food/penne-alfredo.png" },
  { categoryName: "Pasta", name: "Penne — Bolognese", description: "Penne with slow-cooked Italian meat Bolognese", price: "12.95", imageUrl: "/food/penne-bolognese.png", isPopular: true },
  // Sandwiches & Wraps
  { categoryName: "Sandwiches & Wraps", name: "Veal Sandwich / Wrap", description: "Tender breaded veal in a fresh bun or wrap with your choice of toppings", price: "12.95", imageUrl: "/food/veal-sandwich.png", isPopular: true },
  { categoryName: "Sandwiches & Wraps", name: "Chicken Sandwich / Wrap", description: "Grilled or breaded chicken in a fresh bun or wrap", price: "12.95", imageUrl: "/food/chicken-sandwich.png", isPopular: true },
  { categoryName: "Sandwiches & Wraps", name: "Eggplant Parmesan Sandwich / Wrap", description: "Crispy breaded eggplant with tomato sauce and mozzarella in a bun or wrap", price: "12.95", imageUrl: "/food/falafel-wrap.png" },
  { categoryName: "Sandwiches & Wraps", name: "Grilled Vegetable Sandwich / Wrap", description: "Seasonal grilled vegetables with pesto and fresh greens in a bun or wrap", price: "12.95", imageUrl: "/food/grilled-veggie-sandwich.png" },
  { categoryName: "Sandwiches & Wraps", name: "Meatball Sandwich", description: "Juicy Italian meatballs in tomato sauce on a fresh bun", price: "13.95", imageUrl: "/food/meatball-sandwich.png", isPopular: true },
  { categoryName: "Sandwiches & Wraps", name: "Falafel Wrap", description: "Crispy falafel with fresh vegetables and tahini in a soft wrap", price: "13.95", imageUrl: "/food/falafel-wrap.png" },
  { categoryName: "Sandwiches & Wraps", name: "Grilled Steak Sandwich", description: "Sliced grilled steak with caramelized onions and peppers on a fresh bun", price: "13.95", imageUrl: "/food/veal-sandwich.png" },
  { categoryName: "Sandwiches & Wraps", name: "Sausage Sandwich", description: "Italian sausage with peppers and onions on a fresh bun", price: "9.95", imageUrl: "/food/sausage-sandwich.png" },
  // Salads
  { categoryName: "Salads", name: "Italian Salad", description: "Mixed greens with olives, pepperoncini, tomato, and Italian vinaigrette", price: "11.95", imageUrl: "/food/italian-salad.png", isPopular: true },
  { categoryName: "Salads", name: "Caesar Salad", description: "Crisp romaine with classic Caesar dressing, croutons, and Parmesan", price: "12.95", imageUrl: "/food/caesar-salad.png", isPopular: true },
  { categoryName: "Salads", name: "Greek Salad", description: "Cucumber, tomato, red onion, olives, and feta with lemon-herb dressing", price: "12.95", imageUrl: "/food/greek-salad.png" },
  { categoryName: "Salads", name: "Add Grilled Chicken", description: "Add a grilled chicken breast to any salad", price: "6.95", imageUrl: "/food/grilled-chicken.png" },
  // Sides & Arancini
  { categoryName: "Sides & Arancini", name: "Rice Ball — Mozzarella", description: "Golden arancino filled with creamy melted mozzarella", price: "4.95", imageUrl: "/food/arancini.png", isPopular: true },
  { categoryName: "Sides & Arancini", name: "Rice Ball — Mozzarella & Ham", description: "Arancino filled with mozzarella and sliced ham", price: "5.95", imageUrl: "/food/arancini.png", isPopular: true },
  { categoryName: "Sides & Arancini", name: "Rice Ball — Bolognese", description: "Arancino filled with rich meat Bolognese and mozzarella", price: "5.95", imageUrl: "/food/arancini.png", isPopular: true },
  { categoryName: "Sides & Arancini", name: "Fries", description: "Golden crispy fries, seasoned with sea salt", price: "5.95", imageUrl: "/food/fries.png" },
  { categoryName: "Sides & Arancini", name: "Side Salad", description: "Fresh mixed greens with your choice of dressing", price: "6.95", imageUrl: "/food/italian-salad.png" },
  { categoryName: "Sides & Arancini", name: "Cheese Add-on", description: "Add melted cheese to any sandwich or burger", price: "2.25", imageUrl: "/food/cheese-addon.png" },
  { categoryName: "Sides & Arancini", name: "Onions", description: "Caramelized onions — add to any sandwich", price: "1.75", imageUrl: "/food/onions.png" },
  { categoryName: "Sides & Arancini", name: "Sweet Peppers", description: "Roasted sweet peppers — add to any sandwich", price: "1.75", imageUrl: "/food/sweet-peppers.png" },
  { categoryName: "Sides & Arancini", name: "Hot Peppers", description: "Pickled hot peppers — add to any sandwich or salad", price: "1.75", imageUrl: "/food/hot-peppers.png" },
  { categoryName: "Sides & Arancini", name: "Mushrooms", description: "Sautéed mushrooms — add to any sandwich or pasta", price: "1.75", imageUrl: "/food/mushrooms.png" },
  // Catering
  { categoryName: "Catering", name: "Sandwich Favourite Tray", description: "Assorted favourite sandwiches — customized to your order. Pricing based on selection.", price: "0.00", imageUrl: "/food/veal-sandwich.png" },
  { categoryName: "Catering", name: "Penne Tray — Tomato Sauce (Small/Large)", description: "Fresh penne in classic tomato sauce. Small serves ~8–10, Large serves ~18–20.", price: "75.00", imageUrl: "/food/penne-bolognese.png" },
  { categoryName: "Catering", name: "Penne Tray — Bolognese (Small/Large)", description: "Penne with slow-cooked meat Bolognese. Small $95 / Large $185.", price: "95.00", imageUrl: "/food/penne-bolognese.png" },
  { categoryName: "Catering", name: "Gnocchi Tray — Rosé Sauce (Small/Large)", description: "House gnocchi in creamy rosé. Small $85 / Large $160.", price: "85.00", imageUrl: "/food/gnocchi-rose.png" },
  { categoryName: "Catering", name: "Caesar Salad Tray (Small/Large)", description: "Classic Caesar salad tray. Small $65 / Large $90.", price: "65.00", imageUrl: "/food/caesar-salad.png" },
];

const TODAY = new Date().toISOString().split("T")[0];

export async function seedMenuData() {
  try {
    // Check if already seeded
    const [{ value: catCount }] = await db
      .select({ value: count() })
      .from(categoriesTable);

    if (Number(catCount) > 0) {
      logger.info("Menu data already seeded, skipping");
      return;
    }

    logger.info("Seeding menu data...");

    // Insert categories and build name → id map
    const categoryMap = new Map<string, number>();
    for (const cat of CATEGORIES) {
      const [inserted] = await db
        .insert(categoriesTable)
        .values(cat)
        .returning({ id: categoriesTable.id });
      categoryMap.set(cat.name, inserted.id);
    }
    logger.info({ count: categoryMap.size }, "Categories seeded");

    // Insert menu items
    for (const item of MENU_ITEMS) {
      const categoryId = categoryMap.get(item.categoryName);
      if (!categoryId) {
        logger.warn({ item: item.name }, "Category not found, skipping item");
        continue;
      }
      await db.insert(menuItemsTable).values({
        categoryId,
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
        available: true,
        isPopular: item.isPopular ?? false,
        isFeatured: item.isFeatured ?? false,
      });
    }
    logger.info({ count: MENU_ITEMS.length }, "Menu items seeded");

    // Insert today's special
    const [existing] = await db
      .select()
      .from(specialsTable)
      .where(eq(specialsTable.activeDate, TODAY));

    if (!existing) {
      await db.insert(specialsTable).values({
        title: "Rose Penne Pasta with Grilled Chicken",
        description: "A delicate penne pasta enrobed in our signature rose cream sauce, crowned with tender grilled chicken breast, served alongside house-baked garlic bread and a fresh garden salad",
        price: "18.95",
        imageUrl: "/food/special-penne-rose-chicken.png",
        activeDate: TODAY,
        isActive: true,
      });
      logger.info("Daily special seeded");
    }

    logger.info("Menu seed complete");
  } catch (err) {
    logger.error({ err }, "Failed to seed menu data");
  }
}

export async function repairBrokenSpecialImages() {
  try {
    const broken = await db
      .select({ id: specialsTable.id, title: specialsTable.title })
      .from(specialsTable)
      .where(like(specialsTable.imageUrl, "/food/generated/%"));

    if (broken.length === 0) return;

    for (const s of broken) {
      await db
        .update(specialsTable)
        .set({ imageUrl: "/food/special-penne-rose-chicken.png" })
        .where(eq(specialsTable.id, s.id));
      logger.info({ id: s.id, title: s.title }, "Repaired broken special image path");
    }
  } catch (err) {
    logger.error({ err }, "Failed to repair broken special images");
  }
}
