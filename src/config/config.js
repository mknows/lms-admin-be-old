require("dotenv").config({ path: __dirname + "/config.env" });
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
		username: "postgres",
		password: "root",
		database: "kg",
		host: "localhost",
		dialect: "postgres",
		port: 5432,
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
	GCP_sql_postge: {
		username: "postgres",
		password: "D^Eos<=#hyusu{P8",
		database: "kampus-gratis-develop",
		host: "34.101.250.5",
		dialect: "postgres",
		port: 5432,
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
	nonmsib: {
		username: DB_USERNAME_NONMSIB,
		password: DB_PASSWORD_NONMSIB,
		database: DB_NAME_NONMSIB,
		host: DB_HOST_NONMSIB,
		dialect: "postgres",
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
	testing_kg: {
		username: "postgres",
		password: "belajar",
		database: "testing_kg",
		host: "localhost",
		dialect: "postgres",
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

	gcpdb: {
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
		},
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
