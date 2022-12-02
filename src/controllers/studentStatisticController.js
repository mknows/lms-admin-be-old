const { User, Student, Subject, Certificate } = require("../models");
const { getAuth: getClientAuth, updateProfile } = require("firebase/auth");
const Sequelize = require("sequelize");
require("dotenv").config();
const { FINISHED, ONGOING } = process.env;
const asyncHandler = require("express-async-handler");
const scoringController = require("./scoringController");

module.exports = {
	/**
	 * @desc      Get student Report
	 * @route     GET /api/v1/report/subject
	 * @access    Private
	 */
	getSubjectReport: asyncHandler(async (req, res) => {
		const student_id = req.student_id;

		let report = await scoringController.getReport(student_id);

		return res.status(200).json({
			success: true,
			message: "Successfuly retrieved report",
			data: report,
		});
	}),

	/**
	 * @desc      Get student score
	 * @route     GET /api/v1/report/likescore
	 * @access    Private
	 */
	getScoreReport: asyncHandler(async (req, res) => {
		let user_id = req.userData.id;

		let report;

		let raw_dat = [];
		let total_score = 0;
		let likes = await scoringController.getLikesReport(user_id);

		for (let i = 0; i < likes.length; i++) {
			let currlike = likes[i][0].dataValues;

			let studlike =
				currlike.n_student_like == null ? 0 : parseInt(currlike.n_student_like);

			let leclike =
				currlike.n_teacher_like == null ? 0 : parseInt(currlike.n_teacher_like);

			let currscore = await scoringController.getTotalLikesScore(
				studlike,
				leclike
			);

			total_score += currscore;

			raw_dat.push({
				studlike: studlike,
				leclike: leclike,
				score: currscore,
			});
		}

		report = {
			discussion_forum: {
				total_student_like: raw_dat[0].studlike,
				total_lecturer_like: raw_dat[0].leclike,
				score: raw_dat[0].score,
			},
			comment: {
				total_student_like: raw_dat[1].studlike,
				total_lecturer_like: raw_dat[1].leclike,
				score: raw_dat[1].score,
			},
			reply: {
				total_student_like: raw_dat[2].studlike,
				total_lecturer_like: raw_dat[2].leclike,
				score: raw_dat[2].score,
			},
			total: total_score,
		};

		return res.status(200).json({
			success: true,
			message: "Successfuly retrieved report",
			data: report,
		});
	}),
};
