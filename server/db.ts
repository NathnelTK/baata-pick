import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { and, count, desc, eq, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import {
  businessApplications,
  customers,
  driverApplications,
  type InsertBusinessApplication,
  type InsertCustomer,
  type InsertDriverApplication,
  users,
} from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

/** Resolve the SQLite file path from DATABASE_URL (plain path or sqlite:// URL). */
export function resolveDbPath() {
  let target = (process.env.DATABASE_URL ?? "").trim().replace(/^sqlite:\/\//, "");
  if (!target) target = path.join("data", "baata-pick.db");
  if (target !== ":memory:" && !path.isAbsolute(target)) target = path.join(process.cwd(), target);
  return target;
}

/** Open the SQLite database and apply pending drizzle migrations (idempotent). */
export async function getDb() {
  if (!_db) {
    try {
      const dbPath = resolveDbPath();
      if (dbPath !== ":memory:") mkdirSync(path.dirname(dbPath), { recursive: true });
      const sqlite = new Database(dbPath);
      sqlite.pragma("journal_mode = WAL");
      sqlite.pragma("foreign_keys = ON");
      const db = drizzle(sqlite);
      const migrationsFolder = path.join(process.cwd(), "drizzle");
      if (existsSync(migrationsFolder)) migrate(db, { migrationsFolder });
      _db = db;
      console.log(`[Database] SQLite ready at ${dbPath}`);
    } catch (error) {
      console.warn("[Database] Failed to open:", error instanceof Error ? error.message : "unknown error");
      _db = null;
    }
  }
  return _db;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

/** Admin lookup for JWT login; only admin-role users with a stored password hash qualify. */
export async function getAdminByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(and(eq(users.email, email), eq(users.role, "admin"))).limit(1);
  return result[0];
}

export async function createAdminUser(input: { openId: string; email: string; passwordHash: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(users).values({
    openId: input.openId,
    name: "Mela Admin",
    email: input.email,
    passwordHash: input.passwordHash,
    loginMethod: "password",
    role: "admin",
  });
}

export async function updateAdminUser(id: number, update: { role?: "admin"; passwordHash?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(users).set(update).where(eq(users.id, id));
}

export async function touchLastSignedIn(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, id));
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

export async function getAdminOverview() {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const [customerCount, driverCount, businessCount, pendingDrivers, demandByRegion, businessesByCategory, customersByService] = await Promise.all([
    db.select({ total: count() }).from(customers),
    db.select({ total: count() }).from(driverApplications),
    db.select({ total: count() }).from(businessApplications),
    db.select({ total: count() }).from(driverApplications).where(eq(driverApplications.status, "Pending")),
    db.select({ region: customers.region, total: count() }).from(customers).groupBy(customers.region).orderBy(desc(count())).limit(20),
    db.select({ category: businessApplications.category, total: count() }).from(businessApplications).groupBy(businessApplications.category).orderBy(desc(count())).limit(20),
    db.select({ service: customers.preferredDeliveryService, total: count() }).from(customers).groupBy(customers.preferredDeliveryService).orderBy(desc(count())).limit(20),
  ]);
  return {
    totals: {
      customers: Number(customerCount[0]?.total ?? 0),
      drivers: Number(driverCount[0]?.total ?? 0),
      businesses: Number(businessCount[0]?.total ?? 0),
      pendingDrivers: Number(pendingDrivers[0]?.total ?? 0),
    },
    demandByRegion: demandByRegion.map(row => ({ region: row.region, total: Number(row.total) })),
    businessesByCategory: businessesByCategory.map(row => ({ category: row.category, total: Number(row.total) })),
    customersByService: customersByService.map(row => ({ service: row.service, total: Number(row.total) })),
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
