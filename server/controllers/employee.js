const db = require('../config/connect_DB');
const bcrypt = require('bcrypt');
const { SUCCESS_MESSAGES, ERROR_MESSAGES } = require('../config/constants');
const { success, created, notFound, conflict, serverError, badRequest } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * Get all employees
 */
exports.getEmployees = (req, res) => {
  db.query('SELECT id, name, last_name, email, role FROM employees', (err, results) => {
    if (err) {
      logger.error('Error retrieving employees:', err);
      return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
    }
    return success(res, SUCCESS_MESSAGES.EMPLOYEES_FETCHED, { employees: results });
  });
};

/**
 * Create a new employee with hashed password
 */
exports.createEmployee = async (req, res) => {
  try {
    const { id, name, last_name, email, role, password } = req.body;

    if (!id || !name || !last_name || !email || !role || !password) {
      return badRequest(res, ERROR_MESSAGES.MISSING_FIELDS);
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedId = id.toString().trim();

    // Check for existing ID or email
    db.query('SELECT id, email FROM employees WHERE id = ? OR email = ?', [trimmedId, trimmedEmail], async (err, results) => {
      if (err) {
        logger.error('Error checking ID or email:', err);
        return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
      }
      if (results.some(row => row.id.toString() === trimmedId)) {
        return conflict(res, ERROR_MESSAGES.ID_ALREADY_EXISTS);
      }
      if (results.some(row => row.email === trimmedEmail)) {
        return conflict(res, ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new employee
      db.query(
        'INSERT INTO employees (id, name, last_name, email, role, password) VALUES (?, ?, ?, ?, ?, ?)',
        [trimmedId, name.trim(), last_name.trim(), trimmedEmail, role.trim(), hashedPassword],
        (err) => {
          if (err) {
            logger.error('Error creating employee:', err);
            return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
          }
          return created(res, SUCCESS_MESSAGES.EMPLOYEE_CREATED);
        }
      );
    });
  } catch (error) {
    logger.error('Error in createEmployee:', error);
    return serverError(res, ERROR_MESSAGES.SERVER_ERROR);
  }
};

/**
 * Update an employee
 */
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, last_name, email, role, password } = req.body;

    if (!name || !last_name || !email || !role) {
      return badRequest(res, 'Name, last_name, email, and role are required');
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check for existing email (exclude self)
    db.query('SELECT id FROM employees WHERE email = ? AND id != ?', [trimmedEmail, id], async (err, results) => {
      if (err) {
        logger.error('Error checking email:', err);
        return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
      }
      if (results.length > 0) {
        return conflict(res, ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
      }

      // Update employee
      const updateFields = [name.trim(), last_name.trim(), trimmedEmail, role.trim()];
      let sql = 'UPDATE employees SET name = ?, last_name = ?, email = ?, role = ?';

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        sql += ', password = ?';
        updateFields.push(hashedPassword);
      }

      sql += ' WHERE id = ?';
      updateFields.push(id);

      db.query(sql, updateFields, (err, result) => {
        if (err) {
          logger.error('Error updating employee:', err);
          return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
        }
        if (result.affectedRows === 0) {
          return notFound(res, ERROR_MESSAGES.EMPLOYEE_NOT_FOUND);
        }
        return success(res, SUCCESS_MESSAGES.EMPLOYEE_UPDATED);
      });
    });
  } catch (error) {
    logger.error('Error in updateEmployee:', error);
    return serverError(res, ERROR_MESSAGES.SERVER_ERROR);
  }
};

/**
 * Delete an employee
 */
exports.deleteEmployee = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM employees WHERE id = ?', [id], (err, result) => {
    if (err) {
      logger.error('Error deleting employee:', err);
      return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
    }
    if (result.affectedRows === 0) {
      return notFound(res, ERROR_MESSAGES.EMPLOYEE_NOT_FOUND);
    }
    return success(res, SUCCESS_MESSAGES.EMPLOYEE_DELETED);
  });
};
