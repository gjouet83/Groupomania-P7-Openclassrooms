'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      user.hasMany(models.post, {onDelete: "cascade"});
      user.hasMany(models.like, {onDelete: "cascade"});
      user.hasMany(models.comment, {onDelete: "cascade"});
    }
  };
  user.init({
    username: DataTypes.STRING(40),
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    givenname: DataTypes.STRING,
    birthday: DataTypes.DATEONLY,
    avatar: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};