import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"),
});

export const connections = pgTable("connections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const menuLinks = pgTable("menu_links", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  url: text("url").notNull(),
  pageContent: text("page_content"),  // Optional page content for simple pages
  hasPage: boolean("has_page").notNull().default(false),  // Flag to indicate if this is a page vs external link
  order: integer("order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users);
export const insertConnectionSchema = createInsertSchema(connections).pick({
  name: true,
  email: true,
});
export const insertMenuLinkSchema = createInsertSchema(menuLinks).pick({
  label: true,
  url: true,
  pageContent: true,
  hasPage: true,
  order: true,
  active: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Connection = typeof connections.$inferSelect;
export type InsertConnection = z.infer<typeof insertConnectionSchema>;
export type MenuLink = typeof menuLinks.$inferSelect;
export type InsertMenuLink = z.infer<typeof insertMenuLinkSchema>;
