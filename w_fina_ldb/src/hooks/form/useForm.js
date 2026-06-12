/**
 * Form Hook
 * Enhanced form management with validation
 */
import { useState, useCallback } from 'react';

export const useForm = (initialState, validationRules = {}) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  /**
   * Handle input change
   */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [errors]);

  /**
   * Handle direct value change (for selects, checkboxes, etc.)
   */
  const handleDirectChange = useCallback((name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [errors]);

  /**
   * Handle multiple field changes at once
   */
  const handleBulkChange = useCallback((updates) => {
    setForm(prev => ({ ...prev, ...updates }));
    Object.keys(updates).forEach(key => {
      setTouched(prev => ({ ...prev, [key]: true }));
    });
  }, []);

  /**
   * Validate form
   */
  const validate = useCallback(() => {
    const newErrors = {};

    Object.entries(validationRules).forEach(([field, rules]) => {
      const value = form[field];

      // Required validation
      if (rules.required && !value) {
        newErrors[field] = rules.required || `${field} is required`;
      }

      // Pattern validation
      if (rules.pattern && value && !rules.pattern.test(value)) {
        newErrors[field] = rules.patternMessage || `${field} format is invalid`;
      }

      // Custom validation function
      if (rules.validate && typeof rules.validate === 'function') {
        const customError = rules.validate(value, form);
        if (customError) {
          newErrors[field] = customError;
        }
      }

      // Match validation (e.g., password confirmation)
      if (rules.match && value !== form[rules.match]) {
        newErrors[field] = rules.matchMessage || `Must match ${rules.match}`;
      }

      // Min/Max length
      if (rules.minLength && value && value.length < rules.minLength) {
        newErrors[field] = `Minimum ${rules.minLength} characters required`;
      }
      if (rules.maxLength && value && value.length > rules.maxLength) {
        newErrors[field] = `Maximum ${rules.maxLength} characters allowed`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form, validationRules]);

  /**
   * Validate a single field
   */
  const validateField = useCallback((fieldName) => {
    if (!validationRules[fieldName]) return true;

    const rules = validationRules[fieldName];
    const value = form[fieldName];
    let error = null;

    if (rules.required && !value) {
      error = rules.required || `${fieldName} is required`;
    } else if (rules.pattern && value && !rules.pattern.test(value)) {
      error = rules.patternMessage || `${fieldName} format is invalid`;
    } else if (rules.validate && typeof rules.validate === 'function') {
      error = rules.validate(value, form);
    }

    setErrors(prev => ({ ...prev, [fieldName]: error }));
    return !error;
  }, [form, validationRules]);

  /**
   * Set field error manually
   */
  const setFieldError = useCallback((name, message) => {
    setErrors(prev => ({ ...prev, [name]: message }));
  }, []);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Reset form to initial state
   */
  const reset = useCallback(() => {
    setForm(initialState);
    setErrors({});
    setTouched({});
  }, [initialState]);

  /**
   * Set form value directly
   */
  const setFormValue = useCallback((name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Set multiple form values
   */
  const setFormValues = useCallback((values) => {
    setForm(prev => ({ ...prev, ...values }));
  }, []);

  return {
    form,
    errors,
    touched,
    handleChange,
    handleDirectChange,
    handleBulkChange,
    validate,
    validateField,
    reset,
    setFieldError,
    clearErrors,
    setFormValue,
    setFormValues,
    setForm,
  };
};
