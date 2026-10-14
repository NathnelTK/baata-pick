import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createApp } from "../server/app";
import { ensureAdminSeed } from "../server/_core/auth";

const app = createApp();
let seedPromise: Promise<void> | null = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!seedPromise) seedPromise = ensureAdminSeed().catch(() => undefined);
  await seedPromise;
  return app(req as never, res as never);
}
