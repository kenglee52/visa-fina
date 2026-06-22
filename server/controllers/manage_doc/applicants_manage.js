const db = require('../../config/connect_DB');
const { APPLICANT_STATUS, AUDIT_ACTIONS, ROLES, SUCCESS_MESSAGES, ERROR_MESSAGES } = require('../../config/constants');
const { success, badRequest, notFound, unauthorized, forbidden, serverError } = require('../../utils/response');
const logger = require('../../utils/logger');

/**
 * Check/Verify document - Update applicant status to 'checked'
 */
exports.checkDocument = (req, res) => {
  const { applicant_id } = req.body;
  const verifier_id = req.user.id;
  const status = APPLICANT_STATUS.CHECKED;
  const action = AUDIT_ACTIONS.CHECK_DOCUMENT;

  if (!applicant_id) return badRequest(res, ERROR_MESSAGES.MISSING_FIELDS);

  db.getConnection((err, connection) => {
    if (err) return serverError(res, ERROR_MESSAGES.DATABASE_CONNECTION_ERROR);

    connection.beginTransaction((err) => {
      if (err) { connection.release(); return serverError(res, ERROR_MESSAGES.TRANSACTION_ERROR); }

      connection.query(`SELECT id FROM applicants WHERE id = ?`, [applicant_id], (err, results) => {
        if (err) return connection.rollback(() => { connection.release(); serverError(res, ERROR_MESSAGES.DATABASE_ERROR); });
        if (results.length === 0) return connection.rollback(() => { connection.release(); notFound(res, ERROR_MESSAGES.APPLICANT_NOT_FOUND); });

        // Update applicant status
        connection.query(
          `UPDATE applicants SET current_status = ?, updated_at = NOW() WHERE id = ?`,
          [status, applicant_id],
          (err, result) => {
            if (err) return connection.rollback(() => { connection.release(); serverError(res, ERROR_MESSAGES.DATABASE_ERROR); });
            if (result.affectedRows === 0) return connection.rollback(() => { connection.release(); notFound(res, ERROR_MESSAGES.APPLICANT_NOT_FOUND); });

            // ✅ data_entry_employee_id = NULL (check_document ບໍ່ກ່ຽວກັບ data_entry)
            connection.query(
              `INSERT INTO audit_logs (applicant_id, data_entry_employee_id, verifier_id, action, status, timestamp)
               VALUES (?, NULL, ?, ?, ?, NOW())`,
              [applicant_id, verifier_id, action, status],
              (err) => {
                if (err) return connection.rollback(() => { connection.release(); serverError(res, ERROR_MESSAGES.DATABASE_ERROR); });

                connection.commit((err) => {
                  if (err) return connection.rollback(() => { connection.release(); serverError(res, ERROR_MESSAGES.TRANSACTION_ERROR); });
                  connection.release();
                  logger.info('Document checked:', { applicant_id, verifier_id });
                  return success(res, SUCCESS_MESSAGES.DOCUMENT_CHECKED);
                });
              }
            );
          }
        );
      });
    });
  });
};

/**
 * Reject document - Update applicant status to 'rejected'
 */
exports.rejectDocument = (req, res) => {
  const { applicant_id, feedback } = req.body;
  const verifier_id = req.user.id;
  const status = APPLICANT_STATUS.REJECTED;
  const action = AUDIT_ACTIONS.REJECTED;

  db.getConnection((err, connection) => {
    if (err) return serverError(res, ERROR_MESSAGES.DATABASE_CONNECTION_ERROR);

    connection.beginTransaction((err) => {
      if (err) { connection.release(); return serverError(res, ERROR_MESSAGES.TRANSACTION_ERROR); }

      connection.query(`SELECT id FROM applicants WHERE id = ?`, [applicant_id], (err, results) => {
        if (err) return connection.rollback(() => { connection.release(); serverError(res, ERROR_MESSAGES.DATABASE_ERROR); });
        if (results.length === 0) return connection.rollback(() => { connection.release(); notFound(res, ERROR_MESSAGES.APPLICANT_NOT_FOUND); });

        connection.query(
          `UPDATE applicants SET current_status = ?, last_rejected_feedback = ?, is_corrected = FALSE, updated_at = NOW() WHERE id = ?`,
          [status, feedback, applicant_id],
          (err, result) => {
            if (err) return connection.rollback(() => { connection.release(); serverError(res, ERROR_MESSAGES.DATABASE_ERROR); });
            if (result.affectedRows === 0) return connection.rollback(() => { connection.release(); notFound(res, ERROR_MESSAGES.APPLICANT_NOT_FOUND); });

            // ✅ data_entry_employee_id = NULL (rejected ບໍ່ກ່ຽວກັບ data_entry)
            connection.query(
              `INSERT INTO audit_logs (applicant_id, data_entry_employee_id, verifier_id, action, status, timestamp)
               VALUES (?, NULL, ?, ?, ?, NOW())`,
              [applicant_id, verifier_id, action, status],
              (err) => {
                if (err) return connection.rollback(() => { connection.release(); serverError(res, ERROR_MESSAGES.DATABASE_ERROR); });

                connection.commit((err) => {
                  if (err) return connection.rollback(() => { connection.release(); serverError(res, ERROR_MESSAGES.TRANSACTION_ERROR); });
                  connection.release();
                  logger.info('Document rejected:', { applicant_id, verifier_id, feedback });
                  return success(res, SUCCESS_MESSAGES.DOCUMENT_REJECTED);
                });
              }
            );
          }
        );
      });
    });
  });
};

/**
 * Issue card - Update applicant status to 'issued'
 */
exports.issueCard = (req, res) => {
  const { applicant_id } = req.body;
  const verifier_id = req.user.id;
  const status = APPLICANT_STATUS.ISSUED;
  const action = AUDIT_ACTIONS.ISSUE_CARD;

  if (!applicant_id) return badRequest(res, ERROR_MESSAGES.MISSING_FIELDS);

  db.getConnection((err, connection) => {
    if (err) return serverError(res, ERROR_MESSAGES.DATABASE_CONNECTION_ERROR);

    connection.beginTransaction((err) => {
      if (err) { connection.release(); return serverError(res, ERROR_MESSAGES.TRANSACTION_ERROR); }

      connection.query(`SELECT id, fina_ctm_key FROM applicants WHERE id = ?`, [applicant_id], (err, results) => {
        if (err) return connection.rollback(() => { connection.release(); serverError(res, ERROR_MESSAGES.DATABASE_ERROR); });
        if (results.length === 0) return connection.rollback(() => { connection.release(); notFound(res, ERROR_MESSAGES.APPLICANT_NOT_FOUND); });

        const fina_ctm_key = results[0].fina_ctm_key;
        if (!fina_ctm_key || fina_ctm_key.trim() === '') {
          return connection.rollback(() => { connection.release(); badRequest(res, 'FINA CTM Key is required before issuing'); });
        }

        connection.query(
          `UPDATE applicants SET current_status = ?, updated_at = NOW() WHERE id = ?`,
          [status, applicant_id],
          (err, result) => {
            if (err) return connection.rollback(() => { connection.release(); serverError(res, ERROR_MESSAGES.DATABASE_ERROR); });
            if (result.affectedRows === 0) return connection.rollback(() => { connection.release(); notFound(res, ERROR_MESSAGES.APPLICANT_NOT_FOUND); });

            // ✅ data_entry_employee_id = NULL (issue_card ບໍ່ກ່ຽວກັບ data_entry)
            connection.query(
              `INSERT INTO audit_logs (applicant_id, data_entry_employee_id, verifier_id, action, status, timestamp)
               VALUES (?, NULL, ?, ?, ?, NOW())`,
              [applicant_id, verifier_id, action, status],
              (err) => {
                if (err) return connection.rollback(() => { connection.release(); serverError(res, ERROR_MESSAGES.DATABASE_ERROR); });

                connection.commit((err) => {
                  if (err) return connection.rollback(() => { connection.release(); serverError(res, ERROR_MESSAGES.TRANSACTION_ERROR); });
                  connection.release();
                  logger.info('Card issued:', { applicant_id, verifier_id });
                  return success(res, SUCCESS_MESSAGES.DOCUMENT_ISSUED);
                });
              }
            );
          }
        );
      });
    });
  });
};

/**
 * Update FINA CTM Key
 */
exports.updateFinaCtmKey = (req, res) => {
  const { applicant_id, fina_ctm_key } = req.body;
  const verifier_id = req.user.id;

  if (!applicant_id || !fina_ctm_key || fina_ctm_key.trim() === '') {
    return badRequest(res, 'Applicant ID and FINA CTM Key are required');
  }

  db.getConnection((err, connection) => {
    if (err) return serverError(res, ERROR_MESSAGES.DATABASE_CONNECTION_ERROR);

    connection.beginTransaction((err) => {
      if (err) { connection.release(); return serverError(res, ERROR_MESSAGES.TRANSACTION_ERROR); }

      connection.query(`SELECT id FROM applicants WHERE id = ?`, [applicant_id], (err, results) => {
        if (err) return connection.rollback(() => { connection.release(); serverError(res, ERROR_MESSAGES.DATABASE_ERROR); });
        if (results.length === 0) return connection.rollback(() => { connection.release(); notFound(res, ERROR_MESSAGES.APPLICANT_NOT_FOUND); });

        connection.query(
          `UPDATE applicants SET fina_ctm_key = ?, updated_at = NOW() WHERE id = ?`,
          [fina_ctm_key, applicant_id],
          (err, result) => {
            if (err) return connection.rollback(() => { connection.release(); serverError(res, ERROR_MESSAGES.DATABASE_ERROR); });
            if (result.affectedRows === 0) return connection.rollback(() => { connection.release(); notFound(res, ERROR_MESSAGES.APPLICANT_NOT_FOUND); });

            // ✅ data_entry_employee_id = NULL
            connection.query(
              `INSERT INTO audit_logs (applicant_id, data_entry_employee_id, verifier_id, action, status, timestamp)
               VALUES (?, NULL, ?, ?, ?, NOW())`,
              [applicant_id, verifier_id, AUDIT_ACTIONS.EDIT_DOCUMENTS, 'updated'],
              (err) => {
                if (err) return connection.rollback(() => { connection.release(); serverError(res, ERROR_MESSAGES.DATABASE_ERROR); });

                connection.commit((err) => {
                  if (err) return connection.rollback(() => { connection.release(); serverError(res, ERROR_MESSAGES.TRANSACTION_ERROR); });
                  connection.release();
                  logger.info('FINA CTM Key updated:', { applicant_id, verifier_id });
                  return success(res, SUCCESS_MESSAGES.FINA_CTM_KEY_UPDATED);
                });
              }
            );
          }
        );
      });
    });
  });
};

/**
 * Update receiver - Confirm card receipt
 */
exports.updateReceiver = (req, res) => {
  const { applicant_ids } = req.body;
  const employee_id = req.user.id;

  if (!applicant_ids || !Array.isArray(applicant_ids) || applicant_ids.length === 0) {
    return badRequest(res, 'Applicant IDs are required');
  }

  db.getConnection((err, connection) => {
    if (err) return serverError(res, ERROR_MESSAGES.DATABASE_CONNECTION_ERROR);

    connection.beginTransaction((err) => {
      if (err) { connection.release(); return serverError(res, ERROR_MESSAGES.TRANSACTION_ERROR); }

      // ກວດ role receiver
      connection.query(`SELECT id, role FROM employees WHERE id = ?`, [employee_id], (err, results) => {
        if (err) return connection.rollback(() => { connection.release(); serverError(res, ERROR_MESSAGES.DATABASE_ERROR); });
        if (results.length === 0) return connection.rollback(() => { connection.release(); unauthorized(res, 'Employee not found'); });
        if (results[0].role !== ROLES.RECEIVER) return connection.rollback(() => { connection.release(); forbidden(res, 'Employee does not have receiver role'); });

        // ກວດ applicant_ids ຢູ່ໃນ issued status
        connection.query(
          `SELECT id FROM applicants WHERE id IN (?) AND current_status = ?`,
          [applicant_ids, APPLICANT_STATUS.ISSUED],
          (err, results) => {
            if (err) return connection.rollback(() => { connection.release(); serverError(res, ERROR_MESSAGES.DATABASE_ERROR); });

            if (results.length !== applicant_ids.length) {
              const foundIds = results.map(row => row.id);
              const invalidIds = applicant_ids.filter(id => !foundIds.includes(id));
              return connection.rollback(() => {
                connection.release();
                badRequest(res, `Some applicants are not found or not in issued status: ${invalidIds.join(', ')}`);
              });
            }

            // Update status to received
            connection.query(
              `UPDATE applicants SET current_status = ?, updated_at = NOW() WHERE id IN (?)`,
              [APPLICANT_STATUS.RECEIVED, applicant_ids],
              (err, result) => {
                if (err) return connection.rollback(() => { connection.release(); serverError(res, ERROR_MESSAGES.DATABASE_ERROR); });
                if (result.affectedRows !== applicant_ids.length) return connection.rollback(() => { connection.release(); badRequest(res, 'Failed to update some applicants'); });

                // ✅ data_entry_employee_id = NULL, verifier_id = NULL, receiver_id = employee_id
                const auditLogs = applicant_ids.map(applicant_id => [
                  applicant_id,
                  null,          // data_entry_employee_id = NULL
                  null,          // verifier_id = NULL
                  AUDIT_ACTIONS.RECEIVE_CARD,
                  APPLICANT_STATUS.RECEIVED,
                  new Date(),
                  employee_id    // receiver_id
                ]);

                connection.query(
                  `INSERT INTO audit_logs (applicant_id, data_entry_employee_id, verifier_id, action, status, timestamp, receiver_id) VALUES ?`,
                  [auditLogs],
                  (err) => {
                    if (err) return connection.rollback(() => { connection.release(); serverError(res, ERROR_MESSAGES.DATABASE_ERROR); });

                    connection.commit((err) => {
                      if (err) return connection.rollback(() => { connection.release(); serverError(res, ERROR_MESSAGES.TRANSACTION_ERROR); });
                      connection.release();
                      logger.info('Receipt confirmed:', { applicant_ids, employee_id });
                      return success(res, SUCCESS_MESSAGES.RECEIPT_CONFIRMED);
                    });
                  }
                );
              }
            );
          }
        );
      });
    });
  });
};