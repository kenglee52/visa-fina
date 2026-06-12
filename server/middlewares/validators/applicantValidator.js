/**
 * Applicant Validation Middleware
 * Validates input data for applicant-related operations
 */

const { body, param, validationResult } = require('express-validator');
const { DOC_TYPES, GENDER, RELATIONSHIP_STATUS, FILE_TYPES } = require('../../config/constants');

/**
 * Validation result checker middleware
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

/**
 * Create Applicant Validation Rules
 */
const createApplicantRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 25 })
    .withMessage('Name must not exceed 25 characters'),
  body('surname')
    .trim()
    .notEmpty()
    .withMessage('Surname is required')
    .isLength({ max: 64 })
    .withMessage('Surname must not exceed 64 characters'),
  body('dob')
    .notEmpty()
    .withMessage('Date of birth is required')
    .isDate()
    .withMessage('Invalid date format'),
  body('village')
    .trim()
    .notEmpty()
    .withMessage('Village is required')
    .isLength({ max: 100 })
    .withMessage('Village must not exceed 100 characters'),
  body('gender')
    .trim()
    .notEmpty()
    .withMessage('Gender is required')
    .isIn(Object.values(GENDER))
    .withMessage('Invalid gender value'),
  body('province_id')
    .notEmpty()
    .withMessage('Province ID is required')
    .isInt()
    .withMessage('Province ID must be an integer'),
  body('district_id')
    .notEmpty()
    .withMessage('District ID is required')
    .isInt()
    .withMessage('District ID must be an integer'),
  body('relationship_status')
    .trim()
    .notEmpty()
    .withMessage('Relationship status is required')
    .isIn(Object.values(RELATIONSHIP_STATUS))
    .withMessage('Invalid relationship status'),
  body('doc_type')
    .trim()
    .notEmpty()
    .withMessage('Document type is required')
    .isIn(Object.values(DOC_TYPES))
    .withMessage('Invalid document type'),
  body('doc_number')
    .trim()
    .notEmpty()
    .withMessage('Document number is required')
    .isLength({ max: 50 })
    .withMessage('Document number must not exceed 50 characters'),
  body('issued_by')
    .trim()
    .notEmpty()
    .withMessage('Issued by is required')
    .isLength({ max: 100 })
    .withMessage('Issued by must not exceed 100 characters'),
  body('issued_date')
    .notEmpty()
    .withMessage('Issued date is required')
    .isDate()
    .withMessage('Invalid issued date format'),
  body('expiry_date')
    .notEmpty()
    .withMessage('Expiry date is required')
    .isDate()
    .withMessage('Invalid expiry date format'),
  body('lbd_ctm_key')
    .trim()
    .notEmpty()
    .withMessage('LBD CTM Key is required')
    .isLength({ max: 60 })
    .withMessage('LBD CTM Key must not exceed 60 characters'),
  body('fina_ctm_key')
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage('FINA CTM Key must not exceed 60 characters'),
  body('credit_rating')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Credit rating must not exceed 50 characters'),
  validateRequest
];

/**
 * Update Applicant Validation Rules
 */
const updateApplicantRules = [
  param('applicant_id')
    .notEmpty()
    .withMessage('Applicant ID is required')
    .isInt()
    .withMessage('Applicant ID must be an integer'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ max: 25 })
    .withMessage('Name must not exceed 25 characters'),
  body('surname')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Surname cannot be empty')
    .isLength({ max: 64 })
    .withMessage('Surname must not exceed 64 characters'),
  body('dob')
    .optional()
    .isDate()
    .withMessage('Invalid date format'),
  body('village')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Village cannot be empty'),
  body('gender')
    .optional()
    .isIn(Object.values(GENDER))
    .withMessage('Invalid gender value'),
  body('province_id')
    .optional()
    .isInt()
    .withMessage('Province ID must be an integer'),
  body('district_id')
    .optional()
    .isInt()
    .withMessage('District ID must be an integer'),
  body('relationship_status')
    .optional()
    .isIn(Object.values(RELATIONSHIP_STATUS))
    .withMessage('Invalid relationship status'),
  body('doc_type')
    .optional()
    .isIn(Object.values(DOC_TYPES))
    .withMessage('Invalid document type'),
  body('doc_number')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Document number cannot be empty'),
  body('issued_by')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Issued by cannot be empty'),
  body('issued_date')
    .optional()
    .isDate()
    .withMessage('Invalid issued date format'),
  body('expiry_date')
    .optional()
    .isDate()
    .withMessage('Invalid expiry date format'),
  validateRequest
];

/**
 * Get Applicant Validation Rules
 */
const getApplicantRules = [
  param('applicant_id')
    .notEmpty()
    .withMessage('Applicant ID is required')
    .isInt()
    .withMessage('Applicant ID must be an integer'),
  validateRequest
];

/**
 * Delete Document Validation Rules
 */
const deleteDocumentRules = [
  param('applicant_id')
    .notEmpty()
    .withMessage('Applicant ID is required')
    .isInt()
    .withMessage('Applicant ID must be an integer'),
  param('file_type')
    .notEmpty()
    .withMessage('File type is required')
    .isIn(Object.values(FILE_TYPES))
    .withMessage('Invalid file type'),
  validateRequest
];

/**
 * Check/Reject Document Validation Rules
 */
const checkDocumentRules = [
  body('applicant_id')
    .notEmpty()
    .withMessage('Applicant ID is required')
    .isInt()
    .withMessage('Applicant ID must be an integer'),
  validateRequest
];

const rejectDocumentRules = [
  body('applicant_id')
    .notEmpty()
    .withMessage('Applicant ID is required')
    .isInt()
    .withMessage('Applicant ID must be an integer'),
  body('feedback')
    .trim()
    .notEmpty()
    .withMessage('Feedback is required for rejection'),
  validateRequest
];

/**
 * Update FINA CTM Key Validation Rules
 */
const updateFinaCtmKeyRules = [
  body('applicant_id')
    .notEmpty()
    .withMessage('Applicant ID is required')
    .isInt()
    .withMessage('Applicant ID must be an integer'),
  body('fina_ctm_key')
    .trim()
    .notEmpty()
    .withMessage('FINA CTM Key is required')
    .isLength({ max: 60 })
    .withMessage('FINA CTM Key must not exceed 60 characters'),
  validateRequest
];

/**
 * Update Receiver (Confirm Received) Validation Rules
 */
const updateReceiverRules = [
  body('applicant_ids')
    .isArray()
    .withMessage('Applicant IDs must be an array')
    .notEmpty()
    .withMessage('At least one applicant ID is required'),
  body('applicant_ids.*')
    .isInt()
    .withMessage('Each applicant ID must be an integer'),
  body('receiver_id')
    .trim()
    .notEmpty()
    .withMessage('Receiver ID is required'),
  body('receiver_password')
    .trim()
    .notEmpty()
    .withMessage('Receiver password is required'),
  validateRequest
];

/**
 * Get Districts by Province Validation Rules
 */
const getDistrictsRules = [
  param('province_id')
    .notEmpty()
    .withMessage('Province ID is required')
    .isInt()
    .withMessage('Province ID must be an integer'),
  validateRequest
];

module.exports = {
  createApplicantRules,
  updateApplicantRules,
  getApplicantRules,
  deleteDocumentRules,
  checkDocumentRules,
  rejectDocumentRules,
  updateFinaCtmKeyRules,
  updateReceiverRules,
  getDistrictsRules
};
