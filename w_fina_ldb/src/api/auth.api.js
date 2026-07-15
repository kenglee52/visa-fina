/**
 * Authentication API
 * Handles login, logout, and user authentication
 */
import axiosInstance from './axiosInstance';
import { API_ENDPOINTS, buildUrl } from '@/config/api.config';
import { STORAGE_KEYS } from '@/config/constants';

export const authAPI = {
  /**
   * Login with employee ID and password
   */
  login: (credentials) =>
    axiosInstance.post(API_ENDPOINTS.LOGIN, {
      id: credentials.employeeId,
      password: credentials.password,
    }),

  /**
   * Get current user from token (optional endpoint)
   */
  getCurrentUser: () =>
    axiosInstance.get(API_ENDPOINTS.USER),

  /**
   * Logout - clear local storage
   */
  // logout: () => {
  //   localStorage.removeItem(STORAGE_KEYS.TOKEN);
  //   localStorage.removeItem(STORAGE_KEYS.EMPLOYEE);
  // },
  logout: async () => {
    try {
      await axiosInstance.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      // ✅ ຖ້າ API ຜິດພາດ (ເຊັ່ນ token ໝົດອາຍຸແລ້ວ) ກໍ່ຍັງລຶບ local storage ຕໍ່ໄປປົກກະຕິ
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.EMPLOYEE);
    }
  },


  /**
   * Get stored token
   */
  getToken: () => localStorage.getItem(STORAGE_KEYS.TOKEN),

  /**
   * Get stored employee data
   */
  getEmployee: () => {
    const employee = localStorage.getItem(STORAGE_KEYS.EMPLOYEE);
    return employee ? JSON.parse(employee) : null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => !!localStorage.getItem(STORAGE_KEYS.TOKEN),

  /**
   * Store authentication data
   */
  setAuthData: (token, employee) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.EMPLOYEE, JSON.stringify(employee));
  },

  //  ✅ Heartbeat - ຍືດອາຍຸ session
   
  heartbeat: () => axiosInstance.post(API_ENDPOINTS.HEARTBEAT),
};
