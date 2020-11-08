const { News, Favorite, Topics } = require("../models");
const { Op } = require("sequelize");
const responeStandart = require("../helper/respone");

module.exports = {
    getFavorite: async (req, res) => {
        try {
            const find = await Favorite.findAll({
                where: {
                    user_id: req.user.id,
              
                },
            });
            const { count, rows } = await News.findAndCountAll({
                where: {
                    id: find.map((item) => {
                        return item.news_id;
                    }),
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
                return responeStandart(res, "success to display favorite stories", {
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
                    "unable to display favorite stories",
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
                "unable to display favorite stories",
                { ValidationError: e.details[0].message, sqlError: e },
                400,
                false
            );
        }
    },

    postFavorite: async (req, res) => {
        try{
            const news = await News.findByPk(req.params.id);
            if (news) {
                const save = await Favorite.create({
                    user_id: req.user.id,
                    news_id: req.params.id,
                });
                if (save) {
                    return responeStandart(res, "success to save story", {});
                } else {
                    return responeStandart(
                        res,
                        "the story failed to save",
                        {},
                        400,
                        false
                    );
                }
            } else {
                return responeStandart(
                    res,
                    "news not found",
                    {},
                    404,
                    false
                );
            }
            
        }catch(e){
            return responeStandart(
                res,
                "the story failed to save",
                { ValidationError: e.details[0].message, sqlError: e },
                400,
                false
            );
        }
    },

    deleteFavorite: async (req, res) => {
        try{
            const deletes = await Favorite.destroy({
                where: {
                    user_id: req.user.id,
                    news_id: req.params.id,
                },
            });
            if(deletes){
                return responeStandart(res, "success to remove favorite story");
            }else{
                return responeStandart(res, "the favorite story failed to remove", {}, 400, false);
            }
        }catch(e){
            return responeStandart(
                res,
                "the favorite story failed to remove",
                { ValidationError: e.details[0].message, sqlError: e },
                400,
                false
            );
        }
    }
};