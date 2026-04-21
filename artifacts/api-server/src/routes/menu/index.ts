import { Router } from "express";
import { db } from "@workspace/db";
import { categoriesTable, menuItemsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import {
  CreateCategoryBody,
  UpdateCategoryParams,
  UpdateCategoryBody,
  DeleteCategoryParams,
  ListMenuItemsQueryParams,
  CreateMenuItemBody,
  GetMenuItemParams,
  UpdateMenuItemParams,
  UpdateMenuItemBody,
  DeleteMenuItemParams,
} from "@workspace/api-zod";

const router = Router();

// ── CATEGORIES ──────────────────────────────────────────────────────────────

router.get("/categories", async (req, res) => {
  const categories = await db
    .select()
    .from(categoriesTable)
    .orderBy(asc(categoriesTable.displayOrder));
  res.json(categories.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
  })));
});

router.post("/categories", async (req, res) => {
  const parsed = CreateCategoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const [cat] = await db
    .insert(categoriesTable)
    .values(parsed.data)
    .returning();
  res.status(201).json({ ...cat, createdAt: cat.createdAt.toISOString() });
});

router.patch("/categories/:id", async (req, res) => {
  const params = UpdateCategoryParams.safeParse({ id: Number(req.params.id) });
  const body = UpdateCategoryBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const updateData = Object.fromEntries(
    Object.entries(body.data).filter(([, value]) => value != null)
  );
  const [cat] = await db
    .update(categoriesTable)
    .set(updateData)
    .where(eq(categoriesTable.id, params.data.id))
    .returning();
  if (!cat) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...cat, createdAt: cat.createdAt.toISOString() });
});

router.delete("/categories/:id", async (req, res) => {
  const params = DeleteCategoryParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(categoriesTable).where(eq(categoriesTable.id, params.data.id));
  res.status(204).end();
});

// ── MENU ITEMS ───────────────────────────────────────────────────────────────

router.get("/items", async (req, res) => {
  const query = ListMenuItemsQueryParams.safeParse({
    categoryId: req.query.categoryId ? Number(req.query.categoryId) : undefined,
    available: req.query.available !== undefined ? req.query.available === "true" : undefined,
  });

  const categories = await db.select().from(categoriesTable);
  const catMap = new Map(categories.map((c) => [c.id, c.name]));

  let rows = await db.select().from(menuItemsTable).orderBy(asc(menuItemsTable.id));

  if (query.success) {
    if (query.data.categoryId != null) {
      rows = rows.filter((r) => r.categoryId === query.data.categoryId);
    }
    if (query.data.available != null) {
      rows = rows.filter((r) => r.available === query.data.available);
    }
  }

  res.json(rows.map((r) => ({
    ...r,
    price: parseFloat(r.price),
    categoryName: r.categoryId ? catMap.get(r.categoryId) ?? null : null,
    createdAt: r.createdAt.toISOString(),
  })));
});

router.post("/items", async (req, res) => {
  const parsed = CreateMenuItemBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }
  const [item] = await db
    .insert(menuItemsTable)
    .values({ ...parsed.data, price: String(parsed.data.price) })
    .returning();
  res.status(201).json({ ...item, price: parseFloat(item.price), createdAt: item.createdAt.toISOString() });
});

router.get("/items/:id", async (req, res) => {
  const params = GetMenuItemParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const [item] = await db.select().from(menuItemsTable).where(eq(menuItemsTable.id, params.data.id));
  if (!item) { res.status(404).json({ error: "Not found" }); return; }

  const categories = await db.select().from(categoriesTable);
  const catMap = new Map(categories.map((c) => [c.id, c.name]));

  res.json({ ...item, price: parseFloat(item.price), categoryName: item.categoryId ? catMap.get(item.categoryId) ?? null : null, createdAt: item.createdAt.toISOString() });
});

router.patch("/items/:id", async (req, res) => {
  const params = UpdateMenuItemParams.safeParse({ id: Number(req.params.id) });
  const body = UpdateMenuItemBody.safeParse(req.body);
  if (!params.success || !body.success) { res.status(400).json({ error: "Invalid input" }); return; }

  const updateData: Record<string, unknown> = { ...body.data };
  if (body.data.price != null) updateData.price = String(body.data.price);

  const [item] = await db
    .update(menuItemsTable)
    .set(updateData)
    .where(eq(menuItemsTable.id, params.data.id))
    .returning();
  if (!item) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...item, price: parseFloat(item.price), createdAt: item.createdAt.toISOString() });
});

router.delete("/items/:id", async (req, res) => {
  const params = DeleteMenuItemParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(menuItemsTable).where(eq(menuItemsTable.id, params.data.id));
  res.status(204).end();
});

export default router;
