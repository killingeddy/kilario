const responses = require("../utils/responses");

const validate = (schema) => {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);

      req.body = validated;

      next();
    } catch (error) {
      if (error.name === "ZodError") {
        const errors = error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        return responses.badRequest(res, "Validation error", errors);
      }

      return responses.badRequest(res, "Invalid request data");
    }
  };
};

const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.query);
      req.query = validated;
      next();
    } catch (error) {
      if (error.name === "ZodError") {
        const errors = error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        return responses.badRequest(res, "Validation error", errors);
      }

      return responses.badRequest(res, "Invalid query parameters");
    }
  };
};

const validateParams = (schema) => {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.params);
      req.params = validated;
      next();
    } catch (error) {
      if (error.name === "ZodError") {
        const errors = error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        return responses.badRequest(res, "Validation error", errors);
      }

      return responses.badRequest(res, "Invalid parameters");
    }
  };
};

module.exports = {
  validate,
  validateQuery,
  validateParams,
};
