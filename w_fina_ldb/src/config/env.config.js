/**
 * Environment Configuration
 * Supports development, production, and test environments
 */

const config = {
  development: {
    // API_BASE_URL: 'http://localhost:8001',
    API_BASE_URL: 'http://10.0.200.107:8002',
    API_TIMEOUT: 30000,
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
