/**
 * API Barrel Export
 * Central export point for all API modules
 */
export { default as axiosInstance } from './axiosInstance';
export { authAPI } from './auth.api';
export { applicantAPI } from './applicant.api';
export { documentAPI } from './document.api';
export { locationAPI } from './location.api';
export { auditAPI, employeeAPI, provinceAPI, districtAPI } from './admin.api';
