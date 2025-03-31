import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertConnectionSchema, insertMenuLinkSchema, type InsertMenuLink } from "@shared/schema";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
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

  const httpServer = createServer(app);
  return httpServer;
}
