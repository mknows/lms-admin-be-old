const { Major, Subject, MajorSubject } = require("../models");
const moment = require("moment");
const { Op } = require("sequelize");
const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/errorResponse");

module.exports = {
	/**
	 * @desc      post Major (Tambah Major)
	 * @route     POST /api/v1/major/create
	 * @access    Private
	 */
	postMajor: asyncHandler(async (req, res) => {
		const { major } = req.body;
		if (!major) return res.sendJson(400, false, "Some fields is missing.", {});

		const data = await Major.create({
			name: major[0].toUpperCase() + major.slice(1),
		});

		return res.sendJson(
			200,
			true,
			"Create New Major Success.",
			data.dataValues
		);
	}),

	/**
	 * @desc      post MajorSubjects
	 * @route     POST /api/v1/major/insertsubjects/:major_id
	 * @access    Private
	 */
	insertSubjectToMajor: asyncHandler(async (req, res) => {
		const { subjects } = req.body;
		const { major_id } = req.params;

		if (!major_id) {
			return res.sendJson(400, false, "Some fields are missing.", {});
		}

		const major = await Major.findOne({
			where: {
				id: major_id,
			},
		});

		if (!major) {
			return res.sendJson(400, false, "Invalid major id", {});
		}

		for (let i = 0; i < subjects.length; i++) {
			let sub = await Subject.findOne({
				where: {
					id: subjects[i],
				},
			});

			if (!sub) {
				return res.sendJson(
					400,
					false,
					`invalid subject id ${subjects[i]}`,
					{}
				);
			}

			await MajorSubject.create({
				major_id: major_id,
				subject_id: subjects[i],
			});
		}

		return res.sendJson(
			200,
			true,
			"Successfully Created New MajorSubjects",
			major
		);
	}),

	/**
	 * @desc      get Major
	 * @route     GET /api/v1/major
	 * @access    Public
	 */
	getAllMajors: asyncHandler(async (req, res) => {
		const data = await Major.findAll();
		return res.sendJson(200, true, "Search all major successfully.", data);
	}),

	/**
	 * @desc      get one Major
	 * @route     GET /api/v1/major/:id
	 * @access    Public
	 */
	getMajor: asyncHandler(async (req, res) => {
		const { major_id } = req.params;
		const data = await Major.findOne({
			where: {
				id: major_id,
			},
		});
		return res.sendJson(200, true, "Search major successfully.", data);
	}),

	/**
	 * @desc      Edit Major (Ubah Major)
	 * @route     PUT /api/v1/major/edit/:major_id
	 * @access    Private
	 */
	editMajor: asyncHandler(async (req, res) => {
		const { major_id } = req.params;
		const { major } = req.body;

		let data = await Major.findOne({
			where: { id: major_id },
		});

		if (!data) {
			return res.status(404).json({
				success: false,
				message: "Invalid major_id.",
				data: {},
			});
		}

		data = await Major.update(
			{
				name: major,
			},
			{
				where: { id: major_id },
				returning: true,
				plain: true,
			}
		);

		return res.status(200).json({
			success: true,
			message: `Edit Major with ID ${major_id} successfully.`,
			data: { ...data[1].dataValues },
		});
	}),

	/**
	 * @desc      Delete Major (Hapus Major)
	 * @route     DELETE /api/v1/majors/delete/:major_id
	 * @access    Private
	 */
	removeMajor: asyncHandler(async (req, res) => {
		const { major_id } = req.params;

		let data = await Major.findOne({
			where: { id: major_id },
		});

		if (!data)
			return res.status(404).json({
				success: false,
				message: "Invalid major_id.",
				data: {},
			});

		Major.destroy({
			where: { id: major_id },
		});

		return res.status(200).json({
			success: true,
			message: `Delete Major with ID ${major_id} successfully.`,
			data: {},
		});
	}),
};
