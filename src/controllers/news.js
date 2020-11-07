const { News } = require("../models");
const multer = require("multer");
const responeStandart = require("../helper/respone");
const schema = require("../helper/validation");
const options = require("../helper/upload");

const upload = options.single("thumbnail");
const newsSchema = schema.News;

module.exports = {
    getNews: async (req, res) => {
        try{
            const data = await News.findAll({
                where: {
                    user_id: req.user.id,
                }
            });
            const respone = data.map(item => {
                const picture = { URL_thumbnail: process.env.APP_URL + item.thumbnail };
                return Object.assign({}, item.dataValues, picture);
            });
            return responeStandart(res, "success display your stories", { respone });
        }catch(e){
            return responeStandart(res, "you don't have a story", {}, 400, false);
        }
    },

    postNews: async (req, res) => {
        upload(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return responeStandart(res, err, {}, 500, false);
            } else if (err) {
                return responeStandart(res, err, {}, 500, false);
            }
            try {
                const result = await newsSchema.required().validateAsync(req.body);
                const news = {
                    user_id: req.user.id,
                    title: result.title,
                    story: result.story,
                    thumbnail: req.file === undefined ? undefined : req.file.path
                };
                const filteredObject = Object.keys(news).reduce((results, key) => {
                    if (news[key] !== undefined) results[key] = news[key];
                    return results;
                }, {});
                await News.create(filteredObject);
                return responeStandart(res, "success create your story", {});
            } catch (e) {
                return responeStandart(res, "failed for create story", {}, 400, false);
            }
        });
    },

    patchNews: async (req, res) => {
        upload(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return responeStandart(res, err, {}, 500, false);
            } else if (err) {
                return responeStandart(res, err, {}, 500, false);
            }
            try {
                const result = await newsSchema.validateAsync(req.body);
                const news = {
                    title: result.title,
                    story: result.story,
                    thumbnail: req.file === undefined ? undefined : req.file.path
                };
                const filteredObject = Object.keys(news).reduce((results, key) => {
                    if (news[key] !== undefined) results[key] = news[key];
                    return results;
                }, {});
                await News.update(filteredObject, {
                    where: {
                        id: req.params.id,
                        user_id: req.user.id
                    }
                });
                return responeStandart(res, "success update your story", {});
            } catch (e) {
                return responeStandart(res, "failed for update story", {}, 400, false);
            }
        });
    },

    putNews: async (req, res) => {
        upload(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return responeStandart(res, err, {}, 500, false);
            } else if (err) {
                return responeStandart(res, err, {}, 500, false);
            }
            try {
                const result = await newsSchema.required().validateAsync(req.body);
                const news = {
                    title: result.title,
                    story: result.story,
                    thumbnail: req.file === undefined ? undefined : req.file.path
                };
                const filteredObject = Object.keys(news).reduce((results, key) => {
                    if (news[key] !== undefined) results[key] = news[key];
                    return results;
                }, {});
                await News.update(filteredObject, {
                    where: {
                        id: req.params.id,
                        user_id: req.user.id
                    }
                });
                return responeStandart(res, "success update your story", {});
            } catch (e) {
                return responeStandart(res, "failed for update story", {}, 400, false);
            }
        });
    },

    deleteNews: async (req, res) => {
        try{
            const result = await News.destroy({
                where: {
                    id: req.params.id,
                    user_id: req.user.id
                }
            });
            if(result){
                return responeStandart(res, "success delete your story", {});
            }else{
                return responeStandart(res, "story not found", {}, 404, false);
            }
        }catch(e){
            return responeStandart(res, "failed for delete story", {}, 400, false);
        }
    }
};