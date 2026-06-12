/**
 * Toast Hook
 * Unified toast notifications using Sonner
 */
import { useCallback } from 'react';
import { toast } from 'sonner';

export const useToast = () => {
  /**
   * Show toast notification
   */
  const showToast = useCallback((message, type = 'info', options = {}) => {
    const toastMethods = {
      success: () => toast.success(message, options),
      error: () => toast.error(message, options),
      warning: () => toast.warning(message, options),
      info: () => toast.info(message, options),
    };

    (toastMethods[type] || toastMethods.info)();
  }, []);

  /**
   * Show success toast
   */
  const showSuccess = useCallback((message, options) => {
    toast.success(message, options);
  }, []);

  /**
   * Show error toast
   */
  const showError = useCallback((message, options) => {
    toast.error(message, options);
  }, []);

  /**
   * Show warning toast
   */
  const showWarning = useCallback((message, options) => {
    toast.warning(message, options);
  }, []);

  /**
   * Show info toast
   */
  const showInfo = useCallback((message, options) => {
    toast.info(message, options);
  }, []);

  /**
   * Show promise toast (for async operations)
   */
  const showPromise = useCallback((promise, messages) => {
    toast.promise(promise, messages);
  }, []);

  /**
   * Dismiss all toasts
   */
  const dismiss = useCallback(() => {
    toast.dismiss();
  }, []);

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showPromise,
    dismiss,
  };
};
