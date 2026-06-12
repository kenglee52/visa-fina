/**
 * File Upload Hook
 * Handles file upload with validation
 */
import { useState, useCallback } from 'react';
import { FILE_UPLOAD_CONFIG, VALIDATION_MESSAGES } from '@/config/constants';

export const useFileUpload = (config = FILE_UPLOAD_CONFIG) => {
  const [files, setFiles] = useState({});
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState({});

  /**
   * Handle file change
   */
  const handleFileChange = useCallback((fileType, file) => {
    if (!file) return;

    // Validate file type
    if (config.allowedTypes && !config.allowedTypes.includes(file.type)) {
      const error = VALIDATION_MESSAGES.INVALID_FILE_TYPE;
      setErrors(prev => ({ ...prev, [fileType]: error }));
      return false;
    }

    // Validate file size
    if (config.maxSize && file.size > config.maxSize) {
      const error = VALIDATION_MESSAGES.FILE_TOO_LARGE;
      setErrors(prev => ({ ...prev, [fileType]: error }));
      return false;
    }

    setFiles(prev => ({ ...prev, [fileType]: file }));
    setErrors(prev => ({ ...prev, [fileType]: null }));
    return true;
  }, [config]);

  /**
   * Clear a file
   */
  const clearFile = useCallback((fileType) => {
    setFiles(prev => ({ ...prev, [fileType]: null }));
    setErrors(prev => ({ ...prev, [fileType]: null }));
  }, []);

  /**
   * Reset all files
   */
  const reset = useCallback(() => {
    setFiles({});
    setErrors({});
    setUploading({});
  }, []);

  /**
   * Check if any files exist
   */
  const hasFiles = useCallback(() => {
    return Object.values(files).some(f => f !== null && f !== undefined);
  }, [files]);

  /**
   * Get file count
   */
  const getFileCount = useCallback(() => {
    return Object.values(files).filter(f => f !== null && f !== undefined).length;
  }, [files]);

  /**
   * Set uploading state for a file
   */
  const setUploadingState = useCallback((fileType, isLoading) => {
    setUploading(prev => ({ ...prev, [fileType]: isLoading }));
  }, []);

  /**
   * Create FormData for upload
   * Note: Additional data (like applicant_id) is appended BEFORE files
   * to ensure multer's filename callback has access to req.body fields
   */
  const createFormData = useCallback((additionalData = {}) => {
    const formData = new FormData();

    // Add additional data FIRST (e.g., applicant_id for multer filename callback)
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Add files AFTER additional data
    Object.entries(files).forEach(([key, file]) => {
      if (file) {
        formData.append(key, file);
      }
    });

    return formData;
  }, [files]);

  return {
    files,
    errors,
    uploading,
    handleFileChange,
    clearFile,
    reset,
    hasFiles,
    getFileCount,
    setUploadingState,
    createFormData,
    setFiles,
  };
};
