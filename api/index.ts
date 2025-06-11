import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import serverlessExpress from "serverless-http";
import { registerRoutes } from "../server/routes";

let handler: any = null;

// Initialize app and routes
async function initializeApp() {
  if (handler) return handler;
  
  // Create Express app
  const app = express();
  
  // Parse JSON bodies
  app.use(express.json());
  
  // Trust proxy for secure headers
  app.set('trust proxy', 1);
  
  try {
    // Register all routes and wait for completion
    await registerRoutes(app);
    console.log("Routes registered successfully");
    
    // Create serverless handler after routes are registered
    handler = serverlessExpress(app);
    return handler;
  } catch (error) {
    console.error("Failed to register routes:", error);
    throw error;
  }
}

// Export the handler for Vercel
export default async function(req: VercelRequest, res: VercelResponse) {
  try {
    // Check required environment variables
    const requiredEnvVars = ['DATABASE_URL', 'SESSION_SECRET'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error("Missing required environment variables:", missingVars);
      return res.status(500).json({ 
        error: "Configuration Error",
        message: `Missing environment variables: ${missingVars.join(', ')}`
      });
    }

    const appHandler = await initializeApp();
    return appHandler(req, res);
  } catch (error) {
    console.error("Server initialization error:", error);
    return res.status(500).json({ 
      error: "Internal Server Error",
      message: error instanceof Error ? error.message : "Failed to initialize server"
    });
  }
}