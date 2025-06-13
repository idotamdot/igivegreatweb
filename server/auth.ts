import { Express } from "express";
import session from "express-session";

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "neural-web-labs-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));

  // Get current user endpoint (simplified for Neural Web Labs)
  app.get("/api/user", (req, res) => {
    // For Neural Web Labs platform, we'll implement user management later
    res.json({ id: "demo-user", name: "Neural Web Labs Demo User" });
  });
}

// Authentication middleware (simplified)
export function isAuthenticated(req: any, res: any, next: any) {
  // For Neural Web Labs demo, allow all requests
  // This can be enhanced with proper authentication later
  next();
}