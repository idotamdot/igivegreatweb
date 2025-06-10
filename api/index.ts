import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import serverlessExpress from "serverless-http";
import { registerRoutes } from "../server/routes";

// Create Express app
const app = express();

// Parse JSON bodies
app.use(express.json());

// Trust proxy for secure headers
app.set('trust proxy', 1);

// Register all routes
registerRoutes(app).then(() => {
  console.log("Routes registered successfully");
}).catch((error) => {
  console.error("Failed to register routes:", error);
});

// Create serverless handler
const handler = serverlessExpress(app);

// Export the handler for Vercel
export default async function(req: VercelRequest, res: VercelResponse) {
  return handler(req, res);
}