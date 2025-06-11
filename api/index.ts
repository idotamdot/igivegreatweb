import express from 'express';
import { registerRoutes } from '../server/routes';
import { createTables } from '../server/neon';

const app = express();

async function initializeApp() {
  // Initialize database tables
  await createTables();
  
  // Register all routes
  await registerRoutes(app);
}

// Initialize the app
initializeApp().catch(console.error);

export default app;