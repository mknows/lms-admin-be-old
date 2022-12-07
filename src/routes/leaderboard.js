const express = require("express");
const route = express.Router();

const leaderboardController = require("../controllers/leaderboardController");
const { protection, authorize } = require("../middlewares/Authentication");

route.get("/", protection, leaderboardController.getLeaderboard);

route.put(
	"/update/all",
	protection,
	leaderboardController.updateAllLeaderboard
);

module.exports = route;
