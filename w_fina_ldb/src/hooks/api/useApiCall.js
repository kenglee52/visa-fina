/**
 * API Call Hook
 * Generic hook for making API calls with loading and error states
 */
import { useState, useCallback } from 'react';

export const useApiCall = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  /**
   * Execute an API call
   * @param {Function} apiFunction - The API function to call
   * @param {Object} options - Options for the call
   */
  const execute = useCallback(async (apiFunction, options = {}) => {
    const {
      onSuccess,
      onError,
      showSuccessToast,
      showErrorToast,
      successMessage,
    } = options;

    setLoading(true);
    setError(null);

    try {
      const response = await apiFunction();
      const responseData = response.data.data || response.data;

      setData(responseData);

      if (onSuccess) {
        onSuccess(responseData);
      }

      return { success: true, data: responseData };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'An error occurred';
      setError(message);

      if (onError) {
        onError(err);
      }

      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    execute,
    loading,
    error,
    data,
    reset,
    setError,
  };
};
