import { pgTable, text, serial, integer, boolean, timestamp, numeric, json, jsonb, varchar, decimal } from "drizzle-orm/pg-core";
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

// Dashboard widgets schema
export const dashboardWidgets = pgTable("dashboard_widgets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // The widget type identifier (e.g., "recent-orders", "activity-log", "stats")
  config: jsonb("config"), // JSON configuration for the widget
  position: integer("position").notNull().default(0), // Order position in the dashboard
  width: text("width").notNull().default("full"), // full, half, third
  height: text("height").default("auto"), // Can be "auto" or a specific height
  roles: text("roles").array().notNull(), // Array of roles that can see this widget: ["admin", "staff", "client"]
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  userId: integer("user_id").references(() => users.id), // If null, this is a default widget. If set, it's a custom user widget
});

// Dashboard layout schema (for storing user dashboard customizations)
export const dashboardLayouts = pgTable("dashboard_layouts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  role: text("role").notNull(), // The role this layout applies to
  layout: jsonb("layout").notNull(), // JSON array of widget IDs in display order
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDashboardWidgetSchema = createInsertSchema(dashboardWidgets).pick({
  name: true,
  type: true,
  config: true,
  position: true,
  width: true,
  height: true,
  roles: true,
  active: true,
  userId: true,
});

export const insertDashboardLayoutSchema = createInsertSchema(dashboardLayouts).pick({
  userId: true,
  role: true,
  layout: true,
});

export type DashboardWidget = typeof dashboardWidgets.$inferSelect;
export type InsertDashboardWidget = z.infer<typeof insertDashboardWidgetSchema>;
export type DashboardLayout = typeof dashboardLayouts.$inferSelect;
export type InsertDashboardLayout = z.infer<typeof insertDashboardLayoutSchema>;

// Product and Service Index (PSI) Tables
export const psiCategories = pgTable("psi_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  parentId: integer("parent_id"),
  icon: text("icon"),
  color: text("color"),
  active: boolean("active").default(true),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const psiValues = pgTable("psi_values", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  color: text("color"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const psiProducts = pgTable("psi_products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  categoryId: integer("category_id"),
  createdBy: integer("created_by"),
  
  // Product details
  price: numeric("price", { precision: 10, scale: 2 }),
  currency: text("currency").default("USD"),
  images: text("images").array(),
  website: text("website"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  
  // Location info
  location: text("location"),
  latitude: numeric("latitude", { precision: 10, scale: 8 }),
  longitude: numeric("longitude", { precision: 11, scale: 8 }),
  shipsGlobally: boolean("ships_globally").default(false),
  localOnly: boolean("local_only").default(false),
  
  // Ethical attributes
  fairTrade: boolean("fair_trade").default(false),
  organic: boolean("organic").default(false),
  handmade: boolean("handmade").default(false),
  biodegradable: boolean("biodegradable").default(false),
  transparentBusiness: boolean("transparent_business").default(false),
  noAds: boolean("no_ads").default(false),
  openSource: boolean("open_source").default(false),
  communitySupported: boolean("community_supported").default(false),
  
  // Quality and trust
  verifiedSeller: boolean("verified_seller").default(false),
  qualityScore: numeric("quality_score", { precision: 3, scale: 2 }).default("0"),
  trustScore: numeric("trust_score", { precision: 3, scale: 2 }).default("0"),
  
  // Status
  active: boolean("active").default(true),
  featured: boolean("featured").default(false),
  approved: boolean("approved").default(false),
  
  // Metadata
  tags: text("tags").array(),
  metaData: jsonb("meta_data"),
  searchVector: text("search_vector"), // For full-text search
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const psiProductValues = pgTable("psi_product_values", {
  id: serial("id").primaryKey(),
  productId: integer("product_id"),
  valueId: integer("value_id"),
  verified: boolean("verified").default(false),
  verifiedBy: integer("verified_by"),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const psiReviews = pgTable("psi_reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id"),
  userId: integer("user_id"),
  
  // Review content
  rating: integer("rating").notNull(), // 1-5 stars
  title: text("title"),
  content: text("content").notNull(),
  
  // Review quality
  helpfulVotes: integer("helpful_votes").default(0),
  verifiedPurchase: boolean("verified_purchase").default(false),
  
  // Status
  approved: boolean("approved").default(false),
  flagged: boolean("flagged").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const psiSearches = pgTable("psi_searches", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  query: text("query").notNull(),
  intent: text("intent"), // Natural language description of what user is looking for
  filters: jsonb("filters"),
  resultsCount: integer("results_count").default(0),
  clickedResults: integer("clicked_results").array(),
  sessionId: text("session_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertPsiCategorySchema = createInsertSchema(psiCategories).pick({
  name: true,
  description: true,
  parentId: true,
  icon: true,
  color: true,
  active: true,
  order: true,
});

export const insertPsiValueSchema = createInsertSchema(psiValues).pick({
  name: true,
  description: true,
  icon: true,
  color: true,
  active: true,
});

export const insertPsiProductSchema = createInsertSchema(psiProducts).pick({
  name: true,
  description: true,
  shortDescription: true,
  categoryId: true,
  price: true,
  currency: true,
  images: true,
  website: true,
  contactEmail: true,
  contactPhone: true,
  location: true,
  latitude: true,
  longitude: true,
  shipsGlobally: true,
  localOnly: true,
  fairTrade: true,
  organic: true,
  handmade: true,
  biodegradable: true,
  transparentBusiness: true,
  noAds: true,
  openSource: true,
  communitySupported: true,
  active: true,
  featured: true,
  tags: true,
  metaData: true,
});

export const insertPsiReviewSchema = createInsertSchema(psiReviews).pick({
  productId: true,
  rating: true,
  title: true,
  content: true,
  verifiedPurchase: true,
});

export const insertPsiSearchSchema = createInsertSchema(psiSearches).pick({
  userId: true,
  query: true,
  intent: true,
  filters: true,
  sessionId: true,
});

// Types
export type PsiCategory = typeof psiCategories.$inferSelect;
export type InsertPsiCategory = z.infer<typeof insertPsiCategorySchema>;

export type PsiValue = typeof psiValues.$inferSelect;
export type InsertPsiValue = z.infer<typeof insertPsiValueSchema>;

export type PsiProduct = typeof psiProducts.$inferSelect;
export type InsertPsiProduct = z.infer<typeof insertPsiProductSchema>;

export type PsiProductValue = typeof psiProductValues.$inferSelect;

export type PsiReview = typeof psiReviews.$inferSelect;
export type InsertPsiReview = z.infer<typeof insertPsiReviewSchema>;

export type PsiSearch = typeof psiSearches.$inferSelect;
export type InsertPsiSearch = z.infer<typeof insertPsiSearchSchema>;
