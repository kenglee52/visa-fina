/**
 * DateInput Component
 * Reusable date input with validation and formatting
 */
import React, { useRef, useEffect, useState, forwardRef } from 'react';
import { Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { INPUT_LABELS } from '@/config/constants';

const DateInput = ({
  name,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  label,
  placeholder = 'dd/mm/yyyy',
  className = '',
}) => {

  const [open, setOpen] = useState(false);

  const toDate = (val) => {
    if (!val) return null;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  };

  const handlePickerChange = (date) => {
    if (!date) {
      onChange({ target: { name, value: '' } });
      setOpen(false);
      return;
    }
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    onChange({ target: { name, value: `${yyyy}-${mm}-${dd}` } });
    setOpen(false);
  };

  const handleTyping = (e) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (raw.length > 2) raw = raw.slice(0, 2) + '/' + raw.slice(2);
    if (raw.length > 5) raw = raw.slice(0, 5) + '/' + raw.slice(5, 9);

    if (raw.length === 10) {
      const [dd, mm, yyyy] = raw.split('/');
      const date = new Date(`${yyyy}-${mm}-${dd}`);
      if (!isNaN(date.getTime())) {
        onChange({ target: { name, value: `${yyyy}-${mm}-${dd}` } });
        return;
      }
    }
    onChange({ target: { name, value: raw } });
  };

  const displayValue = () => {
    if (!value) return '';
    if (value.includes('-') && value.length === 10) {
      const [yyyy, mm, dd] = value.split('-');
      return `${dd}/${mm}/${yyyy}`;
    }
    return value;
  };

  const CustomInput = forwardRef((props, ref) => (
    <div className="relative w-full" ref={ref}>
      <input
        type="text"
        value={displayValue()}
        onChange={handleTyping}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={10}
        className={`
          w-full h-10 border rounded-md px-3 pr-10 text-sm bg-white
          focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'text-gray-400' : 'text-gray-900'}
          ${className}
        `}
      />
      <button
        type="button"
        onClick={() => !disabled && setOpen(true)}
        disabled={disabled}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 disabled:cursor-not-allowed"
      >
        <Calendar size={16} />
      </button>
    </div>
  ));

  CustomInput.displayName = 'CustomInput';

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* ແກ້ DatePicker wrapper ໃຫ້ w-full */}
      <style>{`.react-datepicker-wrapper { width: 100% !important; } .react-datepicker__input-container { width: 100% !important; }`}</style>

      <DatePicker
        selected={toDate(value)}
        onChange={handlePickerChange}
        dateFormat="dd/MM/yyyy"
        disabled={disabled}
        required={required}
        customInput={<CustomInput />}
        open={open}
        onClickOutside={() => setOpen(false)}
        showYearDropdown
        showMonthDropdown
        dropdownMode="select"
        yearDropdownItemNumber={80}
        scrollableYearDropdown
        popperPlacement="bottom-start"
      />
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default DateInput;
