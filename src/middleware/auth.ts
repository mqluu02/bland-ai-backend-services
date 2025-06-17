import { bearerAuth } from 'hono/bearer-auth';
import { basicAuth } from 'hono/basic-auth';
import type { Environment } from '@/config/environment';

/**
 * Create bearer token authentication middleware
 */
export function createBearerAuth(config: Environment) {
  return bearerAuth({ token: config.API_BEARER_TOKEN });
}

/**
 * Create basic authentication middleware
 */
export function createBasicAuth(config: Environment) {
  return basicAuth({
    username: config.ADMIN_USERNAME,
    password: config.ADMIN_PASSWORD,
  });
} 