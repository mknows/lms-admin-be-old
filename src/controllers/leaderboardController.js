const { Leaderboard, Student, Lecturer, User } = require("../models");
const asyncHandler = require("express-async-handler");
const scoringController = require("./scoringController");

module.exports = {
	/**
	 * @desc      Update leaderboard
	 * @access    Private
	 */
	updateLeaderboardGPA: asyncHandler(async (user_id, gpa) => {
		let result;

		let data = await Leaderboard.findOne({
			where: {
				user_id: user_id,
			},
		});

		if (!data) {
			data = await Leaderboard.create({
				user_id: user_id,
				gpa: gpa,
			});

			// #### DEBUG ####
			console.log(
				"crete nerw log",
				data.gpa,
				data.forum_score,
				data.final_score
			);

			return data;
		}

		data = await Leaderboard.update(
			{
				gpa: gpa,
			},
			{
				where: {
					user_id: user_id,
				},
				returning: true,
			}
		);

		data = data[1][0].dataValues;
		// #### DEBUG ####
		console.log(
			"UPDTATE LOG gpa",
			data.gpa,
			data.forum_score,
			data.final_score
		);

		await updateLeaederboardFinalScore(user_id);

		return result;
	}),
	/**
	 * @desc      Update leaderboard
	 * @access    Private
	 */
	updateLeaderboardForum: asyncHandler(async (user_id, forum_score) => {
		let result;

		let data = await Leaderboard.findOne({
			where: {
				user_id: user_id,
			},
		});

		if (!data) {
			data = await Leaderboard.create({
				user_id: user_id,
				forum_score: forum_score,
			});

			// #### DEBUG ####
			console.log(
				"crete nerw log",
				data.gpa,
				data.forum_score,
				data.final_score
			);

			return data;
		}

		data = await Leaderboard.update(
			{
				forum_score: forum_score,
			},
			{
				where: {
					user_id: user_id,
				},
				returning: true,
			}
		);

		data = data[1][0].dataValues;
		// #### DEBUG ####
		console.log(
			"UPDTATE LOG forum",
			data.gpa,
			data.forum_score,
			data.final_score
		);

		await updateLeaederboardFinalScore(user_id);

		return result;
	}),
	/**
	 * @desc      Update leaderboard
	 * @access    Private
	 */
	getUserId: asyncHandler(async (role_id, role) => {
		let result;
		let data;

		switch (role) {
			case "STUDENT":
				data = await Student.findOne({
					where: {
						id: role_id,
					},
					attributes: ["user_id"],
				});
				result = data.user_id;
				break;
			case "LECTURER":
				data = await Lecturer.findOne({
					where: {
						id: role_id,
					},
					attributes: ["user_id"],
				});
				result = data.user_id;
				break;
		}
		return result;
	}),
};

async function calculateFinalScore(gpa, forum) {
	let result = gpa + forum;

	let min_forum = await Leaderboard.min("forum_score");
	let max_forum = await Leaderboard.max("forum_score");

	// #### DEBUG ####
	console.log("FINAL SCORE from calculator", min_forum, max_forum);
	return result;
}

async function updateLeaederboardFinalScore(user_id) {
	let data = await Leaderboard.findOne({
		where: {
			user_id: user_id,
		},
	});

	let new_final_score = await calculateFinalScore(data.gpa, data.forum_score);

	data = await Leaderboard.update(
		{
			final_score: new_final_score,
		},
		{
			where: {
				user_id: user_id,
			},
			returning: true,
		}
	);

	data = data[1][0].dataValues;
	return data;
}
