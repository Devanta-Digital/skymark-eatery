import { Router } from "express";
import jwt from "jsonwebtoken";
import { db } from "@workspace/db";
import { rewards, subscriptions } from "@workspace/db";
import { eq, and, gt } from "drizzle-orm";

const router = Router();
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

router.get("/me", async (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ error: "Not authenticated" });

  const now = new Date();
  const activeReward = await db
    .select()
    .from(rewards)
    .where(and(
      eq(rewards.userId, user.id),
      eq(rewards.isActive, true),
      gt(rewards.validUntil, now)
    ))
    .limit(1);

  if (activeReward.length === 0) {
    return res.json({ hasReward: false, discountPercent: 0 });
  }

  const r = activeReward[0];
  return res.json({
    hasReward: true,
    discountPercent: parseFloat(r.discountPercent),
    validUntil: r.validUntil.toISOString(),
    reason: r.reason,
  });
});

router.post("/claim", async (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ error: "Not authenticated" });

  const now = new Date();
  const existing = await db
    .select()
    .from(rewards)
    .where(eq(rewards.userId, user.id))
    .limit(1);

  if (existing.length > 0) {
    const r = existing[0];
    const isActive = r.isActive && r.validUntil > now;
    return res.json({
      hasReward: isActive,
      discountPercent: isActive ? parseFloat(r.discountPercent) : 0,
      validUntil: r.validUntil.toISOString(),
      alreadyClaimed: true,
    });
  }

  const validUntil = new Date(now);
  validUntil.setDate(validUntil.getDate() + 30);

  const [reward] = await db.insert(rewards).values({
    userId: user.id,
    discountPercent: "15",
    validUntil,
    isActive: true,
    reason: "new_customer",
  }).returning();

  return res.status(201).json({
    hasReward: true,
    discountPercent: 15,
    validUntil: reward.validUntil.toISOString(),
    alreadyClaimed: false,
  });
});

router.get("/subscriptions", async (req, res) => {
  const user = getUser(req);
  if (!user || (user.role !== "admin" && user.role !== "developer")) {
    return res.status(403).json({ error: "Admin access required" });
  }

  const subs = await db.select().from(subscriptions);
  return res.json(subs.map(s => ({
    ...s,
    discountPercent: parseFloat(s.discountPercent),
    cycleStartDate: s.cycleStartDate.toISOString(),
    nextBillingDate: s.nextBillingDate.toISOString(),
    createdAt: s.createdAt?.toISOString(),
    updatedAt: s.updatedAt?.toISOString(),
  })));
});

router.post("/subscriptions", async (req, res) => {
  const user = getUser(req);
  if (!user || (user.role !== "admin" && user.role !== "developer")) {
    return res.status(403).json({ error: "Admin access required" });
  }

  const { userId, planType, notes, corporateName } = req.body;
  if (!userId || !planType) return res.status(400).json({ error: "userId and planType required" });

  const planConfig: Record<string, { discount: string; freeMeals: number }> = {
    weekly: { discount: "20", freeMeals: 2 },
    biweekly: { discount: "20", freeMeals: 4 },
    monthly: { discount: "20", freeMeals: 6 },
  };

  const config = planConfig[planType];
  if (!config) return res.status(400).json({ error: "Invalid plan type" });

  const now = new Date();
  const nextBillingDate = new Date(now);
  if (planType === "weekly") nextBillingDate.setDate(nextBillingDate.getDate() + 7);
  else if (planType === "biweekly") nextBillingDate.setDate(nextBillingDate.getDate() + 14);
  else nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

  const [sub] = await db.insert(subscriptions).values({
    userId,
    planType,
    status: "active",
    discountPercent: config.discount,
    freeMealsTotal: config.freeMeals,
    freeMealsRemaining: config.freeMeals,
    cycleStartDate: now,
    nextBillingDate,
    corporateName: corporateName ?? null,
    notes: notes ?? null,
  }).returning();

  return res.status(201).json({
    ...sub,
    discountPercent: parseFloat(sub.discountPercent),
    cycleStartDate: sub.cycleStartDate.toISOString(),
    nextBillingDate: sub.nextBillingDate.toISOString(),
    createdAt: sub.createdAt?.toISOString(),
    updatedAt: sub.updatedAt?.toISOString(),
  });
});

export default router;
