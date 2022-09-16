require("dotenv").config({ path: __dirname + "/config.env" });
const { DB_USERNAME, DB_PASSWORD, DB_NAME, DB_PORT, DB_HOST, DB_DIALECT } =
	process.env;

module.exports = {
	development: {
		username: "postgres",
		password: "belajar",
		database: "testing_kg",
		host: "localhost",
		dialect: "postgres",
		port: 5433,
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
	test: {
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
	testing_kg:{
		username: "postgres",
		password: "belajar",
		database: "testing_kg",
		host: "localhost",
		dialect: "postgres",
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
