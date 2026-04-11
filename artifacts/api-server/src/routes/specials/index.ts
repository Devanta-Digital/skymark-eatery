import { Router } from "express";
import { db } from "@workspace/db";
import { specialsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import {
  CreateSpecialBody,
  UpdateSpecialParams,
  UpdateSpecialBody,
} from "@workspace/api-zod";

const router = Router();

function formatSpecial(s: typeof specialsTable.$inferSelect) {
  return {
    ...s,
    price: s.price != null ? parseFloat(s.price) : null,
    createdAt: s.createdAt.toISOString(),
  };
}

router.get("/today", async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const [special] = await db
    .select()
    .from(specialsTable)
    .where(eq(specialsTable.activeDate, today))
    .orderBy(desc(specialsTable.createdAt))
    .limit(1);

  if (!special) {
    const [active] = await db
      .select()
      .from(specialsTable)
      .where(eq(specialsTable.isActive, true))
      .orderBy(desc(specialsTable.createdAt))
      .limit(1);
    if (!active) { res.status(404).json({ error: "No special today" }); return; }
    res.json(formatSpecial(active));
    return;
  }
  res.json(formatSpecial(special));
});

router.get("/", async (req, res) => {
  const specials = await db.select().from(specialsTable).orderBy(desc(specialsTable.createdAt));
  res.json(specials.map(formatSpecial));
});

router.post("/", async (req, res) => {
  const parsed = CreateSpecialBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid body" }); return; }

  const values = {
    ...parsed.data,
    price: parsed.data.price != null ? String(parsed.data.price) : null,
    isActive: parsed.data.isActive ?? false,
  };

  const [special] = await db.insert(specialsTable).values(values).returning();
  res.status(201).json(formatSpecial(special));
});

router.patch("/:id", async (req, res) => {
  const params = UpdateSpecialParams.safeParse({ id: Number(req.params.id) });
  const body = UpdateSpecialBody.safeParse(req.body);
  if (!params.success || !body.success) { res.status(400).json({ error: "Invalid input" }); return; }

  const updateData: Record<string, unknown> = { ...body.data };
  if (body.data.price != null) updateData.price = String(body.data.price);

  const [special] = await db
    .update(specialsTable)
    .set(updateData)
    .where(eq(specialsTable.id, params.data.id))
    .returning();
  if (!special) { res.status(404).json({ error: "Not found" }); return; }
  res.json(formatSpecial(special));
});

export default router;
