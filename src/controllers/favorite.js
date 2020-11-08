const {News, Favorite} = require("../models");
const responeStandart = require("../helper/respone");

module.exports = {
    getFavorite: async (req, res) => {
        try{
            const find = await Favorite.findAll({
                where: {
                    user_id: req.user.id
                }
            });
            const findNews = await News.findAll({
                where: {
                    id: find.map(item => {
                        return item.news_id;
                    })
                }
            });
            return responeStandart(res, "success to display favorite stories", {findNews});
        }catch(e){
            return responeStandart(res, "unable to display favorite stories", 500, false);
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
            return responeStandart(res, "the story failed to save", {}, 400, false);
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
            return responeStandart(res, "the favorite story failed to remove", {}, 400, false);
        }
    }
};