const { Major } = require("../models");
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
		const { majorId } = req.params;
		const data = await Major.findOne({
			where: {
				id: majorId,
			},
		});
		return res.sendJson(200, true, "Search major successfully.", data);
	}),

	/**
	 * @desc      Edit Major (Ubah Major)
	 * @route     PUT /api/v1/major/edit/:majorId
	 * @access    Private
	 */
	editMajor: asyncHandler(async (req, res) => {
		const { majorId } = req.params;
		const { major } = req.body;

		let data = await Major.findOne({
			where: { id: majorId },
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
				where: { id: majorId },
				returning: true,
				plain: true,
			}
		);

		return res.status(200).json({
			success: true,
			message: `Edit Major with ID ${majorId} successfully.`,
			data: { ...data[1].dataValues },
		});
	}),

	/**
	 * @desc      Delete Major (Hapus Major)
	 * @route     DELETE /api/v1/majors/delete/:majorId
	 * @access    Private
	 */
	removeMajor: asyncHandler(async (req, res) => {
		const { majorId } = req.params;

		let data = await Major.findOne({
			where: { id: majorId },
		});

		if (!data)
			return res.status(404).json({
				success: false,
				message: "Invalid major_id.",
				data: {},
			});

		Major.destroy({
			where: { id: majorId },
		});

		return res.status(200).json({
			success: true,
			message: `Delete Major with ID ${majorId} successfully.`,
			data: {},
		});
	}),
};
