/**
 * Toast Context
 * Provides toast notification functionality
 */
import { createContext, useContext } from 'react';
import { toast } from 'sonner';

const ToastContext = createContext(null);

/**
 * Toast Provider Component
 */
export const ToastProvider = ({ children }) => {
  /**
   * Show toast notification
   */
  const showToast = (message, type = 'info', options = {}) => {
    const toastMethods = {
      success: () => toast.success(message, options),
      error: () => toast.error(message, options),
      warning: () => toast.warning(message, options),
      info: () => toast.info(message, options),
      loading: () => toast.loading(message, options),
    };

    (toastMethods[type] || toastMethods.info)();
  };

  /**
   * Show success toast
   */
  const showSuccess = (message, options) => {
    toast.success(message, options);
  };

  /**
   * Show error toast
   */
  const showError = (message, options) => {
    toast.error(message, options);
  };

  /**
   * Show warning toast
   */
  const showWarning = (message, options) => {
    toast.warning(message, options);
  };

  /**
   * Show info toast
   */
  const showInfo = (message, options) => {
    toast.info(message, options);
  };

  /**
   * Show loading toast
   */
  const showLoading = (message, options) => {
    return toast.loading(message, options);
  };

  /**
   * Show promise toast (for async operations)
   */
  const showPromise = (promise, messages) => {
    toast.promise(promise, messages);
  };

  /**
   * Dismiss all toasts
   */
  const dismiss = () => {
    toast.dismiss();
  };

  const value = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    showPromise,
    dismiss,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

/**
 * useToast Hook
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
