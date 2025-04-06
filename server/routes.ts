import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertConnectionSchema, 
  insertMenuLinkSchema, 
  insertArtworkSchema,
  insertPrintSizeSchema,
  insertArtworkPrintSizeSchema,
  insertPrintOrderSchema,
  type InsertMenuLink,
  type InsertArtwork,
  type InsertPrintSize,
  type InsertArtworkPrintSize,
  type InsertPrintOrder,
} from "@shared/schema";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
    storage.getAllArtworks()
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

  // API endpoint to delete an artwork (protected, admin access required)
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
      
      await storage.deleteArtwork(artworkId);
      res.status(200).json({ message: "Artwork deleted successfully" });
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

  const httpServer = createServer(app);
  return httpServer;
}
