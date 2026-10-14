import "dotenv/config";
import { createServer } from "http";
import { createApp } from "../app";
import { ensureAdminSeed } from "./auth";
import { serveStatic, setupVite } from "./vite";

async function startServer() {
  const app = createApp();
  const server = createServer(app);
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = Number(process.env.PORT || "3000");
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid PORT");
  server.on("error", error => { console.error("Server failed:", error.message); process.exit(1); });
  server.listen(port, "0.0.0.0", () => console.log(`Server listening on port ${port}`));
  try {
    await ensureAdminSeed();
  } catch (error) {
    console.error("[Auth] Admin seeding failed:", error instanceof Error ? error.message : error);
  }
}

startServer().catch(error => { console.error(error); process.exit(1); });
