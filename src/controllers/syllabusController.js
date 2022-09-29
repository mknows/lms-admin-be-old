const { Major, Subject, MajorSubject } = require("../models");
const { Op } = require("sequelize");
const Sequelize = require("sequelize");
const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/errorResponse");
const pagination = require("../helpers/pagination");

module.exports = {
	/**
	 * @desc      update module enrolled
	 * @route     PUT /api/v1/syllabus/getAllMajors
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
		console.log(majorSubject);
		for (i = 0; i < major.length; i++) {
			for (j = 0; j < majorSubject.length; j++) {
				if (major[i].dataValues.id === majorSubject[j].dataValues.major_id) {
					console.log(major[i].dataValues);
					major[i].dataValues["number_of_subjects"] =
						majorSubject[j].dataValues.number_of_subjects;
				}
			}
		}
		console.log(major);
		return res.sendJson(200, true, "Success", major);
	}),
	/**
	 * @desc      update module enrolled
	 * @route     PUT /api/v1/syllabus/getAllMajorsPagination?offset=(number)&&limit=(number)
	 * @access    Private
	 */ getAllMajorsPagination: asyncHandler(async (req, res) => {
		const { offset, limit } = req.query;

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
					console.log(major[i].dataValues);
					major[i].dataValues["number_of_subjects"] =
						majorSubject[j].dataValues.number_of_subjects;
				}
			}
		}
		const pagedMajor = pagination(major, offset, limit);
		return res.sendJson(200, true, "Success", pagedMajor);
	}),
	/**
	 * @desc      update module enrolled
	 * @route     PUT /api/v1/syllabus/getAllSubjects
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
	 * @route     PUT /api/v1/syllabus/getAllSubjectsPagination?offset=(number)&&limit=(number)
	 * @access   Private
	 */
	getAllSubjectsPagination: asyncHandler(async (req, res) => {
		const { offset, limit } = req.query;

		const SubjectMajor = await Major.findAll({
			attributes: ["name", "description"],
			include: {
				model: Subject,
				attributes: ["id", "name", "credit", "degree"],
			},
		});
		pagination(SubjectMajor, offset, limit);
		return res.sendJson(200, true, "Success", SubjectMajor);
	}),
};
