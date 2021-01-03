const {User} = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const schema = require("../helper/validation");
const responeStandart = require("../helper/respone");

const signupSchema = schema.Signup;
const loginSchema = schema.Login;
const changePassSchema = schema.ChangePass;
const forgotPassSchema = schema.ForgotPass;

module.exports = {
    login: async (req, res) => {
        try{
            const result = await loginSchema.required().validateAsync(req.body);
            const user = {
                email: result.email,
            };

            const validate = await User.findAll({
                where: {
                    email: user.email
                }
            });
            const comparePass = await bcrypt.compareSync(result.password, validate[0].password);
            if (validate && comparePass) {
                jwt.sign(
                    { id: validate[0].id },
                    process.env.APP_KEY,
                    { expiresIn: "2 days" },
                    function (err, token) {
                        if (!err) {
                            return responeStandart(res, "Loggin Success", {
                                token: token,
                                auth: { id: validate[0].id },
                            });
                        } else {
                            return responeStandart(res, err, {}, 403, false);
                        }
                    }
                );
            } else {
                return responeStandart(res, "Wrong Password", {}, 400, false);
            }

        }catch(e){
            return responeStandart(res, e, {}, 400, false);
        }
    },

    signup: async (req, res) => {
        try {
            const result = await signupSchema.required().validateAsync(req.body);
            const saltRounds = 10;
            const salt = await bcrypt.genSaltSync(saltRounds);
            const hash = await bcrypt.hashSync(result.password, salt);
            const user = {
                name: result.name,
                email: result.email,
                password: hash,
            };

            const validate = User.findAll({
                where: {
                    email: user.email
                }
            });
            if(!validate.length){
                await User.create(user);
                return responeStandart(res, "Signup Success", {});
            }else{
                return responeStandart(res, "Email already used", {}, 400, false);
            }
            
        } catch (e) {
            return responeStandart(res, e, {}, 400, false);
        }
    },

    changePass: async (req, res) => {
        try{
            const result = await changePassSchema.required().validateAsync(req.body);
            if(result.newPassword === result.repeatPassword){
                const saltRounds = 10;
                const salt = await bcrypt.genSaltSync(saltRounds);
                const hash = await bcrypt.hashSync(result.newPassword, salt);
                
                const user = {
                    password: hash,
                };
                const validate = await User.findAll({
                    where: {
                        email: result.email
                    }
                });
                const comparePass = await bcrypt.compareSync(result.oldPassword, validate[0].password);
                if (validate && comparePass) {
                    await User.update(user, {
                        where: {
                            id: validate[0].id
                        }
                    });
                    return responeStandart(res, "Change Password Success", {});
                } else {
                    return responeStandart(res, "The user is not registered yet", {}, 400, false);
                }
            }else{
                return responeStandart(res, "Passwords are not the same", {}, 400, false);
            }
        }catch(e){
            return responeStandart(res, e, {}, 400, false);
        }
    },

    forgotPass: async (req, res) => {
        try {
            const result = await forgotPassSchema.required().validateAsync(req.body);
            if (result.newPassword === result.repeatPassword) {
                const saltRounds = 10;
                const salt = await bcrypt.genSaltSync(saltRounds);
                const hash = await bcrypt.hashSync(result.newPassword, salt);

                const user = {
                    password: hash,
                };
                const validate = await User.findAll({
                    where: {
                        email: result.email
                    }
                });
                if (validate) {
                    await User.update(user, {
                        where: {
                            id: validate[0].id
                        }
                    });
                    return responeStandart(res, "Change Password Success", {});
                } else {
                    return responeStandart(res, "The user is not registered yet", {}, 400, false);
                }
            } else {
                return responeStandart(res, "Passwords are not the same", {}, 400, false);
            }
        } catch (e) {
            return responeStandart(res, e, {}, 400, false);
        }
    },
};