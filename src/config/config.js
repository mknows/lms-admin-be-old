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
	},
	test: {
		username: DB_USERNAME,
		password: DB_PASSWORD,
		database: DB_NAME,
		host: DB_HOST,
		dialect: DB_DIALECT,
	},
	production: {
		username: DB_USERNAME,
		password: DB_PASSWORD,
		database: DB_NAME,
		host: DB_HOST,
		dialect: DB_DIALECT,
	},
};
