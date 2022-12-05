const { Leaderboard } = require("../models");
const asyncHandler = require("express-async-handler");
const scoringFunctions = require("../functions/scoringFunctions");
const leaderboardFunctions = require("../functions/leaderboardFunctions");

module.exports = {
	/**
	 * @desc      Get get top at most 13 (3 + 10)
	 * @route     GET /api/v1/leaderboard/
	 * @access    Private
	 */
	getLeaderboard: asyncHandler(async (req, res) => {
		let result;

		result = await Leaderboard.findAll({
			limit: 23,
			order: [["final_score", "DESC"]],
		});

		return res.sendJson(
			200,
			true,
			"Successfully retrieved leaderboard",
			result
		);
	}),
};
