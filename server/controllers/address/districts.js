const db = require('../../config/connect_DB');
const { SUCCESS_MESSAGES, ERROR_MESSAGES } = require('../../config/constants');
const { success, created, notFound, conflict, serverError, badRequest } = require('../../utils/response');
const logger = require('../../utils/logger');

/**
 * Get all districts
 */
exports.getDistricts = (req, res) => {
  db.query('SELECT id, name, province_id FROM districts ORDER BY name', (err, results) => {
    if (err) {
      logger.error('Error retrieving districts:', err);
      return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
    }
    return success(res, SUCCESS_MESSAGES.DISTRICTS_FETCHED, { districts: results });
  });
};

/**
 * Create a new district
 */
exports.createDistrict = (req, res) => {
  const { name, province_id } = req.body;

  if (!name || !province_id) {
    return badRequest(res, 'Name and province_id are required');
  }

  const trimmedName = name.trim();

  db.query('SELECT id FROM districts WHERE name = ? AND province_id = ?', [trimmedName, province_id], (err, results) => {
    if (err) {
      logger.error('Error checking district:', err);
      return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
    }
    if (results.length > 0) {
      return conflict(res, ERROR_MESSAGES.DISTRICT_NAME_EXISTS);
    }

    db.query('INSERT INTO districts (name, province_id) VALUES (?, ?)', [trimmedName, province_id], (err) => {
      if (err) {
        logger.error('Error creating district:', err);
        return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
      }
      return created(res, SUCCESS_MESSAGES.DISTRICT_CREATED);
    });
  });
};

/**
 * Update a district
 */
exports.updateDistrict = (req, res) => {
  const { id } = req.params;
  const { name, province_id } = req.body;

  if (!name || !province_id) {
    return badRequest(res, 'Name and province_id are required');
  }

  const trimmedName = name.trim();

  db.query('SELECT id FROM districts WHERE name = ? AND province_id = ? AND id != ?', [trimmedName, province_id, id], (err, results) => {
    if (err) {
      logger.error('Error checking district:', err);
      return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
    }
    if (results.length > 0) {
      return conflict(res, ERROR_MESSAGES.DISTRICT_NAME_EXISTS);
    }

    db.query('UPDATE districts SET name = ?, province_id = ? WHERE id = ?', [trimmedName, province_id, id], (err, result) => {
      if (err) {
        logger.error('Error updating district:', err);
        return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
      }
      if (result.affectedRows === 0) {
        return notFound(res, ERROR_MESSAGES.DISTRICT_NOT_FOUND);
      }
      return success(res, SUCCESS_MESSAGES.DISTRICT_UPDATED);
    });
  });
};

/**
 * Delete a district
 */
exports.deleteDistrict = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM districts WHERE id = ?', [id], (err, result) => {
    if (err) {
      logger.error('Error deleting district:', err);
      return serverError(res, ERROR_MESSAGES.CANNOT_DELETE_REFERENCED);
    }
    if (result.affectedRows === 0) {
      return notFound(res, ERROR_MESSAGES.DISTRICT_NOT_FOUND);
    }
    return success(res, SUCCESS_MESSAGES.DISTRICT_DELETED);
  });
};
