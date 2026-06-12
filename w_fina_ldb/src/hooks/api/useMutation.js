/**
 * Mutation Hook
 * For POST, PUT, DELETE operations
 */
import { useState, useCallback } from 'react';

export const useMutation = (mutationFn, options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const mutate = useCallback(async (variables) => {
    setLoading(true);
    setError(null);

    try {
      const result = await mutationFn(variables);
      setData(result);

      if (options.onSuccess) {
        options.onSuccess(result);
      }

      return { success: true, data: result };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Operation failed';
      setError(message);

      if (options.onError) {
        options.onError(err);
      }

      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [mutationFn, options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return {
    mutate,
    loading,
    error,
    data,
    reset,
  };
};
