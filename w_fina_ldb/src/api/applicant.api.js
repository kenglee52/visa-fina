/**
 * Applicant API
 * Handles all applicant-related operations
 */
import axiosInstance from './axiosInstance';
import { API_ENDPOINTS, buildUrl } from '@/config/api.config';

export const applicantAPI = {
  /**
   * Get paginated list of applicants (follow report)
   */
  getApplicants: (params) =>
    axiosInstance.get(API_ENDPOINTS.FOLLOW_REPORT, { params }),

  /**
   * Get single applicant by ID
   */
  getApplicantById: (id) =>
    axiosInstance.get(buildUrl(API_ENDPOINTS.GET_APPLICANT, { id })),

  /**
   * Create new applicant
   */
  createApplicant: (data) =>
    axiosInstance.post(API_ENDPOINTS.CREATE_APPLICANT, data),

  /**
   * Update applicant information
   */
  updateApplicant: (id, data) =>
    axiosInstance.put(buildUrl(API_ENDPOINTS.UPDATE_APPLICANT, { id }), data),

  /**
   * Delete applicant
   */
  deleteApplicant: (id) =>
    axiosInstance.delete(buildUrl(API_ENDPOINTS.DELETE_APPLICANT, { id })),

  /**
   * Check/approve document
   */
  checkDocument: (applicantId, employeeId) =>
    axiosInstance.put(API_ENDPOINTS.CHECK_DOCUMENT, {
      applicant_id: applicantId,
      employee_id: employeeId,
    }),

  /**
   * Reject document with feedback
   */
  rejectDocument: (applicantId, employeeId, feedback) =>
    axiosInstance.put(API_ENDPOINTS.REJECT_DOCUMENT, {
      applicant_id: applicantId,
      employee_id: employeeId,
      feedback,
    }),

  /**
   * Confirm card received
   */
  confirmReceived: (applicantIds, employeeId) =>
    axiosInstance.post(API_ENDPOINTS.CONFIRM_RECEIVED, {
      applicant_ids: applicantIds,
      employee_id: employeeId,
    }),

  /**
   * Update FINA CTM Key
   */
  updateFinaCtmKey: (applicantId, employeeId, finaCtmKey) =>
    axiosInstance.put(API_ENDPOINTS.UPDATE_FINA_CTM_KEY, {
      applicant_id: applicantId,
      employee_id: employeeId,
      fina_ctm_key: finaCtmKey,
    }),
};
