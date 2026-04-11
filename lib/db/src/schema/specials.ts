import { pgTable, serial, text, numeric, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const specialsTable = pgTable("specials", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }),
  imageUrl: text("image_url"),
  activeDate: text("active_date").notNull(),
  isActive: boolean("is_active").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSpecialSchema = createInsertSchema(specialsTable).omit({ id: true, createdAt: true });
export type InsertSpecial = z.infer<typeof insertSpecialSchema>;
export type Special = typeof specialsTable.$inferSelect;
