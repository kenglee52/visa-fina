/**
 * Response Helper Functions
 * Standardized response format for all API endpoints
 */

const success = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data !== null && { data })
  });
};

const error = (res, message, statusCode = 500, details = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(details !== null && { details })
  });
};

const created = (res, message, data = null) => {
  return success(res, message, data, 201);
};

const notFound = (res, message = 'Resource not found') => {
  return error(res, message, 404);
};

const badRequest = (res, message) => {
  return error(res, message, 400);
};

const unauthorized = (res, message = 'Unauthorized access') => {
  return error(res, message, 401);
};

const forbidden = (res, message = 'Forbidden') => {
  return error(res, message, 403);
};

const conflict = (res, message) => {
  return error(res, message, 409);
};

const serverError = (res, message = 'Internal server error') => {
  return error(res, message, 500);
};

// Paginated response helper
const paginated = (res, message, data, total, page, limit) => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    }
  });
};

module.exports = {
  success,
  error,
  created,
  notFound,
  badRequest,
  unauthorized,
  forbidden,
  conflict,
  serverError,
  paginated
};
