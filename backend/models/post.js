'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      post.hasMany(models.like, { onDelete: 'cascade' });
      post.hasMany(models.comment, { onDelete: 'cascade' });
      post.belongsTo(models.user);
    }
  }
  post.init(
    {
      userId: DataTypes.INTEGER.UNSIGNED,
      content: DataTypes.STRING(1000),
      attachment: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'post',
    }
  );
  return post;
};
