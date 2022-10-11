const dotenv = require("dotenv");
dotenv.config({ path: "../config/config.env" });
const redis = require("redis");

let redisClient;

(async () => {
	redisClient = redis.createClient({
		url: process.env.DB_REDIS_URL,
		password: process.env.DB_REDIS_PASS,
	});

	redisClient.on("connect", () => {
		console.log("connected redis");
	});
	redisClient.on("error redis : ", (error) => console.log(error));

	await redisClient.connect();
})();

exports.redisClient = redisClient;
