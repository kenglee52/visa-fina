const db = require('../config/connect_DB');
const upload = require('../config/multer/uploadConfig');
const path = require('path');
const fs = require('fs');
const {
  APPLICANT_STATUS,
  DOC_TYPES,
  FILE_TYPES,
  GENDER,
  RELATIONSHIP_STATUS,
  AUDIT_ACTIONS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
} = require('../config/constants');
const {
  success,
  created,
  badRequest,
  unauthorized,
  notFound,
  conflict,
  serverError
} = require('../utils/response');
const logger = require('../utils/logger');

/**
 * Get applicant by ID with documents
 */
exports.getApplicant = (req, res) => {
  const { applicant_id } = req.params;

  if (!applicant_id) {
    return badRequest(res, ERROR_MESSAGES.MISSING_FIELDS);
  }

  const applicantQuery = `
    SELECT
      fina_ctm_key,
      lbd_ctm_key,
      credit_rating,
      name,
      surname,
      dob,
      village,
      gender,
      province_id,
      district_id,
      relationship_status,
      doc_type,
      doc_number,
      issued_by,
      issued_date,
      expiry_date
    FROM applicants
    WHERE id = ?
  `;
  const documentsQuery = `
    SELECT file_type, file_path
    FROM applicant_documents
    WHERE applicant_id = ?
  `;

  db.query(applicantQuery, [applicant_id], (err, applicantResults) => {
    if (err) {
      logger.error('Error fetching applicant:', err);
      return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
    }
    if (applicantResults.length === 0) {
      return notFound(res, ERROR_MESSAGES.APPLICANT_NOT_FOUND);
    }

    db.query(documentsQuery, [applicant_id], (docErr, documentResults) => {
      if (docErr) {
        logger.error('Error fetching documents:', docErr);
        return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
      }

      const documents = {
        customer_request_form: null,
        request_earmark_account: null,
        registration_form_credit_card: null,
        registration_form_gif_fina: null,
        file_typ_5: null,
      };

      documentResults.forEach((doc) => {
        if (Object.values(FILE_TYPES).includes(doc.file_type)) {
          documents[doc.file_type] = doc.file_path;
        }
      });

      return success(res, SUCCESS_MESSAGES.APPLICANT_FETCHED, {
        applicant: applicantResults[0],
        documents
      });
    });
  });
};

/**
 * Upload documents for an applicant
 */
exports.uploadDocuments = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      logger.error('Upload error:', err);
      console.error('❌ MULTER ERROR:', err); // ✅ ເພີ່ມ
      return badRequest(res, err.message || ERROR_MESSAGES.FILE_UPLOAD_FAILED);
    }

    console.log('✅ req.files received:', Object.keys(req.files || {})); // ✅ ເພີ່ມ
    console.log('✅ req.body:', req.body); // ✅ ເພີ່ມ

    const { applicant_id } = req.body;
    const data_entry_employee_id = req.user?.id;

    if (!applicant_id) {
      return badRequest(res, ERROR_MESSAGES.MISSING_FIELDS);
    }
    if (!data_entry_employee_id) {
      return unauthorized(res, ERROR_MESSAGES.TOKEN_MISSING);
    }
    // if (!req.files || !req.files['registration_form_credit_card']) {
    //   return badRequest(res, ERROR_MESSAGES.REGISTRATION_FORM_CREDIT_CARD_REQUIRED);
    // }
    // if (!req.files || !req.files['registration_form_gif_fina']) {
    //   return badRequest(res, ERROR_MESSAGES.REGISTRATION_FORM_GIF_FINA_REQUIRED);
    // }
    // // ✅ ເພີ່ມໃໝ່
    // if (!req.files || !req.files['file_typ_5']) {
    //   return badRequest(res, ERROR_MESSAGES.FILE_TYP_5_REQUIRED);
    // }
    // ✅ ແກ້ໃຫ້ກວດທຸກໄຟລ໌ທີ່ບັງຄັບ
    const requiredFileTypes = [
      'registration_form_credit_card',
      'registration_form_gif_fina',
      'customer_request_form',
      'request_earmark_account',
      'file_typ_5',
    ];

    for (const ft of requiredFileTypes) {
      if (!req.files || !req.files[ft]) {
        return badRequest(res, `${ft} is required`);
      }
    }

    db.getConnection((err, connection) => {
      if (err) {
        logger.error('Error getting connection:', err);
        return serverError(res, ERROR_MESSAGES.DATABASE_CONNECTION_ERROR);
      }

      connection.beginTransaction((txErr) => {
        if (txErr) {
          connection.release();
          logger.error('Error starting transaction:', txErr);
          return serverError(res, ERROR_MESSAGES.TRANSACTION_ERROR);
        }

        const checkApplicantQuery = 'SELECT id FROM applicants WHERE id = ?';
        connection.query(checkApplicantQuery, [applicant_id], (checkErr, results) => {
          if (checkErr) {
            return connection.rollback(() => {
              connection.release();
              logger.error('Error checking applicant:', checkErr);
              serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
            });
          }
          if (results.length === 0) {
            return connection.rollback(() => {
              connection.release();
              notFound(res, ERROR_MESSAGES.APPLICANT_NOT_FOUND);
            });
          }

          // const insertQuery = 'INSERT INTO applicant_documents (applicant_id, file_type, file_path) VALUES (?, ?, ?)';
          // const uploadedFiles = [];
          // const errors = [];
          // const fileTypes = Object.values(FILE_TYPES);

          // let filesProcessed = 0;
          // const filesToProcess = fileTypes.filter(ft => req.files[ft]).length;

          // fileTypes.forEach((fileType) => {
          //   if (!req.files[fileType]) {
          //     filesProcessed++;
          //     if (filesProcessed === filesToProcess) {
          //       finalizeUpload();
          //     }
          //     return;
          //   }
          //   const file = req.files[fileType][0];
          //   const file_path = `applicant_documents/${fileType}/${file.filename}`;

          //   connection.query(insertQuery, [applicant_id, fileType, file_path], (insertErr) => {
          //     if (insertErr) {
          //       errors.push(`Failed to store ${fileType}: ${insertErr.message}`);
          //     } else {
          //       uploadedFiles.push({ applicant_id, file_type: fileType, file_path });
          //     }
          //     filesProcessed++;
          //     if (filesProcessed === filesToProcess) {
          //       finalizeUpload();
          //     }
          //   });
          // });
          const insertQuery = 'INSERT INTO applicant_documents (applicant_id, file_type, file_path) VALUES (?, ?, ?)';
          const uploadedFiles = [];
          const errors = [];
          const fileTypes = Object.values(FILE_TYPES);

          // ✅ ກັ່ນສະເພາະໄຟລ໌ທີ່ມາຈິງໆ
          const presentFiles = fileTypes.filter(ft => req.files && req.files[ft]);

          console.log('📁 Files to process:', presentFiles); // debug

          // ✅ ຖ້າບໍ່ມີໄຟລ໌ເລີຍ
          if (presentFiles.length === 0) {
            return badRequest(res, 'No files uploaded');
          }

          let filesProcessed = 0;

          presentFiles.forEach((fileType) => {
            const file = req.files[fileType][0];
            const file_path = `applicant_documents/${fileType}/${file.filename}`;

            connection.query(insertQuery, [applicant_id, fileType, file_path], (insertErr) => {
              if (insertErr) {
                console.error('❌ Insert error:', insertErr); // debug
                errors.push(`Failed to store ${fileType}: ${insertErr.message}`);
              } else {
                uploadedFiles.push({ applicant_id, file_type: fileType, file_path });
              }
              filesProcessed++;
              if (filesProcessed === presentFiles.length) {
                finalizeUpload();
              }
            });
          });

          function finalizeUpload() {
            if (errors.length > 0) {
              return connection.rollback(() => {
                connection.release();
                serverError(res, ERROR_MESSAGES.DATABASE_ERROR, { errors });
              });
            }

            const insertAuditQuery = `
              INSERT INTO audit_logs (applicant_id, data_entry_employee_id, action, status, timestamp)
              VALUES (?, ?, ?, ?, NOW())
            `;
            connection.query(insertAuditQuery, [applicant_id, data_entry_employee_id, AUDIT_ACTIONS.UPLOAD_DOCUMENTS, APPLICANT_STATUS.IN_PROGRESS], (auditErr) => {
              if (auditErr) {
                logger.error('Error inserting audit log:', auditErr);
                return connection.rollback(() => {
                  connection.release();
                  serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
                });
              }

              connection.commit((commitErr) => {
                if (commitErr) {
                  return connection.rollback(() => {
                    connection.release();
                    logger.error('Error committing transaction:', commitErr);
                    serverError(res, ERROR_MESSAGES.TRANSACTION_ERROR);
                  });
                }
                connection.release();
                return created(res, SUCCESS_MESSAGES.FILES_UPLOADED, { documents: uploadedFiles });
              });
            });
          }
        });
      });
    });
  });
};

/**
 * Create new applicant
 */
exports.createApplicant = (req, res) => {
  const {
    fina_ctm_key,
    lbd_ctm_key,
    credit_rating,
    name,
    surname,
    dob,
    village,
    gender,
    province_id,
    district_id,
    relationship_status,
    doc_type,
    doc_number,
    issued_by,
    issued_date,
    expiry_date,
  } = req.body;

  const data_entry_employee_id = req.user?.id;

  if (!data_entry_employee_id) {
    return unauthorized(res, ERROR_MESSAGES.TOKEN_MISSING);
  }

  // Validation
  const requiredFields = [
    { field: name, name: 'name' },
    { field: surname, name: 'surname' },
    { field: dob, name: 'dob' },
    { field: village, name: 'village' },
    { field: gender, name: 'gender' },
    { field: province_id, name: 'province_id' },
    { field: district_id, name: 'district_id' },
    { field: relationship_status, name: 'relationship_status' },
    { field: doc_type, name: 'doc_type' },
    { field: doc_number, name: 'doc_number' },
    { field: issued_by, name: 'issued_by' },
    { field: issued_date, name: 'issued_date' },
    { field: expiry_date, name: 'expiry_date' },
    { field: lbd_ctm_key, name: 'lbd_ctm_key' },
  ];

  const missingField = requiredFields.find(f => !f.field);
  if (missingField) {
    return badRequest(res, ERROR_MESSAGES.MISSING_FIELDS);
  }

  // Validate dates
  if (isNaN(Date.parse(dob)) || isNaN(Date.parse(issued_date)) || isNaN(Date.parse(expiry_date))) {
    return badRequest(res, ERROR_MESSAGES.INVALID_DATE_FORMAT);
  }

  // Validate enums
  if (!Object.values(RELATIONSHIP_STATUS).includes(relationship_status)) {
    return badRequest(res, ERROR_MESSAGES.INVALID_RELATIONSHIP_STATUS);
  }

  if (!Object.values(DOC_TYPES).includes(doc_type)) {
    return badRequest(res, ERROR_MESSAGES.INVALID_DOC_TYPE);
  }

  if (!Object.values(GENDER).includes(gender)) {
    return badRequest(res, ERROR_MESSAGES.INVALID_GENDER);
  }

  // Check if keys are different
  if (fina_ctm_key && lbd_ctm_key && fina_ctm_key === lbd_ctm_key) {
    return conflict(res, ERROR_MESSAGES.KEYS_MUST_BE_DIFFERENT);
  }

  db.getConnection((err, connection) => {
    if (err) {
      logger.error('Error getting connection:', err);
      return serverError(res, ERROR_MESSAGES.DATABASE_CONNECTION_ERROR);
    }

    connection.beginTransaction((txErr) => {
      if (txErr) {
        connection.release();
        logger.error('Error starting transaction:', txErr);
        return serverError(res, ERROR_MESSAGES.TRANSACTION_ERROR);
      }

      const checkKeysQuery = `
        SELECT fina_ctm_key, lbd_ctm_key
        FROM applicants
        WHERE fina_ctm_key = ? OR lbd_ctm_key = ?
      `;
      connection.query(checkKeysQuery, [fina_ctm_key || null, lbd_ctm_key], (checkErr, results) => {
        if (checkErr) {
          logger.error('Error checking keys:', checkErr);
          return connection.rollback(() => {
            connection.release();
            serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
          });
        }

        if (results.length > 0) {
          const existing = results[0];
          if (fina_ctm_key && existing.fina_ctm_key === fina_ctm_key) {
            return connection.rollback(() => {
              connection.release();
              conflict(res, ERROR_MESSAGES.FINA_CTM_KEY_EXISTS);
            });
          }
          if (existing.lbd_ctm_key === lbd_ctm_key) {
            return connection.rollback(() => {
              connection.release();
              conflict(res, ERROR_MESSAGES.LBD_CTM_KEY_EXISTS);
            });
          }
        }

        // Validate location
        const checkLocationQuery = `
          SELECT d.id
          FROM districts d
          JOIN provinces p ON d.province_id = p.id
          WHERE d.id = ? AND p.id = ?
        `;
        connection.query(checkLocationQuery, [district_id, province_id], (locErr, locResults) => {
          if (locErr) {
            logger.error('Error checking location:', locErr);
            return connection.rollback(() => {
              connection.release();
              serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
            });
          }

          if (locResults.length === 0) {
            return connection.rollback(() => {
              connection.release();
              badRequest(res, ERROR_MESSAGES.INVALID_PROVINCE_DISTRICT);
            });
          }

          // 🟢 ຍ້າຍການກວດສອບເລກທີເອກະສານ (doc_number) ມາໄວ້ບ່ອນນີ້ ກ່ອນການ Insert
          const validatedocument = 'SELECT doc_type FROM applicants WHERE doc_number = ? AND doc_type = ?';
          connection.query(validatedocument, [doc_number, doc_type], (docCheckErr, docCheckResults) => {
            if (docCheckErr) {
              logger.error('Error checking document existence:', docCheckErr);
              return connection.rollback(() => {
                connection.release();
                serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
              });
            }

            if (docCheckResults.length > 0) {
              return connection.rollback(() => {
                connection.release();
                return res.status(409).json({
                  status: 'error',
                  message: "ເລກທີໃນປະເພດເອກະສານນີ້ມີຢູ່ແລ້ວ",
                });
              });
            }

            // 🟢 ຖ້າເອກະສານບໍ່ຊ້ຳ ຈຶ່ງຈະເລີ່ມຂະບວນການ INSERT ຢູ່ດ້ານໃນ Callback ນີ້ເລີຍ
            const insertQuery = `
              INSERT INTO applicants (
                fina_ctm_key, lbd_ctm_key, credit_rating, name, surname, dob, village, gender,
                province_id, district_id, relationship_status, doc_type, doc_number,
                issued_by, issued_date, expiry_date
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const values = [
              fina_ctm_key || null,
              lbd_ctm_key,
              credit_rating || null,
              name,
              surname,
              dob,
              village,
              gender,
              province_id,
              district_id,
              relationship_status,
              doc_type,
              doc_number,
              issued_by,
              issued_date,
              expiry_date,
            ];

            connection.query(insertQuery, values, (insertErr, result) => {
              if (insertErr) {
                logger.error('Error inserting applicant:', insertErr);
                return connection.rollback(() => {
                  connection.release();
                  serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
                });
              }

              const applicantId = result.insertId;
              connection.commit((commitErr) => {
                if (commitErr) {
                  logger.error('Error committing transaction:', commitErr);
                  return connection.rollback(() => {
                    connection.release();
                    serverError(res, ERROR_MESSAGES.TRANSACTION_ERROR);
                  });
                }
                connection.release();
                return created(res, SUCCESS_MESSAGES.APPLICANT_CREATED, {
                  applicant: {
                    id: applicantId,
                    fina_ctm_key,
                    lbd_ctm_key,
                    credit_rating,
                    name,
                    surname,
                    dob,
                    village,
                    gender,
                    province_id,
                    district_id,
                    relationship_status,
                    doc_type,
                    doc_number,
                    issued_by,
                    issued_date,
                    expiry_date,
                  },
                });
              }); // End commit // End audit query
            }); // End insert query
          }); // End document check query
        }); // End location query
      }); // End keys check query
    }); // End beginTransaction
  }); // End getConnection
};

/**
 * Get provinces
 * Note: This should be moved to address/provinces controller
 */
exports.getProvinces = (req, res) => {
  const query = 'SELECT id, name FROM provinces ORDER BY name';
  db.query(query, (err, results) => {
    if (err) {
      logger.error('Error fetching provinces:', err);
      return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
    }
    return success(res, SUCCESS_MESSAGES.PROVINCES_FETCHED, { provinces: results || [] });
  });
};

/**
 * Get districts by province
 * Note: This should be moved to address/districts controller
 */
exports.getDistricts = (req, res) => {
  const { province_id } = req.params;

  if (!province_id) {
    return badRequest(res, ERROR_MESSAGES.MISSING_FIELDS);
  }

  const query = 'SELECT id, name FROM districts WHERE province_id = ? ORDER BY name';
  db.query(query, [province_id], (err, results) => {
    if (err) {
      logger.error('Error fetching districts:', err);
      return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
    }
    return success(res, SUCCESS_MESSAGES.DISTRICTS_FETCHED, { districts: results || [] });
  });
};

/**
 * Get documents for an applicant
 */
exports.getDocuments = (req, res) => {
  const { applicant_id } = req.params;

  if (!applicant_id) {
    return badRequest(res, ERROR_MESSAGES.MISSING_FIELDS);
  }

  const query = 'SELECT file_type, file_path FROM applicant_documents WHERE applicant_id = ?';
  db.query(query, [applicant_id], (err, results) => {
    if (err) {
      logger.error('Error fetching documents:', err);
      return serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
    }

    const documents = {};
    Object.values(FILE_TYPES).forEach(type => {
      documents[type] = null;
    });

    results.forEach((doc) => {
      if (Object.values(FILE_TYPES).includes(doc.file_type)) {
        documents[doc.file_type] = doc.file_path;
      }
    });

    return success(res, SUCCESS_MESSAGES.FETCHED, { documents });
  });
};

/**
 * Delete old file helper function
 */
const deleteOldFile = (applicant_id, fileType, connection, callback) => {
  connection.query(
    'SELECT file_path FROM applicant_documents WHERE applicant_id = ? AND file_type = ?',
    [applicant_id, fileType],
    (err, results) => {
      if (err) {
        logger.error(`Error querying old file for ${fileType}:`, err);
        return callback(err);
      }
      if (results.length === 0) {
        logger.debug(`No existing file found for ${fileType} for applicant_id ${applicant_id}`);
        return callback(null);
      }

      const file_path = results[0].file_path;
      const fullPath = path.join(process.cwd(), file_path);
      logger.debug(`Attempting to delete file: ${fullPath}`);

      fs.access(fullPath, fs.constants.F_OK | fs.constants.W_OK, (accessErr) => {
        if (accessErr && accessErr.code !== 'ENOENT') {
          logger.error(`Error accessing file ${fullPath}:`, accessErr);
          return callback(new Error(`Cannot access file ${fileType}: ${accessErr.message}`));
        }
        logger.debug(`File ${fullPath} exists: ${!accessErr}`);

        fs.unlink(fullPath, (unlinkErr) => {
          if (unlinkErr && unlinkErr.code !== 'ENOENT') {
            logger.error(`Error deleting file ${fullPath}:`, unlinkErr);
            return callback(new Error(`Failed to delete file ${fileType}: ${unlinkErr.message}`));
          }
          logger.debug(
            unlinkErr?.code === 'ENOENT'
              ? `File ${fullPath} not found, proceeding with database deletion`
              : `Deleted file: ${fullPath}`
          );

          connection.query(
            'DELETE FROM applicant_documents WHERE applicant_id = ? AND file_type = ?',
            [applicant_id, fileType],
            (deleteErr) => {
              if (deleteErr) {
                logger.error(`Error deleting document record for ${fileType}:`, deleteErr);
                return callback(deleteErr);
              }
              logger.debug(`Deleted document record for ${fileType} from database`);
              callback(null);
            }
          );
        });
      });
    }
  );
};

/**
 * Update applicant with optional file uploads
 */
exports.updateApplicant = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      logger.error('Multer error:', err);
      return badRequest(res, err.message || ERROR_MESSAGES.FILE_UPLOAD_FAILED);
    }

    const { applicant_id } = req.params;
    const {
      fina_ctm_key,
      lbd_ctm_key,
      credit_rating,
      name,
      surname,
      dob,
      village,
      gender,
      province_id,
      district_id,
      relationship_status,
      doc_type,
      doc_number,
      issued_by,
      issued_date,
      expiry_date,
    } = req.body;

    const data_entry_employee_id = req.user?.id;

    if (!data_entry_employee_id) {
      return unauthorized(res, ERROR_MESSAGES.TOKEN_MISSING);
    }

    const requiredFields = [
      { field: name, name: 'name' },
      { field: surname, name: 'surname' },
      { field: dob, name: 'dob' },
      { field: village, name: 'village' },
      { field: gender, name: 'gender' },
      { field: province_id, name: 'province_id' },
      { field: district_id, name: 'district_id' },
      { field: relationship_status, name: 'relationship_status' },
      { field: doc_type, name: 'doc_type' },
      { field: doc_number, name: 'doc_number' },
      { field: issued_by, name: 'issued_by' },
      { field: issued_date, name: 'issued_date' },
      { field: expiry_date, name: 'expiry_date' },
      { field: lbd_ctm_key, name: 'lbd_ctm_key' },
    ];

    const missingField = requiredFields.find(f => !f.field);
    if (missingField) {
      return badRequest(res, ERROR_MESSAGES.MISSING_FIELDS);
    }

    if (isNaN(Date.parse(dob)) || isNaN(Date.parse(issued_date)) || isNaN(Date.parse(expiry_date))) {
      return badRequest(res, ERROR_MESSAGES.INVALID_DATE_FORMAT);
    }

    if (!Object.values(RELATIONSHIP_STATUS).includes(relationship_status)) {
      return badRequest(res, ERROR_MESSAGES.INVALID_RELATIONSHIP_STATUS);
    }

    if (!Object.values(DOC_TYPES).includes(doc_type)) {
      return badRequest(res, ERROR_MESSAGES.INVALID_DOC_TYPE);
    }

    if (!Object.values(GENDER).includes(gender)) {
      return badRequest(res, ERROR_MESSAGES.INVALID_GENDER);
    }

    if (fina_ctm_key && lbd_ctm_key && fina_ctm_key === lbd_ctm_key) {
      return conflict(res, ERROR_MESSAGES.KEYS_MUST_BE_DIFFERENT);
    }

    db.getConnection((err, connection) => {
      if (err) {
        logger.error('Error getting connection:', err);
        return serverError(res, ERROR_MESSAGES.DATABASE_CONNECTION_ERROR);
      }

      connection.beginTransaction((txErr) => {
        if (txErr) {
          connection.release();
          logger.error('Error starting transaction:', txErr);
          return serverError(res, ERROR_MESSAGES.TRANSACTION_ERROR);
        }

        connection.query('SELECT * FROM applicants WHERE id = ?', [applicant_id], (checkErr, applicantResults) => {
          if (checkErr) {
            logger.error('Error checking applicant:', checkErr);
            return connection.rollback(() => {
              connection.release();
              serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
            });
          }
          if (applicantResults.length === 0) {
            return connection.rollback(() => {
              connection.release();
              notFound(res, ERROR_MESSAGES.APPLICANT_NOT_FOUND);
            });
          }

          const currentData = applicantResults[0];
          const updateFields = {};
          const fieldsToCheck = [
            'fina_ctm_key',
            'lbd_ctm_key',
            'credit_rating',
            'name',
            'surname',
            'dob',
            'village',
            'gender',
            'province_id',
            'district_id',
            'relationship_status',
            'doc_type',
            'doc_number',
            'issued_by',
            'issued_date',
            'expiry_date',
          ];

          fieldsToCheck.forEach((field) => {
            const newValue = req.body[field];
            if (newValue !== undefined && newValue !== null && newValue !== currentData[field]) {
              updateFields[field] = newValue;
            }
          });

          // ✅ ບັງຄັບ update current_status ເປັນ in_progress ສະເໝີ
          updateFields['current_status'] = APPLICANT_STATUS.IN_PROGRESS;

          connection.query(
            'SELECT fina_ctm_key, lbd_ctm_key FROM applicants WHERE (fina_ctm_key = ? OR lbd_ctm_key = ?) AND id != ?',
            [fina_ctm_key || null, lbd_ctm_key, applicant_id],
            (keyErr, keyResults) => {
              if (keyErr) {
                logger.error('Error checking keys:', keyErr);
                return connection.rollback(() => {
                  connection.release();
                  serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
                });
              }
              if (keyResults.length > 0) {
                const existing = keyResults[0];
                if (fina_ctm_key && existing.fina_ctm_key === fina_ctm_key) {
                  return connection.rollback(() => {
                    connection.release();
                    conflict(res, ERROR_MESSAGES.FINA_CTM_KEY_EXISTS);
                  });
                }
                if (existing.lbd_ctm_key === lbd_ctm_key) {
                  return connection.rollback(() => {
                    connection.release();
                    conflict(res, ERROR_MESSAGES.LBD_CTM_KEY_EXISTS);
                  });
                }
              }

              connection.query(
                'SELECT d.id FROM districts d JOIN provinces p ON d.province_id = p.id WHERE d.id = ? AND p.id = ?',
                [district_id, province_id],
                (locErr, locResults) => {
                  if (locErr) {
                    logger.error('Error checking location:', locErr);
                    return connection.rollback(() => {
                      connection.release();
                      serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
                    });
                  }
                  if (locResults.length === 0) {
                    return connection.rollback(() => {
                      connection.release();
                      badRequest(res, ERROR_MESSAGES.INVALID_PROVINCE_DISTRICT);
                    });
                  }

                  const checkCertificateQuery = `
                    SELECT id FROM applicants
                    WHERE doc_type = ? AND doc_number = ? AND id != ?
                  `;

                  connection.query(
                    checkCertificateQuery,
                    [doc_type, doc_number, applicant_id],
                    (certErr, certResults) => {
                      if (certErr) {
                        logger.error('Error checking document:', certErr);
                        return connection.rollback(() => {
                          connection.release();
                          serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
                        });
                      }

                      if (certResults.length > 0) {
                        return connection.rollback(() => {
                          connection.release();
                          return conflict(res, 'ເລກເອກະສານນີ້ມີຢູ່ແລ້ວ');
                        });
                      }

                      const uploadedFiles = [];
                      let updated = false;

                      const updateApplicantQuery = `
                        UPDATE applicants SET
                          ${Object.keys(updateFields).map(field => `${field} = ?`).join(', ')}
                        WHERE id = ?
                      `;
                      const values = [...Object.values(updateFields), applicant_id];

                      const executeNextStep = () => {
                        const fileTypes = Object.values(FILE_TYPES);
                        const fileErrors = [];
                        let filesProcessed = 0;
                        const filesToProcess = fileTypes.filter(ft => req.files[ft]).length;

                        if (filesToProcess === 0) {
                          logger.debug('No files to upload, proceeding to audit log');
                          insertAuditLog();
                          return;
                        }

                        fileTypes.forEach((fileType) => {
                          if (!req.files[fileType]) {
                            filesProcessed++;
                            if (filesProcessed === filesToProcess) {
                              finalizeFileUpdate();
                            }
                            return;
                          }

                          const file = req.files[fileType][0];
                          const new_file_path = `applicant_documents/${fileType}/${file.filename}`;
                          logger.debug(`Uploading new file: ${new_file_path}`);

                          deleteOldFile(applicant_id, fileType, connection, (delErr) => {
                            if (delErr) {
                              fileErrors.push(`Failed to delete old file for ${fileType}: ${delErr.message}`);
                              filesProcessed++;
                              if (filesProcessed === filesToProcess) {
                                finalizeFileUpdate();
                              }
                              return;
                            }

                            connection.query(
                              'INSERT INTO applicant_documents (applicant_id, file_type, file_path) VALUES (?, ?, ?)',
                              [applicant_id, fileType, new_file_path],
                              (insertErr) => {
                                if (insertErr) {
                                  logger.error(`Error inserting new file ${fileType}:`, insertErr);
                                  fileErrors.push(`Failed to insert new file ${fileType}: ${insertErr.message}`);
                                } else {
                                  uploadedFiles.push({ applicant_id, file_type: fileType, file_path: new_file_path });
                                  updated = true;
                                }
                                filesProcessed++;
                                if (filesProcessed === filesToProcess) {
                                  finalizeFileUpdate();
                                }
                              }
                            );
                          });
                        });

                        function finalizeFileUpdate() {
                          if (fileErrors.length > 0) {
                            logger.error('File update errors:', fileErrors);
                            return connection.rollback(() => {
                              connection.release();
                              serverError(res, ERROR_MESSAGES.DATABASE_ERROR, { errors: fileErrors });
                            });
                          }
                          insertAuditLog();
                        }
                      };

                      function insertAuditLog() {
                        connection.query(
                          'INSERT INTO audit_logs (applicant_id, data_entry_employee_id, action, status, timestamp) VALUES (?, ?, ?, ?, NOW())',
                          [applicant_id, data_entry_employee_id, AUDIT_ACTIONS.EDIT_DOCUMENTS, APPLICANT_STATUS.IN_PROGRESS],
                          (auditErr) => {
                            if (auditErr) {
                              logger.error('Error inserting audit log:', auditErr);
                              return connection.rollback(() => {
                                connection.release();
                                serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
                              });
                            }

                            connection.commit((commitErr) => {
                              if (commitErr) {
                                logger.error('Error committing transaction:', commitErr);
                                return connection.rollback(() => {
                                  connection.release();
                                  serverError(res, ERROR_MESSAGES.TRANSACTION_ERROR);
                                });
                              }
                              connection.release();
                              return success(res, SUCCESS_MESSAGES.APPLICANT_UPDATED, { documents: uploadedFiles });
                            });
                          }
                        );
                      }

                      connection.query(updateApplicantQuery, values, (updateErr) => {
                        if (updateErr) {
                          logger.error('Error updating applicant:', updateErr);
                          return connection.rollback(() => {
                            connection.release();
                            serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
                          });
                        }
                        updated = true;
                        executeNextStep();
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
  });
};

/**
 * Delete document for an applicant
 */
exports.deleteDocument = (req, res) => {
  const { applicant_id, file_type } = req.params;
  const data_entry_employee_id = req.user?.id;

  if (!data_entry_employee_id) {
    return unauthorized(res, ERROR_MESSAGES.TOKEN_MISSING);
  }

  if (!Object.values(FILE_TYPES).includes(file_type)) {
    return badRequest(res, ERROR_MESSAGES.INVALID_DOC_TYPE);
  }

  db.getConnection((err, connection) => {
    if (err) {
      logger.error('Error getting connection:', err);
      return serverError(res, ERROR_MESSAGES.DATABASE_CONNECTION_ERROR);
    }

    connection.beginTransaction((txErr) => {
      if (txErr) {
        logger.error('Error starting transaction:', txErr);
        connection.release();
        return serverError(res, ERROR_MESSAGES.TRANSACTION_ERROR);
      }

      connection.query(
        'SELECT file_path FROM applicant_documents WHERE applicant_id = ? AND file_type = ?',
        [applicant_id, file_type],
        (err, results) => {
          if (err) {
            logger.error(`Error querying document for ${file_type}:`, err);
            return connection.rollback(() => {
              connection.release();
              serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
            });
          }
          if (results.length === 0) {
            return connection.rollback(() => {
              connection.release();
              notFound(res, ERROR_MESSAGES.DOCUMENT_NOT_FOUND);
            });
          }

          const file_path = results[0].file_path;
          const fullPath = path.join(process.cwd(), file_path);

          fs.access(fullPath, fs.constants.F_OK | fs.constants.W_OK, (accessErr) => {
            if (accessErr && accessErr.code !== 'ENOENT') {
              logger.error(`Error accessing file ${fullPath}:`, accessErr);
              return connection.rollback(() => {
                connection.release();
                serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
              });
            }

            fs.unlink(fullPath, (unlinkErr) => {
              if (unlinkErr && unlinkErr.code !== 'ENOENT') {
                logger.error(`Error deleting file ${fullPath}:`, unlinkErr);
                return connection.rollback(() => {
                  connection.release();
                  serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
                });
              }
              logger.debug(
                unlinkErr?.code === 'ENOENT'
                  ? `File ${fullPath} not found, proceeding with database deletion`
                  : `Deleted file: ${fullPath}`
              );

              connection.query(
                'DELETE FROM applicant_documents WHERE applicant_id = ? AND file_type = ?',
                [applicant_id, file_type],
                (deleteErr) => {
                  if (deleteErr) {
                    logger.error(`Error deleting document record for ${file_type}:`, deleteErr);
                    return connection.rollback(() => {
                      connection.release();
                      serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
                    });
                  }

                  connection.query(
                    'INSERT INTO audit_logs (applicant_id, data_entry_employee_id, action, status, timestamp) VALUES (?, ?, ?, ?, NOW())',
                    [applicant_id, data_entry_employee_id, AUDIT_ACTIONS.EDIT_DOCUMENTS, APPLICANT_STATUS.IN_PROGRESS],
                    (auditErr) => {
                      if (auditErr) {
                        logger.error('Error inserting audit log:', auditErr);
                        return connection.rollback(() => {
                          connection.release();
                          serverError(res, ERROR_MESSAGES.DATABASE_ERROR);
                        });
                      }

                      connection.commit((commitErr) => {
                        if (commitErr) {
                          logger.error('Error committing transaction:', commitErr);
                          return connection.rollback(() => {
                            connection.release();
                            serverError(res, ERROR_MESSAGES.TRANSACTION_ERROR);
                          });
                        }
                        connection.release();
                        logger.debug(`Document ${file_type} deleted successfully for applicant_id ${applicant_id}`);
                        return success(res, SUCCESS_MESSAGES.DOCUMENT_DELETED);
                      });
                    }
                  );
                }
              );
            });
          });
        }
      );
    });
  });
};
