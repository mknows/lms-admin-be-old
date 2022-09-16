const { Assignment, Material } = require("../models");
const moment = require("moment");
const { Op } = require("sequelize");
const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/errorResponse");

module.exports = {
	/**
	 * @desc      Get all Assignment
	 * @route     GET /api/v1/assignment/
	 * @access    Private
	 */
	getAllAssignment: async (req, res) => {
		try {
			const assign = await Assignment.findAll();
			res.sendJson(200, true, "Success", assign);
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
	/**
	 * @desc      Get Assignment
	 * @route     GET /api/v1/assignment/:id
	 * @access    Private
	 */
	getAssignment: async (req, res) => {
		try {
			const assignmentID = req.params.id;
			const assign = await Assignment.findAll({
				where: {
					id: assignmentID,
				},
			});
			res.sendJson(200, true, "Success", assign);
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
	/**
	 * @desc      update Assignment
	 * @route     put /api/v1/assignment/:id
	 * @access    Private
	 */
	updateAssignment: asyncHandler(async (req, res) => {
		const assignmentID = req.params.id;
		let { session_id, duration, description, content, document_id } = req.body;
		const exist = await Assignment.findOne({
			where: {
				id: assignmentID,
			},
		});

		if (!exist) {
			return res.status(404).json({
				success: false,
				message: "Invalid assignment id.",
				data: {},
			});
		}

		if (session_id === null) {
			session_id = exist.session_id;
		}
		if (duration === null) {
			duration = exist.duration;
		}
		if (description === null) {
			description = exist.description;
		}
		if (content === null) {
			content = exist.content;
		}
		if (document_id === null) {
			document_id = exist.document_id;
		}

		const assign = await Assignment.update(
			{
				session_id,
				duration,
				description,
				content,
				document_id,
			},
			{
				where: {
					id: assignmentID,
				},
				returning: true,
			}
		);
		return res.sendJson(200, true, "Success", { ...assign[1].dataValues });
	}),
	/**
	 * @desc      POST create Assignment
	 * @route     GET /api/v1/assignment/create
	 * @access    Private
	 */
	postAssignment: async (req, res) => {
		const { session_id, duration, description, content, document_id } =
			req.body;

		try {
			const assign = await Assignment.create({
				session_id: session_id,
				duration: duration,
				description: description,
				content: content,
				document_id: document_id,
			});

			await Material.create({
				session_id: session_id,
				duration: duration,
				description: description,
				type: "ASSIGNMENT",
				id_referrer: assign.id,
			});

			res.sendJson(200, true, "Success", assign);
		} catch (err) {
			res.sendJson(500, false, err.message, null);
		}
	},
};
