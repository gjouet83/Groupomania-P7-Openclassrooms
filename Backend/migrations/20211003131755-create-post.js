'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER.UNSIGNED
      },
      userId: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
        onDelete: "CASCADE",
        references: {
          model:"users",
          key:"id",
        }
      },
      title: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING(50)
      },
      content: {
        type: Sequelize.DataTypes.STRING(1000)
      },
      attachment: {
        type: Sequelize.STRING
      },
      likes: {
        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0
      },
      dislikes: {
        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATEONLY
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('posts');
  }
};