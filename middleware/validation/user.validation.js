const joi = require('joi');
const { error_res } = require('../../library/general');

const confirmpasswordError = new Error("Password and ConfirmPassword must be the same");

exports.registrationValidation = (req, res, next) => {
    const { error } = joi.object({
        name: joi.string().min(2).max(10).regex(/^[^0-9\s]+$/).regex(/^[a-zA-Z\s]+$/).required()
            .messages({
                "string.pattern.base": "Please enter a valid name",
                "string.empty": "Name field is a required",
                "string.min": `Name must be at least {#limit} characters`,
                "string.max": `Name should not be more than {#limit} characters`,
            }),
        username: joi.string().min(2).max(20).regex(/^(?![0-9\s]+$)[a-zA-Z0-9_.-]+$/).required()
            .messages({
                "string.pattern.base": "Please enter a valid username",
                "string.empty": "Username field is a required ",
                "string.min": `Username must be at least {#limit} characters`,
                "string.max": `Username should not be more than {#limit} characters`,
            }),
        email: joi.string().email().required().messages({
            "string.pattern.base": "Please enter a valid email",
            "string.empty": "Email field is a required "
        }),
        password: joi.string().min(6).max(10).regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,10}$/)
            .required().messages({
                "string.pattern.base": "Password must contain at least 1 uppercase letter, 1 digit, and 1 special character",
                "string.empty": "Password field is a required ",
                "string.min": `Password must be at least {#limit} characters`,
                "string.max": `Password should not be more than {#limit} characters`,
            }),
        confirmpassword: joi.valid(joi.ref('password')).error(confirmpasswordError)
    }).validate(req.body);

    if (error) {
        return res.json(error_res(error.message));
    }
    next();
};

exports.loginValidation = (req, res, next) => {
    const { error } = joi.object({
        emailORusername: joi.string().required().messages({ 'string.required': 'Email OR Username is required' }),
        password: joi.string().required().messages({ 'string.required': 'Password is required' }),
    }).validate(req.body);

    if (error) {
        return res.json(error_res(error.message));
    }
    next();
};

exports.resetPasswordValidation = (req, res, next) => {
    const { error } = joi.object({
        password: joi.string().min(6).max(10).regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,10}$/)
            .required().messages({
                "string.pattern.base": "Password must contain at least 1 uppercase letter, 1 digit, and 1 special character",
                "string.empty": "Password field is a required ",
                "string.min": `Password must be at least {#limit} characters`,
                "string.max": `Password should not be more than {#limit} characters`,
            }),
        confirmpassword: joi.valid(joi.ref('password')).error(confirmpasswordError),
        token: joi.string().optional().allow(""),
    }).validate(req.body);

    if (error) {
        return res.json(error_res(error.message));
    }
    next();
}