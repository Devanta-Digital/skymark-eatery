import { pgTable, serial, text, integer, numeric, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const menuItemsTable = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id"),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
  available: boolean("available").notNull().default(true),
  isPopular: boolean("is_popular").notNull().default(false),
  isFeatured: boolean("is_featured").notNull().default(false),
  allergens: text("allergens"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMenuItemSchema = createInsertSchema(menuItemsTable).omit({ id: true, createdAt: true });
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type MenuItem = typeof menuItemsTable.$inferSelect;
