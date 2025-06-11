// Type declarations to fix Vite server configuration compatibility
import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';

declare module 'vite' {
  interface ServerOptions {
    middlewareMode?: boolean | 'ssr' | 'html';
    hmr?: boolean | {
      server?: HttpServer | HttpsServer;
      port?: number;
      host?: string;
      overlay?: boolean;
    };
    allowedHosts?: true | string[];
  }
  
  interface InlineConfig {
    server?: ServerOptions;
  }
}

// Extend the setupVite function type to accept HTTP servers
declare global {
  namespace Express {
    interface Application {}
  }
}

export {};