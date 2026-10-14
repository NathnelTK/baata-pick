import { z } from "zod";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { signSessionToken, verifyPassword } from "./_core/auth";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { allowRegistration } from "./registrationRateLimit";

const phoneSchema = z.string().trim().min(7).max(24).regex(/^\+?[0-9][0-9 ()-]{5,22}$/, "Enter a valid phone number");
const requiredText = (max: number) => z.string().trim().min(1).max(max);
const regionSchema = requiredText(100);
const registrationMeta = { website: z.string().max(200).optional().default(""), startedAt: z.number().int().positive() };
const customerSchema = z.object({
  ...registrationMeta,
  fullName: requiredText(120), phone: phoneSchema,
  email: z.union([z.literal(""), z.string().trim().email().max(320)]).optional().default(""),
  region: regionSchema, zone: requiredText(100), woreda: requiredText(100), kebele: requiredText(100),
  preferredDeliveryService: requiredText(120), expectedFrequency: requiredText(80),
});
const driverSchema = z.object({
  ...registrationMeta,
  fullName: requiredText(120), phone: phoneSchema, region: regionSchema,
  operatingArea: requiredText(180), vehicleType: requiredText(80), vehicleOwnership: requiredText(80),
  experience: requiredText(2000), licenseDetails: requiredText(300), availability: requiredText(100),
  accuracyConfirmed: z.literal(true), privacyConsent: z.literal(true),
});
const businessSchema = z.object({
  ...registrationMeta,
  businessName: requiredText(160), contactName: requiredText(120), phone: phoneSchema, category: requiredText(100),
  region: regionSchema, location: requiredText(180), productsServices: requiredText(2000), deliveryNeeds: requiredText(2000),
});
const areaFiltersSchema = z.object({ region: z.string().trim().max(100).optional().default(""), search: z.string().trim().max(100).optional().default("") });
const driverStatusSchema = z.enum(["Pending", "Under Review", "Approved", "Rejected"]);

function normalizePhone(phone: string) { return phone.replace(/[ ()-]/g, ""); }
function shouldStore(request: Parameters<typeof allowRegistration>[0], kind: string, website: string, startedAt: number) {
  const elapsed = Date.now() - startedAt;
  if (website.trim() || elapsed < 900 || elapsed > 24 * 60 * 60 * 1000) return false;
  return allowRegistration(request, kind);
}
function accepted() {
  // Identical for new, duplicate, and silently rate-limited submissions.
  return { ok: true as const, message: "Thank you. If this is a new registration, it has been added to the launch list." };
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    login: publicProcedure.input(z.object({ email: z.string().trim().min(3).max(320), password: z.string().min(1).max(200) })).mutation(async ({ ctx, input }) => {
      if (!allowRegistration(ctx.req, "admin-login")) return { ok: false as const, message: "Too many attempts. Please try again later." };
      const email = input.email.trim().toLowerCase();
      const user = await db.getAdminByEmail(email);
      const passwordMatches = user?.passwordHash ? await verifyPassword(input.password, user.passwordHash) : false;
      if (!user || !passwordMatches) return { ok: false as const, message: "Invalid email or password." };
      const token = await signSessionToken(user);
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      await db.touchLastSignedIn(user.id);
      return { ok: true as const, message: "Signed in." };
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  customer: router({
    register: publicProcedure.input(customerSchema).mutation(async ({ ctx, input }) => {
      if (shouldStore(ctx.req, "customer", input.website, input.startedAt)) {
        await db.createCustomer({ fullName: input.fullName, phone: normalizePhone(input.phone), email: input.email || null, region: input.region, zone: input.zone, woreda: input.woreda, kebele: input.kebele, preferredDeliveryService: input.preferredDeliveryService, expectedFrequency: input.expectedFrequency });
      }
      return accepted();
    }),
  }),
  driver: router({
    register: publicProcedure.input(driverSchema).mutation(async ({ ctx, input }) => {
      if (shouldStore(ctx.req, "driver", input.website, input.startedAt)) {
        await db.createDriverApplication({ fullName: input.fullName, phone: normalizePhone(input.phone), region: input.region, operatingArea: input.operatingArea, vehicleType: input.vehicleType, vehicleOwnership: input.vehicleOwnership, experience: input.experience, licenseDetails: input.licenseDetails, availability: input.availability, accuracyConfirmed: input.accuracyConfirmed, privacyConsent: input.privacyConsent, status: "Pending" });
      }
      return accepted();
    }),
  }),
  business: router({
    register: publicProcedure.input(businessSchema).mutation(async ({ ctx, input }) => {
      if (shouldStore(ctx.req, "business", input.website, input.startedAt)) {
        await db.createBusinessApplication({ businessName: input.businessName, contactName: input.contactName, phone: normalizePhone(input.phone), category: input.category, region: input.region, location: input.location, productsServices: input.productsServices, deliveryNeeds: input.deliveryNeeds });
      }
      return accepted();
    }),
  }),
  admin: router({
    overview: adminProcedure.query(() => db.getAdminOverview()),
    customers: adminProcedure.input(areaFiltersSchema).query(({ input }) => db.listCustomers({ region: input.region || undefined, search: input.search || undefined })),
    drivers: adminProcedure.query(() => db.listDrivers()),
    businesses: adminProcedure.query(() => db.listBusinesses()),
    updateDriverStatus: adminProcedure.input(z.object({ id: z.number().int().positive(), status: driverStatusSchema })).mutation(async ({ input }) => {
      await db.updateDriverStatus(input.id, input.status);
      return { ok: true as const };
    }),
  }),
});

export type AppRouter = typeof appRouter;
