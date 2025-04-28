import { pgTable, text, serial, integer, boolean, timestamp, numeric, json } from "drizzle-orm/pg-core";
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
  images: text("images").array(),  // Array of image paths or URLs
  showImageGallery: boolean("show_image_gallery").notNull().default(false),  // Flag to display images as gallery
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: integer("created_by"),  // User ID of who created this link
  approved: boolean("approved").notNull().default(false),  // Flag to indicate if link is approved by admin
  sharedWith: text("shared_with").array(),  // Array of user IDs that this link is shared with
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
  images: true,
  showImageGallery: true,
  createdBy: true,
  approved: true,
  sharedWith: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Connection = typeof connections.$inferSelect;
export type InsertConnection = z.infer<typeof insertConnectionSchema>;
export type MenuLink = typeof menuLinks.$inferSelect;
export type InsertMenuLink = z.infer<typeof insertMenuLinkSchema>;

// Artwork schema
export const artworks = pgTable("artworks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  artistName: text("artist_name").notNull(),
  imageUrl: text("image_url").notNull(),
  originalAvailable: boolean("original_available").default(false),
  originalPrice: numeric("original_price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  dimensions: text("dimensions"), // Format: "width x height" in inches
  medium: text("medium"),
  featured: boolean("featured").default(false),
  visible: boolean("visible").default(true), // New field to toggle artwork visibility
});

// Print sizes schema
export const printSizes = pgTable("print_sizes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // e.g., "Small", "Medium", "Large"
  width: numeric("width", { precision: 5, scale: 2 }).notNull(), // In inches
  height: numeric("height", { precision: 5, scale: 2 }).notNull(), // In inches
  priceFactor: numeric("price_factor", { precision: 5, scale: 2 }).notNull(), // Price multiplier
  active: boolean("active").default(true),
});

// Artwork print sizes relationship
export const artworkPrintSizes = pgTable("artwork_print_sizes", {
  id: serial("id").primaryKey(),
  artworkId: integer("artwork_id").references(() => artworks.id).notNull(),
  printSizeId: integer("print_size_id").references(() => printSizes.id).notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(), // Custom price for this artwork & size
  inStock: boolean("in_stock").default(true),
});

// Define orders for print purchases
export const printOrders = pgTable("print_orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  artworkId: integer("artwork_id").references(() => artworks.id).notNull(),
  printSizeId: integer("print_size_id").references(() => printSizes.id).notNull(),
  quantity: integer("quantity").notNull().default(1),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  isOriginal: boolean("is_original").default(false),
  shippingAddress: text("shipping_address").notNull(),
  status: text("status").notNull().default("pending"), // pending, processing, shipped, delivered
  trackingNumber: text("tracking_number"),
  orderDate: timestamp("order_date").defaultNow(),
  stripePaymentId: text("stripe_payment_id"),
  printingServiceOrderId: text("printing_service_order_id"),
});

// Insert schemas
export const insertArtworkSchema = createInsertSchema(artworks).pick({
  title: true,
  description: true,
  artistName: true,
  imageUrl: true,
  originalAvailable: true,
  originalPrice: true,
  category: true,
  dimensions: true,
  medium: true,
  featured: true,
  visible: true,
});

export const insertPrintSizeSchema = createInsertSchema(printSizes).pick({
  name: true,
  width: true,
  height: true,
  priceFactor: true,
  active: true,
});

export const insertArtworkPrintSizeSchema = createInsertSchema(artworkPrintSizes).pick({
  artworkId: true,
  printSizeId: true,
  price: true,
  inStock: true,
});

export const insertPrintOrderSchema = createInsertSchema(printOrders).pick({
  userId: true,
  artworkId: true,
  printSizeId: true,
  quantity: true,
  price: true,
  isOriginal: true,
  shippingAddress: true,
  status: true,
});

// Types
export type Artwork = typeof artworks.$inferSelect;
export type InsertArtwork = z.infer<typeof insertArtworkSchema>;

export type PrintSize = typeof printSizes.$inferSelect;
export type InsertPrintSize = z.infer<typeof insertPrintSizeSchema>;

export type ArtworkPrintSize = typeof artworkPrintSizes.$inferSelect;
export type InsertArtworkPrintSize = z.infer<typeof insertArtworkPrintSizeSchema>;

export type PrintOrder = typeof printOrders.$inferSelect;
export type InsertPrintOrder = z.infer<typeof insertPrintOrderSchema>;

// Content management schema
export const contentBlocks = pgTable("content_blocks", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(), // Unique identifier for the content block
  title: text("title").notNull(),
  content: text("content").notNull(), // Can be plain text, HTML, or markdown
  placement: text("placement").notNull(), // Where on the site this content appears
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  metaData: text("meta_data").default("{}"), // For additional configurable options (stored as JSON string)
});

export const insertContentBlockSchema = createInsertSchema(contentBlocks).pick({
  key: true,
  title: true,
  content: true,
  placement: true,
  active: true,
  metaData: true,
});

export type ContentBlock = typeof contentBlocks.$inferSelect;
export type InsertContentBlock = z.infer<typeof insertContentBlockSchema>;
