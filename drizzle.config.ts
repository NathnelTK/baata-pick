import { defineConfig } from "drizzle-kit";

// SQLite database file. Accepts a plain path or a sqlite:// URL.
const url = (process.env.DATABASE_URL ?? "data/baata-pick.db").replace(/^sqlite:\/\//, "");

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url,
  },
});
