import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, usersTable, eq } from "@workspace/db";
import { rewards } from "@workspace/db";

const router = Router();
const JWT_SECRET = process.env["SESSION_SECRET"] || "skymark-secret-key-2024";
const SALT_ROUNDS = 10;

function signToken(payload: { id: number; email: string; role: string; name: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Email, password, and name are required" });
  }
  try {
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase()));
    if (existing.length > 0) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const [user] = await db.insert(usersTable).values({
      email: email.toLowerCase(),
      passwordHash,
      name,
      role: "customer",
    }).returning();

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);
    await db.insert(rewards).values({
      userId: user.id,
      discountPercent: "15",
      validUntil,
      isActive: true,
      reason: "new_customer",
    });

    const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
    return res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to create account" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase()));
    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
    return res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to login" });
  }
});

router.get("/me", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string; role: string; name: string };
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, decoded.id));
    if (!user || !user.isActive) return res.status(401).json({ error: "User not found" });
    return res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
});

router.post("/logout", (_req, res) => {
  return res.json({ success: true });
});

export default router;
