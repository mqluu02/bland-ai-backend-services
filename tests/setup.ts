/**
 * Jest setup file for Cloudflare Workers testing environment
 */

// Mock environment variables for testing
process.env.OPENAI_API_KEY = 'test-openai-key';
process.env.BLAND_AI_API_KEY = 'test-bland-ai-key';
process.env.RESOS_API_KEY = 'test-resos-key';
process.env.API_BEARER_TOKEN = 'test-bearer-token';
process.env.ADMIN_USERNAME = 'admin';
process.env.ADMIN_PASSWORD = 'test-password';
process.env.DEFAULT_TIMEZONE = 'America/Edmonton';
process.env.DEFAULT_PHONE_NUMBER = '+15875012618';
process.env.NODE_ENV = 'test'; 