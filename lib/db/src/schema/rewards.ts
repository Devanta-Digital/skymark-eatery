import { pgTable, serial, integer, numeric, timestamp, text, boolean } from "drizzle-orm/pg-core";

export const rewards = pgTable("rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  discountPercent: numeric("discount_percent", { precision: 5, scale: 2 }).notNull().default("15"),
  validUntil: timestamp("valid_until").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  reason: text("reason").default("new_customer"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  planType: text("plan_type").notNull(),
  status: text("status").notNull().default("active"),
  discountPercent: numeric("discount_percent", { precision: 5, scale: 2 }).notNull(),
  freeMealsTotal: integer("free_meals_total").notNull().default(0),
  freeMealsRemaining: integer("free_meals_remaining").notNull().default(0),
  cycleStartDate: timestamp("cycle_start_date").notNull(),
  nextBillingDate: timestamp("next_billing_date").notNull(),
  monthsActive: integer("months_active").notNull().default(0),
  corporateName: text("corporate_name"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
