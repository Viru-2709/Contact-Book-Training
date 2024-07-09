const joi = require('joi');
const { error_res } = require('../../library/general');

exports.Validation = async (req, res, next) => {
    const Schema = joi.object({
        name: joi.string().min(2).max(25).regex(/^[^\s]+$/).regex(/^[a-zA-Z\s_.]+$/).required()
            .messages({
                "string.pattern.base": "Please enter a valid name",
                "string.empty": "Name field is a required ",
                "string.min": `Name must be at least {#limit} characters`,
                "string.max": `Name should not be more than {#limit} characters`,
            }),
        email: joi.string().email().required().messages({
            "string.pattern.base": "Please enter a valid email",
            "string.empty": "Email field is a required"
        }),
        number: joi.string().min(6).max(10).regex(/^[0-9]+$/).required().messages({
            "string.pattern.base": "Please enter a valid  contact number",
            "string.empty": "Contact number field is a required",
            "string.min": `Contact number must be at least {#limit} numbers`,
            "string.max": `Contact number should not be more than {#limit} numbers!`,
        }),
        image: joi.string().optional().allow(""),
        group: joi.string().optional().allow(""),
    });

    const { error } = Schema.validate(req.body);

    if (error) {
        return res.json(error_res(error.message));
    }

    if (req.body.group === "") {
        req.body.group = null;
    }

    next();
};