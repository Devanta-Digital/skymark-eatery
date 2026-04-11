import { pgTable, serial, text, numeric, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  status: text("status").notNull().default("pending"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeStatus: text("stripe_status"),
  specialInstructions: text("special_instructions"),
  estimatedReadyAt: text("estimated_ready_at"),
  isTest: boolean("is_test").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const orderItemsTable = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  menuItemId: integer("menu_item_id").notNull(),
  menuItemName: text("menu_item_name").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  specialInstructions: text("special_instructions"),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertOrderItemSchema = createInsertSchema(orderItemsTable).omit({ id: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = typeof ordersTable.$inferSelect;
export type OrderItem = typeof orderItemsTable.$inferSelect;
