const Joi = require("joi");

module.exports = {
    User: Joi.object({
        name: Joi.string().min(3).max(80),
        email: Joi.string().email(),
        password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
        bio: Joi.string().max(160),
    }),

    Login: Joi.object({
        email: Joi.string().email(),
        password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    }),

    Signup: Joi.object({
        name: Joi.string().min(3).max(80),
        email: Joi.string().email(),
        password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    }),

    ChangePass: Joi.object({
        email: Joi.string().email(),
        oldPassword: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
        newPassword: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
        repeatPassword: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    }),

    ForgotPass: Joi.object({
        email: Joi.string().email(),
        oldPassword: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
        newPassword: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
        repeatPassword: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    }),

    News: Joi.object({
        topics_id: Joi.number().integer().positive(),
        title: Joi.string().min(3).max(80),
        story: Joi.string(),
    }),

    Topics: Joi.object({
        title: Joi.string().min(3).max(30),
        subTitle: Joi.string().min(3).max(80),
    }),
};