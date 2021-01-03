const { News, Topics, User, Favorite } = require("../models");
const { Sequelize, Op } = require("sequelize");
const responeStandart = require("../helper/respone");
const pagination = require("../helper/pagination");

module.exports = {
    detailsNews: async (req, res) => {
        try {
            const results = await News.findByPk(req.params.id, {
                include: [
                    { model: Topics, attributes: ["title"] },
                    { model: User, attributes: ["name", "photo"] },
                ],
            });
            if (results !== null) {
                return responeStandart(res, "success to display stories", {
                    results,
                });
            } else {
                return responeStandart(
                    res,
                    "unable to display stories",
                    {},
                    400,
                    false
                );
            }
        } catch (e) {
            return responeStandart(res, e, {}, 400, false);
        }
    },

    searchNews: async (req, res) => {
        try {
            const {
                page = 1,
                limit = 10,
                search = "",
                sortBy = "createdAt",
                sortType = "DESC",
            } = req.query;
            const offset = (page - 1) * limit;
            const { count, rows } = await News.findAndCountAll({
                include: [
                    { model: Topics, attributes: ["title"] },
                    { model: User, attributes: ["name", "photo"] },
                ],
                where: {
                    title: {
                        [Op.startsWith]: search,
                    },
                },
                order: [[sortBy, sortType]],
                offset: parseInt(offset),
                limit: parseInt(limit),
            });
            const pageInfo = pagination.paging(
                "search/news",
                req,
                count,
                page,
                limit
            );
            if (rows.length) {
                const results = rows.map((item) => {
                    const picture = {
                        URL_thumbnail: process.env.APP_URL + item.thumbnail,
                    };
                    return Object.assign({}, item.dataValues, picture);
                });
                return responeStandart(res, "success to display stories", {
                    results,
                    pageInfo,
                });
            } else {
                return responeStandart(
                    res,
                    "unable to display stories",
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

    findNewsByTopics: async (req, res) => {
        try {
            const {
                page = 1,
                limit = 10,
                search = "",
                sortBy = "createdAt",
                sortType = "DESC",
            } = req.query;
            const offset = (page - 1) * limit;
            const { count, rows } = await News.findAndCountAll({
                include: [
                    { model: Topics, attributes: ["title"] },
                    { model: User, attributes: ["name", "photo"] },
                ],
                where: {
                    topics_id: req.params.id,
                    title: {
                        [Op.startsWith]: search,
                    },
                },
                order: [[sortBy, sortType]],
                offset: parseInt(offset),
                limit: parseInt(limit),
            });
            const pageInfo = pagination.paging(
                `/news/topics/${req.params.id}`,
                req,
                count,
                page,
                limit
            );
            if (rows.length) {
                const results = rows.map((item) => {
                    const picture = {
                        URL_thumbnail: process.env.APP_URL + item.thumbnail,
                    };
                    return Object.assign({}, item.dataValues, picture);
                });
                return responeStandart(res, "success to display stories", {
                    results,
                    pageInfo,
                });
            } else {
                return responeStandart(
                    res,
                    "unable to display stories",
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

    searchTrends: async (req, res) => {
        try {
            const {
                page = 1,
                limit = 10,
                search = "",
                sortBy = "createdAt",
                sortType = "DESC",
            } = req.query;
            const offset = (page - 1) * limit;
            const { count, rows } = await News.findAndCountAll({
                include: [
                    { model: Topics, attributes: ["title"] },
                    { model: User, attributes: ["name", "photo"] },
                    {
                        model: Favorite,
                        attributes: {
                            include: [
                                [
                                    Sequelize.fn("COUNT", Sequelize.col("Favorites.id")),
                                    "stars",
                                ],
                            ],
                        },
                    },
                ],
                where: {
                    title: {
                        [Op.startsWith]: search,
                    },
                },
                order: [[sortBy, sortType]],
                offset: parseInt(offset),
                limit: parseInt(limit),
            });
            const pageInfo = pagination.paging(
                "search/trends",
                req,
                count,
                page,
                limit
            );
            if (rows.length) {
                const results = rows.map((item) => {
                    const picture = {
                        URL_thumbnail: process.env.APP_URL + item.thumbnail,
                    };
                    
                    if(count){
                        return Object.assign(
                            {},
                            item.dataValues,
                            picture
                        );
                    }
                });
                return responeStandart(res, "success to display stories", {
                    results,
                    pageInfo,
                });
            } else {
                return responeStandart(
                    res,
                    "unable to display stories",
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

    findTopics: async (req, res) => {
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
};