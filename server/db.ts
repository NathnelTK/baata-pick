import { and, count, desc, eq, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  adminBootstrapClaims,
  businessApplications,
  customers,
  driverApplications,
  type InsertBusinessApplication,
  type InsertCustomer,
  type InsertDriverApplication,
  type InsertUser,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

/** Lazily connect so local tooling can run without a provisioned database. */
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error instanceof Error ? error.message : "unknown error");
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  type TextField = (typeof textFields)[number];
  const assignNullable = (field: TextField) => {
    const value = user[field];
    if (value === undefined) return;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  };
  textFields.forEach(assignNullable);
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId && ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  values.lastSignedIn ??= new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

function isDuplicateRecord(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const candidate = error as { code?: unknown; errno?: unknown };
  return candidate.code === "ER_DUP_ENTRY" || candidate.errno === 1062;
}

export async function createCustomer(input: InsertCustomer): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const existing = await db.select({ id: customers.id }).from(customers).where(eq(customers.phone, input.phone)).limit(1);
  if (existing.length) return false;
  try { await db.insert(customers).values(input); return true; }
  catch (error) { if (isDuplicateRecord(error)) return false; throw error; }
}

export async function createDriverApplication(input: InsertDriverApplication): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const existing = await db.select({ id: driverApplications.id }).from(driverApplications).where(eq(driverApplications.phone, input.phone)).limit(1);
  if (existing.length) return false;
  try { await db.insert(driverApplications).values(input); return true; }
  catch (error) { if (isDuplicateRecord(error)) return false; throw error; }
}

export async function createBusinessApplication(input: InsertBusinessApplication): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const existing = await db.select({ id: businessApplications.id }).from(businessApplications).where(eq(businessApplications.phone, input.phone)).limit(1);
  if (existing.length) return false;
  try { await db.insert(businessApplications).values(input); return true; }
  catch (error) { if (isDuplicateRecord(error)) return false; throw error; }
}

/** Only the first user with the configured bootstrap token can claim owner-admin. */
export async function claimFirstAdmin(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  try {
    return await db.transaction(async tx => {
      const existing = await tx.select({ id: adminBootstrapClaims.id }).from(adminBootstrapClaims).limit(1);
      if (existing.length) return false;
      await tx.insert(adminBootstrapClaims).values({ id: 1, userId });
      await tx.update(users).set({ role: "admin" }).where(eq(users.id, userId));
      return true;
    });
  } catch (error) {
    if (isDuplicateRecord(error)) return false;
    throw error;
  }
}

export async function getAdminOverview() {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const [customerCount, driverCount, businessCount, pendingDrivers, demandByRegion] = await Promise.all([
    db.select({ total: count() }).from(customers),
    db.select({ total: count() }).from(driverApplications),
    db.select({ total: count() }).from(businessApplications),
    db.select({ total: count() }).from(driverApplications).where(eq(driverApplications.status, "Pending")),
    db.select({ region: customers.region, total: count() }).from(customers).groupBy(customers.region).orderBy(desc(count())).limit(20),
  ]);
  return {
    totals: {
      customers: Number(customerCount[0]?.total ?? 0),
      drivers: Number(driverCount[0]?.total ?? 0),
      businesses: Number(businessCount[0]?.total ?? 0),
      pendingDrivers: Number(pendingDrivers[0]?.total ?? 0),
    },
    demandByRegion: demandByRegion.map(row => ({ region: row.region, total: Number(row.total) })),
  };
}

export async function listCustomers(filters: { region?: string; search?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const criteria = [];
  if (filters.region) criteria.push(eq(customers.region, filters.region));
  if (filters.search) {
    const term = `%${filters.search.replace(/[\\%_]/g, "\\$&")}%`;
    criteria.push(or(like(customers.zone, term), like(customers.woreda, term), like(customers.kebele, term), like(customers.fullName, term))!);
  }
  return db.select().from(customers).where(criteria.length ? and(...criteria) : undefined).orderBy(desc(customers.createdAt)).limit(500);
}

export async function listDrivers() {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  return db.select().from(driverApplications).orderBy(desc(driverApplications.createdAt)).limit(500);
}

export async function listBusinesses() {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  return db.select().from(businessApplications).orderBy(desc(businessApplications.createdAt)).limit(500);
}

export async function updateDriverStatus(id: number, status: "Pending" | "Under Review" | "Approved" | "Rejected") {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(driverApplications).set({ status }).where(eq(driverApplications.id, id));
}
