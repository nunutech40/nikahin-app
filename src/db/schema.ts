import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================
// ENUMS
// ============================================

export const userRoleEnum = pgEnum("user_role", ["admin", "customer", "agency"]);
export const attendanceEnum = pgEnum("attendance", ["hadir", "tidak", "ragu"]);

// ============================================
// USERS TABLE
// ============================================

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  name: varchar("name", { length: 255 }), // Added for personalization
  phone: varchar("phone", { length: 20 }), // Essential for WA communication
  weddingDate: timestamp("wedding_date"), // Critical for analysis/segmentation
  role: userRoleEnum("role").default("customer").notNull(),
  isActive: boolean("is_active").default(false).notNull(),
  referralCode: varchar("referral_code", { length: 50 }),
  referredBy: integer("referred_by").references((): any => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

// ============================================
// FEATURES TABLE (Dynamic Feature Gating)
// ============================================

export const features = pgTable("features", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  isCore: boolean("is_core").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// PACKAGES TABLE
// ============================================

export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: integer("price").notNull(), // in cents/rupiah
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================
// PACKAGE_FEATURES TABLE (Pivot)
// ============================================

export const packageFeatures = pgTable("package_features", {
  id: serial("id").primaryKey(),
  packageId: integer("package_id")
    .references(() => packages.id, { onDelete: "cascade" })
    .notNull(),
  featureId: integer("feature_id")
    .references(() => features.id, { onDelete: "cascade" })
    .notNull(),
});

// ============================================
// THEMES TABLE
// ============================================

export const themes = pgTable("themes", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  previewImage: text("preview_image"),
  isFree: boolean("is_free").default(true).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================
// INVITATIONS TABLE (Core)
// ============================================

export const invitations = pgTable("invitations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  themeId: integer("theme_id")
    .references(() => themes.id)
    .notNull(),
  packageId: integer("package_id")
    .references(() => packages.id)
    .notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: jsonb("content").notNull(), // InvitationData as JSON
  isPublished: boolean("is_published").default(false).notNull(),
  expiredAt: timestamp("expired_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================
// GUESTS TABLE (RSVP & Guestbook)
// ============================================

export const guests = pgTable("guests", {
  id: serial("id").primaryKey(),
  invitationId: integer("invitation_id")
    .references(() => invitations.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  attendance: attendanceEnum("attendance"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================
// TRANSACTIONS TABLE (Payment tracking)
// ============================================

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  packageId: integer("package_id")
    .references(() => packages.id)
    .notNull(),
  amount: integer("amount").notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  paymentMethod: varchar("payment_method", { length: 100 }),
  paymentProof: text("payment_proof"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================
// RELATIONS
// ============================================

export const usersRelations = relations(users, ({ many }) => ({
  invitations: many(invitations),
  transactions: many(transactions),
}));

export const invitationsRelations = relations(invitations, ({ one, many }) => ({
  user: one(users, {
    fields: [invitations.userId],
    references: [users.id],
  }),
  theme: one(themes, {
    fields: [invitations.themeId],
    references: [themes.id],
  }),
  package: one(packages, {
    fields: [invitations.packageId],
    references: [packages.id],
  }),
  guests: many(guests),
}));

export const themesRelations = relations(themes, ({ many }) => ({
  invitations: many(invitations),
}));

export const packagesRelations = relations(packages, ({ many }) => ({
  invitations: many(invitations),
  features: many(packageFeatures),
}));

export const featuresRelations = relations(features, ({ many }) => ({
  packages: many(packageFeatures),
}));

export const packageFeaturesRelations = relations(packageFeatures, ({ one }) => ({
  package: one(packages, {
    fields: [packageFeatures.packageId],
    references: [packages.id],
  }),
  feature: one(features, {
    fields: [packageFeatures.featureId],
    references: [features.id],
  }),
}));

export const guestsRelations = relations(guests, ({ one }) => ({
  invitation: one(invitations, {
    fields: [guests.invitationId],
    references: [invitations.id],
  }),
}));

// ============================================
// VISITOR_LOGS TABLE (Analytics)
// ============================================

export const visitorLogs = pgTable("visitor_logs", {
  id: serial("id").primaryKey(),
  invitationId: integer("invitation_id")
    .references(() => invitations.id, { onDelete: "cascade" })
    .notNull(),
  device: varchar("device", { length: 50 }),
  browser: varchar("browser", { length: 50 }),
  os: varchar("os", { length: 50 }),
  ipHash: varchar("ip_hash", { length: 64 }), // For unique visitor tracking (Privacy focused)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const visitorLogsRelations = relations(visitorLogs, ({ one }) => ({
  invitation: one(invitations, {
    fields: [visitorLogs.invitationId],
    references: [invitations.id],
  }),
}));
