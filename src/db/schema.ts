import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
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
