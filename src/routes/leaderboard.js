const express = require("express");
const route = express.Router();

const leaderboardController = require("../controllers/leaderboardController");
const { protection, authorize } = require("../middlewares/Authentication");

route.get("/", protection, leaderboardController.getLeaderboard);

module.exports = route;
