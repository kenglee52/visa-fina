const db = require('../../config/connect_DB');
const { SUCCESS_MESSAGES, ERROR_MESSAGES } = require('../../config/constants');
const { success, created, notFound, conflict, serverError } = require('../../utils/response');
const logger = require('../../utils/logger');

/**
 * Get all provinces
 */
exports.getProvinces = (req, res) => {
  db.query('SELECT id, name FROM provinces ORDER BY name', (err, results) => {
    if (err) {
      logger.error('Error retrieving provinces:', err);
      return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
    }
    return success(res, SUCCESS_MESSAGES.PROVINCES_FETCHED, { provinces: results || [] });
  });
};

/**
 * Create a new province
 */
exports.createProvince = (req, res) => {
  const { name } = req.body;
  const trimmedName = name.trim();

  // Check for existing province
  db.query('SELECT id FROM provinces WHERE name = ?', [trimmedName], (err, results) => {
    if (err) {
      logger.error('Error checking province:', err);
      return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
    }
    if (results.length > 0) {
      return conflict(res, ERROR_MESSAGES.PROVINCE_NAME_EXISTS);
    }

    // Insert new province
    db.query('INSERT INTO provinces (name) VALUES (?)', [trimmedName], (err) => {
      if (err) {
        logger.error('Error creating province:', err);
        return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
      }
      return created(res, SUCCESS_MESSAGES.PROVINCE_CREATED);
    });
  });
};

/**
 * Update a province
 */
exports.updateProvince = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const trimmedName = name.trim();

  // Check if province exists
  db.query('SELECT id FROM provinces WHERE id = ?', [id], (err, results) => {
    if (err) {
      logger.error('Error checking province:', err);
      return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
    }
    if (results.length === 0) {
      return notFound(res, ERROR_MESSAGES.PROVINCE_NOT_FOUND);
    }

    // Check for duplicate name
    db.query('SELECT id FROM provinces WHERE name = ? AND id != ?', [trimmedName, id], (err, results) => {
      if (err) {
        logger.error('Error checking duplicate province:', err);
        return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
      }
      if (results.length > 0) {
        return conflict(res, ERROR_MESSAGES.PROVINCE_NAME_EXISTS);
      }

      // Update province
      db.query('UPDATE provinces SET name = ? WHERE id = ?', [trimmedName, id], (err) => {
        if (err) {
          logger.error('Error updating province:', err);
          return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
        }
        return success(res, SUCCESS_MESSAGES.PROVINCE_UPDATED);
      });
    });
  });
};

/**
 * Delete a province
 */
exports.deleteProvince = (req, res) => {
  const { id } = req.params;

  // Check if province exists
  db.query('SELECT id FROM provinces WHERE id = ?', [id], (err, results) => {
    if (err) {
      logger.error('Error checking province:', err);
      return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
    }
    if (results.length === 0) {
      return notFound(res, ERROR_MESSAGES.PROVINCE_NOT_FOUND);
    }

    // Delete province
    db.query('DELETE FROM provinces WHERE id = ?', [id], (err) => {
      if (err) {
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
          return conflict(res, ERROR_MESSAGES.CANNOT_DELETE_REFERENCED);
        }
        logger.error('Error deleting province:', err);
        return serverError(res, ERROR_MESSAGES.SERVER_ERROR);
      }
      return success(res, SUCCESS_MESSAGES.PROVINCE_DELETED);
    });
  });
};
