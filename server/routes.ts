import type { Express } from "express";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertConnectionSchema, 
  insertMenuLinkSchema, 
  insertArtworkSchema,
  insertPrintSizeSchema,
  insertArtworkPrintSizeSchema,
  insertPrintOrderSchema,
  insertContentBlockSchema,
  insertDashboardWidgetSchema,
  insertDashboardLayoutSchema,
  type InsertMenuLink,
  type InsertArtwork,
  type InsertPrintSize,
  type InsertArtworkPrintSize,
  type InsertPrintOrder,
  type InsertContentBlock,
  type InsertDashboardWidget,
  type InsertDashboardLayout,
} from "@shared/schema";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import Stripe from "stripe";
import { 
  createTables, 
  seedData, 
  getAIOperators, 
  getBusinessMetrics, 
  getServices, 
  getClientProjects,
  updateOperatorMetrics,
  createProject 
} from "./neon";

// Stripe configuration - will be initialized when needed
let stripe: Stripe | undefined;

try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
} catch (error) {
  console.warn('Stripe initialization failed:', error);
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export async function registerRoutes(app: Express): Promise<void> {
  // Setup authentication first
  setupAuth(app);

  // Initialize Neural Web Labs database
  try {
    await createTables();
    await seedData();
    console.log("Neural Web Labs database initialized successfully");
  } catch (error) {
    console.log("Database already initialized or error:", error);
  }

  // Neural Web Labs API endpoints
  app.get("/api/neural/ai-operators", async (req, res) => {
    try {
      const operators = await getAIOperators();
      res.json(operators);
    } catch (error) {
      console.error("Error fetching AI operators:", error);
      res.status(500).json({ error: "Failed to fetch AI operators" });
    }
  });

  app.get("/api/neural/business-metrics", async (req, res) => {
    try {
      const metrics = await getBusinessMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching business metrics:", error);
      res.status(500).json({ error: "Failed to fetch business metrics" });
    }
  });

  app.get("/api/neural/services", async (req, res) => {
    try {
      const services = await getServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.get("/api/neural/client-projects", async (req, res) => {
    try {
      const projects = await getClientProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching client projects:", error);
      res.status(500).json({ error: "Failed to fetch client projects" });
    }
  });

  app.post("/api/neural/projects", async (req, res) => {
    try {
      const { project_name, client_name, ai_operator_id, complexity_level, revenue } = req.body;
      
      if (!project_name || !client_name || !ai_operator_id || !complexity_level || !revenue) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const project = await createProject({
        project_name,
        client_name,
        ai_operator_id: parseInt(ai_operator_id),
        complexity_level,
        revenue: parseFloat(revenue)
      });

      res.json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.put("/api/neural/operators/:id/metrics", async (req, res) => {
    try {
      const operatorId = parseInt(req.params.id);
      const { tasksCompleted, efficiency } = req.body;

      if (!tasksCompleted || !efficiency) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      await updateOperatorMetrics(operatorId, parseInt(tasksCompleted), parseFloat(efficiency));
      res.json({ message: "Operator metrics updated successfully" });
    } catch (error) {
      console.error("Error updating operator metrics:", error);
      res.status(500).json({ error: "Failed to update operator metrics" });
    }
  });

  // Password change endpoint
  app.post("/api/change-password", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters long" });
    }

    try {
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify current password
      const isCurrentPasswordValid = await comparePasswords(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Hash new password
      const hashedNewPassword = await hashPassword(newPassword);

      // Update password in storage
      await storage.updateUserPassword(req.user.id, hashedNewPassword);

      res.json({ message: "Password changed successfully" });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to change password" });
    }
  });
  
  // Dashboard Widget API routes
  app.get("/api/widgets", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    
    // If no specific role is provided, use the user's current role
    const role = (req.query.role as string) || req.user.role;
    const userId = req.user.id;
    
    try {
      // Get dashboard widgets based on user and role
      const widgets = await storage.getDashboardWidgetsByUserAndRole(userId, role);
      res.json(widgets);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post("/api/widgets", async (req, res) => {
    if (!req.isAuthenticated() || (req.user.role !== "admin" && req.user.role !== "owner")) {
      return res.sendStatus(403);
    }
    
    try {
      const widgetData = insertDashboardWidgetSchema.parse({
        ...req.body,
        userId: req.user.id // Set the current user as the creator
      });
      
      const widget = await storage.createDashboardWidget(widgetData);
      res.status(201).json(widget);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  app.patch("/api/widgets/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    
    const widgetId = parseInt(req.params.id);
    const widget = await storage.getDashboardWidget(widgetId);
    
    if (!widget) {
      return res.status(404).json({ error: "Widget not found" });
    }
    
    // Only allow admin/owner to update widgets, or the user who created it
    if (req.user.role !== "admin" && req.user.role !== "owner" && widget.userId !== req.user.id) {
      return res.sendStatus(403);
    }
    
    try {
      const updatedWidget = await storage.updateDashboardWidget(widgetId, req.body);
      res.json(updatedWidget);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  
  app.delete("/api/widgets/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    
    const widgetId = parseInt(req.params.id);
    const widget = await storage.getDashboardWidget(widgetId);
    
    if (!widget) {
      return res.status(404).json({ error: "Widget not found" });
    }
    
    // Only allow admin/owner to delete widgets, or the user who created it
    if (req.user.role !== "admin" && req.user.role !== "owner" && widget.userId !== req.user.id) {
      return res.sendStatus(403);
    }
    
    try {
      await storage.deleteDashboardWidget(widgetId);
      res.sendStatus(204);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Dashboard Layout API routes
  app.get("/api/layouts", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    
    // If no specific role is provided, use the user's current role
    const role = (req.query.role as string) || req.user.role;
    const userId = req.user.id;
    
    try {
      // Get dashboard layout for the user and role
      const layout = await storage.getDashboardLayout(userId, role);
      
      if (!layout) {
        // If no layout exists, return default layout based on widgets order
        const widgets = await storage.getDashboardWidgetsByUserAndRole(userId, role);
        const defaultLayout = widgets.map(widget => widget.id.toString());
        
        return res.json({ layout: defaultLayout });
      }
      
      res.json(layout);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  app.post("/api/layouts", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    
    try {
      // First check if layout already exists
      const existingLayout = await storage.getDashboardLayout(req.user.id, req.body.role);
      
      if (existingLayout) {
        // Update the existing layout
        const updatedLayout = await storage.updateDashboardLayout(existingLayout.id, {
          layout: req.body.layout
        });
        return res.json(updatedLayout);
      }
      
      // Create new layout
      const layoutData = insertDashboardLayoutSchema.parse({
        userId: req.user.id,
        role: req.body.role,
        layout: req.body.layout
      });
      
      const layout = await storage.createDashboardLayout(layoutData);
      res.status(201).json(layout);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
  // Setup Authentication
  setupAuth(app);

  // API endpoint to create a new connection
  app.post("/api/connections", async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertConnectionSchema.parse(req.body);
      
      // Create the connection
      const connection = await storage.createConnection(validatedData);
      
      // Return the created connection
      res.status(201).json(connection);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // API endpoint to get all connections (protected, only for authenticated users)
  app.get("/api/connections", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    storage.getAllConnections()
      .then(connections => res.json(connections))
      .catch(error => res.status(500).json({ message: error.message }));
  });
  
  // API endpoint to get all users (protected, only for owner)
  app.get("/api/users", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user?.role !== "owner") {
      return res.status(403).json({ message: "Forbidden - Owner access required" });
    }
    
    storage.getAllUsers()
      .then(users => res.json(users))
      .catch(error => res.status(500).json({ message: error.message }));
  });
  
  // API endpoint to create a new user (protected, only for owner)
  app.post("/api/users", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user?.role !== "owner") {
      return res.status(403).json({ message: "Forbidden - Owner access required" });
    }
    
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Hash the password before storing
      const hashedPassword = await hashPassword(req.body.password);
      const user = await storage.createUser({
        username: req.body.username,
        password: hashedPassword,
        role: req.body.role || "staff",
      });
      
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // API endpoint to delete a user (protected, only for owner)
  app.delete("/api/users/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user?.role !== "owner") {
      return res.status(403).json({ message: "Forbidden - Owner access required" });
    }
    
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    try {
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      if (user.role === "owner") {
        return res.status(403).json({ message: "Cannot delete owner account" });
      }
      
      await storage.deleteUser(userId);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // API endpoint to get all menu links
  app.get("/api/menu-links", async (req, res) => {
    try {
      // For public use, only return active and approved links
      if (!req.isAuthenticated()) {
        // Public view - only approved links
        const approvedLinks = await storage.getApprovedMenuLinks();
        return res.json(approvedLinks.filter(link => link.active));
      }
      
      const role = req.user?.role;
      const userId = req.user?.id;
      
      // Owner sees all links
      if (role === "owner") {
        const allLinks = await storage.getAllMenuLinks();
        return res.json(allLinks);
      }
      
      // Staff sees their own links plus approved ones
      if ((role === "staff" || role === "admin") && userId) {
        // Get links created by this user
        const userLinks = await storage.getUserMenuLinks(userId);
        // Get links shared with this user
        const sharedLinks = await storage.getSharedMenuLinks(userId);
        // Get all approved links
        const approvedLinks = await storage.getApprovedMenuLinks();
        
        // Combine links and remove duplicates based on ID
        const combinedLinks = [...userLinks, ...sharedLinks, ...approvedLinks];
        const uniqueLinks = Array.from(new Map(combinedLinks.map(link => [link.id, link])).values());
        
        // Sort by order
        uniqueLinks.sort((a, b) => a.order - b.order);
        
        return res.json(uniqueLinks);
      }
      
      // Default to approved links
      const approvedLinks = await storage.getApprovedMenuLinks();
      return res.json(approvedLinks.filter(link => link.active));
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // API endpoint to get a specific menu link by ID
  app.get("/api/menu-links/:id", async (req, res) => {
    const menuLinkId = parseInt(req.params.id);
    if (isNaN(menuLinkId)) {
      return res.status(400).json({ message: "Invalid menu link ID" });
    }
    
    try {
      const menuLink = await storage.getMenuLink(menuLinkId);
      
      if (!menuLink) {
        return res.status(404).json({ message: "Menu link not found" });
      }
      
      // For public use, only return active and approved links
      if (!req.isAuthenticated()) {
        if (!menuLink.active || !menuLink.approved) {
          return res.status(404).json({ message: "Menu link not found" });
        }
      } else {
        const role = req.user?.role;
        const userId = req.user?.id;
        
        // Owner can see any link
        if (role === "owner") {
          return res.json(menuLink);
        }
        
        // Staff can see their own links or approved links
        if ((role === "staff" || role === "admin") && userId) {
          // Check if the link is created by this user, shared with them, or approved
          const isCreator = menuLink.createdBy === userId;
          const isShared = menuLink.sharedWith && menuLink.sharedWith.includes(userId.toString());
          const isApproved = menuLink.approved;
          
          if (!isCreator && !isShared && !isApproved) {
            return res.status(404).json({ message: "Menu link not found" });
          }
        }
      }
      
      res.json(menuLink);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // API endpoint to create a new menu link (protected, staff and owner)
  app.post("/api/menu-links", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const role = req.user?.role;
    const userId = req.user?.id;
    
    if (!role || !userId) {
      return res.status(400).json({ message: "Invalid user role or ID" });
    }
    
    // Only staff, admin, and owner can create menu links
    if (role !== "staff" && role !== "admin" && role !== "owner") {
      return res.status(403).json({ message: "Forbidden - Insufficient permissions" });
    }
    
    try {
      // Validate request body
      const parsedData = insertMenuLinkSchema.safeParse(req.body);
      
      if (!parsedData.success) {
        return res.status(400).json({ 
          message: "Invalid menu link data", 
          errors: parsedData.error.format() 
        });
      }
      
      // Set the creator ID
      const menuLinkData = {
        ...parsedData.data,
        createdBy: userId,
        // Owner-created links are automatically approved
        approved: role === "owner" ? true : false
      };
      
      // Create the menu link
      const menuLink = await storage.createMenuLink(menuLinkData);
      
      // Return the created menu link
      res.status(201).json(menuLink);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // API endpoint to update a menu link (protected)
  app.patch("/api/menu-links/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const role = req.user?.role;
    const userId = req.user?.id;
    
    if (!role || !userId) {
      return res.status(400).json({ message: "Invalid user role or ID" });
    }
    
    const menuLinkId = parseInt(req.params.id);
    if (isNaN(menuLinkId)) {
      return res.status(400).json({ message: "Invalid menu link ID" });
    }
    
    try {
      const menuLink = await storage.getMenuLink(menuLinkId);
      
      if (!menuLink) {
        return res.status(404).json({ message: "Menu link not found" });
      }
      
      // Check permissions - owner can edit any link, staff can only edit their own links or shared links
      if (role !== 'owner') {
        // Check if the staff member created this link or if it's shared with them
        const isCreator = menuLink.createdBy === userId;
        const isShared = menuLink.sharedWith && menuLink.sharedWith.includes(userId.toString());
        
        if (!isCreator && !isShared) {
          return res.status(403).json({ message: "Forbidden - You can only edit your own links or links shared with you" });
        }
      }
      
      // Only validate fields that are provided in the request body
      const updateData: Partial<InsertMenuLink> = {};
      if (req.body.label !== undefined) updateData.label = req.body.label;
      if (req.body.url !== undefined) updateData.url = req.body.url;
      if (req.body.order !== undefined) updateData.order = req.body.order;
      if (req.body.active !== undefined) updateData.active = req.body.active;
      if (req.body.hasPage !== undefined) updateData.hasPage = req.body.hasPage;
      if (req.body.pageContent !== undefined) updateData.pageContent = req.body.pageContent;
      if (req.body.images !== undefined) updateData.images = req.body.images;
      if (req.body.showImageGallery !== undefined) updateData.showImageGallery = req.body.showImageGallery;
      
      // Only owner can update sharing and approval status
      if (role === 'owner') {
        if (req.body.sharedWith !== undefined) updateData.sharedWith = req.body.sharedWith;
        if (req.body.approved !== undefined) updateData.approved = req.body.approved;
      }
      
      const updatedMenuLink = await storage.updateMenuLink(menuLinkId, updateData);
      
      res.json(updatedMenuLink);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // API endpoint to update menu link approval (protected, only for owner)
  app.patch("/api/menu-links/:id/approval", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user?.role !== "owner") {
      return res.status(403).json({ message: "Forbidden - Owner access required" });
    }
    
    const menuLinkId = parseInt(req.params.id);
    if (isNaN(menuLinkId)) {
      return res.status(400).json({ message: "Invalid menu link ID" });
    }
    
    try {
      const { approved } = req.body;
      
      if (approved === undefined) {
        return res.status(400).json({ message: "Approval status is required" });
      }
      
      const updatedMenuLink = await storage.updateMenuLinkApproval(menuLinkId, approved);
      
      if (!updatedMenuLink) {
        return res.status(404).json({ message: "Menu link not found" });
      }
      
      res.json(updatedMenuLink);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // API endpoint to delete a menu link (protected)
  app.delete("/api/menu-links/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const role = req.user?.role;
    const userId = req.user?.id;
    
    if (!role || !userId) {
      return res.status(400).json({ message: "Invalid user role or ID" });
    }
    
    const menuLinkId = parseInt(req.params.id);
    if (isNaN(menuLinkId)) {
      return res.status(400).json({ message: "Invalid menu link ID" });
    }
    
    try {
      const menuLink = await storage.getMenuLink(menuLinkId);
      
      if (!menuLink) {
        return res.status(404).json({ message: "Menu link not found" });
      }
      
      // Owner can delete any link
      if (role !== 'owner') {
        // Staff can only delete their own links
        if (menuLink.createdBy !== userId) {
          return res.status(403).json({ message: "Forbidden - You can only delete your own links" });
        }
        
        // Staff can't delete approved links
        if (menuLink.approved) {
          return res.status(403).json({ message: "Forbidden - You cannot delete approved links" });
        }
      }
      
      await storage.deleteMenuLink(menuLinkId);
      res.status(200).json({ message: "Menu link deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // API endpoint to update menu link images (protected)
  app.post("/api/menu-links/:id/images", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const role = req.user?.role;
    const userId = req.user?.id;
    
    if (!role || !userId) {
      return res.status(400).json({ message: "Invalid user role or ID" });
    }
    
    const menuLinkId = parseInt(req.params.id);
    if (isNaN(menuLinkId)) {
      return res.status(400).json({ message: "Invalid menu link ID" });
    }
    
    try {
      const menuLink = await storage.getMenuLink(menuLinkId);
      
      if (!menuLink) {
        return res.status(404).json({ message: "Menu link not found" });
      }
      
      // Check permissions - owner can edit any link, staff can only edit their own links or shared links
      if (role !== 'owner') {
        // Check if the staff member created this link or if it's shared with them
        const isCreator = menuLink.createdBy === userId;
        const isShared = menuLink.sharedWith && menuLink.sharedWith.includes(userId.toString());
        
        if (!isCreator && !isShared) {
          return res.status(403).json({ message: "Forbidden - You can only edit your own links or links shared with you" });
        }
      }
      
      const { imageUrl } = req.body;
      
      if (!imageUrl) {
        return res.status(400).json({ message: "Image URL is required" });
      }
      
      // Add the new image URL to the images array
      const currentImages = menuLink.images || [];
      const updatedImages = [...currentImages, imageUrl];
      
      const updatedMenuLink = await storage.updateMenuLink(menuLinkId, {
        images: updatedImages
      });
      
      res.status(200).json(updatedMenuLink);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // API endpoint to delete an image from menu link (protected)
  app.delete("/api/menu-links/:id/images/:imageIndex", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const role = req.user?.role;
    const userId = req.user?.id;
    
    if (!role || !userId) {
      return res.status(400).json({ message: "Invalid user role or ID" });
    }
    
    const menuLinkId = parseInt(req.params.id);
    const imageIndex = parseInt(req.params.imageIndex);
    
    if (isNaN(menuLinkId)) {
      return res.status(400).json({ message: "Invalid menu link ID" });
    }
    
    if (isNaN(imageIndex) || imageIndex < 0) {
      return res.status(400).json({ message: "Invalid image index" });
    }
    
    try {
      const menuLink = await storage.getMenuLink(menuLinkId);
      
      if (!menuLink) {
        return res.status(404).json({ message: "Menu link not found" });
      }
      
      // Check permissions - owner can edit any link, staff can only edit their own links or shared links
      if (role !== 'owner') {
        // Check if the staff member created this link or if it's shared with them
        const isCreator = menuLink.createdBy === userId;
        const isShared = menuLink.sharedWith && menuLink.sharedWith.includes(userId.toString());
        
        if (!isCreator && !isShared) {
          return res.status(403).json({ message: "Forbidden - You can only edit your own links or links shared with you" });
        }
      }
      
      const currentImages = menuLink.images || [];
      
      if (imageIndex >= currentImages.length) {
        return res.status(404).json({ message: "Image not found" });
      }
      
      // Remove the image at the specified index
      const updatedImages = [...currentImages];
      updatedImages.splice(imageIndex, 1);
      
      const updatedMenuLink = await storage.updateMenuLink(menuLinkId, {
        images: updatedImages
      });
      
      res.status(200).json(updatedMenuLink);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // API endpoint to update owner credentials (protected, only for owner)
  app.patch("/api/user/owner", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user?.role !== "owner") {
      return res.status(403).json({ message: "Forbidden - Owner access required" });
    }
    
    try {
      const { username, currentPassword, newPassword } = req.body;
      
      if (!username || !currentPassword || !newPassword) {
        return res.status(400).json({ message: "Username, current password, and new password are required" });
      }
      
      // Verify the current password matches
      const user = await storage.getUserByUsername(req.user.username);
      if (!user) {
        return res.status(404).json({ message: "Owner user not found" });
      }
      
      const isPasswordCorrect = await comparePasswords(currentPassword, user.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
      
      // Check if the new username already exists (unless it's the same as the current one)
      if (username !== req.user.username) {
        const existingUser = await storage.getUserByUsername(username);
        if (existingUser && existingUser.id !== user.id) {
          return res.status(400).json({ message: "Username already exists" });
        }
      }
      
      // Hash the new password
      const hashedPassword = await hashPassword(newPassword);
      
      // Update the owner's credentials
      const updatedUser = await storage.updateOwnerCredentials(username, hashedPassword);
      
      // Return success
      res.status(200).json(updatedUser);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // API endpoint to get all available services
  app.get("/api/services", (req, res) => {
    const services = [
      {
        id: 'web-basic',
        name: 'Basic Website',
        description: 'A responsive website with up to 5 pages, including contact form and basic SEO.',
        price: 1499,
        features: [
          '5 Page Website',
          'Mobile Responsive Design',
          'Contact Form',
          'Basic SEO Setup',
          '1 Round of Revisions',
          '2 Weeks Delivery'
        ]
      },
      {
        id: 'web-premium',
        name: 'Premium Website',
        description: 'A comprehensive website with up to 10 pages, custom design, and enhanced features.',
        price: 2999,
        features: [
          '10 Page Website',
          'Custom Design',
          'Contact Form & Newsletter',
          'Advanced SEO Setup',
          'Social Media Integration',
          '3 Rounds of Revisions',
          '4 Weeks Delivery'
        ]
      },
      {
        id: 'web-ecommerce',
        name: 'E-Commerce Website',
        description: 'A full-featured online store with product management, payment processing, and order tracking.',
        price: 4999,
        features: [
          'Full E-Commerce Functionality',
          'Up to 50 Product Listings',
          'Secure Payment Processing',
          'Inventory Management',
          'Order Tracking',
          'Customer Account Creation',
          'Mobile Shopping Experience',
          '6 Weeks Delivery'
        ]
      },
      {
        id: 'design-logo',
        name: 'Logo Design',
        description: 'Professional logo design with multiple concepts and iterations.',
        price: 499,
        features: [
          '3 Initial Concepts',
          '3 Rounds of Revisions',
          'Final Files in All Formats',
          'Full Copyright Ownership',
          '1 Week Delivery'
        ]
      },
      {
        id: 'design-brand',
        name: 'Brand Identity Package',
        description: 'Complete brand identity including logo, color palette, typography, and brand guidelines.',
        price: 1299,
        features: [
          'Logo Design',
          'Color Palette',
          'Typography Selection',
          'Brand Guidelines Document',
          'Business Card Design',
          'Letterhead Design',
          '2 Weeks Delivery'
        ]
      },
      {
        id: 'marketing-seo',
        name: 'SEO Package',
        description: 'Comprehensive SEO optimization to improve your search engine rankings.',
        price: 899,
        features: [
          'Keyword Research',
          'On-Page SEO Optimization',
          'Content Recommendations',
          'Technical SEO Audit',
          'Monthly Performance Report',
          'Ongoing Support for 3 Months'
        ]
      }
    ];
    
    res.json(services);
  });
  
  // Stripe payment route for service payments
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, serviceId, serviceName } = req.body;
      
      if (!stripe) {
        return res.status(500).json({ error: "Payment processing not configured" });
      }
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount, // Amount should be in cents (e.g., 1499 for $14.99)
        currency: "usd",
        metadata: {
          serviceId,
          serviceName
        }
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // ==================== ARTWORK & PRINTS ENDPOINTS ====================

  // API endpoint to get all artworks
  app.get("/api/artworks", (req, res) => {
    // Check if we should include hidden artworks (for admin pages)
    const includeHidden = req.query.includeHidden === 'true';
    
    // Only allow admin users to see hidden artworks
    const showHidden = includeHidden && req.isAuthenticated() && 
      (req.user?.role === 'admin' || req.user?.role === 'owner');
    
    storage.getAllArtworks(showHidden)
      .then(artworks => res.json(artworks))
      .catch(error => res.status(500).json({ message: error.message }));
  });

  // API endpoint to get featured artworks
  app.get("/api/artworks/featured", (req, res) => {
    storage.getFeaturedArtworks()
      .then(artworks => res.json(artworks))
      .catch(error => res.status(500).json({ message: error.message }));
  });

  // API endpoint to get a single artwork by ID
  app.get("/api/artworks/:id", async (req, res) => {
    const artworkId = parseInt(req.params.id);
    if (isNaN(artworkId)) {
      return res.status(400).json({ message: "Invalid artwork ID" });
    }
    
    try {
      const artwork = await storage.getArtwork(artworkId);
      if (!artwork) {
        return res.status(404).json({ message: "Artwork not found" });
      }
      
      res.json(artwork);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // API endpoint to create a new artwork (protected, admin access required)
  app.post("/api/artworks", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user?.role !== "admin" && req.user?.role !== "owner") {
      return res.status(403).json({ message: "Forbidden - Admin access required" });
    }
    
    try {
      // Validate request body
      const validatedData = insertArtworkSchema.parse(req.body);
      
      // Create the artwork
      const artwork = await storage.createArtwork(validatedData);
      
      // Return the created artwork
      res.status(201).json(artwork);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // API endpoint to update an artwork (protected, admin access required)
  app.patch("/api/artworks/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user?.role !== "admin" && req.user?.role !== "owner") {
      return res.status(403).json({ message: "Forbidden - Admin access required" });
    }
    
    const artworkId = parseInt(req.params.id);
    if (isNaN(artworkId)) {
      return res.status(400).json({ message: "Invalid artwork ID" });
    }
    
    try {
      const artwork = await storage.getArtwork(artworkId);
      if (!artwork) {
        return res.status(404).json({ message: "Artwork not found" });
      }
      
      // Only update fields that are provided
      const updateData: Partial<InsertArtwork> = {};
      
      if (req.body.title !== undefined) updateData.title = req.body.title;
      if (req.body.description !== undefined) updateData.description = req.body.description;
      if (req.body.artistName !== undefined) updateData.artistName = req.body.artistName;
      if (req.body.imageUrl !== undefined) updateData.imageUrl = req.body.imageUrl;
      if (req.body.originalAvailable !== undefined) updateData.originalAvailable = req.body.originalAvailable;
      if (req.body.originalPrice !== undefined) updateData.originalPrice = req.body.originalPrice;
      if (req.body.category !== undefined) updateData.category = req.body.category;
      if (req.body.dimensions !== undefined) updateData.dimensions = req.body.dimensions;
      if (req.body.medium !== undefined) updateData.medium = req.body.medium;
      if (req.body.featured !== undefined) updateData.featured = req.body.featured;
      
      const updatedArtwork = await storage.updateArtwork(artworkId, updateData);
      
      res.json(updatedArtwork);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // API endpoint to toggle artwork visibility (protected, admin access required)
  app.patch("/api/artworks/:id/toggle-visibility", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user?.role !== "admin" && req.user?.role !== "owner") {
      return res.status(403).json({ message: "Forbidden - Admin access required" });
    }
    
    const artworkId = parseInt(req.params.id);
    if (isNaN(artworkId)) {
      return res.status(400).json({ message: "Invalid artwork ID" });
    }
    
    try {
      const artwork = await storage.getArtwork(artworkId);
      if (!artwork) {
        return res.status(404).json({ message: "Artwork not found" });
      }
      
      // Toggle the visibility
      const newVisibility = artwork.visible === false ? true : false;
      
      const updatedArtwork = await storage.updateArtwork(artworkId, { 
        visible: newVisibility
      });
      
      if (!updatedArtwork) {
        return res.status(500).json({ message: "Failed to update artwork visibility" });
      }
      
      res.status(200).json({ 
        message: `Artwork ${newVisibility ? 'shown' : 'hidden'} successfully`,
        artwork: updatedArtwork
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // API endpoint to delete an artwork (protected, admin access required)
  // Note: This is kept for backwards compatibility but artwork deletion is now discouraged
  // Use toggle-visibility endpoint instead to hide artwork
  app.delete("/api/artworks/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user?.role !== "admin" && req.user?.role !== "owner") {
      return res.status(403).json({ message: "Forbidden - Admin access required" });
    }
    
    const artworkId = parseInt(req.params.id);
    if (isNaN(artworkId)) {
      return res.status(400).json({ message: "Invalid artwork ID" });
    }
    
    try {
      const artwork = await storage.getArtwork(artworkId);
      if (!artwork) {
        return res.status(404).json({ message: "Artwork not found" });
      }
      
      // Instead of deleting, just hide it
      await storage.updateArtwork(artworkId, { visible: false });
      res.status(200).json({ message: "Artwork hidden successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // API endpoint to get all print sizes
  app.get("/api/print-sizes", (req, res) => {
    storage.getAllPrintSizes()
      .then(printSizes => res.json(printSizes))
      .catch(error => res.status(500).json({ message: error.message }));
  });

  // API endpoint to create a new print size (protected, admin access required)
  app.post("/api/print-sizes", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user?.role !== "admin" && req.user?.role !== "owner") {
      return res.status(403).json({ message: "Forbidden - Admin access required" });
    }
    
    try {
      // Validate request body
      const validatedData = insertPrintSizeSchema.parse(req.body);
      
      // Create the print size
      const printSize = await storage.createPrintSize(validatedData);
      
      // Return the created print size
      res.status(201).json(printSize);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // API endpoint to get all available print sizes for a specific artwork
  app.get("/api/artworks/:id/print-sizes", async (req, res) => {
    const artworkId = parseInt(req.params.id);
    if (isNaN(artworkId)) {
      return res.status(400).json({ message: "Invalid artwork ID" });
    }
    
    try {
      const artwork = await storage.getArtwork(artworkId);
      if (!artwork) {
        return res.status(404).json({ message: "Artwork not found" });
      }
      
      const printSizesWithDetails = await storage.getArtworkPrintSizesWithDetails(artworkId);
      res.json(printSizesWithDetails);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // API endpoint to add a print size to an artwork (protected, admin access required)
  app.post("/api/artworks/:id/print-sizes", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user?.role !== "admin" && req.user?.role !== "owner") {
      return res.status(403).json({ message: "Forbidden - Admin access required" });
    }
    
    const artworkId = parseInt(req.params.id);
    if (isNaN(artworkId)) {
      return res.status(400).json({ message: "Invalid artwork ID" });
    }
    
    try {
      const artwork = await storage.getArtwork(artworkId);
      if (!artwork) {
        return res.status(404).json({ message: "Artwork not found" });
      }
      
      // Validate request body
      const { printSizeId, price, inStock } = req.body;
      
      if (!printSizeId || !price) {
        return res.status(400).json({ message: "Print size ID and price are required" });
      }
      
      const printSize = await storage.getPrintSize(printSizeId);
      if (!printSize) {
        return res.status(404).json({ message: "Print size not found" });
      }
      
      // Create the association
      const artworkPrintSize = await storage.createArtworkPrintSize({
        artworkId,
        printSizeId,
        price,
        inStock: inStock !== undefined ? inStock : true
      });
      
      // Return the created association with print size details
      const response = {
        ...artworkPrintSize,
        printSize
      };
      
      res.status(201).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // API endpoint to create an order for a print (requires user authentication)
  app.post("/api/print-orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const { artworkId, printSizeId, quantity, isOriginal, shippingAddress } = req.body;
      
      if (!artworkId || !(printSizeId || isOriginal) || !shippingAddress) {
        return res.status(400).json({ 
          message: "Artwork ID, print size ID (or isOriginal=true), and shipping address are required" 
        });
      }
      
      // Get the artwork
      const artwork = await storage.getArtwork(artworkId);
      if (!artwork) {
        return res.status(404).json({ message: "Artwork not found" });
      }
      
      let price: number;
      
      if (isOriginal) {
        // Check if original is available
        if (!artwork.originalAvailable) {
          return res.status(400).json({ message: "Original artwork is not available for purchase" });
        }
        
        price = parseFloat(artwork.originalPrice.toString());
      } else {
        // Get the artwork print size
        const artworkPrintSizes = await storage.getArtworkPrintSizes(artworkId);
        const artworkPrintSize = artworkPrintSizes.find(aps => aps.printSizeId === printSizeId);
        
        if (!artworkPrintSize) {
          return res.status(404).json({ message: "Print size not available for this artwork" });
        }
        
        if (!artworkPrintSize.inStock) {
          return res.status(400).json({ message: "Print size is out of stock" });
        }
        
        price = parseFloat(artworkPrintSize.price.toString());
      }
      
      // Calculate total price
      const totalPrice = price * (quantity || 1);
      
      // Create the order
      const order = await storage.createPrintOrder({
        userId: req.user.id,
        artworkId,
        printSizeId: isOriginal ? 0 : printSizeId,
        quantity: quantity || 1,
        price: totalPrice.toString(),
        isOriginal: isOriginal || false,
        shippingAddress,
        status: "pending"
      });
      
      // Return the created order
      res.status(201).json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // API endpoint to get orders for the current user
  app.get("/api/print-orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const orders = await storage.getUserPrintOrders(req.user.id);
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // API endpoint to update order status (protected, admin access required)
  app.patch("/api/print-orders/:id/status", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user?.role !== "admin" && req.user?.role !== "owner") {
      return res.status(403).json({ message: "Forbidden - Admin access required" });
    }
    
    const orderId = parseInt(req.params.id);
    if (isNaN(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }
    
    try {
      const { status, trackingNumber } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const order = await storage.getPrintOrder(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const updatedOrder = await storage.updatePrintOrderStatus(orderId, status, trackingNumber);
      res.json(updatedOrder);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // API endpoint to integrate with print service (protected, admin access required)
  app.post("/api/print-orders/:id/print-service", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user?.role !== "admin" && req.user?.role !== "owner") {
      return res.status(403).json({ message: "Forbidden - Admin access required" });
    }
    
    const orderId = parseInt(req.params.id);
    if (isNaN(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }
    
    try {
      const { printingServiceOrderId } = req.body;
      
      if (!printingServiceOrderId) {
        return res.status(400).json({ message: "Printing service order ID is required" });
      }
      
      const order = await storage.getPrintOrder(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const updatedOrder = await storage.updatePrintOrderPrintingInfo(orderId, printingServiceOrderId);
      
      // Update status to processing if it's currently pending
      if (updatedOrder && updatedOrder.status === "pending") {
        await storage.updatePrintOrderStatus(orderId, "processing");
      }
      
      res.json(updatedOrder);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // API endpoint for Stripe payment for prints (directly ties to an order)
  app.post("/api/print-orders/:id/payment", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const orderId = parseInt(req.params.id);
    if (isNaN(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }
    
    try {
      const order = await storage.getPrintOrder(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Verify the order belongs to the current user
      if (order.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden - You do not have access to this order" });
      }
      
      // Create a payment intent with Stripe
      if (!stripe) {
        return res.status(500).json({ error: "Payment processing not configured" });
      }
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(parseFloat(order.price.toString()) * 100), // Convert to cents
        currency: "usd",
        metadata: {
          orderId: order.id.toString(),
          userId: req.user.id.toString(),
          isOriginal: order.isOriginal ? "true" : "false",
          artworkId: order.artworkId.toString()
        }
      });
      
      // Update the order with the Stripe payment ID
      await storage.updatePrintOrderPaymentInfo(orderId, paymentIntent.id);
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Content block routes
  // Get all content blocks (temporarily no auth for development)
  app.get("/api/content-blocks", (req, res) => {
    // Temporarily removed auth checks for development testing
    // if (!req.isAuthenticated()) {
    //  return res.status(401).json({ message: "Unauthorized" });
    // }
    
    // if (req.user?.role !== "admin" && req.user?.role !== "owner") {
    //  return res.status(403).json({ message: "Forbidden - Admin access required" });
    // }
    
    storage.getAllContentBlocks()
      .then(contentBlocks => res.json(contentBlocks))
      .catch(error => res.status(500).json({ message: error.message }));
  });
  
  // Get active content blocks by placement (public)
  app.get("/api/content-blocks/placement/:placement", (req, res) => {
    const placement = req.params.placement;
    
    storage.getActiveContentBlocksByPlacement(placement)
      .then(contentBlocks => res.json(contentBlocks))
      .catch(error => res.status(500).json({ message: error.message }));
  });
  
  // Get a specific content block by key (public)
  app.get("/api/content-blocks/key/:key", async (req, res) => {
    const key = req.params.key;
    
    try {
      const contentBlock = await storage.getContentBlockByKey(key);
      
      if (!contentBlock) {
        return res.status(404).json({ message: "Content block not found" });
      }
      
      res.json(contentBlock);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Get a specific content block by ID (temporarily no auth for development)
  app.get("/api/content-blocks/:id", async (req, res) => {
    // Temporarily removed auth checks for development testing
    // if (!req.isAuthenticated()) {
    //   return res.status(401).json({ message: "Unauthorized" });
    // }
    
    // if (req.user?.role !== "admin" && req.user?.role !== "owner") {
    //   return res.status(403).json({ message: "Forbidden - Admin access required" });
    // }
    
    const contentBlockId = parseInt(req.params.id);
    if (isNaN(contentBlockId)) {
      return res.status(400).json({ message: "Invalid content block ID" });
    }
    
    try {
      const contentBlock = await storage.getContentBlock(contentBlockId);
      
      if (!contentBlock) {
        return res.status(404).json({ message: "Content block not found" });
      }
      
      res.json(contentBlock);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Create a new content block (temporarily no auth for development) 
  app.post("/api/content-blocks", async (req, res) => {
    // Temporarily removed auth checks for development testing
    // if (!req.isAuthenticated()) {
    //   return res.status(401).json({ message: "Unauthorized" });
    // }
    
    // if (req.user?.role !== "admin" && req.user?.role !== "owner") {
    //   return res.status(403).json({ message: "Forbidden - Admin access required" });
    // }
    
    try {
      // Check if a block with this key already exists
      const existingBlock = await storage.getContentBlockByKey(req.body.key);
      if (existingBlock) {
        return res.status(400).json({ message: "A content block with this key already exists" });
      }
      
      // Validate request body
      const validatedData = insertContentBlockSchema.parse(req.body);
      
      // Create the content block
      const contentBlock = await storage.createContentBlock(validatedData);
      
      // Return the created content block
      res.status(201).json(contentBlock);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Update a content block (temporarily no auth for development)
  app.patch("/api/content-blocks/:id", async (req, res) => {
    // Temporarily removed auth checks for development testing
    // if (!req.isAuthenticated()) {
    //   return res.status(401).json({ message: "Unauthorized" });
    // }
    
    // if (req.user?.role !== "admin" && req.user?.role !== "owner") {
    //   return res.status(403).json({ message: "Forbidden - Admin access required" });
    // }
    
    const contentBlockId = parseInt(req.params.id);
    if (isNaN(contentBlockId)) {
      return res.status(400).json({ message: "Invalid content block ID" });
    }
    
    try {
      const contentBlock = await storage.getContentBlock(contentBlockId);
      
      if (!contentBlock) {
        return res.status(404).json({ message: "Content block not found" });
      }
      
      // Only validate fields that are provided in the request body
      const updateData: Partial<InsertContentBlock> = {};
      if (req.body.key !== undefined) updateData.key = req.body.key;
      if (req.body.title !== undefined) updateData.title = req.body.title;
      if (req.body.content !== undefined) updateData.content = req.body.content;
      if (req.body.placement !== undefined) updateData.placement = req.body.placement;
      if (req.body.active !== undefined) updateData.active = req.body.active;
      if (req.body.metaData !== undefined) updateData.metaData = req.body.metaData;
      
      // If changing the key, make sure it's still unique
      if (updateData.key && updateData.key !== contentBlock.key) {
        const existingBlock = await storage.getContentBlockByKey(updateData.key);
        if (existingBlock) {
          return res.status(400).json({ message: "A content block with this key already exists" });
        }
      }
      
      const updatedContentBlock = await storage.updateContentBlock(contentBlockId, updateData);
      
      res.json(updatedContentBlock);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Delete a content block (temporarily no auth for development)
  app.delete("/api/content-blocks/:id", async (req, res) => {
    // Temporarily removed auth checks for development testing
    // if (!req.isAuthenticated()) {
    //   return res.status(401).json({ message: "Unauthorized" });
    // }
    
    // if (req.user?.role !== "admin" && req.user?.role !== "owner") {
    //   return res.status(403).json({ message: "Forbidden - Admin access required" });
    // }
    
    const contentBlockId = parseInt(req.params.id);
    if (isNaN(contentBlockId)) {
      return res.status(400).json({ message: "Invalid content block ID" });
    }
    
    try {
      const contentBlock = await storage.getContentBlock(contentBlockId);
      
      if (!contentBlock) {
        return res.status(404).json({ message: "Content block not found" });
      }
      
      await storage.deleteContentBlock(contentBlockId);
      res.status(200).json({ message: "Content block deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Routes registered successfully - no server creation needed for Vercel
}
