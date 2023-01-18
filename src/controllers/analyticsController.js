const { StudentDatapool, Student, User, Subject } = require("../models");
const { Op } = require("sequelize");
const asyncHandler = require("express-async-handler");
const makeslug = require("../helpers/makeslug");
const sequelize = require("sequelize");
const pagination = require("../helpers/pagination");
const analyticsFunctions = require("../functions/analyticsFunctions");

module.exports = {
	/**
	 * @desc      posts data
	 * @route     GET /api/v1/analytics/insertall
	 * @access    Public
	 */
	getStudentPrediction: asyncHandler(async (req, res) => {
		const { student_id } = req.query;
		const { semester } = req.query;
		let result = await analyticsFunctions.getPrediction(student_id, semester);

		return res.sendJson(200, true, "Successfully retrieved prediction", result);
	}),

	/**
	 * @desc      posts data
	 * @route     GET /api/v1/analytics/insertall
	 * @access    Public
	 */
	getStudentSemestrialAnalytics: asyncHandler(async (req, res) => {
		let result = 0;

		const student_id = req.student_id;

		const required_data = await Promise.all([
			await StudentDatapool.findAll({
				where: {
					student_id: student_id,
				},
				attributes: {
					exclude: ["user_id", "student_id", "id"],
				},
				order: ["semester"],
			}),
			await Student.findOne({
				where: {
					id: student_id,
				},
				attributes: ["id"],
				include: {
					model: User,
					attributes: ["id", "full_name"],
				},
			}),
		]);

		let semestrial_data = required_data[0];

		let student_data = required_data[1];

		result = {
			student_information: student_data,
			semestrial_analytics: semestrial_data,
		};

		return res.sendJson(200, true, "Successfully retrieved", result);
	}),
};
