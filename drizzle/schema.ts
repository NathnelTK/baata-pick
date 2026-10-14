import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

/** Core user table. Admins sign in with email + password (JWT session cookie). */
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  openId: text("openId").notNull().unique(),
  name: text("name"),
  email: text("email"),
  passwordHash: text("passwordHash"),
  loginMethod: text("loginMethod"),
  role: text("role", { enum: ["user", "admin"] }).notNull().default("user"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()).$onUpdate(() => new Date()),
  lastSignedIn: integer("lastSignedIn", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const customers = sqliteTable("customers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fullName: text("fullName").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  region: text("region").notNull(),
  zone: text("zone").notNull(),
  woreda: text("woreda").notNull(),
  kebele: text("kebele").notNull(),
  preferredDeliveryService: text("preferredDeliveryService").notNull(),
  expectedFrequency: text("expectedFrequency").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, table => [
  uniqueIndex("customers_phone_unique").on(table.phone),
  index("customers_region_idx").on(table.region),
  index("customers_location_idx").on(table.zone, table.woreda, table.kebele),
]);

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;

export const driverApplications = sqliteTable("driverApplications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fullName: text("fullName").notNull(),
  phone: text("phone").notNull(),
  region: text("region").notNull(),
  operatingArea: text("operatingArea").notNull(),
  vehicleType: text("vehicleType").notNull(),
  vehicleOwnership: text("vehicleOwnership").notNull(),
  experience: text("experience").notNull(),
  licenseDetails: text("licenseDetails").notNull(),
  availability: text("availability").notNull(),
  accuracyConfirmed: integer("accuracyConfirmed", { mode: "boolean" }).notNull().default(false),
  privacyConsent: integer("privacyConsent", { mode: "boolean" }).notNull().default(false),
  status: text("status", { enum: ["Pending", "Under Review", "Approved", "Rejected"] }).notNull().default("Pending"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, table => [
  uniqueIndex("driver_applications_phone_unique").on(table.phone),
  index("driver_applications_status_idx").on(table.status),
  index("driver_applications_region_idx").on(table.region),
]);

export type DriverApplication = typeof driverApplications.$inferSelect;
export type InsertDriverApplication = typeof driverApplications.$inferInsert;

export const businessApplications = sqliteTable("businessApplications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  businessName: text("businessName").notNull(),
  contactName: text("contactName").notNull(),
  phone: text("phone").notNull(),
  category: text("category").notNull(),
  region: text("region").notNull(),
  location: text("location").notNull(),
  productsServices: text("productsServices").notNull(),
  deliveryNeeds: text("deliveryNeeds").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, table => [
  uniqueIndex("business_applications_phone_unique").on(table.phone),
  index("business_applications_region_idx").on(table.region),
]);

export type BusinessApplication = typeof businessApplications.$inferSelect;
export type InsertBusinessApplication = typeof businessApplications.$inferInsert;
