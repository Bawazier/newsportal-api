const { News, Topics } = require("../models");
const { Op } = require("sequelize");
const multer = require("multer");
const responeStandart = require("../helper/respone");
const schema = require("../helper/validation");
const options = require("../helper/upload");

const upload = options.single("thumbnail");
const newsSchema = schema.News;

module.exports = {
    getNews: async (req, res) => {
        try {
            const { count, rows } = await News.findAndCountAll({
                where: {
                    user_id: req.user.id,
                    title: {
                        [Op.startsWith]: req.query.search,
                    },
                },
                order: [["createdAt", "DESC"]],
                offset: parseInt(req.query.page) || 0,
                limit: parseInt(req.query.limit) || 10,
            });
            if (rows.length) {
                const results = rows.map((item) => {
                    const picture = {
                        URL_thumbnail: process.env.APP_URL + item.thumbnail,
                    };
                    const topics = Topics.findAll({
                        where: {
                            id: item.topics_id,
                        },
                    });
                    return Object.assign({}, item.dataValues, picture, {
                        topics: topics.title,
                    });
                });
                return responeStandart(res, "success to display stories", {
                    results,
                    pageInfo: [
                        {
                            count: count,
                            page: parseInt(req.query.page) || 0,
                            limit: parseInt(req.query.limit) || 10,
                        },
                    ],
                });
            } else {
                return responeStandart(
                    res,
                    "unable to display stories",
                    {
                        pageInfo: [
                            {
                                count: count,
                                page: parseInt(req.query.page) || 0,
                                limit: parseInt(req.query.limit) || 10,
                            },
                        ],
                    },
                    400,
                    false
                );
            }
        } catch (e) {
            return responeStandart(
                res,
                "unable to display stories",
                { ValidationError: e.details[0].message, sqlError: e },
                400,
                false
            );
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
                    thumbnail: req.file === undefined ? undefined : req.file.path,
                };
                const filteredObject = Object.keys(news).reduce((results, key) => {
                    if (news[key] !== undefined) results[key] = news[key];
                    return results;
                }, {});
                await News.create(filteredObject);
                return responeStandart(res, "success create your story", {});
            } catch (e) {
                return responeStandart(
                    res,
                    "failed for create story",
                    { ValidationError: e.details[0].message, sqlError: e },
                    400,
                    false
                );
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
                    thumbnail: req.file === undefined ? undefined : req.file.path,
                };
                const filteredObject = Object.keys(news).reduce((results, key) => {
                    if (news[key] !== undefined) results[key] = news[key];
                    return results;
                }, {});
                await News.update(filteredObject, {
                    where: {
                        id: req.params.id,
                        user_id: req.user.id,
                    },
                });
                return responeStandart(res, "success update your story", {});
            } catch (e) {
                return responeStandart(
                    res,
                    "failed for update story",
                    { ValidationError: e.details[0].message, sqlError: e },
                    400,
                    false
                );
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
                    thumbnail: req.file === undefined ? undefined : req.file.path,
                };
                const filteredObject = Object.keys(news).reduce((results, key) => {
                    if (news[key] !== undefined) results[key] = news[key];
                    return results;
                }, {});
                await News.update(filteredObject, {
                    where: {
                        id: req.params.id,
                        user_id: req.user.id,
                    },
                });
                return responeStandart(res, "success update your story", {});
            } catch (e) {
                return responeStandart(
                    res,
                    "failed for update story",
                    { ValidationError: e.details[0].message, sqlError: e },
                    400,
                    false
                );
            }
        });
    },

    deleteNews: async (req, res) => {
        try {
            const result = await News.destroy({
                where: {
                    id: req.params.id,
                    user_id: req.user.id,
                },
            });
            if (result) {
                return responeStandart(res, "success delete your story", {});
            } else {
                return responeStandart(res, "story not found", {}, 404, false);
            }
        } catch (e) {
            return responeStandart(
                res,
                "failed for delete story",
                { ValidationError: e.details[0].message, sqlError: e },
                400,
                false
            );
        }
    },
};