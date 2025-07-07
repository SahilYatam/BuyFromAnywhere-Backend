import Joi from "joi";

const signupSchema = Joi.object({
    name: Joi.string().trim().min(2).max(20).required().messages({
        "any.required": "Name is required",
        "string.base": "Name must be a string",
        "string.empty": "Name cannot be empty",
        "string.min": "Name must be at least 2 characters long",
        "string.max": "Name must be at most 20 characters long",
    }),

    email: Joi.string().email({tlds: {allow: false}}).trim().lowercase().required().messages({
        "any.required": "Email is required",
        "string.email": "Email must be a valid email address",
        "string.base": "Email must be a string",
        "string.empty": "Email cannot be empty"
    }),

    password: Joi.string().min(8).max(16).pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$")).required().messages({
        "any.required": "Password is required",
        "string.min": "Password must be at lease 8 characters long",
        "string.max": "Password cannot exceed 20 characters",
        "string.pattern.base": "Password must contain at least one latter and one number",
        "stringe.empty": "Password cannot be empty",
    }),

    region: Joi.string().trim().min(2).max(50).required().messages({
    "any.required": "Region is required",
    "string.base": "Region must be a string",
    "string.empty": "Region cannot be empty",
    "string.min": "Region must be at least 2 characters long",
    "string.max": "Region must be at most 50 characters long",
    }),


    currency: Joi.string().trim().length(3).uppercase().required().messages({
    "any.required": "Currency is required",
    "string.base": "Currency must be a string",
    "string.empty": "Currency cannot be empty",
    "string.length": "Currency must be a valid 3-letter code (e.g., USD, INR)",
    }),

    isEmailVerified: Joi.boolean().default(false).messages({
    "boolean.base": "isEmailVerified must be a boolean",
    }),
});

const loginSchema = Joi.object({
    email: Joi.string().email().trim().lowercase().required().messages({
        "string.email": "Email must be valid",
        "any.required": "Email is required",
        "string.empty": "Email cannot be empty"
    }),

    password: Joi.string().min(8).max(16).required().messages({
        "any.required": "Password is required",
        "string.empty": "Password cannot be empty",
    })
});

const updateSchema = Joi.object({
    name: Joi.string().trim().min(2).max(20).messages({
        "string.min": "Name must be at least 2 characters long",
        "string.max": "Name must be at most 20 characters long",
    }),
    
    region: Joi.string().trim().min(2).max(50).messages({
        "string.min": "Region must be at least 2 characters long"
    }),

    currency: Joi.string().trim().length(3).uppercase().messages({
        "string.length": "Currency must be a valid 3-letter code (e.g., USD)"
    })
}).min(1); // Must include at least one field to update

const logoutSchema = Joi.object({
    refreshToken: Joi.string().required().messages({
        "any.required": "Refresh token is required to logout",
        "string.empty": "Refresh token cannot be empty"
    })
});

const forgetPasswordSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } }) // disables TLD restriction like `.com` only
    .trim()
    .lowercase()
    .required()
    .messages({
      "string.email": "Please enter a valid email address.",
      "any.required": "Email is required.",
    }),
});

const resetPasswordSchema = Joi.object({
    password: Joi.string().pattern(new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,30}$"
    )).required()
    .messages({
      "string.pattern.base":
        "Password must be 8–30 characters, include uppercase, lowercase, number, and special character.",
      "any.required": "Password is required.",
    }),
});


export const validateUser = {
    signupSchema, 
    loginSchema,
    updateSchema, 
    logoutSchema,
    forgetPasswordSchema,
    resetPasswordSchema
}