const logger = require("../utils/logger");
const responses = require("../utils/responses");
class AppError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(err.message, {
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    userId: req.admin?.id,
  });

  if (err.name === "ZodError") {
    const errors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return responses.badRequest(res, "Validation error", errors);
  }

  if (err.name === "JsonWebTokenError") {
    return responses.unauthorized(res, "Invalid token");
  }

  if (err.name === "TokenExpiredError") {
    return responses.unauthorized(res, "Token expired");
  }

  if (err.code === "23505") {
    return responses.conflict(res, "Resource already exists");
  }

  if (err.code === "23503") {
    return responses.badRequest(res, "Invalid reference");
  }

  if (err.isOperational) {
    return responses.error(res, err.message, err.statusCode, err.errors);
  }

  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message;

  return responses.error(res, message, 500);
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  AppError,
  errorHandler,
  asyncHandler,
};
