import { afterEach, describe, expect, it, vi } from "vitest";
import { publicPlatformConfig, publicPlatformScript } from "./_core/publicConfig";
import { getSessionCookieOptions } from "./_core/cookies";
import { hashPassword, signSessionToken, verifyPassword } from "./_core/auth";
import { listLLMModels } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";
import { COOKIE_NAME } from "../shared/const";

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
describe("current platform integration", () => {
  it("exposes only named public runtime configuration", () => {
    const env = { MANUS_PROJECT_ID: "project-test", MANUS_API_KEY: "server-only-test", MANUS_JWT_SECRET: "signing-only-test", DATABASE_URL: "db-only-test", MANUS_API_BROWSER_KEY: "public-browser-test", MANUS_ANALYTICS_ENDPOINT: "https://analytics.example", MANUS_ANALYTICS_WEBSITE_ID: "site-test" };
    expect(publicPlatformConfig(env)).toMatchObject({ projectId: "project-test", apiBrowserKey: "public-browser-test" });
    const script = publicPlatformScript(env);
    for (const value of [env.MANUS_API_KEY, env.MANUS_JWT_SECRET, env.DATABASE_URL]) expect(script).not.toContain(value);
    const appended: unknown[] = [];
    const fakeDocument = { createElement: () => ({ setAttribute() {} }), head: { appendChild: (node: unknown) => appended.push(node) } };
    new Function("window", "document", script)({}, fakeDocument);
    expect(appended).toHaveLength(0);
    new Function("window", "document", publicPlatformScript({}))({}, fakeDocument);
    expect(appended).toHaveLength(0);
  });
  it("does not guess a production API when the project environment is absent", async () => {
    vi.stubEnv("MANUS_API_URL", ""); vi.stubEnv("MANUS_API_KEY", "test-only");
    const request = vi.fn(); vi.stubGlobal("fetch", request);
    await expect(listLLMModels()).rejects.toThrow("MANUS_API_URL");
    expect(request).not.toHaveBeenCalled();
  });
  it("persists URL-only image results through current managed storage", async () => {
    vi.stubEnv("MANUS_API_URL", "https://api.example"); vi.stubEnv("MANUS_API_KEY", "test-only");
    const request = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ image: { url: "https://image.example/result.png", mimeType: "image/png" } })))
      .mockResolvedValueOnce(new Response(new Uint8Array([1, 2, 3])))
      .mockResolvedValueOnce(new Response(JSON.stringify({ url: "https://upload.example/object" })))
      .mockResolvedValueOnce(new Response(""));
    vi.stubGlobal("fetch", request);
    const image = await generateImage({ prompt: "test", originalImages: [] });
    expect(image.url).toMatch(/^\/manus-storage\/generated\//);
    expect(request).toHaveBeenCalledTimes(4);
    expect(JSON.parse(request.mock.calls[0][1].body)).toHaveProperty("originalImages");
  });
  it("uses a distinct secure app cookie behind the HTTPS Preview proxy", () => {
    expect(COOKIE_NAME).not.toBe("app_session_id");
    expect(getSessionCookieOptions({ protocol: "http", headers: {} } as never)).toMatchObject({ secure: true, httpOnly: true, sameSite: "none" });
  });
  it("hashes passwords with a per-hash salt and rejects wrong passwords", async () => {
    const hash = await hashPassword("correct horse battery staple");
    expect(hash).toMatch(/^scrypt:[0-9a-f]+:[0-9a-f]+$/);
    expect(await verifyPassword("correct horse battery staple", hash)).toBe(true);
    expect(await verifyPassword("wrong password", hash)).toBe(false);
  });

  it("signs JWT sessions that verify and expire per the session window", async () => {
    vi.stubEnv("JWT_SECRET", "unit-test-signing-key-never-deployed");
    const now = new Date();
    const user = {
      id: 7,
      openId: "admin:test",
      name: "Mela Admin",
      email: "test@example.com",
      passwordHash: null,
      loginMethod: "password",
      role: "admin" as const,
      createdAt: now,
      updatedAt: now,
      lastSignedIn: now,
    };
    const token = await signSessionToken(user);
    const [, payload] = token.split(".");
    const claims = JSON.parse(Buffer.from(payload!, "base64url").toString("utf8")) as { sub: string; role: string; exp: number };
    expect(claims.sub).toBe("7");
    expect(claims.role).toBe("admin");
    expect(claims.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
    vi.unstubAllEnvs();
  });
});
