const { StudentDatapool, Student, User, Subject } = require("../models");
const { Op } = require("sequelize");
const asyncHandler = require("express-async-handler");
const makeslug = require("../helpers/makeslug");
const sequelize = require("sequelize");
const pagination = require("../helpers/pagination");

module.exports = {
	/**
	 * @desc      posts data
	 * @route     GET /api/v1/analytics/insertall
	 * @access    Public
	 */
	randomDataSeed: asyncHandler(async (req, res) => {
		let result = 0;
		const students = await Student.findAll({
			attributes: ["id", "user_id"],
		});

		result = students;

		return res.sendJson(200, true, "Successfully updated", result);
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
