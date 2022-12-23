const {
	Faculty,
	Major,
	Subject,
	User,
	Student,
	Lecturer,
} = require("../models");
const asyncHandler = require("express-async-handler");
const { Op, fn, col } = require("sequelize");

module.exports = {
	/**
	 * @desc      get all notification
	 * @route     POST /api/v1/faculty/
	 * @access    Public
	 */
	getAllFaculty: asyncHandler(async (req, res) => {
		let result;

		result = await Faculty.findAll({
			attributes: {
				include: [
					[fn("COUNT", col("Majors.id")), "major_count"],
					[fn("COUNT", col("Majors.id")), "subject_count"], // TODO STILL WRONG (NOT YET IJMPLEMENTED)
					[fn("COUNT", col("Majors.id")), "sks_count"], // TODO STILL WRONG (NOT YET IMPLEMENTED), IS HERE ONLY TO PLEASE APPS MODEL
				],
			},
			include: [
				{
					model: Major,
					attributes: [],
				},
			],
			group: ["Faculty.id"],
		});
		return res.sendJson(200, true, "Success", result);
	}),

	/**
	 * @desc      get all notification
	 * @route     POST /api/v1/faculty/majors?faculty_id=<id>
	 * @access    Public
	 */
	getFacultyMajors: asyncHandler(async (req, res) => {
		let result;
		const { faculty_id } = req.query;
		result = await Faculty.findOne({
			where: {
				id: faculty_id,
			},
			include: {
				model: Major,
			},
		});
		return res.sendJson(200, true, "Success", result);
	}),
};
