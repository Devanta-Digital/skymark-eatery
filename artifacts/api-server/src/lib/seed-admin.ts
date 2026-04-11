import bcrypt from "bcryptjs";
import { db, usersTable, eq } from "@workspace/db";
import { logger } from "./logger.js";

interface SeedUser {
  email: string;
  password: string;
  name: string;
  role: string;
}

const SEED_USERS: SeedUser[] = [
  {
    email: "jrattan@devantadigital.com",
    password: "Jenhson587499!",
    name: "Developer Admin",
    role: "developer",
  },
  {
    email: "skymarkeatery@gmail.com",
    password: "password2026",
    name: "Skymark Eatery Staff",
    role: "staff",
  },
];

export async function seedAdminUser() {
  for (const seedUser of SEED_USERS) {
    try {
      const existing = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, seedUser.email));

      if (existing.length > 0) {
        const current = existing[0];
        if (current.role !== seedUser.role) {
          await db
            .update(usersTable)
            .set({ role: seedUser.role })
            .where(eq(usersTable.email, seedUser.email));
          logger.info({ email: seedUser.email, role: seedUser.role }, "Updated user role");
        } else {
          logger.info({ email: seedUser.email }, "Seed user already exists, skipping");
        }
        continue;
      }

      const passwordHash = await bcrypt.hash(seedUser.password, 10);
      await db.insert(usersTable).values({
        email: seedUser.email,
        passwordHash,
        name: seedUser.name,
        role: seedUser.role,
        isActive: true,
      });
      logger.info({ email: seedUser.email, role: seedUser.role }, "Seed user created");
    } catch (err) {
      logger.error({ err, email: seedUser.email }, "Failed to seed user");
    }
  }
}
