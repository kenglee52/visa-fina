/**
 * Employee Validation Middleware
 * Validates input data for employee-related operations
 */

const { body, param, validationResult } = require('express-validator');
const { ROLES } = require('../../config/constants');

/**
 * Validation result checker middleware
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

/**
 * Register Employee Validation Rules
 */
const registerEmployeeRules = [
  body('id')
    .trim()
    .notEmpty()
    .withMessage('Employee ID is required'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name must not exceed 100 characters'),
  body('last_name')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 100 })
    .withMessage('Last name must not exceed 100 characters'),
  body('role')
    .trim()
    .notEmpty()
    .withMessage('Role is required')
    .isIn([ROLES.DATA_ENTRY, ROLES.VERIFIER])
    .withMessage('Role must be data_entry or verifier'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validateRequest
];

/**
 * Login Validation Rules
 */
const loginRules = [
  body('id')
    .trim()
    .notEmpty()
    .withMessage('Employee ID is required'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required'),
  validateRequest
];

/**
 * Create Employee (Admin) Validation Rules
 */
const createEmployeeRules = [
  body('id')
    .trim()
    .notEmpty()
    .withMessage('Employee ID is required'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name must not exceed 100 characters'),
  body('last_name')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 100 })
    .withMessage('Last name must not exceed 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('role')
    .trim()
    .notEmpty()
    .withMessage('Role is required')
    .isIn(Object.values(ROLES))
    .withMessage('Invalid role'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validateRequest
];

/**
 * Update Employee Validation Rules
 */
const updateEmployeeRules = [
  param('id')
    .notEmpty()
    .withMessage('Employee ID is required')
    .trim(),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Name must not exceed 100 characters'),
  body('last_name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Last name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Last name must not exceed 100 characters'),
  body('email')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Email cannot be empty')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('role')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Role cannot be empty')
    .isIn(Object.values(ROLES))
    .withMessage('Invalid role'),
  body('password')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Password cannot be empty')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validateRequest
];

/**
 * Delete Employee Validation Rules
 */
const deleteEmployeeRules = [
  param('id')
    .notEmpty()
    .withMessage('Employee ID is required')
    .trim(),
  validateRequest
];

module.exports = {
  registerEmployeeRules,
  loginRules,
  createEmployeeRules,
  updateEmployeeRules,
  deleteEmployeeRules
};
