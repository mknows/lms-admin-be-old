"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Article extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Article.init(
		{
			id: {
				type: DataTypes.STRING,
				primaryKey: true,
				defaultValue: sequelize.literal("gen_random_uuid()"),
			},
			title: DataTypes.STRING,
			image: DataTypes.STRING,
			description: DataTypes.STRING,
			created_by: DataTypes.UUID,
			updated_by: DataTypes.UUID,
			created_at: DataTypes.DATE,
			updated_at: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: "Article",
			tableName: "Articles",
			timestamps: true,
			underscored: true,
			underscoredAll: true,
			createdAt: "created_at",
			updatedAt: "updated_at",
		}
	);
	return Article;
};
