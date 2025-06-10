import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

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
    // Register API routes
    const server = await registerRoutes(app);
    
    // Setup Vite in development or serve static files in production
    if (process.env.NODE_ENV === "production") {
      serveStatic(app);
    } else {
      await setupVite(app, server);
    }

    // Start the server
    server.listen(port, "0.0.0.0", () => {
      log(`serving on port ${port}`);
    });

  } catch (error) {
    log(`Failed to start server: ${error}`, "error");
    process.exit(1);
  }
}

main();