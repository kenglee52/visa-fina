/**
 * Application Constants
 * Centralized enum values and constants for the entire application
 */

// Applicant Status
const APPLICANT_STATUS = {
  IN_PROGRESS: 'in_progress',
  CHECKED: 'checked',
  REJECTED: 'rejected',
  ISSUED: 'issued',
  RECEIVED: 'received'
};

// Document Types
const DOC_TYPES = {
  ID_CARD: 'id_card',
  PASSPORT: 'passport',
  FAMILY_BOOK: 'family_book',
  OTHER: 'other'
};

// File Types for Applicant Documents
const FILE_TYPES = {
  CUSTOMER_REQUEST_FORM: 'customer_request_form',
  REQUEST_EARMARK_ACCOUNT: 'request_earmark_account',
  REGISTRATION_FORM_CREDIT_CARD: 'registration_form_credit_card',
  REGISTRATION_FORM_GIF_FINA: 'registration_form_gif_fina',
  FILE_TYP_5: 'file_typ_5', // ✅ ເພີ່ມໃໝ່
};

// Gender
const GENDER = {
  MALE: 'male',
  FEMALE: 'female'
};

// Relationship Status
const RELATIONSHIP_STATUS = {
  SINGLE: 'single',
  MARRIED: 'married',
  DIVORCED: 'divorced',
  WIDOWED: 'widowed'
};

// Employee Roles
const ROLES = {
  ADMIN: 'admin',
  VERIFIER: 'verifier',
  DATA_ENTRY: 'data_entry',
  RECEIVER: 'receiver'
};

// Audit Actions
const AUDIT_ACTIONS = {
  CHECK_DOCUMENT: 'check_document',
  ISSUE_CARD: 'issue_card',
  RECEIVE_CARD: 'receive_card',
  UPLOAD_DOCUMENTS: 'upload_documents',
  EDIT_DOCUMENTS: 'edit_documents',
  REJECTED: 'rejected',
  UPDATE_FINA_CTM_KEY: 'update_fina_ctm_key',
  DELETE_DOCUMENT: 'delete_document',
  CREATE_APPLICANT: 'create_applicant'
};

// HTTP Status Messages (Standardized English)
const ERROR_MESSAGES = {
  // Authentication
  UNAUTHORIZED: 'Unauthorized access',
  TOKEN_INVALID: 'Invalid or expired token',
  TOKEN_MISSING: 'No token provided',

  // Validation
  INVALID_CREDENTIALS: 'Invalid employee ID or password',
  MISSING_FIELDS: 'Please provide all required fields',
  INVALID_DATE_FORMAT: 'Invalid date format',
  INVALID_EMAIL: 'Invalid email format',
  INVALID_ID: 'Invalid ID format',

  // Resources
  NOT_FOUND: 'Resource not found',
  APPLICANT_NOT_FOUND: 'Applicant not found',
  EMPLOYEE_NOT_FOUND: 'Employee not found',
  PROVINCE_NOT_FOUND: 'Province not found',
  DISTRICT_NOT_FOUND: 'District not found',
  DOCUMENT_NOT_FOUND: 'Document not found',

  // Conflict
  ALREADY_EXISTS: 'Resource already exists',
  ID_ALREADY_EXISTS: 'ID already exists',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  FINA_CTM_KEY_EXISTS: 'FINA CTM Key already exists',
  LBD_CTM_KEY_EXISTS: 'LBD CTM Key already exists',
  PROVINCE_NAME_EXISTS: 'Province name already exists',
  DISTRICT_NAME_EXISTS: 'District name already exists in this province',
  KEYS_MUST_BE_DIFFERENT: 'FINA CTM Key and LBD CTM Key must be different',

  // Business Rules
  INVALID_RELATIONSHIP_STATUS: 'Invalid relationship status',
  INVALID_DOC_TYPE: 'Invalid document type',
  INVALID_GENDER: 'Invalid gender',
  INVALID_ROLE: 'Invalid role',
  INVALID_PROVINCE_DISTRICT: 'Invalid province or district',
  CANNOT_DELETE_REFERENCED: 'Cannot delete resource (referenced by other records)',

  // File Upload
  ONLY_PDF_ALLOWED: 'Only PDF files are allowed',
  FILE_TOO_LARGE: 'File size exceeds limit (max 5MB)',
  FILE_UPLOAD_FAILED: 'Failed to upload file',
  REGISTRATION_FORM_CREDIT_CARD_REQUIRED: 'Registration form credit card file is required',
  REGISTRATION_FORM_GIF_FINA_REQUIRED: 'Registration form GIF FINA file is required',
  FILE_TYP_5_REQUIRED: 'File typ 5 is required',

  // Server
  SERVER_ERROR: 'Internal server error',
  DATABASE_ERROR: 'Database error',
  DATABASE_CONNECTION_ERROR: 'Database connection error',
  TRANSACTION_ERROR: 'Transaction error'
};

const SUCCESS_MESSAGES = {
  // General
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  FETCHED: 'Resource fetched successfully',

  // Applicants
  APPLICANT_CREATED: 'Applicant created successfully',
  APPLICANT_UPDATED: 'Applicant updated successfully',
  APPLICANT_DELETED: 'Applicant deleted successfully',
  APPLICANT_FETCHED: 'Applicant fetched successfully',

  // Documents
  FILES_UPLOADED: 'Files uploaded successfully',
  DOCUMENT_DELETED: 'Document deleted successfully',
  DOCUMENT_CHECKED: 'Document checked successfully',
  DOCUMENT_REJECTED: 'Document rejected successfully',
  DOCUMENT_ISSUED: 'Document issued successfully',
  FINA_CTM_KEY_UPDATED: 'FINA CTM Key updated successfully',
  RECEIPT_CONFIRMED: 'Receipt confirmed successfully',

  // Employees
  EMPLOYEE_CREATED: 'Employee created successfully',
  EMPLOYEE_UPDATED: 'Employee updated successfully',
  EMPLOYEE_DELETED: 'Employee deleted successfully',
  EMPLOYEES_FETCHED: 'Employees retrieved successfully',
  EMPLOYEE_REGISTERED: 'Employee registered successfully',

  // Address
  PROVINCE_CREATED: 'Province created successfully',
  PROVINCE_UPDATED: 'Province updated successfully',
  PROVINCE_DELETED: 'Province deleted successfully',
  PROVINCES_FETCHED: 'Provinces retrieved successfully',
  DISTRICT_CREATED: 'District created successfully',
  DISTRICT_UPDATED: 'District updated successfully',
  DISTRICT_DELETED: 'District deleted successfully',
  DISTRICTS_FETCHED: 'Districts retrieved successfully',

  // Auth
  LOGIN_SUCCESS: 'Login successful',
  REGISTER_SUCCESS: 'Employee registered successfully',
  CURRENT_USER_FETCHED: 'Current user retrieved successfully',

  // Reports
  REPORT_FETCHED: 'Report fetched successfully',
  LOGS_FETCHED: 'Logs fetched successfully',

  // No Changes
  NO_CHANGES_DETECTED: 'No changes detected',
  NO_CHANGES: 'No changes'
};

module.exports = {
  APPLICANT_STATUS,
  DOC_TYPES,
  FILE_TYPES,
  GENDER,
  RELATIONSHIP_STATUS,
  ROLES,
  AUDIT_ACTIONS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
};
