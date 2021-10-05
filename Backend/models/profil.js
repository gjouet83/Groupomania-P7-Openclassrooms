'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class profil extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      profil.belongsTo(models.user);
    }
  };
  profil.init({
    userId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    givenname: DataTypes.STRING,
    birthday: DataTypes.DATEONLY,
    avatar: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'profil',
  });
  return profil;
};