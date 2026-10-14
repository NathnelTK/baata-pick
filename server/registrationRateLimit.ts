import type { Request } from "express";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_SUBMISSIONS_PER_WINDOW = 8;
const buckets = new Map<string, { startedAt: number; count: number }>();
let lastSweep = Date.now();

/** Basic per-process spam friction; visitor IPs are kept only transiently in memory. */
export function allowRegistration(request: Request, formKind: string) {
  const now = Date.now();
  if (now - lastSweep > WINDOW_MS) {
    for (const [key, bucket] of buckets) {
      if (now - bucket.startedAt >= WINDOW_MS) buckets.delete(key);
    }
    lastSweep = now;
  }

  const address = request.ip || request.socket.remoteAddress || "unknown";
  const key = `${address}:${formKind}`;
  const existing = buckets.get(key);
  if (!existing || now - existing.startedAt >= WINDOW_MS) {
    buckets.set(key, { startedAt: now, count: 1 });
    return true;
  }
  existing.count += 1;
  return existing.count <= MAX_SUBMISSIONS_PER_WINDOW;
}
