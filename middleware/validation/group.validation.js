const joi = require('joi');
const { error_res } = require('../../library/general');

exports.Validation = (req, res, next) => {
    const Schema = joi.object({
        name: joi.string().min(2).max(25).regex(/^[^0-9\s]+$/).regex(/^[a-zA-Z\s_.]+$/).required()
            .messages({
                "string.pattern.base": "Please enter a valid group name",
                "string.empty": "Group name field is a required",
                "string.min": `Group name must be at least {#limit} characters`,
                "string.max": `Group should not be more than {#limit} characters`,
            })
    });

    const { error } = Schema.validate(req.body);

    return error ? res.json(error_res(error.message)) : next();
};
