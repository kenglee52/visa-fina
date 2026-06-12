/**
 * Confirm Dialog Hook
 * SweetAlert2 confirmation dialogs
 */
import { useCallback } from 'react';
import Swal from 'sweetalert2';

export const useConfirmDialog = () => {
  /**
   * Show confirmation dialog
   */
  const confirm = useCallback(async ({
    title = 'ຢືນຢັນ',
    text = '',
    confirmButtonText = 'ຢືນຢັນ',
    cancelButtonText = 'ຍົກເລີກ',
    icon = 'question',
    confirmButtonColor = '#2563eb',
    cancelButtonColor = '#dc2626',
    ...options
  } = {}) => {
    const result = await Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
      confirmButtonColor,
      cancelButtonColor,
      customClass: {
        popup: 'font-noto-sans-lao',
        title: 'font-bold text-lg',
        content: 'text-base',
      },
      ...options,
    });

    return result.isConfirmed;
  }, []);

  /**
   * Confirm delete dialog
   */
  const confirmDelete = useCallback(async (itemName) => {
    return confirm({
      title: 'ຢືນຢັນການລຶບ',
      text: `ທ່ານແນ່ໃຈບໍ່ທີ່ຈະລຶບ "${itemName}"?`,
      icon: 'warning',
      confirmButtonText: 'ລຶບ',
      cancelButtonText: 'ຍົກເລີກ',
      confirmButtonColor: '#dc2626',
    });
  }, [confirm]);

  /**
   * Confirm logout dialog
   */
  const confirmLogout = useCallback(async () => {
    return confirm({
      title: 'ຢືນຢັນການອອກຈາກລະບົບ',
      text: 'ທ່ານແນ່ໃຈບໍ່ທີ່ຈະອອກຈາກລະບົບ?',
      icon: 'question',
    });
  }, [confirm]);

  /**
   * Show success dialog
   */
  const showSuccess = useCallback((title, text = '') => {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonText: 'ຕົກລົງ',
      confirmButtonColor: '#2563eb',
      customClass: {
        popup: 'font-noto-sans-lao',
        title: 'font-bold text-lg',
        content: 'text-base',
      },
    });
  }, []);

  /**
   * Show error dialog
   */
  const showError = useCallback((title, text = '') => {
    return Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonText: 'ຕົກລົງ',
      confirmButtonColor: '#2563eb',
      customClass: {
        popup: 'font-noto-sans-lao',
        title: 'font-bold text-lg',
        content: 'text-base',
      },
    });
  }, []);

  /**
   * Show warning dialog
   */
  const showWarning = useCallback((title, text = '') => {
    return Swal.fire({
      icon: 'warning',
      title,
      text,
      confirmButtonText: 'ຕົກລົງ',
      confirmButtonColor: '#2563eb',
      customClass: {
        popup: 'font-noto-sans-lao',
        title: 'font-bold text-lg',
        content: 'text-base',
      },
    });
  }, []);

  return {
    confirm,
    confirmDelete,
    confirmLogout,
    showSuccess,
    showError,
    showWarning,
  };
};
