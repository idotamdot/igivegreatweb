// Type declarations to fix Vite server configuration compatibility
import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';

declare module 'vite' {
  interface ServerOptions {
    middlewareMode?: boolean;
    hmr?: {
      server?: HttpServer | HttpsServer;
    };
    allowedHosts?: true | string[] | undefined;
  }
}

// Global type overrides for server compatibility
declare global {
  namespace NodeJS {
    interface Global {
      setupVite: (app: any, server: HttpServer | HttpsServer) => Promise<void>;
    }
  }
}

export {};