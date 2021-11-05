'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
      },
      userId: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER.UNSIGNED,
        onDelete: 'CASCADE',
        references: {
          model: 'users',
          key: 'id',
        },
      },
      content: {
        type: Sequelize.DataTypes.STRING(1000),
      },
      attachment: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('posts');
  },
};
