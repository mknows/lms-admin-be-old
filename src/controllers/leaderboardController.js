const { Leaderboard, User, Student } = require("../models");
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
			include: {
				model: User,
				attributes: ["full_name", "display_picture_link", "id"],
			},
		});

		return res.sendJson(
			200,
			true,
			"Successfully retrieved leaderboard",
			result
		);
	}),
	/**
	 * @desc      UPDATE LOOP USERS
	 * @route     PUT /api/v1/leaderboard/update/all
	 * @access    Private
	 */
	updateAllLeaderboard: asyncHandler(async (req, res) => {
		let result = null;

		const students = await Student.findAll({
			attributes: ["id", "user_id"],
		});

		for (let i = 0; i < students.length; i++) {
			let user_id = students[i].user_id;
			await leaderboardFunctions.updateUserInLeaderboard(user_id);
		}

		result = {
			rows_affected: students.length,
		};

		return res.sendJson(
			200,
			true,
			"Successfully updated all leaderboard",
			result
		);
	}),
};
