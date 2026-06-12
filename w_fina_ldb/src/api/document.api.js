/**
 * Document API
 * Handles document upload and management
 */
import axiosInstance from './axiosInstance';
import { API_ENDPOINTS, buildUrl } from '@/config/api.config';

export const documentAPI = {
  /**
   * Get documents for an applicant
   */
  getDocuments: (applicantId) =>
    axiosInstance.get(buildUrl(API_ENDPOINTS.GET_DOCUMENTS, { applicantId })),

  /**
   * Upload documents for an applicant
   */
  uploadDocuments: (applicantId, formData) =>
    axiosInstance.post(API_ENDPOINTS.UPLOAD_DOCUMENTS, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  /**
   * Delete a specific document
   */
  deleteDocument: (applicantId, fileType) =>
    axiosInstance.delete(
      buildUrl(API_ENDPOINTS.DELETE_DOCUMENT, { applicantId, fileType })
    ),
};
