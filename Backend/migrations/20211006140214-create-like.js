"use strict";
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("likes", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			userId: {
				allowNull: false,
				type: Sequelize.DataTypes.INTEGER.UNSIGNED,
				onDelete: "CASCADE",
				references: {
					model: "users",
					key: "id",
				},
			},
			postId: {
				allowNull: false,
				type: Sequelize.DataTypes.INTEGER.UNSIGNED,
				onDelete: "CASCADE",
				references: {
					model: "posts",
					key: "id",
				},
			},
			like: {
				type: Sequelize.DataTypes.INTEGER.UNSIGNED,
			},
			dislike: {
				type: Sequelize.DataTypes.INTEGER.UNSIGNED,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATEONLY,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATEONLY,
			},
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("likes");
	},
};
