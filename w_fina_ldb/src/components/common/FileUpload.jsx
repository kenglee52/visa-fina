/**
 * FileUpload Component
 * Reusable file upload component with PDF validation
 */
import React, { useRef } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { FILE_UPLOAD_CONFIG, VALIDATION_MESSAGES } from '@/config/constants';

const FileUpload = ({
  name,
  onFileChange,
  onClear,
  fileName = null,
  error = null,
  accept = '.pdf',
  required = false,
  disabled = false,
  label,
  className = '',
}) => {
  const inputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && onFileChange) {
      onFileChange(name, file);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (onClear) {
      onClear(name);
    }
    // Reset input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      <div
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-lg p-6
          flex flex-col items-center justify-center cursor-pointer
          transition-colors duration-200
          ${disabled
            ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
            : error
              ? 'border-red-500 hover:bg-red-50'
              : 'border-blue-500 hover:bg-blue-50'
          }
        `}
      >
        {fileName ? (
          <div className="flex items-center gap-3 w-full">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="text-blue-600" size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {fileName}
              </p>
              <p className="text-xs text-gray-500">
                {typeof fileName === 'string' && fileName.length > 20
                  ? `${(fileName.length / 1024).toFixed(1)} KB`
                  : ''}
              </p>
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className={disabled ? 'text-gray-400' : 'text-blue-500'} size={32} />
            <p className="text-sm text-gray-600">
              {disabled ? 'ປິດการใช้งาน' : 'ຄລິກเพื่อเลือກໄຟລ໌'}
            </p>
            <p className="text-xs text-gray-500">
              PDF ເທົ່ານັ້ນ, ຂະໜາດສູງສຸດ {FILE_UPLOAD_CONFIG.MAX_SIZE / 1024 / 1024}MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;
