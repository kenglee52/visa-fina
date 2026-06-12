/**
 * Address Validation Middleware
 * Validates input data for province and district operations
 */

const { body, param, validationResult } = require('express-validator');

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
 * Create Province Validation Rules
 */
const createProvinceRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Province name is required')
    .isLength({ max: 100 })
    .withMessage('Province name must not exceed 100 characters'),
  validateRequest
];

/**
 * Update Province Validation Rules
 */
const updateProvinceRules = [
  param('id')
    .notEmpty()
    .withMessage('Province ID is required')
    .isInt()
    .withMessage('Province ID must be an integer'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Province name is required')
    .isLength({ max: 100 })
    .withMessage('Province name must not exceed 100 characters'),
  validateRequest
];

/**
 * Delete Province Validation Rules
 */
const deleteProvinceRules = [
  param('id')
    .notEmpty()
    .withMessage('Province ID is required')
    .isInt()
    .withMessage('Province ID must be an integer'),
  validateRequest
];

/**
 * Create District Validation Rules
 */
const createDistrictRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('District name is required')
    .isLength({ max: 100 })
    .withMessage('District name must not exceed 100 characters'),
  body('province_id')
    .notEmpty()
    .withMessage('Province ID is required')
    .isInt()
    .withMessage('Province ID must be an integer'),
  validateRequest
];

/**
 * Update District Validation Rules
 */
const updateDistrictRules = [
  param('id')
    .notEmpty()
    .withMessage('District ID is required')
    .isInt()
    .withMessage('District ID must be an integer'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('District name is required')
    .isLength({ max: 100 })
    .withMessage('District name must not exceed 100 characters'),
  body('province_id')
    .notEmpty()
    .withMessage('Province ID is required')
    .isInt()
    .withMessage('Province ID must be an integer'),
  validateRequest
];

/**
 * Delete District Validation Rules
 */
const deleteDistrictRules = [
  param('id')
    .notEmpty()
    .withMessage('District ID is required')
    .isInt()
    .withMessage('District ID must be an integer'),
  validateRequest
];

module.exports = {
  createProvinceRules,
  updateProvinceRules,
  deleteProvinceRules,
  createDistrictRules,
  updateDistrictRules,
  deleteDistrictRules
};
