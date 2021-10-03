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
      models.profil.belongsTO(models.user, {
        foreignKey: {
          allowNull: false
        }
      })
    }
  };
  profil.init({
    userId: DataTypes.INTEGER.UNSIGNED,
    name: DataTypes.STRING(50),
    givenname: DataTypes.STRING(50),
    birthday: DataTypes.DATEONLY,
    avatar: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'profil',
  });
  return profil;
};