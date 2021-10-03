'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.post.belongsTO(models.user, {
        foreignKey: {
          allowNull: false
        }
      })
    }
  };
  post.init({
    userId: DataTypes.INTEGER.UNSIGNED,
    title: DataTypes.STRING(50),
    content: DataTypes.STRING(1000),
    attachment: DataTypes.STRING,
    likes: DataTypes.INTEGER.UNSIGNED(1),
    dislikes: DataTypes.INTEGER.UNSIGNED(1),
  }, {
    sequelize,
    modelName: 'post',
  });
  return post;
};