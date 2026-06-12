const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/connect_DB');
const { ROLES, SUCCESS_MESSAGES, ERROR_MESSAGES } = require('../config/constants');
const { success, created, badRequest, unauthorized, serverError } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * Register a new employee (data_entry or verifier)
 */
exports.register = async (req, res) => {
  try {
    const { id, name, last_name, role, password } = req.body;

    logger.debug('Register request:', { id, name, last_name, role });

    if (!id || !name || !last_name || !role || !password) {
      return badRequest(res, ERROR_MESSAGES.MISSING_FIELDS);
    }

    if (!Object.values(ROLES).includes(role)) {
      return badRequest(res, ERROR_MESSAGES.INVALID_ROLE);
    }

    const checkQuery = 'SELECT * FROM employees WHERE id = ? OR name = ?';
    db.query(checkQuery, [id, name], async (err, results) => {
      if (err) {
        logger.error('Error checking employee:', err);
        return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
      }
      if (results.length > 0) {
        return badRequest(res, ERROR_MESSAGES.ALREADY_EXISTS);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const insertQuery = 'INSERT INTO employees (id, name, last_name, role, password) VALUES (?, ?, ?, ?, ?)';

      db.query(insertQuery, [id, name, last_name, role, hashedPassword], (err, result) => {
        if (err) {
          logger.error('Error registering employee:', err);
          return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
        }
        return created(res, SUCCESS_MESSAGES.EMPLOYEE_REGISTERED, {
          employee: { id, name, last_name, role }
        });
      });
    });
  } catch (err) {
    logger.error('Error during registration:', err);
    return serverError(res, ERROR_MESSAGES.SERVER_ERROR);
  }
};

/**
 * Login employee
 */
exports.login = async (req, res) => {
  try {
    const { id, password } = req.body;

    logger.debug('Login request:', { id });

    if (!id || !password) {
      return badRequest(res, 'Please provide employee ID and password');
    }

    if (!process.env.SECRET) {
      logger.error('JWT secret is not defined');
      return serverError(res, ERROR_MESSAGES.SERVER_ERROR);
    }

    const loginQuery = 'SELECT * FROM employees WHERE id = ?';
    db.query(loginQuery, [id], async (err, results) => {
      if (err) {
        logger.error('Error during login:', err);
        return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
      }

      if (results.length === 0) {
        return badRequest(res, ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      const employee = results[0];
      const isMatch = await bcrypt.compare(password, employee.password);

      if (!isMatch) {
        logger.warn('Failed login attempt for employee:', { id });
        return badRequest(res, ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      try {
        const token = jwt.sign(
          { id: employee.id, name: employee.name, role: employee.role },
          process.env.SECRET,
          { expiresIn: '5h' }
        );

        logger.info('Employee logged in successfully:', { id: employee.id });
        return success(res, SUCCESS_MESSAGES.LOGIN_SUCCESS, {
          token,
          employee: {
            id: employee.id,
            name: employee.name,
            last_name: employee.last_name,
            role: employee.role
          }
        });
      } catch (jwtErr) {
        logger.error('Error signing JWT:', jwtErr);
        return serverError(res, 'Error generating token');
      }
    });
  } catch (err) {
    logger.error('Error during login:', err);
    return serverError(res, ERROR_MESSAGES.SERVER_ERROR);
  }
};

/**
 * Get current authenticated user
 */
exports.currentUser = (req, res) => {
  try {
    const { id } = req.user;
    const query = 'SELECT id, name, last_name, email, role FROM employees WHERE id = ?';

    db.query(query, [id], (err, results) => {
      if (err) {
        logger.error('Error retrieving current user:', err);
        return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
      }
      if (results.length === 0) {
        return notFound(res, ERROR_MESSAGES.EMPLOYEE_NOT_FOUND);
      }

      const employee = results[0];
      return success(res, SUCCESS_MESSAGES.CURRENT_USER_FETCHED, {
        employee: {
          id: employee.id,
          name: employee.name,
          last_name: employee.last_name,
          email: employee.email,
          role: employee.role
        }
      });
    });
  } catch (err) {
    logger.error('Error retrieving current user:', err);
    return serverError(res, ERROR_MESSAGES.SERVER_ERROR);
  }
};
