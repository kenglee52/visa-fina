/**
 * Admin API
 * Handles admin operations - employees, provinces, districts, audit logs
 */
import axiosInstance from './axiosInstance';
import { API_ENDPOINTS, buildUrl } from '@/config/api.config';

// Audit Logs
export const auditAPI = {
  /**
   * Get audit logs
   */
  getAuditLogs: (params) =>
    axiosInstance.get(API_ENDPOINTS.AUDIT_LOGS, { params }),

  /**
   * Get single audit log
   */
  getAuditLog: (id) =>
    axiosInstance.get(buildUrl(`${API_ENDPOINTS.AUDIT_LOG}/:id`, { id })),
};

// Employees
export const employeeAPI = {
  /**
   * Get all employees
   */
  getEmployees: () =>
    axiosInstance.get(API_ENDPOINTS.EMPLOYEES),

  /**
   * Get employee by ID
   */
  getEmployeeById: (id) =>
    axiosInstance.get(buildUrl(`${API_ENDPOINTS.EMPLOYEES}/:id`, { id })),

  /**
   * Create new employee
   */
  createEmployee: (data) =>
    axiosInstance.post(API_ENDPOINTS.CREATE_EMPLOYEE, data),

  /**
   * Update employee
   */
  updateEmployee: (id, data) =>
    axiosInstance.put(buildUrl(API_ENDPOINTS.UPDATE_EMPLOYEE, { id }), data),

  /**
   * Delete employee
   */
  deleteEmployee: (id) =>
    axiosInstance.delete(buildUrl(API_ENDPOINTS.DELETE_EMPLOYEE, { id })),
};

// Provinces
export const provinceAPI = {
  /**
   * Create new province
   */
  createProvince: (data) =>
    axiosInstance.post(API_ENDPOINTS.CREATE_PROVINCE, data),

  /**
   * Update province
   */
  updateProvince: (id, data) =>
    axiosInstance.put(buildUrl(API_ENDPOINTS.UPDATE_PROVINCE, { id }), data),

  /**
   * Delete province
   */
  deleteProvince: (id) =>
    axiosInstance.delete(buildUrl(API_ENDPOINTS.DELETE_PROVINCE, { id })),
};

// Districts
export const districtAPI = {
  /**
   * Create new district
   */
  createDistrict: (data) =>
    axiosInstance.post(API_ENDPOINTS.CREATE_DISTRICT, data),

  /**
   * Update district
   */
  updateDistrict: (id, data) =>
    axiosInstance.put(buildUrl(API_ENDPOINTS.UPDATE_DISTRICT, { id }), data),

  /**
   * Delete district
   */
  deleteDistrict: (id) =>
    axiosInstance.delete(buildUrl(API_ENDPOINTS.DELETE_DISTRICT, { id })),
};
