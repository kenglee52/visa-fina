/**
 * Environment Configuration
 * Supports development, production, and test environments
 */

const config = {
  development: {
    API_BASE_URL: 'http://192.168.100.41:8001',
    API_TIMEOUT: 30000,
    ENABLE_LOGGING: true,
    ENABLE_DEVTOOLS: true,
  },
  production: {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.production.com',
    API_TIMEOUT: 30000,
    ENABLE_LOGGING: false,
    ENABLE_DEVTOOLS: false,
  },
  test: {
    API_BASE_URL: 'http://localhost:3001',
    API_TIMEOUT: 10000,
    ENABLE_LOGGING: true,
    ENABLE_DEVTOOLS: true,
  },
};

const env = import.meta.env.MODE || 'development';
const currentConfig = config[env] || config.development;

export default currentConfig;

export const API_BASE_URL = currentConfig.API_BASE_URL;
export const API_TIMEOUT = currentConfig.API_TIMEOUT;
export const ENABLE_LOGGING = currentConfig.ENABLE_LOGGING;
export const ENABLE_DEVTOOLS = currentConfig.ENABLE_DEVTOOLS;
