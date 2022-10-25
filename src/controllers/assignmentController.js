const {
	Assignment,
	Material,
	MaterialEnrolled,
	sequelize,
	Session,
} = require("../models");
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
const moment = require("moment");
const checkDoneSession = require("../helpers/checkDoneSession");
require("dotenv").config({ path: __dirname + "/controllerconfig.env" });
const {
	ONGOING,
	GRADING,
	PASSED,
	FAILED,
	FINISHED,
	ABANDONED,
	LATE,
	MODULE,
	QUIZ,
	ASSIGNMENT,
} = process.env;

module.exports = {
	/**
	 * @desc      POST submit Assignment
	 * @route     POST /api/v1/assignment/submit/:session_id
	 * @access    Private
	 */
	submitAssignment: asyncHandler(async (req, res) => {
		const { session_id } = req.params;
		const bucket = admin.storage().bucket();
		const storage = getStorage();
		const student_id = req.student_id;

		const assign = await Assignment.findOne({
			attributes: ["created_at", "id", "duration"],
			where: {
				session_id: session_id,
			},
		});

		if (!assign) {
			return res.sendJson(400, false, "Assignment not found");
		}

		let material_data = await MaterialEnrolled.findOne({
			where: {
				id_referrer: assign.id,
				student_id,
			},
		});

		if (!material_data) {
			return res.sendJson(400, false, "student haven't taken assignment");
		}
		const file_assignment =
			"documents/assignments/" +
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
					const deadline = moment(
						new Date(
							new Date(assign.created_at).getTime() + assign.duration * 1000
						)
					);
					const date_submit = moment();

					const activity_detail = {
						date_submit: moment(deadline).format("DD/MM/YYYY hh:mm:ss"),
						file_assignment: file_assignment,
						file_assignment_link: linkFile,
					};

					material_data = await MaterialEnrolled.update(
						{
							activity_detail: activity_detail,
							status: moment(date_submit).isAfter(deadline) ? LATE : GRADING,
						},
						{
							where: {
								id_referrer: assign.id,
								student_id,
							},
							returning: true,
						}
					);
					material_data = material_data[1][0];

					checkDoneSession(student_id, material_data.session_id);
					return res.sendJson(200, true, "Successfully Submitted", {
						activity_detail,
						status: moment(date_submit).isAfter(deadline) ? LATE : GRADING,
					});
				});
			});
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
		const student_id = req.student_id;
		const assign = await Assignment.findOne({
			attributes: [
				"id",
				"content",
				"description",
				"file_assignment",
				"file_assignment_link",
				"duration",
				"created_at",
			],
			where: {
				session_id: session_id,
			},
		});

		const session = await Session.findOne({
			where: {
				id: session_id,
			},
		});

		const deadline = new Date(
			new Date(assign.created_at).getTime() + assign.duration * 1000
		);
		assign.dataValues.deadline = moment(deadline).format("DD/MM/YYYY hh:mm:ss");

		if (!assign) {
			return res.sendJson(400, false, "No assignment was assigned");
		}

		const student_taken_assignment = await MaterialEnrolled.findOne({
			where: {
				student_id: student_id,
				session_id: session_id,
				id_referrer: assign.id,
			},
		});
		if (!student_taken_assignment) {
			await MaterialEnrolled.create({
				student_id,
				session_id,
				subject_id: session.subject_id,
				description: "Assignment",
				status: ONGOING,
				id_referrer: assign.id,
				type: ASSIGNMENT,
			});
		}
		let result = {
			assignment: assign,
			students_work: student_taken_assignment,
		};
		return res.sendJson(200, true, "Success", result);
	}),
	/**
	 * @desc      Get Assignment
	 * @route     POST /api/v1/assignment/:assignment_id
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
	 * @route     put /api/v1/assignment/:session_id
	 * @access    Private
	 */
	updateAssignment: asyncHandler(async (req, res) => {
		const { session_id } = req.params;
		const student_id = req.student_id;
		const storage = getStorage();
		const bucket = admin.storage().bucket();

		const exist = await MaterialEnrolled.findOne({
			where: {
				student_id: student_id,
				session_id: session_id,
			},
		});

		if (!exist) {
			return res.status(404).json({
				success: false,
				message: "Assignment not found",
				data: {},
			});
		}

		if (exist.activity_detail.file_assignment) {
			deleteObject(
				ref(storage, `document_assignment/${exist.file_assignment}`)
			);
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
					await MaterialEnrolled.update(
						{
							activity_detail: null,
							status: ONGOING,
						},
						{
							where: {
								session_id: session_id,
								student_id: student_id,
							},
						}
					);
				});
			});
		return res.sendJson(200, true, "Success");
	}),
	/**
	 * @desc      Delete submission
	 * @route     DELETE /api/v1/assignment/delete/:session_id
	 * @access    Private (Admin)
	 */
	removeSubmission: asyncHandler(async (req, res, next) => {
		const { session_id } = req.params;
		const student_id = req.student_id;
		const storage = getStorage();

		const exist = await MaterialEnrolled.findOne({
			attributes: ["activity_detail"],
			where: {
				student_id: student_id,
				session_id: session_id,
			},
		});

		if (!exist) {
			return res.status(404).json({
				success: false,
				message: "Assignment not found",
				data: {},
			});
		}
		if (exist.activity_detail) {
			deleteObject(
				ref(
					storage,
					`document_assignment/${exist.activity_detail.file_assignment}`
				)
			);
		}

		await MaterialEnrolled.update(
			{
				activity_detail: null,
				status: ONGOING,
			},
			{
				where: {
					session_id: session_id,
					student_id: student_id,
				},
			}
		);

		return res.status(200).json({
			success: true,
			message: "Submission Removed",
		});
	}),
};
