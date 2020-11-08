const {News, Topics, Favorite} = require("../models");
const { Op } = require("sequelize");
const responeStandart = require("../helper/respone");

module.exports = {
    searchNews: async (req, res) => {
        try {
            const { count, rows } = await News.findAndCountAll({
                where: {
                    title: {
                        [Op.startsWith]: req.query.search,
                    },
                },
                order: [
                    ["createdAt", "DESC"]
                ],
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

    findNewsByTopics: async (req, res) => {
        try {
            const { count, rows } = await News.findAndCountAll({
                where: {
                    topics_id: req.params.id,
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

    searchTrends: async (req, res) => {
        try {
            const { count, rows } = await News.findAndCountAll({
                offset: parseInt(req.query.page) || 0,
                limit: parseInt(req.query.limit) || 10,
            });
            if (rows.length) {
                const results = rows.map((item) => {
                    const picture = {
                        URL_thumbnail: process.env.APP_URL + item.thumbnail,
                    };
                    const favorite = Favorite.count({
                        where: {
                            news_id: item.id,
                        },
                    });
                    return Object.assign({}, item.dataValues, picture, {
                        favorite,
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

    findTopics: async (req, res) => {
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
};