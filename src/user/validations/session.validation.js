import Joi from "joi";
import mongoose from "mongoose";

// Custom Joi ObjectId validator

const objectId = () => Joi.string().custom((value, helpers) => {
    if(!mongoose.Types.ObjectId.isValid(value)){
        return helpers.message("Invalid userId: must be a valid MongoDB ObjectId");
    }
    return value;
}, "ObjectId Validation");

export const validationSession = Joi.object({
    userId: objectId().required().messages({
        "any.required": "userId is required",
        "string.base": "userId must be a string",
    }),

    userAgent: Joi.string().trim().required().messages({
        "any.required": "userAgent is required",
        "string.base": "userAgent must be a string",
        "string.empty": "userAgent cannot be empty"
    }),

    ip: Joi.string().ip({version: ["ipv4", "ipv6"], cidr: "forbidden"}).required().messages({
        "any.required": "IP address is required",
        "string.ip": "Invalid IP address format",
        "string.base": "IP address must be a string"
    }),

    refreshToken: Joi.string().min(10).required().messages({
        "any.required": "refreshToken is required",
        "string.min": "refreshToken must be at least 10 characters long",
        "string.base": "refreshToken must be a string",
        "string.empty": "refreshToken cannot be empty",
    }),

    isValid: Joi.boolean().default(false).messages({
        "boolean.base": "isValid must be a boolean value",
    })
});

export const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().trim().required().messages({
        "any.required": "Refresh token is required",
        "string.empty": "Refresh token cannot be empty",
    })
});