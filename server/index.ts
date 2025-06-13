import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { createServer as createHttpServer } from "http";
import { createServer as createHttpsServer } from "https";
/// <reference path="./vite-types.d.ts" />

const app = express();
const port = process.env.PORT || 5000;

// Trust proxy for secure headers in production
app.set('trust proxy', 1);

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";
  
  log(`Error ${status}: ${message}`, "error");
  res.status(status).json({ message });
});

async function main() {
  try {
    // In development, create separate API server to bypass Vite middleware
    if (process.env.NODE_ENV !== "production") {
      // Create dedicated API server on port 3001
      const apiApp = express();
      apiApp.set('trust proxy', 1);
      
      // Enable CORS for cross-origin requests from frontend
      apiApp.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', 'http://localhost:5000');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        
        if (req.method === 'OPTIONS') {
          res.sendStatus(200);
        } else {
          next();
        }
      });
      
      apiApp.use(express.json());
      apiApp.use(express.urlencoded({ extended: true }));
      
      // Register API routes on dedicated server
      await registerRoutes(apiApp);
      
      const apiServer = createHttpServer(apiApp);
      apiServer.listen(3001, "0.0.0.0", () => {
        log(`API server running on port 3001`);
      });
    }
    
    // Register API routes on main server too (for production)
    await registerRoutes(app);
    
    // Create HTTP server
    const server = createHttpServer(app);
    
    // Setup Vite in development or serve static files in production
    if (process.env.NODE_ENV === "production") {
      serveStatic(app);
    } else {
      await setupVite(app, server as any);
    }

    // Start the main server
    server.listen(Number(port), "0.0.0.0", () => {
      log(`serving on port ${port}`);
    });

  } catch (error) {
    log(`Failed to start server: ${error}`, "error");
    process.exit(1);
  }
}

main();