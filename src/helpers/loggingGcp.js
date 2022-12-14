const winston = require("winston");
const { LoggingWinston } = require("@google-cloud/logging-winston");

const loggingWinston = new LoggingWinston();

try {
	const logger = winston.createLogger({
		level: "info",
		transports: [new winston.transports.Console(), loggingWinston],
	});

	logger.error("warp nacelles offline");
	logger.info("shields at 99%");
} catch (error) {
	console.log(error);
}
