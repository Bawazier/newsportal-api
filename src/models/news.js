'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class News extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  News.init({
    user_id: DataTypes.INTEGER,
    topics_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    thumbnail: DataTypes.TEXT,
    story: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'News',
  });
  return News;
};