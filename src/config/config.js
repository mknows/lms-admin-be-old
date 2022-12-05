require("dotenv").config();
const {
	DB_USERNAME,
	DB_PASSWORD,
	DB_NAME,
	DB_PORT,
	DB_HOST,
	DB_DIALECT,

	DB_USERNAME_NONMSIB,
	DB_PASSWORD_NONMSIB,
	DB_NAME_NONMSIB,
	DB_HOST_NONMSIB,

	DB_USERNAME_GCP,
	DB_PASSWORD_GCP,
	DB_NAME_GCP,
	DB_HOST_GCP,
} = process.env;

module.exports = {
	development: {
		username: DB_USERNAME_GCP,
		password: DB_PASSWORD_GCP,
		database: DB_NAME_GCP,
		host: DB_HOST_GCP,
		dialect: DB_DIALECT,
		define: {
			paranoid: true,
			timestamps: true,
			underscored: true,
			underscoredAll: true,
			createdAt: "created_at",
			updatedAt: "updated_at",
			deletedAt: "deleted_at",
			defaultScope: {
				attributes: {
					exclude: [
						"created_at",
						"updated_at",
						"deleted_at",
						"created_by",
						"updated_by",
					],
				},
			},
		},
		logging: false,
	},

	production: {
		username: DB_USERNAME,
		password: DB_PASSWORD,
		database: DB_NAME,
		host: DB_HOST,
		dialect: DB_DIALECT,
		define: {
			paranoid: true,
			timestamps: true,
			underscored: true,
			underscoredAll: true,
			createdAt: "created_at",
			updatedAt: "updated_at",
			deletedAt: "deleted_at",
		},
	},
};
