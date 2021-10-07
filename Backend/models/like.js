'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      like.belongsTo(models.user);
      like.belongsTo(models.post);
    }
  };
  like.init({
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    like: DataTypes.INTEGER,
    dislike: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'like',
  });
  return like;
};