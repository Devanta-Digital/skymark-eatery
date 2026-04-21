import { db } from "@workspace/db";
import { categoriesTable, menuItemsTable, specialsTable } from "@workspace/db";
import { eq, like } from "drizzle-orm";
import { logger } from "./logger.js";
import { DEFAULT_SPECIAL, MENU_CATEGORIES, MENU_ITEMS } from "./menu-catalog.js";

const TODAY = new Date().toISOString().split("T")[0];

type CategoryRow = {
  id: number;
  name: string;
  description: string | null;
  displayOrder: number;
};

type MenuItemRow = {
  id: number;
  categoryId: number | null;
  name: string;
  description: string | null;
  price: string | number;
  imageUrl: string | null;
  available: boolean;
  isPopular: boolean;
  isFeatured: boolean;
};

function categoryKey(categoryName: string, itemName: string) {
  return `${categoryName}::${itemName}`;
}

export async function seedMenuData() {
  try {
    logger.info("Synchronizing menu data from the reference-backed catalog...");

    const existingCategories = await db.select().from(categoriesTable) as CategoryRow[];
    const existingCategoryByName = new Map(existingCategories.map((category) => [category.name, category]));

    let insertedCategories = 0;
    let updatedCategories = 0;

    for (const category of MENU_CATEGORIES) {
      const existing = existingCategoryByName.get(category.name);

      if (!existing) {
        const [created] = await db
          .insert(categoriesTable)
          .values(category)
          .returning({ id: categoriesTable.id });
        insertedCategories += 1;
        continue;
      }

      if (
        existing.description !== category.description ||
        existing.displayOrder !== category.displayOrder
      ) {
        await db
          .update(categoriesTable)
          .set({
            description: category.description,
            displayOrder: category.displayOrder,
          })
          .where(eq(categoriesTable.id, existing.id));
        updatedCategories += 1;
      }
    }

    const refreshedCategories = await db.select().from(categoriesTable) as CategoryRow[];
    const refreshedCategoryById = new Map<number, CategoryRow>(
      refreshedCategories.map((category) => [category.id, category]),
    );
    const refreshedCategoryIdByName = new Map<string, number>(
      refreshedCategories.map((category) => [category.name, category.id]),
    );

    const existingItems = await db.select().from(menuItemsTable) as MenuItemRow[];
    const existingItemByKey = new Map(
      existingItems.map((item) => {
        const categoryName =
          item.categoryId != null
            ? refreshedCategoryById.get(item.categoryId)?.name ?? "Uncategorized"
            : "Uncategorized";
        return [categoryKey(categoryName, item.name), item] as const;
      }),
    );

    const targetKeys = new Set<string>();
    let insertedItems = 0;
    let updatedItems = 0;

    for (const item of MENU_ITEMS) {
      const categoryId = refreshedCategoryIdByName.get(item.categoryName);
      if (!categoryId) {
        logger.warn({ item: item.name, category: item.categoryName }, "Category not found for menu item");
        continue;
      }

      const key = categoryKey(item.categoryName, item.name);
      targetKeys.add(key);

      const existing = existingItemByKey.get(key);
      if (!existing) {
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
        insertedItems += 1;
        continue;
      }

      if (
        existing.categoryId !== categoryId ||
        existing.description !== item.description ||
        String(existing.price) !== item.price ||
        existing.imageUrl !== item.imageUrl ||
        existing.available !== true ||
        existing.isPopular !== (item.isPopular ?? false) ||
        existing.isFeatured !== (item.isFeatured ?? false)
      ) {
        await db
          .update(menuItemsTable)
          .set({
            categoryId,
            description: item.description,
            price: item.price,
            imageUrl: item.imageUrl,
            available: true,
            isPopular: item.isPopular ?? false,
            isFeatured: item.isFeatured ?? false,
          })
          .where(eq(menuItemsTable.id, existing.id));
        updatedItems += 1;
      }
    }

    let deletedItems = 0;
    for (const item of existingItems) {
      const categoryName =
        item.categoryId != null
          ? refreshedCategoryById.get(item.categoryId)?.name ?? "Uncategorized"
          : "Uncategorized";
      const key = categoryKey(categoryName, item.name);

      if (!targetKeys.has(key)) {
        await db.delete(menuItemsTable).where(eq(menuItemsTable.id, item.id));
        deletedItems += 1;
      }
    }

    const targetCategoryNames = new Set(MENU_CATEGORIES.map((category) => category.name));
    let deletedCategories = 0;
    for (const category of refreshedCategories) {
      if (!targetCategoryNames.has(category.name)) {
        await db.delete(categoriesTable).where(eq(categoriesTable.id, category.id));
        deletedCategories += 1;
      }
    }

    logger.info(
      {
        insertedCategories,
        updatedCategories,
        deletedCategories,
        insertedItems,
        updatedItems,
        deletedItems,
      },
      "Menu catalog synchronized",
    );

    const [existingSpecial] = await db
      .select()
      .from(specialsTable)
      .where(eq(specialsTable.activeDate, TODAY));

    if (!existingSpecial) {
      await db.insert(specialsTable).values({
        title: DEFAULT_SPECIAL.title,
        description: DEFAULT_SPECIAL.description,
        price: DEFAULT_SPECIAL.price,
        imageUrl: DEFAULT_SPECIAL.imageUrl,
        activeDate: TODAY,
        isActive: true,
      });
      logger.info("Default daily special seeded");
    }
  } catch (err) {
    logger.error({ err }, "Failed to synchronize menu data");
  }
}

export async function repairBrokenSpecialImages() {
  try {
    const broken = await db
      .select({ id: specialsTable.id, title: specialsTable.title })
      .from(specialsTable)
      .where(like(specialsTable.imageUrl, "/food/generated/%"));

    if (broken.length === 0) return;

    for (const special of broken) {
      await db
        .update(specialsTable)
        .set({ imageUrl: DEFAULT_SPECIAL.imageUrl })
        .where(eq(specialsTable.id, special.id));
      logger.info({ id: special.id, title: special.title }, "Repaired broken special image path");
    }
  } catch (err) {
    logger.error({ err }, "Failed to repair broken special images");
  }
}
