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
					[fn("COUNT", col("Majors.Subjects.id")), "subject_count"],
					[fn("SUM", col("Majors.Subjects.credit")), "sks_count"],
				],
				exclude: ["thumbnail"],
			},
			include: [
				{
					model: Major,
					attributes: [],
					include: {
						model: Subject,
						attributes: [],
					},
				},
			],
			group: ["Faculty.id", "Majors->Subjects->MajorSubject.id"],
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
			attributes: {
				exclude: ["thumbnail"],
			},
			include: {
				model: Major,
				attributes: [
					[fn("SUM", col("Majors.Subjects.credit")), "credit_total"],
					"id",
					"name",
					"head_of_major",
					"thumbnail_link",
					"description",
					"faculty",
				],
				include: [
					{
						model: Lecturer,
						attributes: ["title"],
						include: {
							model: User,
							attributes: ["full_name"],
						},
					},
					{
						model: Subject,
						attributes: [],
					},
				],
			},
			group: [
				"Faculty.id",
				"Majors.id",
				"Majors->Subjects->MajorSubject.id",
				"Majors->Lecturer.id",
				"Majors->Lecturer->User.id",
			],
		});
		return res.sendJson(200, true, "Success", result);
	}),
};
