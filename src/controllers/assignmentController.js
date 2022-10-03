const { Assignment, Material } = require("../models");
const moment = require("moment");
const { Op } = require("sequelize");
const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/errorResponse");
const {
	getStorage,
	ref,
	getDownloadURL,
	deleteObject,
} = require("firebase/storage");
const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");

module.exports = {
	/**
	 * @desc      POST create Assignment
	 * @route     GET /api/v1/assignment/create
	 * @access    Private
	 */
	createAssignment: asyncHandler(async (req, res) => {
		const { session_id, duration, description, content, document_id } =
			req.body;
		const bucket = admin.storage().bucket();
		const storage = getStorage();

		const assign = await Assignment.create({
			session_id: session_id,
			duration: duration,
			description: description,
			content: content,
			// document_id: document_id,
		});

		const file_assignment =
			"document_assignment/" +
			uuidv4() +
			"-" +
			req.file.originalname.split(" ").join("-");
		const file_assignment_buffer = req.file.buffer;

		bucket
			.file(file_assignment)
			.createWriteStream()
			.end(file_assignment_buffer)
			.on("finish", () => {
				getDownloadURL(ref(storage, file_assignment)).then(async (linkFile) => {
					await Assignment.update(
						{
							file_assignment: file_assignment,
							file_assignment_link: linkFile,
						},
						{
							where: {
								id: assign.id,
							},
						}
					);
				});
			});

		await Material.create({
			session_id: session_id,
			duration: duration,
			description: description,
			type: "ASSIGNMENT",
			id_referrer: assign.id,
		});

		return res.sendJson(200, true, "Success", assign);
	}),
	/**
	 * @desc      Get all Assignment
	 * @route     GET /api/v1/assignment/
	 * @access    Private
	 */
	getAllAssignment: asyncHandler(async (req, res) => {
		const assign = await Assignment.findAll();
		res.sendJson(200, true, "Success", assign);
	}),
	/**
	 * @desc      Get Assignment in session
	 * @route     GET /api/v1/assignment/session/:session_id
	 * @access    Private
	 */
	getAssignmentInSession: asyncHandler(async (req, res) => {
		const { session_id } = req.params;
		const assign = await Assignment.findAll({
			where: {
				session_id: session_id,
			},
		});
		res.sendJson(200, true, "Success", assign);
	}),
	/**
	 * @desc      Get Assignment
	 * @route     GET /api/v1/assignment/:assignment_id
	 * @access    Private
	 */
	getAssignment: asyncHandler(async (req, res) => {
		const { assignment_id } = req.params;
		const assign = await Assignment.findOne({
			where: {
				id: assignment_id,
			},
		});
		res.sendJson(200, true, "Success", assign);
	}),
	/**
	 * @desc      update Assignment
	 * @route     put /api/v1/assignment/:assignment_id
	 * @access    Private
	 */
	updateAssignment: asyncHandler(async (req, res) => {
		const { assignment_id } = req.params;
		let { session_id, duration, description, content, document_id } = req.body;
		const storage = getStorage();
		const bucket = admin.storage().bucket();

		const exist = await Assignment.findOne({
			where: {
				id: assignment_id,
			},
		});

		if (!exist) {
			return res.status(404).json({
				success: false,
				message: "Invalid assignment id.",
				data: {},
			});
		}

		if (exist.file_assignment) {
			await deleteObject(
				ref(storage, `document_assignment/${exist.file_assignment}`)
			);
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

		const file_assignment =
			"document_assignment/" +
			uuidv4() +
			"-" +
			req.file.originalname.split(" ").join("-");
		const file_assignment_buffer = req.file.buffer;

		bucket
			.file(file_assignment)
			.createWriteStream()
			.end(file_assignment_buffer)
			.on("finish", () => {
				getDownloadURL(ref(storage, file_assignment)).then(async (linkFile) => {
					await Assignment.update(
						{
							file_assignment: file_assignment,
							file_assignment_link: linkFile,
						},
						{
							where: {
								id: assignment_id,
							},
						}
					);
				});
			});

		await Assignment.update(
			{
				session_id,
				duration,
				description,
				content,
				document_id,
			},
			{
				where: {
					id: assignment_id,
				},
				returning: true,
			}
		);

		return res.sendJson(200, true, "Success");
	}),
	/**
	 * @desc      Delete assignment
	 * @route     DELETE /api/v1/assignment/delete/:assignment_id
	 * @access    Private (Admin)
	 */
	removeAssignment: asyncHandler(async (req, res, next) => {
		const { assignment_id } = req.params;

		let data = await Assignment.findOne({
			where: { id: assignment_id },
		});

		if (!data) {
			return res.status(404).json({
				success: false,
				message: "Invalid assignment id.",
				data: {},
			});
		}

		Assignment.destroy({
			where: { id: assignment_id },
		});

		return res.status(200).json({
			success: true,
			message: `Delete Assignment with ID ${assignment_id} successfully.`,
			data: {},
		});
	}),
};
