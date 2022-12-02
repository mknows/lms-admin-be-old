const dotenv = require("dotenv");
dotenv.config();
const redis = require("redis");

let redisClient;

(async () => {
	redisClient = redis.createClient({
		url: process.env.DB_REDIS_URL,
		password: process.env.DB_REDIS_PASS,
	});

	redisClient.on("connect", () => {
		// console.log("connected to redis");
	});
	redisClient.on("error", (error) => {
		return console.error("error redis : ", error.message);
	});
	await redisClient.connect();
})();

exports.redisClient = redisClient;
