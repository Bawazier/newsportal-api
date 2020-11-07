const Joi = require("joi");

const User = Joi.object({
    name: Joi.string().min(3).max(80),
    email: Joi.string().email(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    bio: Joi.string().max(160),
});

module.exports = User;