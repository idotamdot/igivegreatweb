// api/index.ts

import express, { Request, Response, NextFunction } from 'express';
import { VercelRequest, VercelResponse } from '@vercel/node';
import serverless from 'serverless-http';

const app = express();

// Middleware for logging
app.use((req: Request, res: Response, next: NextFunction) => {
	const start = Date.now();
	const path = req.path;
	let capturedJsonResponse: Record<string, any> | undefined;

	const originalResJson = res.json;
	res.json = function (bodyJson, ...args) {
		capturedJsonResponse = bodyJson;
		return originalResJson.apply(res, [bodyJson, ...args]);
	};

	res.on('finish', () => {
		const duration = Date.now() - start;
		if (path.startsWith('/api')) {
			let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
			if (capturedJsonResponse) {
				logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
			}
			if (logLine.length > 80) {
				logLine = logLine.slice(0, 79) + '…';
			}
			console.log(logLine);
		}
	});

	next();
});

// Register routes
app.get('/api/hello', (req, res) => {
	res.json({ message: 'Hello from Express on Vercel!' });
});

// Error handler middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
	const status = err.status || 500;
	res.status(status).json({ message: err.message || 'Internal Server Error' });
});

// Vercel handler export
const handler = serverless(app);
export default async function vercelHandler(req: VercelRequest, res: VercelResponse) {
	return handler(req, res);
}
