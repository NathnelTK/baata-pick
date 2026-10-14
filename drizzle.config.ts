import { defineConfig } from "drizzle-kit";

// Turso/libSQL or a local SQLite file. Generate works without a live database;
// `pnpm db:migrate` applies pending migrations to the configured database.
const url = (process.env.DATABASE_URL ?? "data/baata-pick.db").trim();
const authToken = (process.env.DATABASE_AUTH_TOKEN ?? process.env.TURSO_AUTH_TOKEN ?? "").trim() || undefined;

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url,
    authToken,
  },
});
