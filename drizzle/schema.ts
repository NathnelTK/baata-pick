import { boolean, index, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/** Core user table backing Manus OAuth and application roles. */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const customers = mysqlTable("customers", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  email: varchar("email", { length: 320 }),
  region: varchar("region", { length: 100 }).notNull(),
  zone: varchar("zone", { length: 100 }).notNull(),
  woreda: varchar("woreda", { length: 100 }).notNull(),
  kebele: varchar("kebele", { length: 100 }).notNull(),
  preferredDeliveryService: varchar("preferredDeliveryService", { length: 120 }).notNull(),
  expectedFrequency: varchar("expectedFrequency", { length: 80 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({
  phoneUnique: uniqueIndex("customers_phone_unique").on(table.phone),
  regionIndex: index("customers_region_idx").on(table.region),
  locationIndex: index("customers_location_idx").on(table.zone, table.woreda, table.kebele),
}));

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;

export const driverApplications = mysqlTable("driverApplications", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  region: varchar("region", { length: 100 }).notNull(),
  operatingArea: varchar("operatingArea", { length: 180 }).notNull(),
  vehicleType: varchar("vehicleType", { length: 80 }).notNull(),
  vehicleOwnership: varchar("vehicleOwnership", { length: 80 }).notNull(),
  experience: text("experience").notNull(),
  licenseDetails: varchar("licenseDetails", { length: 300 }).notNull(),
  availability: varchar("availability", { length: 100 }).notNull(),
  accuracyConfirmed: boolean("accuracyConfirmed").notNull().default(false),
  privacyConsent: boolean("privacyConsent").notNull().default(false),
  status: mysqlEnum("status", ["Pending", "Under Review", "Approved", "Rejected"]).notNull().default("Pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({
  phoneUnique: uniqueIndex("driver_applications_phone_unique").on(table.phone),
  statusIndex: index("driver_applications_status_idx").on(table.status),
  regionIndex: index("driver_applications_region_idx").on(table.region),
}));

export type DriverApplication = typeof driverApplications.$inferSelect;
export type InsertDriverApplication = typeof driverApplications.$inferInsert;

export const businessApplications = mysqlTable("businessApplications", {
  id: int("id").autoincrement().primaryKey(),
  businessName: varchar("businessName", { length: 160 }).notNull(),
  contactName: varchar("contactName", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  region: varchar("region", { length: 100 }).notNull(),
  location: varchar("location", { length: 180 }).notNull(),
  productsServices: text("productsServices").notNull(),
  deliveryNeeds: text("deliveryNeeds").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({
  phoneUnique: uniqueIndex("business_applications_phone_unique").on(table.phone),
  regionIndex: index("business_applications_region_idx").on(table.region),
}));

export type BusinessApplication = typeof businessApplications.$inferSelect;
export type InsertBusinessApplication = typeof businessApplications.$inferInsert;

/** A fixed primary-key row makes the first owner claim atomic and single-use. */
export const adminBootstrapClaims = mysqlTable("adminBootstrapClaims", {
  id: int("id").primaryKey(),
  userId: int("userId").notNull(),
  claimedAt: timestamp("claimedAt").defaultNow().notNull(),
}, table => ({
  userUnique: uniqueIndex("admin_bootstrap_user_unique").on(table.userId),
}));
