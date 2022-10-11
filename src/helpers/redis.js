const dotenv = require("dotenv");
dotenv.config({ path: "../config/config.env" });
const redis = require("redis");
const ErrorResponse = require("../utils/errorResponse");

let redisClient;

(async () => {
	redisClient = redis.createClient({
		url: process.env.DB_REDIS_URL,
		password: process.env.DB_REDIS_PASS,
	});

	redisClient.on("connect", () => {
		console.log("connected to redis");
	});
	redisClient.on("error", (error) => {
		return console.error("error redis : ", error.message);
		// return new Error(error.message);
	});
	await redisClient.connect();
})();

exports.redisClient = redisClient;
