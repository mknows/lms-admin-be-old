const winston = require("winston");
const { LoggingWinston } = require("@google-cloud/logging-winston");

const loggingWinston = new LoggingWinston();

exports.logger = winston.createLogger({
	level: "info",
	transports: [
		new winston.transports.Console(),
		loggingWinston,
		new winston.transports.File({ filename: "gcp_logging.log" }),
	],
});

// logger.error("warp nacelles offline");
// logger.info("shields at 99%");
