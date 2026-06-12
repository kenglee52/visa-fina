const jwt = require('jsonwebtoken');
const db = require('../config/connect_DB');
const { ROLES, ERROR_MESSAGES } = require('../config/constants');
const { unauthorized, forbidden, serverError } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * Authentication check middleware
 * Verifies JWT token and sets req.user
 */
exports.authCheck = (req, res, next) => {
  try {
    const headerToken = req.headers.authorization;
    if (!headerToken) {
      return unauthorized(res, ERROR_MESSAGES.TOKEN_MISSING);
    }

    const token = headerToken.split(' ')[1];
    const decode = jwt.verify(token, process.env.SECRET);
    req.user = decode;

    const query = 'SELECT * FROM employees WHERE id = ?';
    db.query(query, [req.user.id], (err, results) => {
      if (err) {
        logger.error('Error during auth check:', err);
        return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
      }
      if (results.length === 0) {
        return unauthorized(res, ERROR_MESSAGES.EMPLOYEE_NOT_FOUND);
      }
      next();
    });
  } catch (err) {
    logger.error('Error during auth check:', err);
    return unauthorized(res, ERROR_MESSAGES.TOKEN_INVALID);
  }
};

/**
 * Verifier role check middleware
 * Ensures the authenticated user has verifier role
 */
exports.verifierCheck = (req, res, next) => {
  try {
    const { id } = req.user;
    const query = 'SELECT * FROM employees WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        logger.error('Error during verifier check:', err);
        return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
      }
      if (results.length === 0 || results[0].role !== ROLES.VERIFIER) {
        return forbidden(res, ERROR_MESSAGES.FORBIDDEN);
      }
      next();
    });
  } catch (err) {
    logger.error('Error during verifier check:', err);
    return serverError(res, ERROR_MESSAGES.FORBIDDEN);
  }
};

/**
 * Admin role check middleware
 * Ensures the authenticated user has admin role
 */
exports.adminCheck = (req, res, next) => {
  try {
    const { id } = req.user;
    const query = 'SELECT * FROM employees WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) {
        logger.error('Error during admin check:', err);
        return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
      }
      if (results.length === 0 || results[0].role !== ROLES.ADMIN) {
        return forbidden(res, ERROR_MESSAGES.FORBIDDEN);
      }
      next();
    });
  } catch (err) {
    logger.error('Error during admin check:', err);
    return serverError(res, ERROR_MESSAGES.FORBIDDEN);
  }
};

/**
 * Verify token validity
 * Checks if the provided JWT token is valid
 */
exports.verifyToken = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return unauthorized(res, ERROR_MESSAGES.TOKEN_MISSING);
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET || process.env.SECRET);
    return res.status(200).json({ message: 'Token is valid' });
  } catch (err) {
    logger.error('Token verification failed:', err);
    return unauthorized(res, ERROR_MESSAGES.TOKEN_INVALID);
  }
};
