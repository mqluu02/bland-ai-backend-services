import { cors } from 'hono/cors';

/**
 * CORS middleware configuration
 */
export const corsMiddleware = cors({
  origin: '*',
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
  credentials: true,
}); 