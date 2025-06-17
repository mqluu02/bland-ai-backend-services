import { z } from 'zod';

const envSchema = z.object({
  // API Keys
  OPENAI_API_KEY: z.string().min(1, 'OpenAI API key is required'),
  BLAND_AI_API_KEY: z.string().min(1, 'Bland AI API key is required'),
  RESOS_API_KEY: z.string().min(1, 'ResOS API key is required'),
  
  // Authentication
  API_BEARER_TOKEN: z.string().min(1, 'API bearer token is required'),
  ADMIN_USERNAME: z.string().default('admin'),
  ADMIN_PASSWORD: z.string().min(1, 'Admin password is required'),
  
  // Application Settings
  DEFAULT_TIMEZONE: z.string().default('America/Edmonton'),
  DEFAULT_PHONE_NUMBER: z.string().default('+15875012618'),
  
  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Optional
  SUPABASE_URL: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
});

export type Environment = z.infer<typeof envSchema>;

/**
 * Validates and returns the environment configuration
 * In Cloudflare Workers, environment variables are passed via the env object
 */
export function getEnvironmentConfig(env: Record<string, unknown>): Environment {
  try {
    return envSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => err.path.join('.')).join(', ');
      throw new Error(`Invalid environment configuration. Missing or invalid: ${missingVars}`);
    }
    throw error;
  }
}

/**
 * Default configuration for development/testing
 */
export const defaultConfig: Partial<Environment> = {
  DEFAULT_TIMEZONE: 'America/Edmonton',
  DEFAULT_PHONE_NUMBER: '+15875012618',
  NODE_ENV: 'development',
  ADMIN_USERNAME: 'admin',
}; 