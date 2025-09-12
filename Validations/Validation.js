const Joi = require('joi')

const userValidationSchema = Joi.object({
    Name:Joi.string()
    .pattern(/^[A-Za-z\s]+$/)
    .required()
    .messages({
        'string.empty':"Name is required",
        'string.pattern.base': "Only alphabets allowed in Name"
    }),
    Age:Joi.number()
    .min(16)
    .max(100)
    .required()
    .messages({
        'number.base':"Age must be a number",
        'number.min' : "Age must be at least 16",
        'number.max' : "Age must be at most 100"
    }),
    Email: Joi.string()
    .email()
    .required()
    .messages({
        'string.email' : "Enter a valid Email",
        'string.empty' : "Email is required"
    }),
    Password : Joi.string()
    .min(6)
    .required()
    .messages({
        'string.min' : "Password must be at least 6 characters",
        'string.empty' : "Password is required"
    }),
    Number : Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
        'string.pattern.base' : "Phne number must be 10 digits",
        'string.empty' : "Phone number is required"
    }),
    Country : Joi.string()
    .required()
    .messages({
        'string.empty' : 'Country is required',
    }),
    City: Joi.string()
    .required()
    .messages({
        'string.empty' : 'City is required'
    }),
    PinCode : Joi.string()
    .pattern(/^\d{6}$/)
    .messages({
        'sting.pattern.base' : "PinCode must be 6 digits",
        'string.empty' : "PinCode is required"
    })
})

module.exports = userValidationSchema;