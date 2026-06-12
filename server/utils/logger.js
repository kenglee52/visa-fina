/**
 * Logger Utility
 * Centralized logging for the application
 */

const logger = {
  /**
   * Log informational messages
   * @param {string} message - The message to log
   * @param {object} meta - Additional metadata to log
   */
  info: (message, meta = {}) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[INFO] ${new Date().toISOString()} - ${message}`, Object.keys(meta).length > 0 ? meta : '');
    }
  },

  /**
   * Log error messages
   * @param {string} message - The error message
   * @param {Error|object} error - The error object or details
   */
  error: (message, error = {}) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
  },

  /**
   * Log warning messages
   * @param {string} message - The warning message
   * @param {object} meta - Additional metadata to log
   */
  warn: (message, meta = {}) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, Object.keys(meta).length > 0 ? meta : '');
  },

  /**
   * Log debug messages (only in development)
   * @param {string} message - The debug message
   * @param {object} meta - Additional metadata to log
   */
  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, Object.keys(meta).length > 0 ? meta : '');
    }
  }
};

module.exports = logger;
