const db = require('../config/connect_DB');
const { APPLICANT_STATUS, AUDIT_ACTIONS, SUCCESS_MESSAGES, ERROR_MESSAGES } = require('../config/constants');
const { success, badRequest, serverError, paginated } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * Get logs with filtering and pagination
 */
exports.getLogs = (req, res) => {
  const { applicant_id, action, status, date_from, date_to, page = 1, limit = 10 } = req.query;

  // Validate pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  if (isNaN(pageNum) || pageNum < 1 || isNaN(limitNum) || limitNum < 1) {
    return badRequest(res, 'Invalid page or limit value');
  }

  // Validate action
  const validActions = Object.values(AUDIT_ACTIONS);
  if (action && !validActions.includes(action)) {
    return badRequest(res, 'Invalid action value');
  }

  // Validate status
  const validStatuses = Object.values(APPLICANT_STATUS);
  if (status && !validStatuses.includes(status)) {
    return badRequest(res, 'Invalid status value');
  }

  // Validate date format (yyyy-mm-dd)
  if (date_from && !/^\d{4}-\d{2}-\d{2}$/.test(date_from)) {
    return badRequest(res, 'Invalid date_from format, use yyyy-mm-dd');
  }
  if (date_to && !/^\d{4}-\d{2}-\d{2}$/.test(date_to)) {
    return badRequest(res, 'Invalid date_to format, use yyyy-mm-dd');
  }

  const offset = (pageNum - 1) * limitNum;

  // Build query with JOINs
  let query = `
    SELECT DISTINCT
      al.id AS log_id,
      al.applicant_id,
      al.data_entry_employee_id,
      al.verifier_id,
      al.action,
      al.status,
      al.timestamp,
      a.name AS applicant_name,
      a.surname AS applicant_surname,
      a.doc_number
    FROM audit_logs al
    LEFT JOIN applicants a ON al.applicant_id = a.id
    WHERE 1=1
  `;
  const queryParams = [];

  if (applicant_id) {
    query += ` AND al.applicant_id = ?`;
    queryParams.push(applicant_id);
  }
  if (action) {
    query += ` AND al.action = ?`;
    queryParams.push(action);
  }
  if (status) {
    query += ` AND al.status = ?`;
    queryParams.push(status);
  }
  if (date_from) {
    query += ` AND DATE(al.timestamp) >= ?`;
    queryParams.push(date_from);
  }
  if (date_to) {
    query += ` AND DATE(al.timestamp) <= ?`;
    queryParams.push(date_to);
  }

  query += ` ORDER BY al.timestamp DESC LIMIT ? OFFSET ?`;
  queryParams.push(limitNum, offset);

  db.query(query, queryParams, (err, results) => {
    if (err) {
      logger.error('Query error:', err);
      return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
    }

    if (results.length === 0) {
      return paginated(res, SUCCESS_MESSAGES.LOGS_FETCHED, [], 0, pageNum, limitNum);
    }

    // Count total logs
    let countQuery = `SELECT COUNT(DISTINCT al.id) as total FROM audit_logs al
                     LEFT JOIN applicants a ON al.applicant_id = a.id
                     WHERE 1=1`;
    const countParams = [];
    if (applicant_id) {
      countQuery += ` AND al.applicant_id = ?`;
      countParams.push(applicant_id);
    }
    if (action) {
      countQuery += ` AND al.action = ?`;
      countParams.push(action);
    }
    if (status) {
      countQuery += ` AND al.status = ?`;
      countParams.push(status);
    }
    if (date_from) {
      countQuery += ` AND DATE(al.timestamp) >= ?`;
      countParams.push(date_from);
    }
    if (date_to) {
      countQuery += ` AND DATE(al.timestamp) <= ?`;
      countParams.push(date_to);
    }

    db.query(countQuery, countParams, (countErr, countResults) => {
      if (countErr) {
        logger.error('Count query error:', countErr);
        return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
      }

      return paginated(res, SUCCESS_MESSAGES.LOGS_FETCHED, results, countResults[0].total || 0, pageNum, limitNum);
    });
  });
};

/**
 * Get applicant report with filtering and pagination
 */
exports.getReport = (req, res) => {
  const { status, page = 1, limit = 10, applicant_id, date_from, date_to } = req.query;

  // Validate pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  if (isNaN(pageNum) || pageNum < 1 || isNaN(limitNum) || limitNum < 1) {
    return badRequest(res, 'Invalid page or limit value');
  }

  // Validate status
  const validStatuses = Object.values(APPLICANT_STATUS);
  if (status && !validStatuses.includes(status)) {
    return badRequest(res, 'Invalid status value');
  }

  // Validate date format (yyyy-mm-dd)
  if (date_from && !/^\d{4}-\d{2}-\d{2}$/.test(date_from)) {
    return badRequest(res, 'Invalid date_from format, use yyyy-mm-dd');
  }
  if (date_to && !/^\d{4}-\d{2}-\d{2}$/.test(date_to)) {
    return badRequest(res, 'Invalid date_to format, use yyyy-mm-dd');
  }

  const offset = (pageNum - 1) * limitNum;

  // Build query with JOINs
  let query = `
    SELECT DISTINCT
      a.id AS applicant_id,
      a.fina_ctm_key,
      a.lbd_ctm_key,
      a.name AS applicant_name,
      a.surname AS applicant_surname,
      a.dob,
      a.village,
      a.gender,
      a.district_id,
      d.name AS district_name,
      a.province_id,
      p.name AS province_name,
      a.relationship_status,
      a.doc_type,
      a.doc_number,
      a.issued_by,
      a.issued_date,
      a.expiry_date,
      a.current_status AS status,
      a.created_at,
      a.updated_at,
      a.last_rejected_feedback
    FROM applicants a
    LEFT JOIN districts d ON a.district_id = d.id
    LEFT JOIN provinces p ON a.province_id = p.id
    WHERE 1=1
  `;
  const queryParams = [];

  if (status) {
    query += ` AND a.current_status = ?`;
    queryParams.push(status);
  }
  if (applicant_id) {
    query += ` AND a.id = ?`;
    queryParams.push(applicant_id);
  }
  if (date_from) {
    query += ` AND DATE(a.created_at) >= ?`;
    queryParams.push(date_from);
  }
  if (date_to) {
    query += ` AND DATE(a.created_at) <= ?`;
    queryParams.push(date_to);
  }

  // ກ່ອນ
  // query += ` ORDER BY DATE(a.updated_at) = CURDATE() DESC, a.updated_at DESC, a.id DESC LIMIT ? OFFSET ?`;
  // ✅ ຫຼັງ
  query += ` ORDER BY 
  CASE a.current_status
    WHEN 'in_progress' THEN 0
    WHEN 'rejected' THEN 1
    ELSE 2
  END ASC,
  a.updated_at ASC,
  a.id ASC
  LIMIT ? OFFSET ?`;
  queryParams.push(limitNum, offset);

  db.query(query, queryParams, (err, results) => {
    if (err) {
      logger.error('Query error:', err);
      return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
    }

    if (results.length === 0) {
      return paginated(res, SUCCESS_MESSAGES.REPORT_FETCHED, [], 0, pageNum, limitNum);
    }

    const applicantIds = [...new Set(results.map(r => r.applicant_id))];
    const docQuery = `
      SELECT DISTINCT applicant_id, file_type, file_path
      FROM applicant_documents
      WHERE applicant_id IN (?)
    `;
    db.query(docQuery, [applicantIds], (docErr, docResults) => {
      if (docErr) {
        logger.error('Document query error:', docErr);
        return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
      }

      const dataMap = new Map();
      results.forEach(applicant => {
        const key = applicant.applicant_id;
        if (!dataMap.has(key)) {
          dataMap.set(key, {
            ...applicant,
            files: docResults.filter(f => f.applicant_id === key),
            check_date: null,
            issue_date: null,
            receive_date: null,
            data_entry_name: null,
            data_entry_last_name: null,
            verifier_name: null,
            verifier_last_name: null
          });
        }
      });

      const data = Array.from(dataMap.values());

      let countQuery = `SELECT COUNT(DISTINCT a.id) as total FROM applicants a
                       LEFT JOIN districts d ON a.district_id = d.id
                       LEFT JOIN provinces p ON a.province_id = p.id
                       WHERE 1=1`;
      const countParams = [];
      if (status) {
        countQuery += ` AND a.current_status = ?`;
        countParams.push(status);
      }
      if (applicant_id) {
        countQuery += ` AND a.id = ?`;
        countParams.push(applicant_id);
      }
      if (date_from) {
        countQuery += ` AND DATE(a.created_at) >= ?`;
        countParams.push(date_from);
      }
      if (date_to) {
        countQuery += ` AND DATE(a.created_at) <= ?`;
        countParams.push(date_to);
      }

      db.query(countQuery, countParams, (countErr, countResults) => {
        if (countErr) {
          logger.error('Count query error:', countErr);
          return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
        }

        return paginated(res, SUCCESS_MESSAGES.REPORT_FETCHED, data, countResults[0].total || 0, pageNum, limitNum);
      });
    });
  });
};

/**
 * Get detailed log report with advanced filtering
 */
exports.getLogReport = (req, res) => {
  const {
    applicant_id = '',
    action = '',
    status = '',
    date_from = '',
    date_to = '',
    page = 1,
    limit = 10,
  } = req.query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  if (isNaN(pageNum) || pageNum < 1 || isNaN(limitNum) || limitNum < 1) {
    return badRequest(res, 'Invalid page or limit value');
  }

  const validActions = Object.values(AUDIT_ACTIONS);
  const validStatuses = Object.values(APPLICANT_STATUS);

  if (action && !validActions.includes(action)) {
    return badRequest(res, 'Invalid action value');
  }
  if (status && !validStatuses.includes(status)) {
    return badRequest(res, 'Invalid status value');
  }

  // Validate dates (allow empty)
  if ((date_from && isNaN(Date.parse(date_from))) || (date_to && isNaN(Date.parse(date_to)))) {
    return badRequest(res, 'Invalid date format (use YYYY-MM-DD)');
  }
  if (date_from && date_to && new Date(date_from) > new Date(date_to)) {
    return badRequest(res, 'date_from must be before or equal to date_to');
  }

  const offset = (pageNum - 1) * limitNum;

  // Convert empty strings to null
  const applicantIdVal = applicant_id || null;
  const actionVal = action || null;
  const statusVal = status || null;

  // Use full-day range; if empty -> null
  const adjustedDateFrom = date_from ? `${date_from} 00:00:00` : null;
  const adjustedDateTo = date_to ? `${date_to} 23:59:59` : null;

  
  const query = `
    SELECT
      al.id AS log_id,
      al.applicant_id,
      al.data_entry_employee_id,
      al.verifier_id,
      al.action,
      al.status,
      al.timestamp,
      al.receiver_id,
      a.name AS applicant_name,
      a.surname AS applicant_surname,
      a.doc_number
    FROM audit_logs al
    LEFT JOIN applicants a ON al.applicant_id = a.id
    WHERE (? IS NULL OR al.applicant_id = ?)
      AND (? IS NULL OR al.action = ?)
      AND (? IS NULL OR al.status = ?)
      AND (? IS NULL OR al.timestamp >= ?)
      AND (? IS NULL OR al.timestamp <= ?)
    ORDER BY al.timestamp DESC
    LIMIT ? OFFSET ?
  `;

  const queryParams = [
    applicantIdVal, applicantIdVal,
    actionVal, actionVal,
    statusVal, statusVal,
    adjustedDateFrom, adjustedDateFrom,
    adjustedDateTo, adjustedDateTo,
    limitNum, offset
  ];

  db.query(query, queryParams, (err, results) => {
    if (err) {
      logger.error('Query error:', err);
      return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
    }

    const countQuery = `
      SELECT COUNT(*) as total
      FROM audit_logs al
      LEFT JOIN applicants a ON al.applicant_id = a.id
      WHERE (? IS NULL OR al.applicant_id = ?)
        AND (? IS NULL OR al.action = ?)
        AND (? IS NULL OR al.status = ?)
        AND (? IS NULL OR al.timestamp >= ?)
        AND (? IS NULL OR al.timestamp <= ?)
    `;

    const countParams = [
      applicantIdVal, applicantIdVal,
      actionVal, actionVal,
      statusVal, statusVal,
      adjustedDateFrom, adjustedDateFrom,
      adjustedDateTo, adjustedDateTo,
    ];

    db.query(countQuery, countParams, (countErr, countResults) => {
      if (countErr) {
        logger.error('Count query error:', countErr);
        return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
      }

      const total = countResults[0].total;
      return paginated(res, SUCCESS_MESSAGES.LOGS_FETCHED, results, total, pageNum, limitNum);
    });
  });
};
