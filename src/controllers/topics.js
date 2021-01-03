const {Topics} = require("../models");
const { Op } = require("sequelize");
const responeStandart = require("../helper/respone");
const schema = require("../helper/validation");
const pagination = require("../helper/pagination");

const topicsSchema = schema.Topics;

module.exports = {
    getTopics: async (req, res) => {
        try {
            const {
                page = 1,
                limit = 10,
                search = "",
            } = req.query;
            const offset = (page - 1) * limit;
            const { count, rows } = await Topics.findAndCountAll({
                where: {
                    title: {
                        [Op.startsWith]: search,
                    },
                },
                offset: parseInt(offset),
                limit: parseInt(limit),
            });
            const pageInfo = pagination.paging(
                "topics/",
                req,
                count,
                page,
                limit
            );
            if (rows.length) {
                return responeStandart(res, "success to display topics", {
                    results: rows,
                    pageInfo,
                });
            } else {
                return responeStandart(
                    res,
                    "unable to display topics",
                    {
                        pageInfo,
                    },
                    400,
                    false
                );
            }
        } catch (e) {
            return responeStandart(res, e, {}, 400, false);
        }
    },

    postTopics: async (req, res) => {
        try {
            const result = await topicsSchema.validateAsync(req.body);
            const topics = {
                title: result.title,
                subTitle: result.subTitle,
            };
            await Topics.create(topics);
            return responeStandart(res, "success to post topics", {});
        } catch (e) {
            return responeStandart(res, e, {}, 400, false);
        }
    },

    patchTopics: async (req, res) => {
        try {
            const result = await topicsSchema.validateAsync(req.body);
            const topics = {
                title: result.title,
                subTitle: result.subTitle,
            };
            const update = await Topics.update(topics, {
                where: {
                    id: req.params.id,
                },
            });
            if (update) {
                return responeStandart(res, "success to update topics", {});
            } else {
                return responeStandart(res, "unable to update topics", 400, false);
            }
        } catch (e) {
            return responeStandart(res, e, {}, 400, false);
        }
    },

    putTopics: async (req, res) => {
        try {
            const result = await topicsSchema.required().validateAsync(req.body);
            const topics = {
                title: result.title,
                subTitle: result.subTitle,
            };
            const update = await Topics.update(topics, {
                where: {
                    id: req.params.id,
                },
            });
            if (update) {
                return responeStandart(res, "success to update topics", {});
            } else {
                return responeStandart(res, "unable to update topics", {}, 400, false);
            }
        } catch (e) {
            return responeStandart(res, e, {}, 400, false);
        }
    },

    deleteTopics: async (req, res) => {
        try{
            const destroy = await Topics.destroy({
                where: {
                    id: req.params.id,
                },
            });
            if (destroy) {
                return responeStandart(res, "success to remove topics", {});
            } else {
                return responeStandart(
                    res,
                    "unable to remove topics",
                    {},
                    400,
                    false
                );
            }
        }catch(e){
            return responeStandart(res, e, {}, 400, false);
        }
    }
};