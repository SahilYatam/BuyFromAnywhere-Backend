// import { ApiError } from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import logger from "../utils/logger.js";

const defaultOptions = {
  abortEarly: false, // return all errors, not just the first one
  stripUnknown: true, // remove unknown property
  errors: {
    wrap: { label: false }, // don't wrap error labels
  },
};

// joiOptions allows overriding default Joi validation settings on a per-route basis
export const validateRequest = (schema, property = "body", joiOptions = {}) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], ...defaultOptions, ...joiOptions);

    // If validation passes, replace req[property] with validated value
    // This ensures type coercion and default values are applied
    if (!error) {
      req[property] = value;
      return next();
    }

    // Format errors for conistent API response
    const errorDetails = error.details.map((detail) => ({
      path: detail.path.join("."),
      message: detail.message,
    }));

    logger.error(errorDetails)

    return res.status(StatusCodes.BAD_REQUEST).json({
      status: "error",
      message: "Validation error",
      errors: errorDetails,
    });
  };
};
