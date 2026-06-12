/**
 * Location API
 * Handles provinces and districts
 */
import axiosInstance from './axiosInstance';
import { API_ENDPOINTS, buildUrl } from '@/config/api.config';

export const locationAPI = {
  /**
   * Get all provinces
   */
  getProvinces: () =>
    axiosInstance.get(API_ENDPOINTS.PROVINCES),

  /**
   * Get districts by province ID
   */
  getDistricts: (provinceId) =>
    axiosInstance.get(buildUrl(API_ENDPOINTS.DISTRICTS, { provinceId })),
};
