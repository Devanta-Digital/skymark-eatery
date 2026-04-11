import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "@workspace/db";
import { ordersTable, orderItemsTable, menuItemsTable } from "@workspace/db";
import { eq, desc, and, inArray } from "drizzle-orm";
import {
  ListOrdersQueryParams,
  CreateOrderBody,
  GetOrderParams,
  UpdateOrderStatusParams,
  UpdateOrderStatusBody,
} from "@workspace/api-zod";

const JWT_SECRET = process.env["SESSION_SECRET"] || "skymark-secret-key-2024";

function getUser(req: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as { id: number; email: string; role: string; name: string };
  } catch {
    return null;
  }
}

const ADMIN_ROLES = ["admin", "developer"];
const STAFF_ROLES = ["admin", "developer", "staff"];

const router = Router();

// — SSE clients for real-time push —
const sseClients = new Set<Response>();

export function broadcastOrderEvent(event: string, data: object) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach((client) => {
    try { client.write(payload); } catch { sseClients.delete(client); }
  });
}

router.get("/events", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  res.write("event: connected\ndata: {}\n\n");
  sseClients.add(res);

  const keepAlive = setInterval(() => {
    try { res.write(": ping\n\n"); } catch { clearInterval(keepAlive); }
  }, 20000);

  req.on("close", () => {
    clearInterval(keepAlive);
    sseClients.delete(res);
  });
});

function isPeakHours(): boolean {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 11 && hour < 13;
}

function getTimingWindow(): number {
  return isPeakHours() ? 25 : 15;
}

function getEstimatedReadyAt(): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() + getTimingWindow());
  return now.toISOString();
}

async function getOrderWithItems(orderId: number) {
  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId));
  if (!order) return null;

  const items = await db
    .select()
    .from(orderItemsTable)
    .where(eq(orderItemsTable.orderId, orderId));

  return {
    ...order,
    total: parseFloat(order.total),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items: items.map((i) => ({
      ...i,
      unitPrice: parseFloat(i.unitPrice),
      subtotal: parseFloat(i.subtotal),
    })),
  };
}

router.get("/recent", async (req, res) => {
  const orders = await db
    .select()
    .from(ordersTable)
    .orderBy(desc(ordersTable.createdAt))
    .limit(20);

  const orderIds = orders.map((o) => o.id);
  const items = orderIds.length > 0
    ? await db.select().from(orderItemsTable).where(inArray(orderItemsTable.orderId, orderIds))
    : [];

  const itemsByOrder = new Map<number, typeof items>();
  for (const item of items) {
    if (!itemsByOrder.has(item.orderId)) itemsByOrder.set(item.orderId, []);
    itemsByOrder.get(item.orderId)!.push(item);
  }

  res.json(orders.map((o) => ({
    ...o,
    total: parseFloat(o.total),
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
    items: (itemsByOrder.get(o.id) || []).map((i) => ({
      ...i,
      unitPrice: parseFloat(i.unitPrice),
      subtotal: parseFloat(i.subtotal),
    })),
  })));
});

router.get("/", async (req, res) => {
  const query = ListOrdersQueryParams.safeParse(req.query);

  let rows = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));

  if (query.success && query.data.status) {
    rows = rows.filter((r) => r.status === query.data.status);
  }

  const limit = query.success && query.data.limit ? query.data.limit : 100;
  const offset = query.success && query.data.offset ? query.data.offset : 0;
  rows = rows.slice(offset, offset + limit);

  const orderIds = rows.map((o) => o.id);
  const items = orderIds.length > 0
    ? await db.select().from(orderItemsTable).where(inArray(orderItemsTable.orderId, orderIds))
    : [];

  const itemsByOrder = new Map<number, typeof items>();
  for (const item of items) {
    if (!itemsByOrder.has(item.orderId)) itemsByOrder.set(item.orderId, []);
    itemsByOrder.get(item.orderId)!.push(item);
  }

  res.json(rows.map((o) => ({
    ...o,
    total: parseFloat(o.total),
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
    items: (itemsByOrder.get(o.id) || []).map((i) => ({
      ...i,
      unitPrice: parseFloat(i.unitPrice),
      subtotal: parseFloat(i.subtotal),
    })),
  })));
});

router.post("/", async (req, res) => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }

  const menuItemIds = parsed.data.items.map((i) => i.menuItemId);
  const menuItems = await db.select().from(menuItemsTable).where(inArray(menuItemsTable.id, menuItemIds));
  const menuMap = new Map(menuItems.map((m) => [m.id, m]));

  let total = 0;
  const orderItemsData = parsed.data.items.map((item) => {
    const menuItem = menuMap.get(item.menuItemId);
    if (!menuItem) throw new Error(`Menu item ${item.menuItemId} not found`);
    const unitPrice = parseFloat(menuItem.price);
    const subtotal = unitPrice * item.quantity;
    total += subtotal;
    return {
      menuItemId: item.menuItemId,
      menuItemName: menuItem.name,
      quantity: item.quantity,
      unitPrice: String(unitPrice),
      subtotal: String(subtotal),
      specialInstructions: item.specialInstructions ?? null,
    };
  });

  const estimatedReadyAt = getEstimatedReadyAt();

  const [order] = await db.insert(ordersTable).values({
    customerName: parsed.data.customerName,
    customerEmail: parsed.data.customerEmail,
    customerPhone: parsed.data.customerPhone ?? null,
    specialInstructions: parsed.data.specialInstructions ?? null,
    total: String(total),
    status: "pending",
    estimatedReadyAt,
    isTest: false,
  }).returning();

  await db.insert(orderItemsTable).values(
    orderItemsData.map((i) => ({ ...i, orderId: order.id }))
  );

  const full = await getOrderWithItems(order.id);
  broadcastOrderEvent("new_order", full!);
  res.status(201).json(full);
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const order = await getOrderWithItems(id);
  if (!order) { res.status(404).json({ error: "Not found" }); return; }
  res.json(order);
});

router.get("/:id/items", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, id));
  res.json(items.map((i) => ({
    ...i,
    unitPrice: parseFloat(i.unitPrice),
    subtotal: parseFloat(i.subtotal),
  })));
});

router.patch("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const body = UpdateOrderStatusBody.safeParse(req.body);
  if (!body.success) { res.status(400).json({ error: "Invalid input" }); return; }

  const updateData: Record<string, unknown> = {
    status: body.data.status,
    updatedAt: new Date(),
  };
  if (body.data.estimatedReadyAt !== undefined) {
    updateData.estimatedReadyAt = body.data.estimatedReadyAt;
  }

  const [order] = await db
    .update(ordersTable)
    .set(updateData)
    .where(eq(ordersTable.id, id))
    .returning();
  if (!order) { res.status(404).json({ error: "Not found" }); return; }

  const full = await getOrderWithItems(order.id);
  broadcastOrderEvent("order_updated", full!);
  res.json(full);
});

router.patch("/:id/status", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const { status, estimatedReadyAt } = req.body;
  if (!status) { res.status(400).json({ error: "Status required" }); return; }

  const updateData: Record<string, unknown> = { status, updatedAt: new Date() };
  if (estimatedReadyAt) updateData.estimatedReadyAt = estimatedReadyAt;

  const [order] = await db
    .update(ordersTable)
    .set(updateData)
    .where(eq(ordersTable.id, id))
    .returning();
  if (!order) { res.status(404).json({ error: "Not found" }); return; }

  const full = await getOrderWithItems(order.id);
  broadcastOrderEvent("order_updated", full!);
  res.json(full);
});

// DELETE — test orders only (no auth needed for test orders)
// Paid/real orders require admin password
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
  if (!order) { res.status(404).json({ error: "Not found" }); return; }

  if (order.isTest) {
    // Test orders: any staff can delete
    const user = getUser(req);
    if (!user || !STAFF_ROLES.includes(user.role)) {
      return res.status(403).json({ error: "Staff access required" });
    }
    await db.delete(orderItemsTable).where(eq(orderItemsTable.orderId, id));
    await db.delete(ordersTable).where(eq(ordersTable.id, id));
    broadcastOrderEvent("order_deleted", { id });
    return res.json({ success: true, id });
  }

  // Real/paid orders: require admin + password confirmation
  const user = getUser(req);
  if (!user || !ADMIN_ROLES.includes(user.role)) {
    return res.status(403).json({ error: "Admin access required to cancel real orders" });
  }

  const { adminPassword, reason } = req.body;
  const ADMIN_CANCEL_PASSWORD = process.env["ADMIN_CANCEL_PASSWORD"] || process.env["SESSION_SECRET"] || "cancel-2024";
  if (!adminPassword || adminPassword !== ADMIN_CANCEL_PASSWORD) {
    return res.status(401).json({ error: "Invalid admin cancellation password" });
  }

  if (!reason) {
    return res.status(400).json({ error: "Cancellation reason required" });
  }

  // Mark as cancelled (don't hard-delete paid orders — preserve for records)
  const [updated] = await db
    .update(ordersTable)
    .set({ status: "cancelled", updatedAt: new Date() })
    .where(eq(ordersTable.id, id))
    .returning();

  const full = await getOrderWithItems(updated.id);
  broadcastOrderEvent("order_updated", full!);
  return res.json({ success: true, message: "Order cancelled. Issue refund in Stripe dashboard.", order: full });
});

router.post("/test", async (req, res) => {
  const user = getUser(req);
  if (!user || !ADMIN_ROLES.includes(user.role)) {
    return res.status(403).json({ error: "Admin access required to send test orders" });
  }

  const testMenuItems = await db.select().from(menuItemsTable).where(eq(menuItemsTable.available, true)).limit(30);
  if (testMenuItems.length === 0) {
    return res.status(400).json({ error: "No available menu items to build test order" });
  }

  const count = Math.floor(Math.random() * 3) + 1;
  const shuffled = [...testMenuItems].sort(() => Math.random() - 0.5).slice(0, count);

  const testNames = ["Marco Rossi", "Sofia Bianchi", "Luca Romano", "Giulia Ferrari", "Alessandro Costa", "Valentina Ricci"];
  const testName = testNames[Math.floor(Math.random() * testNames.length)];

  let total = 0;
  const orderItemsData = shuffled.map((item) => {
    const qty = Math.floor(Math.random() * 2) + 1;
    const unitPrice = parseFloat(item.price);
    const subtotal = unitPrice * qty;
    total += subtotal;
    return {
      menuItemId: item.id,
      menuItemName: item.name,
      quantity: qty,
      unitPrice: String(unitPrice),
      subtotal: String(subtotal),
      specialInstructions: null,
    };
  });

  const estimatedReadyAt = getEstimatedReadyAt();

  const [order] = await db.insert(ordersTable).values({
    customerName: `[TEST] ${testName}`,
    customerEmail: "test@skymarkeatery.dev",
    customerPhone: "(905) 000-0000",
    specialInstructions: "⚠️ TEST ORDER — Do not prepare",
    total: String(total),
    status: "pending",
    estimatedReadyAt,
    isTest: true,
  }).returning();

  await db.insert(orderItemsTable).values(
    orderItemsData.map((i) => ({ ...i, orderId: order.id }))
  );

  const full = await getOrderWithItems(order.id);
  broadcastOrderEvent("new_order", full!);
  return res.status(201).json(full);
});

export { getTimingWindow, isPeakHours, getEstimatedReadyAt };
export default router;
