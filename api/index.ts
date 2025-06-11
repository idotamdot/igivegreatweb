import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { registerRoutes } from '../server/routes';
import { createTables } from '../server/neon';

let app: express.Express;

async function initializeApp() {
  if (!app) {
    app = express();
    
    // Initialize database tables
    await createTables();
    
    // Register all routes
    await registerRoutes(app);
  }
  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const expressApp = await initializeApp();
  return expressApp(req, res);
}