import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertConnectionSchema, 
  insertMenuLinkSchema, 
  insertAgreementSchema,
  insertUserAgreementSchema,
  type InsertMenuLink,
  type InsertAgreement,
  type InsertUserAgreement 
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

  // API endpoint to get all agreements
  app.get("/api/agreements", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    storage.getAllAgreements()
      .then(agreements => res.json(agreements))
      .catch(error => res.status(500).json({ message: error.message }));
  });

  // API endpoint to get active agreements
  app.get("/api/agreements/active", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    storage.getActiveAgreements()
      .then(agreements => res.json(agreements))
      .catch(error => res.status(500).json({ message: error.message }));
  });

  // API endpoint to get a specific agreement
  app.get("/api/agreements/:id", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const agreementId = parseInt(req.params.id);
    if (isNaN(agreementId)) {
      return res.status(400).json({ message: "Invalid agreement ID" });
    }
    
    storage.getAgreement(agreementId)
      .then(agreement => {
        if (!agreement) {
          return res.status(404).json({ message: "Agreement not found" });
        }
        res.json(agreement);
      })
      .catch(error => res.status(500).json({ message: error.message }));
  });

  // API endpoint to create a new agreement (protected, only for owner)
  app.post("/api/agreements", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user?.role !== "owner") {
      return res.status(403).json({ message: "Forbidden - Owner access required" });
    }
    
    try {
      // Validate request body
      const validatedData = insertAgreementSchema.parse(req.body);
      
      // Create the agreement
      const agreement = await storage.createAgreement(validatedData);
      
      // Return the created agreement
      res.status(201).json(agreement);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // API endpoint to update an agreement (protected, only for owner)
  app.patch("/api/agreements/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user?.role !== "owner") {
      return res.status(403).json({ message: "Forbidden - Owner access required" });
    }
    
    const agreementId = parseInt(req.params.id);
    if (isNaN(agreementId)) {
      return res.status(400).json({ message: "Invalid agreement ID" });
    }
    
    try {
      const agreement = await storage.getAgreement(agreementId);
      
      if (!agreement) {
        return res.status(404).json({ message: "Agreement not found" });
      }
      
      // Only validate fields that are provided in the request body
      const updateData: Partial<InsertAgreement> = {};
      if (req.body.title !== undefined) updateData.title = req.body.title;
      if (req.body.content !== undefined) updateData.content = req.body.content;
      if (req.body.version !== undefined) updateData.version = req.body.version;
      if (req.body.active !== undefined) updateData.active = req.body.active;
      
      const updatedAgreement = await storage.updateAgreement(agreementId, updateData);
      
      res.json(updatedAgreement);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // API endpoint to delete an agreement (protected, only for owner)
  app.delete("/api/agreements/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user?.role !== "owner") {
      return res.status(403).json({ message: "Forbidden - Owner access required" });
    }
    
    const agreementId = parseInt(req.params.id);
    if (isNaN(agreementId)) {
      return res.status(400).json({ message: "Invalid agreement ID" });
    }
    
    try {
      const agreement = await storage.getAgreement(agreementId);
      
      if (!agreement) {
        return res.status(404).json({ message: "Agreement not found" });
      }
      
      await storage.deleteAgreement(agreementId);
      res.status(200).json({ message: "Agreement deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // API endpoint to get user-agreement relationships for a user
  app.get("/api/user-agreements/user/:userId", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    storage.getUserAgreements(userId)
      .then(userAgreements => res.json(userAgreements))
      .catch(error => res.status(500).json({ message: error.message }));
  });

  // API endpoint to get user-agreement relationships for an agreement
  app.get("/api/user-agreements/agreement/:agreementId", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const agreementId = parseInt(req.params.agreementId);
    if (isNaN(agreementId)) {
      return res.status(400).json({ message: "Invalid agreement ID" });
    }
    
    storage.getAgreementUsers(agreementId)
      .then(userAgreements => res.json(userAgreements))
      .catch(error => res.status(500).json({ message: error.message }));
  });

  // API endpoint to create a user-agreement relationship
  app.post("/api/user-agreements", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (req.user?.role !== "owner") {
      return res.status(403).json({ message: "Forbidden - Owner access required" });
    }
    
    try {
      // Validate request body
      const validatedData = insertUserAgreementSchema.parse(req.body);
      
      // Check if the user exists
      const user = await storage.getUser(validatedData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if the agreement exists
      const agreement = await storage.getAgreement(validatedData.agreementId);
      if (!agreement) {
        return res.status(404).json({ message: "Agreement not found" });
      }
      
      // Check if the user-agreement relationship already exists
      const existingUserAgreement = await storage.getUserAgreement(
        validatedData.userId, 
        validatedData.agreementId
      );
      
      if (existingUserAgreement) {
        return res.status(400).json({ message: "User-agreement relationship already exists" });
      }
      
      // Create the user-agreement relationship
      const userAgreement = await storage.createUserAgreement(validatedData);
      
      // Return the created user-agreement relationship
      res.status(201).json(userAgreement);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // API endpoint to update a user-agreement relationship (sign agreement)
  app.patch("/api/user-agreements/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userAgreementId = parseInt(req.params.id);
    if (isNaN(userAgreementId)) {
      return res.status(400).json({ message: "Invalid user-agreement ID" });
    }
    
    try {
      // Get user agreement by ID
      let foundUserAgreement = null;
      const userAgreements = await storage.getUserAgreements(req.user.id);
      for (const ua of userAgreements) {
        if (ua.id === userAgreementId) {
          foundUserAgreement = ua;
          break;
        }
      }
      
      // If not found and user is owner, check all user agreements
      if (!foundUserAgreement && req.user.role === "owner") {
        const allUsers = await storage.getAllUsers();
        for (const user of allUsers) {
          const agreements = await storage.getUserAgreements(user.id);
          for (const ua of agreements) {
            if (ua.id === userAgreementId) {
              foundUserAgreement = ua;
              break;
            }
          }
          if (foundUserAgreement) break;
        }
      }
      
      const userAgreement = foundUserAgreement;
      
      if (!userAgreement) {
        return res.status(404).json({ message: "User-agreement relationship not found" });
      }
      
      // Only allow users to sign their own agreements or owner to sign any agreement
      if (req.user?.id !== userAgreement.userId && req.user?.role !== "owner") {
        return res.status(403).json({ 
          message: "You can only sign your own agreements unless you're the owner" 
        });
      }
      
      // Update the user-agreement relationship
      const { signed } = req.body;
      if (typeof signed !== "boolean") {
        return res.status(400).json({ message: "Signed status must be a boolean" });
      }
      
      const updatedUserAgreement = await storage.updateUserAgreement(
        userAgreementId, 
        signed, 
        signed ? new Date() : undefined
      );
      
      res.json(updatedUserAgreement);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
