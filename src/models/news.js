"use strict";
const {
    Model
} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class News extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
        static associate(models) {
            // define association here
            models.Topics.hasMany(News, {
                foreignKey: "topics_id",
            });
            News.belongsTo(models.Topics, {
                foreignKey: "topics_id",
            });

            models.User.hasMany(News, {
                foreignKey: "user_id",
            });
            News.belongsTo(models.User, {
                foreignKey: "user_id",
            });

            News.hasMany(models.Favorite, {
                foreignKey: "news_id",
            });
            models.Favorite.belongsTo(News, {
                foreignKey: "news_id",
            });
            
        }
    }
    News.init({
        user_id: DataTypes.INTEGER,
        topics_id: DataTypes.INTEGER,
        title: DataTypes.STRING,
        thumbnail: DataTypes.TEXT,
        story: DataTypes.TEXT
    }, {
        sequelize,
        modelName: "News",
    });
    return News;
};