import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertConnectionSchema, 
  insertMenuLinkSchema, 
  type InsertMenuLink
} from "@shared/schema";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

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

export async function registerRoutes(app: Express): Promise<Server> {
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
  app.get("/api/menu-links", (req, res) => {
    storage.getAllMenuLinks()
      .then(menuLinks => res.json(menuLinks))
      .catch(error => res.status(500).json({ message: error.message }));
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
      
      res.json(menuLink);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // API endpoint to create a new menu link (protected, only for owner)
  app.post("/api/menu-links", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user?.role !== "owner") {
      return res.status(403).json({ message: "Forbidden - Owner access required" });
    }
    
    try {
      // Validate request body
      const validatedData = insertMenuLinkSchema.parse(req.body);
      
      // Create the menu link
      const menuLink = await storage.createMenuLink(validatedData);
      
      // Return the created menu link
      res.status(201).json(menuLink);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // API endpoint to update a menu link (protected, only for owner)
  app.patch("/api/menu-links/:id", async (req, res) => {
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
      const menuLink = await storage.getMenuLink(menuLinkId);
      
      if (!menuLink) {
        return res.status(404).json({ message: "Menu link not found" });
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
      
      const updatedMenuLink = await storage.updateMenuLink(menuLinkId, updateData);
      
      res.json(updatedMenuLink);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // API endpoint to delete a menu link (protected, only for owner)
  app.delete("/api/menu-links/:id", async (req, res) => {
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
      const menuLink = await storage.getMenuLink(menuLinkId);
      
      if (!menuLink) {
        return res.status(404).json({ message: "Menu link not found" });
      }
      
      await storage.deleteMenuLink(menuLinkId);
      res.status(200).json({ message: "Menu link deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // API endpoint to update menu link images (protected, only for owner)
  app.post("/api/menu-links/:id/images", async (req, res) => {
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
      const menuLink = await storage.getMenuLink(menuLinkId);
      
      if (!menuLink) {
        return res.status(404).json({ message: "Menu link not found" });
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
  
  // API endpoint to delete an image from menu link (protected, only for owner)
  app.delete("/api/menu-links/:id/images/:imageIndex", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user?.role !== "owner") {
      return res.status(403).json({ message: "Forbidden - Owner access required" });
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

  const httpServer = createServer(app);
  return httpServer;
}
