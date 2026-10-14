import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { parse as parseCookieHeader } from "cookie";
import type { Request } from "express";
import { SignJWT, jwtVerify } from "jose";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { ENV } from "./env";

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: string,
  keylen: number
) => Promise<Buffer>;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = await scrypt(password, salt, 64);
  return `scrypt:${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, salt, hash] = stored.split(":");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const derived = await scrypt(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}

let ephemeralSecret: Uint8Array | null = null;

function sessionSecret(): Uint8Array {
  if (ENV.jwtSecret) return new TextEncoder().encode(ENV.jwtSecret);
  // Dev fallback: a random secret keeps login working without config, but
  // sessions do not survive a restart. Set JWT_SECRET in production.
  if (!ephemeralSecret) {
    ephemeralSecret = new TextEncoder().encode(randomBytes(32).toString("hex"));
    console.warn("[Auth] JWT_SECRET is not set — using an ephemeral secret; admin sessions will not survive restarts.");
  }
  return ephemeralSecret;
}

export async function signSessionToken(user: User): Promise<string> {
  return new SignJWT({ role: user.role })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime(Math.floor((Date.now() + ONE_YEAR_MS) / 1000))
    .sign(sessionSecret());
}

async function readSessionToken(req: Request): Promise<string | null> {
  const cookies = parseCookieHeader(req.headers.cookie ?? "");
  const token = cookies[COOKIE_NAME];
  if (token) return token;
  const header = req.headers.authorization;
  if (typeof header === "string" && header.startsWith("Bearer ")) return header.slice(7);
  return null;
}

/** Resolve the signed-in user from the JWT session cookie (or Bearer token). */
export async function getSessionUser(req: Request): Promise<User | null> {
  const token = await readSessionToken(req);
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, sessionSecret(), { algorithms: ["HS256"] });
    const userId = Number(payload.sub);
    if (!Number.isInteger(userId) || userId < 1) return null;
    return (await db.getUserById(userId)) ?? null;
  } catch {
    return null;
  }
}

/** Create or refresh the admin account from ADMIN_EMAIL / ADMIN_PASSWORD at startup. */
export async function ensureAdminSeed(): Promise<void> {
  const email = ENV.adminEmail.trim().toLowerCase();
  const password = ENV.adminPassword;
  if (!email || !password) {
    console.warn("[Auth] ADMIN_EMAIL and ADMIN_PASSWORD are not set — JWT admin login stays disabled until configured.");
    return;
  }
  if (password.length < 8) {
    console.error("[Auth] ADMIN_PASSWORD must be at least 8 characters; admin seeding skipped.");
    return;
  }
  const openId = `admin:${email}`;
  const existing = await db.getUserByOpenId(openId);
  if (existing) {
    if (existing.role !== "admin") await db.updateAdminUser(existing.id, { role: "admin" });
    const passwordMatches = existing.passwordHash ? await verifyPassword(password, existing.passwordHash) : false;
    if (!passwordMatches) {
      await db.updateAdminUser(existing.id, { passwordHash: await hashPassword(password) });
      console.log("[Auth] Admin password refreshed from ADMIN_PASSWORD.");
    }
    console.log(`[Auth] Admin account ready: ${email}`);
    return;
  }
  await db.createAdminUser({ openId, email, passwordHash: await hashPassword(password) });
  console.log(`[Auth] Seeded admin account: ${email}`);
}
