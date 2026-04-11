import { Router } from "express";
import { db } from "@workspace/db";
import { ordersTable, orderItemsTable, menuItemsTable, expensesTable } from "@workspace/db";
import { eq, gte, lte, and, sql, desc } from "drizzle-orm";
import {
  GetRevenueReportQueryParams,
  CreateExpenseBody,
  UpdateExpenseParams,
  UpdateExpenseBody,
  DeleteExpenseParams,
} from "@workspace/api-zod";
import { getTimingWindow, isPeakHours, getEstimatedReadyAt } from "../orders/index.js";

const router = Router();

router.get("/dashboard", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);

  const allOrders = await db.select().from(ordersTable);
  const todayOrders = allOrders.filter((o) => o.createdAt.toISOString().startsWith(today));
  const weekOrders = allOrders.filter((o) => o.createdAt >= weekAgo);
  const monthOrders = allOrders.filter((o) => o.createdAt >= monthAgo);

  const todayRevenue = todayOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + parseFloat(o.total), 0);

  const weekRevenue = weekOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + parseFloat(o.total), 0);

  const monthRevenue = monthOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + parseFloat(o.total), 0);

  const pendingOrders = allOrders.filter((o) => o.status === "pending").length;
  const preparingOrders = allOrders.filter((o) => o.status === "preparing").length;
  const completedOrders = allOrders.filter((o) => o.status === "completed").length;

  const orderItems = await db.select().from(orderItemsTable);
  const menuItems = await db.select().from(menuItemsTable);
  const menuMap = new Map(menuItems.map((m) => [m.id, m.name]));

  const itemStats = new Map<number, { name: string; count: number; revenue: number }>();
  for (const item of orderItems) {
    const existing = itemStats.get(item.menuItemId) || { name: menuMap.get(item.menuItemId) ?? "Unknown", count: 0, revenue: 0 };
    existing.count += item.quantity;
    existing.revenue += parseFloat(item.subtotal);
    itemStats.set(item.menuItemId, existing);
  }

  const topItems = Array.from(itemStats.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([id, stats]) => ({
      menuItemId: id,
      name: stats.name,
      totalOrdered: stats.count,
      revenue: stats.revenue,
    }));

  res.json({
    todayOrders: todayOrders.length,
    todayRevenue,
    pendingOrders,
    preparingOrders,
    completedOrders,
    weekRevenue,
    monthRevenue,
    topItems,
    currentTimingWindow: getTimingWindow(),
    isPeakHours: isPeakHours(),
  });
});

router.get("/revenue", async (req, res) => {
  const query = GetRevenueReportQueryParams.safeParse(req.query);
  const from = query.success && query.data.from ? query.data.from : (() => {
    const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString().split("T")[0];
  })();
  const to = query.success && query.data.to ? query.data.to : new Date().toISOString().split("T")[0];

  const orders = await db.select().from(ordersTable);
  const filtered = orders.filter((o) => {
    const date = o.createdAt.toISOString().split("T")[0];
    return date >= from && date <= to && o.status !== "cancelled";
  });

  const byDay = new Map<string, { revenue: number; orders: number }>();
  for (const order of filtered) {
    const date = order.createdAt.toISOString().split("T")[0];
    const existing = byDay.get(date) || { revenue: 0, orders: 0 };
    existing.revenue += parseFloat(order.total);
    existing.orders += 1;
    byDay.set(date, existing);
  }

  const totalRevenue = filtered.reduce((sum, o) => sum + parseFloat(o.total), 0);
  const totalOrders = filtered.length;

  res.json({
    from,
    to,
    totalRevenue,
    totalOrders,
    averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    byDay: Array.from(byDay.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, stats]) => ({ date, ...stats })),
  });
});

router.get("/expenses", async (req, res) => {
  const expenses = await db.select().from(expensesTable).orderBy(desc(expensesTable.createdAt));
  res.json(expenses.map((e) => ({
    ...e,
    amount: parseFloat(e.amount),
    createdAt: e.createdAt.toISOString(),
  })));
});

router.post("/expenses", async (req, res) => {
  const parsed = CreateExpenseBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const [expense] = await db.insert(expensesTable).values({ ...parsed.data, amount: String(parsed.data.amount) }).returning();
  res.status(201).json({ ...expense, amount: parseFloat(expense.amount), createdAt: expense.createdAt.toISOString() });
});

router.patch("/expenses/:id", async (req, res) => {
  const params = UpdateExpenseParams.safeParse({ id: Number(req.params.id) });
  const body = UpdateExpenseBody.safeParse(req.body);
  if (!params.success || !body.success) { res.status(400).json({ error: "Invalid input" }); return; }

  const updateData: Record<string, unknown> = { ...body.data };
  if (body.data.amount != null) updateData.amount = String(body.data.amount);

  const [expense] = await db.update(expensesTable).set(updateData).where(eq(expensesTable.id, params.data.id)).returning();
  if (!expense) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...expense, amount: parseFloat(expense.amount), createdAt: expense.createdAt.toISOString() });
});

router.delete("/expenses/:id", async (req, res) => {
  const params = DeleteExpenseParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(expensesTable).where(eq(expensesTable.id, params.data.id));
  res.status(204).end();
});

router.get("/order-timing", async (req, res) => {
  res.json({
    windowMinutes: getTimingWindow(),
    isPeakHours: isPeakHours(),
    peakStart: "11:00",
    peakEnd: "13:00",
    estimatedReadyAt: getEstimatedReadyAt(),
  });
});

export default router;
