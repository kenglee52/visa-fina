/**
 * API Configuration
 * Centralized API endpoints and configuration
 */

// API Base URL - supports environment variables
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.100.41:8001';

// API Timeout
export const API_TIMEOUT = 30000;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/login',
  USER: '/api/user',

  // Applicants
  CREATE_APPLICANT: '/api/create-applicants',
  GET_APPLICANT: '/api/applicant/:id',
  UPDATE_APPLICANT: '/api/update-applicant/:id',
  DELETE_APPLICANT: '/api/applicant/:id',
  FOLLOW_REPORT: '/api/follow-report',

  // Document Actions
  UPLOAD_DOCUMENTS: '/api/upload-documents',
  GET_DOCUMENTS: '/api/documents/:applicantId',
  DELETE_DOCUMENT: '/api/delete-document/:applicantId/:fileType',
  UPDATE_FINA_CTM_KEY: '/api/update-fina-ctm-key',

  // Verification
  CHECK_DOCUMENT: '/api/check_document',
  REJECT_DOCUMENT: '/api/reject_document',
  CONFIRM_RECEIVED: '/api/confirm-received',

  // Locations
  PROVINCES: '/api/provinces',
  DISTRICTS: '/api/districts/:provinceId',

  // Admin - Audit Logs
  AUDIT_LOG: '/api/audit-log',
  AUDIT_LOGS: '/api/audit-logs',

  // Admin - Employees
  EMPLOYEES: '/api/employee',
  CREATE_EMPLOYEE: '/api/employee',
  UPDATE_EMPLOYEE: '/api/employee/:id',
  DELETE_EMPLOYEE: '/api/employee/:id',

  // Admin - Provinces
  CREATE_PROVINCE: '/api/provinces',
  UPDATE_PROVINCE: '/api/provinces/:id',
  DELETE_PROVINCE: '/api/provinces/:id',

  // Admin - Districts
  CREATE_DISTRICT: '/api/districts',
  UPDATE_DISTRICT: '/api/districts/:id',
  DELETE_DISTRICT: '/api/districts/:id',
};

// Helper function to replace path parameters
export const buildUrl = (endpoint, params = {}) => {
  let url = endpoint;
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, value);
  });
  return url;
};
