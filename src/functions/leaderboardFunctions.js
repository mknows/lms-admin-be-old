const { Leaderboard, Student, Lecturer, User } = require("../models");
const scoringFunctions = require("./scoringFunctions");

exports.updateUserInLeaderboard = async (user_id) => {
	let result;

	let likes = await scoringFunctions.getLikesReportTest(user_id);

	let total_forum_score = 0;
	for (let i = 0; i < likes.length; i++) {
		let currlike = likes[i][0].dataValues;

		let studlike =
			currlike.n_student_like == null ? 0 : parseInt(currlike.n_student_like);

		let leclike =
			currlike.n_teacher_like == null ? 0 : parseInt(currlike.n_teacher_like);

		let currscore = await scoringFunctions.getTotalLikesScore(
			studlike,
			leclike
		);
		total_forum_score += currscore;
	}

	const student_id = await this.getStudentId(user_id);

	let gpa = await scoringFunctions.getStudentGPA(student_id);

	await this.updateLeaderboardGPA(user_id, gpa);
	await this.updateLeaderboardForum(user_id, total_forum_score);

	return result;
};

/**
 * @desc      Update leaderboard
 * @access    Private
 */
exports.updateLeaderboardGPA = async (user_id, gpa) => {
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
	console.log("UPDATE LOG gpa", data.gpa, data.forum_score, data.final_score);

	await updateLeaederboardFinalScore(user_id);

	return result;
};
/**
 * @desc      Update leaderboard
 * @access    Private
 */
exports.updateLeaderboardForum = async (user_id, forum_score) => {
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
		console.log("crete nerw log", data.gpa, data.forum_score, data.final_score);

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
};
/**
 * @desc      Update leaderboard
 * @access    Private
 */
exports.getUserId = async (role_id, role) => {
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
};

/**
 * @desc      get student id of user id
 * @access    Private
 */
exports.getStudentId = async (user_id) => {
	let result;

	let data = await Student.findOne({
		where: {
			user_id: user_id,
		},
		attributes: ["id"],
	});

	result = data.id;
	return result;
};

async function calculateFinalScore(gpa, forum) {
	let result;

	// normalize forum score by min max standarization
	const min_forum = await Leaderboard.min("forum_score");
	const max_forum = await Leaderboard.max("forum_score");

	let forum_score_standardized = (forum - min_forum) / (max_forum - min_forum);

	result = (forum_score_standardized + gpa / 4) * 5;

	// let rep = {
	// 	gpa: gpa,
	// 	forum: forum,
	// 	gpa_by4: gpa / 4,
	// 	forum_minmin: forum - min_forum,
	// 	forum_maxminmin: max_forum - min_forum,
	// 	forum_score_standardized: forum_score_standardized,
	// 	total_by5: forum_score_standardized + gpa / 4,
	// 	total: result,
	// };
	// console.log(rep);

	return result;
}

async function updateLeaederboardFinalScore(user_id) {
	let data = await Leaderboard.findOne({
		where: {
			user_id: user_id,
		},
	});

	let new_final_score = await calculateFinalScore(data.gpa, data.forum_score);
	new_final_score = parseFloat(new_final_score.toFixed(3)) * 1000;

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
