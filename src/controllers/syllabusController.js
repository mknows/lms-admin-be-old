const { Major, Subject, MajorSubject, User, Lecturer } = require("../models");
const { Op } = require("sequelize");
const Sequelize = require("sequelize");
const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/errorResponse");
const pagination = require("../helpers/pagination");

module.exports = {
	/**
	 * @desc      update module enrolled
	 * @route     PUT /api/v1/syllabus/major/all
	 * @access    Private
	 */
	getAllMajors: asyncHandler(async (req, res) => {
		const major = await Major.findAll({
			attributes: ["id", "name", "description", "head_of_major"],
		});
		const majorSubject = await MajorSubject.findAll({
			attributes: [
				"major_id",
				[
					Sequelize.fn("COUNT", Sequelize.col("major_id")),
					"number_of_subjects",
				],
			],
			group: "major_id",
		});

		for (i = 0; i < major.length; i++) {
			for (j = 0; j < majorSubject.length; j++) {
				if (major[i].dataValues.id === majorSubject[j].dataValues.major_id) {
					major[i].dataValues["number_of_subjects"] =
						majorSubject[j].dataValues.number_of_subjects;
				}
			}
		}
		return res.sendJson(200, true, "Success", major);
	}),
	/**
	 * @desc      update module enrolled
	 * @route     PUT /api/v1/syllabus/majors/paginate?page=(number)&&limit=(number)
	 * @access    Private
	 */ getAllMajorsPagination: asyncHandler(async (req, res) => {
		const { page, limit, search } = req.query;

		let search_query = "%%";

		if (search) {
			search_query = "%" + search + "%";
		}

		const major = await Major.findAll({
			attributes: ["id", "name", "description"],
			where: {
				name: {
					[Op.like]: search_query,
				},
			},
			include: [
				{
					model: Lecturer,
					attributes: ["is_mentor", "is_lecturer", "id"],
					include: [
						{
							model: User,
							attributes: ["full_name"],
						},
					],
				},
			],
		});
		const majorSubject = await MajorSubject.findAll({
			attributes: [
				"major_id",
				[
					Sequelize.fn("COUNT", Sequelize.col("major_id")),
					"number_of_subjects",
				],
			],
			group: "major_id",
		});
		for (i = 0; i < major.length; i++) {
			for (j = 0; j < majorSubject.length; j++) {
				if (major[i].dataValues.id === majorSubject[j].dataValues.major_id) {
					major[i].dataValues["number_of_subjects"] =
						majorSubject[j].dataValues.number_of_subjects;
				}
			}
		}

		const pagedMajor = await pagination(major, page, limit);

		if (pagedMajor === "Data cannot be sliced") {
			return res.sendJson(400, false, pagedMajor, {});
		} else if (pagedMajor === "Limit and / or Page is not an integer") {
			return res.sendJson(400, false, pagedMajor, {});
		}
		return res.sendJson(200, true, "Success", pagedMajor);
	}),
	/**
	 * @desc      update module enrolled
	 * @route     PUT /api/v1/syllabus/subjects/all
	 * @access   Private
	 */
	getAllSubjects: asyncHandler(async (req, res) => {
		const SubjectMajor = await Major.findAll({
			attributes: ["name", "description"],
			include: {
				model: Subject,
				attributes: ["id", "name", "credit", "degree"],
			},
		});
		return res.sendJson(200, true, "Success", SubjectMajor);
	}),
	/**
	 * @desc      update module enrolled
	 * @route     PUT /api/v1/syllabus/subjects/paginate?page=(number)&&limit=(number)
	 * @access   Private
	 */
	getAllSubjectsPagination: asyncHandler(async (req, res) => {
		const { page, limit } = req.query;

		const SubjectMajor = await Major.findAll({
			attributes: ["name", "description"],
			include: {
				model: Subject,
				attributes: ["id", "name", "credit", "degree"],
			},
		});
		pagination(SubjectMajor, page, limit);
		return res.sendJson(200, true, "Success", SubjectMajor);
	}),
};
