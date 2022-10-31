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
			attributes: ["created_at"],
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
					let date_submit = moment().tz("Asia/Jakarta");
					const deadline = moment(
						new Date(
							new Date(material_data.created_at).getTime() +
								assign.duration * 1000
						)
					);
					const activity_detail = {
						date_submit: date_submit.format("DD/MM/YYYY hh:mm:ss"),
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
	 * @desc      Update file assignment
	 * @route     PUT /api/v1/assignment/edit/:session_id
	 * @access    Private
	 */
	updateAssignment: asyncHandler(async (req, res) => {
		const { session_id } = req.params;
		const student_id = req.student_id;
		const bucket = admin.storage().bucket();
		const storage = getStorage();
		const assign = await Assignment.findOne({
			where: {
				session_id,
			},
		});
		if (!assign) {
			return res.sendJson(404, false, "session id not found");
		}

		const checkFile = await MaterialEnrolled.findOne({
			where: {
				session_id,
				student_id,
				type: ASSIGNMENT,
			},
		});

		//*check for deleta a file
		checkFileIfExistFirebase(res, checkFile.activity_detail.file_assignment);
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
							new Date(checkFile.created_at).getTime() + assign.duration * 1000
						)
					);
					const date_submit = moment().tz("Asia/Jakarta");
					const activity_detail = {
						date_submit: date_submit.format("DD/MM/YYYY hh:mm:ss"),
						file_assignment: file_assignment,
						file_assignment_link: linkFile,
					};
					let check_file = await MaterialEnrolled.update(
						{
							activity_detail: activity_detail,
							status: moment(date_submit).isAfter(deadline) ? LATE : GRADING,
						},
						{
							where: {
								student_id,
								session_id,
								type: ASSIGNMENT,
							},
							returning: true,
						}
					);
					checkDoneSession(student_id, check_file[1][0].session_id);
					return res.sendJson(200, true, "Successfully Updated the File", {
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
		let assign = await Assignment.findOne({
			attributes: [
				"id",
				"content",
				"description",
				"file_assignment",
				"file_assignment_link",
				"duration",
			],
			where: {
				session_id: session_id,
			},
		});
		assign.file_assignment = assign.file_assignment.slice(59);

		const session = await Session.findOne({
			where: {
				id: session_id,
			},
		});

		if (!assign) {
			return res.sendJson(400, false, "No assignment was assigned");
		}

		const student_taken_assignment = await MaterialEnrolled.findOne({
			attributes: {
				include: ["created_at"],
			},
			where: {
				student_id: student_id,
				session_id: session_id,
				id_referrer: assign.id,
			},
		});
		if (!student_taken_assignment) {
			const material_enrolled = await MaterialEnrolled.create({
				student_id,
				session_id,
				subject_id: session.subject_id,
				description: "Assignment",
				status: ONGOING,
				id_referrer: assign.id,
				type: ASSIGNMENT,
			});
			const deadline = new Date(
				new Date(material_enrolled.created_at).getTime() +
					assign.duration * 1000
			);
			assign.dataValues.deadline = moment(deadline).format(
				"DD/MM/YYYY hh:mm:ss"
			);
		} else {
			const deadline = new Date(
				new Date(student_taken_assignment.created_at).getTime() +
					assign.duration * 1000
			);
			assign.dataValues.deadline = moment(deadline).format(
				"DD/MM/YYYY hh:mm:ss"
			);
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
	 * @desc      Get Assignment ongoing
	 * @route     GET /api/v1/assignment/ongoing
	 * @access    Private
	 */
	getAssignmentOngoing: asyncHandler(async (req, res) => {
		const student_id = req.student_id;
		const enr_data = await MaterialEnrolled.findAll({
			where: {
				student_id,
				status: ONGOING,
				type: ASSIGNMENT,
			},
			attributes: { include: ["created_at"] },
		});

		let result = [];
		for (let i = 0; i < enr_data.length; i++) {
			let curr_assign = await Assignment.findOne({
				where: {
					id: enr_data[i].id_referrer,
				},
			});
			const deadline = moment(
				new Date(
					new Date(enr_data[i].created_at).getTime() +
						curr_assign.duration * 1000
				)
			);

			result.push({
				assignment: curr_assign,
				start_date: enr_data[i].created_at,
				duration: curr_assign.duration,
				deadline: deadline,
			});
		}
		res.sendJson(200, true, "Success", result);
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
					type: ASSIGNMENT,
				},
			}
		);

		return res.status(200).json({
			success: true,
			message: "Submission Removed",
		});
	}),
};

const checkFileIfExistFirebase = async (res, data) => {
	const storage = getStorage();
	if (data) {
		await deleteObject(ref(storage, data))
			.then(() => {
				return console.log("success deleteObject");
			})
			.catch(() => {
				return res.sendJson(200, true, "file data was deleted");
			});
	}
};
