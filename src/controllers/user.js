const {User} = require("../models");
const multer = require("multer");
const responeStandart = require("../helper/respone");
const schema = require("../helper/validation");
const options = require("../helper/upload");

const upload = options.single("photo");
const userSchema = schema.User;

module.exports = {
    getUser: async (req, res) => {
        try{
            const results = await User.findByPk(req.user.id, {
                attributes: [
                    "name",
                    "email",
                    "bio",
                    "photo",
                    "createdAt",
                    "updatedAt",
                ],
            });
            return responeStandart(res, "success display user data", {
                results,
            });
        }catch(e){
            return responeStandart(res, e, {}, 400, false);
        }
    },

    patchUser: async (req, res) => {
        upload(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return responeStandart(res, err, {}, 500, false);
            } else if (err) {
                return responeStandart(res, err, {}, 500, false);
            }
            try {
                const result = await userSchema.validateAsync(req.body);
                const user = {
                    name: result.name,
                    email: result.email,
                    bio: result.bio,
                    photo: req.file === undefined ? undefined : req.file.path
                };
                const filteredObject = Object.keys(user).reduce((results, key) => {
                    if (user[key] !== undefined) results[key] = user[key];
                    return results;
                }, {});
                await User.update(filteredObject, {
                    where: {
                        id: req.user.id
                    }
                });
                return responeStandart(res, "success update user data", {});
            } catch (e) {
                return responeStandart(res, e, {}, 400, false);
            }
        });
    },

    putUser: async (req, res) => {
        upload(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return responeStandart(res, err, {}, 500, false);
            } else if (err) {
                return responeStandart(res, err, {}, 500, false);
            }
            try {
                const result = await userSchema.required().validateAsync(req.body);
                const user = {
                    name: result.name,
                    email: result.email,
                    bio: result.bio,
                    photo: req.file === undefined ? undefined : req.file.path
                };
                const filteredObject = Object.keys(user).reduce((results, key) => {
                    if (user[key] !== undefined) results[key] = user[key];
                    return results;
                }, {});
                await User.update(filteredObject, {
                    where: {
                        id: req.user.id
                    }
                });
                return responeStandart(res, "success update user data", {});
            } catch (e) {
                return responeStandart(res, e, {}, 400, false);
            }
        });

    }
};