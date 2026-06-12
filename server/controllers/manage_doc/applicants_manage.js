const db = require('../../config/connect_DB');
const bcrypt = require('bcrypt');
const { APPLICANT_STATUS, AUDIT_ACTIONS, ROLES, SUCCESS_MESSAGES, ERROR_MESSAGES } = require('../../config/constants');
const { success, badRequest, notFound, unauthorized, forbidden, serverError } = require('../../utils/response');
const logger = require('../../utils/logger');

/**
 * Check/Verify document - Update applicant status to 'checked'
 */
exports.checkDocument = (req, res) => {
  const { applicant_id } = req.body;
  const employee_id = req.user.id;
  const status = APPLICANT_STATUS.CHECKED;
  const action = AUDIT_ACTIONS.CHECK_DOCUMENT;

  if (!applicant_id) {
    return badRequest(res, ERROR_MESSAGES.MISSING_FIELDS);
  }

  db.getConnection((err, connection) => {
    if (err) {
      logger.error('Error getting connection:', err);
      return serverError(res, ERROR_MESSAGES.DATABASE_CONNECTION_ERROR);
    }

    connection.beginTransaction((err) => {
      if (err) {
        logger.error('Error starting transaction:', err);
        connection.release();
        return serverError(res, ERROR_MESSAGES.TRANSACTION_ERROR);
      }

      // Check if applicant exists
      connection.query(`SELECT id FROM applicants WHERE id = ?`, [applicant_id], (err, results) => {
        if (err) {
          logger.error('Error fetching applicant:', err);
          return connection.rollback(() => {
            connection.release();
            serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
          });
        }

        if (results.length === 0) {
          return connection.rollback(() => {
            connection.release();
            notFound(res, ERROR_MESSAGES.APPLICANT_NOT_FOUND);
          });
        }

        // Fetch data_entry_employee_id from the earliest audit log
        connection.query(
          `SELECT data_entry_employee_id FROM audit_logs WHERE applicant_id = ? ORDER BY timestamp ASC LIMIT 1`,
          [applicant_id],
          (err, rows) => {
            if (err) {
              logger.error('Error fetching audit log:', err);
              return connection.rollback(() => {
                connection.release();
                serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
              });
            }

            const data_entry_employee_id = rows.length > 0 ? rows[0].data_entry_employee_id : null;

            if (!data_entry_employee_id) {
              return connection.rollback(() => {
                connection.release();
                badRequest(res, 'No data entry employee found for this applicant');
              });
            }

            // Update applicant status
            connection.query(
              `UPDATE applicants SET current_status = ?, updated_at = NOW() WHERE id = ?`,
              [status, applicant_id],
              (err, result) => {
                if (err) {
                  logger.error('Error updating applicant status:', err);
                  return connection.rollback(() => {
                    connection.release();
                    serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
                  });
                }

                if (result.affectedRows === 0) {
                  return connection.rollback(() => {
                    connection.release();
                    notFound(res, ERROR_MESSAGES.APPLICANT_NOT_FOUND);
                  });
                }

                // Insert audit log
                connection.query(
                  `INSERT INTO audit_logs (applicant_id, data_entry_employee_id, employee_id, action, status, timestamp)
                   VALUES (?, ?, ?, ?, ?, NOW())`,
                  [applicant_id, data_entry_employee_id, employee_id, action, status],
                  (err) => {
                    if (err) {
                      logger.error('Error inserting audit log:', err);
                      return connection.rollback(() => {
                        connection.release();
                        serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
                      });
                    }

                    connection.commit((err) => {
                      if (err) {
                        logger.error('Error committing transaction:', err);
                        return connection.rollback(() => {
                          connection.release();
                          serverError(res, ERROR_MESSAGES.TRANSACTION_ERROR);
                        });
                      }

                      connection.release();
                      logger.info('Document checked:', { applicant_id, employee_id });
                      return success(res, SUCCESS_MESSAGES.DOCUMENT_CHECKED);
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

/**
 * Reject document - Update applicant status to 'rejected'
 */
exports.rejectDocument = (req, res) => {
  const { applicant_id, feedback } = req.body;
  const employee_id = req.user.id;
  const status = APPLICANT_STATUS.REJECTED;
  const action = AUDIT_ACTIONS.REJECTED;

  if (!applicant_id) {
    return badRequest(res, ERROR_MESSAGES.MISSING_FIELDS);
  }

  if (!feedback || feedback.trim() === '') {
    return badRequest(res, 'Feedback is required for rejection');
  }

  db.getConnection((err, connection) => {
    if (err) {
      logger.error('Error getting connection:', err);
      return serverError(res, ERROR_MESSAGES.DATABASE_CONNECTION_ERROR);
    }

    connection.beginTransaction((err) => {
      if (err) {
        logger.error('Error starting transaction:', err);
        connection.release();
        return serverError(res, ERROR_MESSAGES.TRANSACTION_ERROR);
      }

      // Check if applicant exists
      connection.query(`SELECT id FROM applicants WHERE id = ?`, [applicant_id], (err, results) => {
        if (err) {
          logger.error('Error fetching applicant:', err);
          return connection.rollback(() => {
            connection.release();
            serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
          });
        }

        if (results.length === 0) {
          return connection.rollback(() => {
            connection.release();
            notFound(res, ERROR_MESSAGES.APPLICANT_NOT_FOUND);
          });
        }

        // Fetch data_entry_employee_id from the earliest audit log
        connection.query(
          `SELECT data_entry_employee_id FROM audit_logs WHERE applicant_id = ? ORDER BY timestamp ASC LIMIT 1`,
          [applicant_id],
          (err, rows) => {
            if (err) {
              logger.error('Error fetching audit log:', err);
              return connection.rollback(() => {
                connection.release();
                serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
              });
            }

            const data_entry_employee_id = rows.length > 0 ? rows[0].data_entry_employee_id : null;

            if (!data_entry_employee_id) {
              return connection.rollback(() => {
                connection.release();
                badRequest(res, 'No data entry employee found for this applicant');
              });
            }

            // Update applicant status, feedback, and is_corrected
            connection.query(
              `UPDATE applicants
               SET current_status = ?, last_rejected_feedback = ?, is_corrected = FALSE, updated_at = NOW()
               WHERE id = ?`,
              [status, feedback, applicant_id],
              (err, result) => {
                if (err) {
                  logger.error('Error updating applicant:', err);
                  return connection.rollback(() => {
                    connection.release();
                    serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
                  });
                }

                if (result.affectedRows === 0) {
                  return connection.rollback(() => {
                    connection.release();
                    notFound(res, ERROR_MESSAGES.APPLICANT_NOT_FOUND);
                  });
                }

                // Insert audit log
                connection.query(
                  `INSERT INTO audit_logs (applicant_id, data_entry_employee_id, employee_id, action, status, timestamp)
                   VALUES (?, ?, ?, ?, ?, NOW())`,
                  [applicant_id, data_entry_employee_id, employee_id, action, status],
                  (err) => {
                    if (err) {
                      logger.error('Error inserting audit log:', err);
                      return connection.rollback(() => {
                        connection.release();
                        serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
                      });
                    }

                    connection.commit((err) => {
                      if (err) {
                        logger.error('Error committing transaction:', err);
                        return connection.rollback(() => {
                          connection.release();
                          serverError(res, ERROR_MESSAGES.TRANSACTION_ERROR);
                        });
                      }

                      connection.release();
                      logger.info('Document rejected:', { applicant_id, employee_id, feedback });
                      return success(res, SUCCESS_MESSAGES.DOCUMENT_REJECTED);
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

/**
 * Issue card - Update applicant status to 'issued'
 */
exports.issueCard = (req, res) => {
  const { applicant_id } = req.body;
  const employee_id = req.user.id;
  const status = APPLICANT_STATUS.ISSUED;
  const action = AUDIT_ACTIONS.ISSUE_CARD;

  if (!applicant_id) {
    return badRequest(res, ERROR_MESSAGES.MISSING_FIELDS);
  }

  db.getConnection((err, connection) => {
    if (err) {
      logger.error('Error getting connection:', err);
      return serverError(res, ERROR_MESSAGES.DATABASE_CONNECTION_ERROR);
    }

    connection.beginTransaction((err) => {
      if (err) {
        logger.error('Error starting transaction:', err);
        connection.release();
        return serverError(res, ERROR_MESSAGES.TRANSACTION_ERROR);
      }

      // Check if applicant exists and fetch fina_ctm_key
      connection.query(`SELECT id, fina_ctm_key FROM applicants WHERE id = ?`, [applicant_id], (err, results) => {
        if (err) {
          logger.error('Error fetching applicant:', err);
          return connection.rollback(() => {
            connection.release();
            serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
          });
        }

        if (results.length === 0) {
          return connection.rollback(() => {
            connection.release();
            notFound(res, ERROR_MESSAGES.APPLICANT_NOT_FOUND);
          });
        }

        const fina_ctm_key = results[0].fina_ctm_key;
        if (!fina_ctm_key || fina_ctm_key.trim() === '') {
          return connection.rollback(() => {
            connection.release();
            badRequest(res, 'FINA CTM Key is required before issuing');
          });
        }

        // Fetch data_entry_employee_id from the earliest audit log
        connection.query(
          `SELECT data_entry_employee_id FROM audit_logs WHERE applicant_id = ? ORDER BY timestamp ASC LIMIT 1`,
          [applicant_id],
          (err, rows) => {
            if (err) {
              logger.error('Error fetching audit log:', err);
              return connection.rollback(() => {
                connection.release();
                serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
              });
            }

            const data_entry_employee_id = rows.length > 0 ? rows[0].data_entry_employee_id : null;

            if (!data_entry_employee_id) {
              return connection.rollback(() => {
                connection.release();
                badRequest(res, 'No data entry employee found for this applicant');
              });
            }

            // Update applicant status
            connection.query(
              `UPDATE applicants SET current_status = ?, updated_at = NOW() WHERE id = ?`,
              [status, applicant_id],
              (err, result) => {
                if (err) {
                  logger.error('Error updating applicant status:', err);
                  return connection.rollback(() => {
                    connection.release();
                    serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
                  });
                }

                if (result.affectedRows === 0) {
                  return connection.rollback(() => {
                    connection.release();
                    notFound(res, ERROR_MESSAGES.APPLICANT_NOT_FOUND);
                  });
                }

                // Insert audit log
                connection.query(
                  `INSERT INTO audit_logs (applicant_id, data_entry_employee_id, employee_id, action, status, timestamp)
                   VALUES (?, ?, ?, ?, ?, NOW())`,
                  [applicant_id, data_entry_employee_id, employee_id, action, status],
                  (err) => {
                    if (err) {
                      logger.error('Error inserting audit log:', err);
                      return connection.rollback(() => {
                        connection.release();
                        serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
                      });
                    }

                    connection.commit((err) => {
                      if (err) {
                        logger.error('Error committing transaction:', err);
                        return connection.rollback(() => {
                          connection.release();
                          serverError(res, ERROR_MESSAGES.TRANSACTION_ERROR);
                        });
                      }

                      connection.release();
                      logger.info('Card issued:', { applicant_id, employee_id });
                      return success(res, SUCCESS_MESSAGES.DOCUMENT_ISSUED);
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

/**
 * Update FINA CTM Key
 */
exports.updateFinaCtmKey = (req, res) => {
  const { applicant_id, fina_ctm_key } = req.body;
  const employee_id = req.user.id;

  if (!applicant_id || !fina_ctm_key || fina_ctm_key.trim() === '') {
    return badRequest(res, 'Applicant ID and FINA CTM Key are required');
  }

  db.getConnection((err, connection) => {
    if (err) {
      logger.error('Error getting connection:', err);
      return serverError(res, ERROR_MESSAGES.DATABASE_CONNECTION_ERROR);
    }

    connection.beginTransaction((err) => {
      if (err) {
        logger.error('Error starting transaction:', err);
        connection.release();
        return serverError(res, ERROR_MESSAGES.TRANSACTION_ERROR);
      }

      // Check if applicant exists
      connection.query(`SELECT id FROM applicants WHERE id = ?`, [applicant_id], (err, results) => {
        if (err) {
          logger.error('Error fetching applicant:', err);
          return connection.rollback(() => {
            connection.release();
            serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
          });
        }

        if (results.length === 0) {
          return connection.rollback(() => {
            connection.release();
            notFound(res, ERROR_MESSAGES.APPLICANT_NOT_FOUND);
          });
        }

        // Update fina_ctm_key
        connection.query(
          `UPDATE applicants SET fina_ctm_key = ?, updated_at = NOW() WHERE id = ?`,
          [fina_ctm_key, applicant_id],
          (err, result) => {
            if (err) {
              logger.error('Error updating FINA CTM Key:', err);
              return connection.rollback(() => {
                connection.release();
                serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
              });
            }

            if (result.affectedRows === 0) {
              return connection.rollback(() => {
                connection.release();
                notFound(res, ERROR_MESSAGES.APPLICANT_NOT_FOUND);
              });
            }

            // Insert audit log
            connection.query(
              `INSERT INTO audit_logs (applicant_id, data_entry_employee_id, employee_id, action, status, timestamp)
               VALUES (?, ?, ?, ?, ?, NOW())`,
              [applicant_id, null, employee_id, AUDIT_ACTIONS.EDIT_DOCUMENTS, 'updated'],
              (err) => {
                if (err) {
                  logger.error('Error inserting audit log:', err);
                  return connection.rollback(() => {
                    connection.release();
                    serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
                  });
                }

                connection.commit((err) => {
                  if (err) {
                    logger.error('Error committing transaction:', err);
                    return connection.rollback(() => {
                      connection.release();
                      serverError(res, ERROR_MESSAGES.TRANSACTION_ERROR);
                    });
                  }

                  connection.release();
                  logger.info('FINA CTM Key updated:', { applicant_id, employee_id });
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
  const { applicant_ids, receiver_id, receiver_password } = req.body;
  const employee_id = req.user.id;

  // Validate input
  if (!applicant_ids || !Array.isArray(applicant_ids) || applicant_ids.length === 0 || !receiver_id || !receiver_password) {
    return badRequest(res, 'Applicant IDs, receiver ID, and receiver password are required');
  }

  db.getConnection((err, connection) => {
    if (err) {
      logger.error('Error getting connection:', err);
      return serverError(res, ERROR_MESSAGES.DATABASE_CONNECTION_ERROR);
    }

    connection.beginTransaction((err) => {
      if (err) {
        logger.error('Error starting transaction:', err);
        connection.release();
        return serverError(res, ERROR_MESSAGES.TRANSACTION_ERROR);
      }

      // Step 1: Verify receiver credentials
      connection.query(`SELECT id, password, role FROM employees WHERE id = ?`, [receiver_id], (err, results) => {
        if (err) {
          logger.error('Error fetching employee:', err);
          return connection.rollback(() => {
            connection.release();
            serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
          });
        }

        if (results.length === 0) {
          return connection.rollback(() => {
            connection.release();
            unauthorized(res, 'Employee ID does not exist');
          });
        }

        const employee = results[0];
        if (employee.role !== ROLES.RECEIVER) {
          return connection.rollback(() => {
            connection.release();
            forbidden(res, 'Employee does not have receiver role');
          });
        }

        // Verify password
        bcrypt.compare(receiver_password, employee.password, (err, isMatch) => {
          if (err) {
            logger.error('Error verifying password:', err);
            return connection.rollback(() => {
              connection.release();
              serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
            });
          }

          if (!isMatch) {
            return connection.rollback(() => {
              connection.release();
              unauthorized(res, 'Incorrect password');
            });
          }

          // Step 2: Verify all applicant_ids exist and are in 'issued' status
          connection.query(
            `SELECT id FROM applicants WHERE id IN (?) AND current_status = ?`,
            [applicant_ids, APPLICANT_STATUS.ISSUED],
            (err, results) => {
              if (err) {
                logger.error('Error fetching applicants:', err);
                return connection.rollback(() => {
                  connection.release();
                  serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
                });
              }

              if (results.length !== applicant_ids.length) {
                const foundIds = results.map(row => row.id);
                const invalidIds = applicant_ids.filter(id => !foundIds.includes(id));
                return connection.rollback(() => {
                  connection.release();
                  badRequest(res, `Some applicants are not found or not in issued status: ${invalidIds.join(', ')}`);
                });
              }

              // Step 3: Fetch data_entry_employee_id for each applicant_id
              connection.query(
                `SELECT al.applicant_id, al.data_entry_employee_id
                 FROM audit_logs al
                 INNER JOIN (
                   SELECT applicant_id, MIN(timestamp) as min_timestamp
                   FROM audit_logs
                   WHERE applicant_id IN (?)
                   GROUP BY applicant_id
                 ) first_logs ON al.applicant_id = first_logs.applicant_id AND al.timestamp = first_logs.min_timestamp`,
                [applicant_ids],
                (err, rows) => {
                  if (err) {
                    logger.error('Error fetching audit logs:', err);
                    return connection.rollback(() => {
                      connection.release();
                      serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
                    });
                  }

                  // Map applicant_id to data_entry_employee_id
                  const dataEntryMap = {};
                  rows.forEach(row => {
                    dataEntryMap[row.applicant_id] = row.data_entry_employee_id || null;
                  });

                  // Check if all applicant_ids have a data_entry_employee_id
                  const missingDataEntry = applicant_ids.filter(id => !dataEntryMap[id]);
                  if (missingDataEntry.length > 0) {
                    return connection.rollback(() => {
                      connection.release();
                      badRequest(res, `No data entry employee found for applicants: ${missingDataEntry.join(', ')}`);
                    });
                  }

                  // Step 4: Update applicants to 'received' status
                  connection.query(
                    `UPDATE applicants SET current_status = ?, updated_at = NOW() WHERE id IN (?)`,
                    [APPLICANT_STATUS.RECEIVED, applicant_ids],
                    (err, result) => {
                      if (err) {
                        logger.error('Error updating applicants:', err);
                        return connection.rollback(() => {
                          connection.release();
                          serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
                        });
                      }

                      if (result.affectedRows !== applicant_ids.length) {
                        return connection.rollback(() => {
                          connection.release();
                          badRequest(res, 'Failed to update some applicants');
                        });
                      }

                      // Step 5: Log to audit_logs for each applicant
                      const auditLogs = applicant_ids.map(applicant_id => [
                        applicant_id,
                        dataEntryMap[applicant_id],
                        employee_id,
                        AUDIT_ACTIONS.RECEIVE_CARD,
                        APPLICANT_STATUS.RECEIVED,
                        new Date(),
                        receiver_id
                      ]);

                      connection.query(
                        `INSERT INTO audit_logs (applicant_id, data_entry_employee_id, employee_id, action, status, timestamp, receiver_id) VALUES ?`,
                        [auditLogs],
                        (err) => {
                          if (err) {
                            logger.error('Error logging to audit_logs:', err);
                            return connection.rollback(() => {
                              connection.release();
                              serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
                            });
                          }

                          // Step 6: Commit transaction
                          connection.commit((err) => {
                            if (err) {
                              logger.error('Error committing transaction:', err);
                              return connection.rollback(() => {
                                connection.release();
                                serverError(res, ERROR_MESSAGES.TRANSACTION_ERROR);
                              });
                            }

                            connection.release();
                            logger.info('Receipt confirmed:', { applicant_ids, receiver_id, employee_id });
                            return success(res, SUCCESS_MESSAGES.RECEIPT_CONFIRMED);
                          });
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        });
      });
    });
  });
};
