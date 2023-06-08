require("dotenv").config();
const { DB_USERNAME_GCP, DB_PASSWORD_GCP, DB_NAME_GCP, DB_HOST_GCP } =
	process.env;

module.exports = {
	development: {
		username: "postgres",
		password: "112233",
		database: "old-v1",
		host: "localhost",
		dialect: "postgres",
		operatorsAliases: 0,
		dialectOptions: {
			useUTC: false,
		},
		timezone: "Asia/Jakarta",
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
};