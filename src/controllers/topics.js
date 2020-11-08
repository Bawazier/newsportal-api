const {Topics} = require("../models");
const responeStandart = require("../helper/respone");
const schema = require("../helper/validation");

const topicsSchema = schema.Topics;

module.exports = {
    getTopics: async (req, res) => {
        try{
            const find = await Topics.findAll();
            if (find) {
                return responeStandart(res, "success to display topics", {find});
            } else {
                return responeStandart(
                    res,
                    "unable to display topics",
                    {},
                    400,
                    false
                );
            }
        }catch(e){
            return responeStandart(res, "unable to display topics", {}, 400, false);
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
                { ValidationError: e.details[0].message },
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
            return responeStandart(res, "unable to update topics", {}, 400, false);
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
            return responeStandart(res, "unable to update topics", {}, 400, false);
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
                {},
                400,
                false
            );
        }
    }
};