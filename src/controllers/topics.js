const {Topics} = require("../models");
const { Op } = require("sequelize");
const responeStandart = require("../helper/respone");
const schema = require("../helper/validation");

const topicsSchema = schema.Topics;

module.exports = {
    getTopics: async (req, res) => {
        try {
            const { count, rows } = await Topics.findAndCountAll({
                where: {
                    title: {
                        [Op.startsWith]: req.query.search,
                    },
                },
                offset: parseInt(req.query.page) || 0,
                limit: parseInt(req.query.limit) || 10,
            });
            if (rows.length) {
                return responeStandart(res, "success to display topics", {
                    results: rows,
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
                    "unable to display topics",
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
                "unable to display topics",
                { ValidationError: e.details[0].message, sqlError: e },
                400,
                false
            );
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
            return responeStandart(
                res,
                "unable to post topics",
                { ValidationError: e.details[0].message, sqlError: e },
                400,
                false
            );
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
            return responeStandart(
                res,
                "unable to update topics",
                { ValidationError: e.details[0].message, sqlError: e },
                400,
                false
            );
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
            return responeStandart(
                res,
                "unable to update topics",
                { ValidationError: e.details[0].message, sqlError: e },
                400,
                false
            );
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
            return responeStandart(
                res,
                "unable to remove topics",
                { ValidationError: e.details[0].message, sqlError: e },
                400,
                false
            );
        }
    }
};