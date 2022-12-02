require("dotenv").config();
const Sentry = require("@sentry/node");

const { SENTRY_DSN } = process.env;

Sentry.init({
  dsn: SENTRY_DSN,
});

module.exports = Sentry;
