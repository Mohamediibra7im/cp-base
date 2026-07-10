import { pgTable, serial, text, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  icon: text("icon").notNull().default("Code"),
  color: text("color").notNull().default("#3b82f6"),
  order: integer("order").notNull().default(0),
  hidden: boolean("hidden").notNull().default(false),
});

export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  categoryId: integer("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
  tags: text("tags").array().notNull().default([]),
  complexity: text("complexity").notNull().default(""),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  hidden: boolean("hidden").notNull().default(false),
  copyCount: integer("copy_count").notNull().default(0),
  likeCount: integer("like_count").notNull().default(0),
  contributorName: text("contributor_name"),
  contributorCfHandle: text("contributor_cf_handle"),
});

export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const templateCodes = pgTable("template_codes", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").notNull().references(() => templates.id, { onDelete: "cascade" }),
  language: text("language").notNull(),
  code: text("code").notNull().default(""),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  templates: many(templates),
}));

export const templatesRelations = relations(templates, ({ one, many }) => ({
  category: one(categories, { fields: [templates.categoryId], references: [categories.id] }),
  codes: many(templateCodes),
}));

export const templateCodesRelations = relations(templateCodes, ({ one }) => ({
  template: one(templates, { fields: [templateCodes.templateId], references: [templates.id] }),
}));

export const contributions = pgTable("contributions", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  status: text("status").notNull().default("pending"),

  contributorName: text("contributor_name").notNull(),
  contributorEmail: text("contributor_email").notNull(),
  contributorCfHandle: text("contributor_cf_handle"),

  title: text("title"),
  slug: text("slug"),
  description: text("description"),
  categoryId: integer("category_id").references(() => categories.id),
  tags: text("tags").array().default([]),
  complexity: text("complexity"),
  notes: text("notes"),
  codes: jsonb("codes"),

  templateId: integer("template_id").references(() => templates.id),
  editReason: text("edit_reason"),
  editCodes: jsonb("edit_codes"),
  editNotes: text("edit_notes"),

  adminNote: text("admin_note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
});

export const contributionsRelations = relations(contributions, ({ one }) => ({
  category: one(categories, { fields: [contributions.categoryId], references: [categories.id] }),
  template: one(templates, { fields: [contributions.templateId], references: [templates.id] }),
}));

export const templateHistory = pgTable("template_history", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").notNull().references(() => templates.id, { onDelete: "cascade" }),
  contributionId: integer("contribution_id"),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  description: text("description").notNull().default(""),
  categoryId: integer("category_id"),
  tags: text("tags").array().notNull().default([]),
  complexity: text("complexity").notNull().default(""),
  notes: text("notes"),
  hidden: boolean("hidden").notNull().default(false),
  contributorName: text("contributor_name"),
  contributorCfHandle: text("contributor_cf_handle"),
  codes: jsonb("codes"),
  reason: text("reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const templateHistoryRelations = relations(templateHistory, ({ one }) => ({
  template: one(templates, { fields: [templateHistory.templateId], references: [templates.id] }),
}));
