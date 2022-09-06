require("dotenv").config({ path: "./config.env" });
const { DB_USERNAME, DB_PASSWORD, DB_NAME, DB_PORT, DB_HOST, DB_DIALECT } =
  process.env;

module.exports = {
  development: {
    username: "mnswslpo",
    password: "iUb503WHBZ1clnoFMkESwENBR8bT4H7s",
    database: "mnswslpo",
    host: "rosie.db.elephantsql.com",
    dialect: "postgres",
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
