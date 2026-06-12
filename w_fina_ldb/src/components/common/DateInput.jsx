/**
 * DateInput Component
 * Reusable date input with validation and formatting
 */
import React, { useRef, useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { INPUT_LABELS } from '@/config/constants';

const DateInput = ({
  name,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  label,
  placeholder = 'ວັນທີ/ເດືອນ/ປີ',
  className = '',
}) => {
  const inputRef = useRef(null);
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Format date from YYYY-MM-DD to DD/MM/YYYY for display
  useEffect(() => {
    if (value && !isFocused) {
      if (value.includes('-')) {
        const [year, month, day] = value.split('-');
        setDisplayValue(`${day}/${month}/${year}`);
      } else if (value.includes('/')) {
        setDisplayValue(value);
      }
    }
  }, [value, isFocused]);

  // Parse date from DD/MM/YYYY to YYYY-MM-DD
  const parseDate = (input) => {
    if (!input) return '';

    // Remove non-numeric characters
    const clean = input.replace(/\D/g, '');

    if (clean.length !== 8) return input;

    const day = clean.substring(0, 2);
    const month = clean.substring(2, 4);
    const year = clean.substring(4, 8);

    return `${year}-${month}-${day}`;
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Show raw value on focus
    if (value) {
      setDisplayValue(value);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Format value on blur
    if (displayValue) {
      const parsed = parseDate(displayValue);
      setDisplayValue(parsed);

      // Trigger onChange with parsed date
      onChange({
        target: { name, value: parsed },
      });
    }
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;

    // Allow formatting while typing: DD/MM/YYYY
    let formatted = inputValue.replace(/\D/g, '');

    if (formatted.length > 0) {
      if (formatted.length > 2) {
        formatted = formatted.substring(0, 2) + '/' + formatted.substring(2);
      }
      if (formatted.length > 5) {
        formatted = formatted.substring(0, 5) + '/' + formatted.substring(5, 9);
      }
    }

    setDisplayValue(formatted);
  };

  const openDatePicker = () => {
    inputRef.current?.showPicker();
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          name={name}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full h-12 border-2 rounded-md px-4 py-2 text-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-500' : 'border-blue-500'}
            ${disabled ? 'text-gray-400' : 'text-gray-900'}
          `}
        />
        <button
          type="button"
          onClick={openDatePicker}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed"
        >
          <Calendar size={20} />
        </button>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default DateInput;
