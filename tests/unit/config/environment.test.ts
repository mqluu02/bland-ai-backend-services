import { getEnvironmentConfig, defaultConfig } from '../../../src/config/environment';

describe('Environment Configuration', () => {
  describe('getEnvironmentConfig', () => {
    const validEnv = {
      OPENAI_API_KEY: 'test-openai-key',
      BLAND_AI_API_KEY: 'test-bland-key',
      RESOS_API_KEY: 'test-resos-key',
      API_BEARER_TOKEN: 'test-bearer-token',
      ADMIN_PASSWORD: 'test-password',
    };

    it('should validate and return valid environment config', () => {
      const config = getEnvironmentConfig(validEnv);
      
      expect(config.OPENAI_API_KEY).toBe('test-openai-key');
      expect(config.BLAND_AI_API_KEY).toBe('test-bland-key');
      expect(config.RESOS_API_KEY).toBe('test-resos-key');
      expect(config.API_BEARER_TOKEN).toBe('test-bearer-token');
      expect(config.ADMIN_PASSWORD).toBe('test-password');
    });

    it('should apply default values for optional fields', () => {
      const config = getEnvironmentConfig(validEnv);
      
      expect(config.DEFAULT_TIMEZONE).toBe('America/Edmonton');
      expect(config.DEFAULT_PHONE_NUMBER).toBe('+15875012618');
      expect(config.NODE_ENV).toBe('development');
      expect(config.ADMIN_USERNAME).toBe('admin');
    });

    it('should throw error for missing required environment variables', () => {
      const invalidEnv = {
        OPENAI_API_KEY: 'test-key',
        // Missing required fields
      };

      expect(() => getEnvironmentConfig(invalidEnv)).toThrow();
    });

    it('should handle custom values for optional fields', () => {
      const customEnv = {
        ...validEnv,
        DEFAULT_TIMEZONE: 'UTC',
        DEFAULT_PHONE_NUMBER: '+19999999999',
        NODE_ENV: 'production' as const,
        ADMIN_USERNAME: 'superadmin',
      };

      const config = getEnvironmentConfig(customEnv);
      
      expect(config.DEFAULT_TIMEZONE).toBe('UTC');
      expect(config.DEFAULT_PHONE_NUMBER).toBe('+19999999999');
      expect(config.NODE_ENV).toBe('production');
      expect(config.ADMIN_USERNAME).toBe('superadmin');
    });

    it('should validate NODE_ENV enum values', () => {
      const invalidNodeEnv = {
        ...validEnv,
        NODE_ENV: 'invalid',
      };

      expect(() => getEnvironmentConfig(invalidNodeEnv)).toThrow();
    });
  });

  describe('defaultConfig', () => {
    it('should contain expected default values', () => {
      expect(defaultConfig.DEFAULT_TIMEZONE).toBe('America/Edmonton');
      expect(defaultConfig.DEFAULT_PHONE_NUMBER).toBe('+15875012618');
      expect(defaultConfig.NODE_ENV).toBe('development');
      expect(defaultConfig.ADMIN_USERNAME).toBe('admin');
    });
  });
}); 