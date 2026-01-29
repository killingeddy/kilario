const authService = require("../services/auth.service");
const responses = require("../utils/responses");
const logger = require("../utils/logger");

const authAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return responses.unauthorized(res, "Access token required");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return responses.unauthorized(res, "Access token required");
    }

    const decoded = authService.verifyToken(token);

    next();
  } catch (error) {
    logger.error("Auth middleware error", { error: error.message });

    if (error.name === "JsonWebTokenError") {
      return responses.unauthorized(res, "Invalid token");
    }

    if (error.name === "TokenExpiredError") {
      return responses.unauthorized(res, "Token expired");
    }

    return responses.unauthorized(res, "Authentication failed");
  }
};

module.exports = authAdmin;
