const {
	Assignment,
	Material,
	MaterialEnrolled,
	Subject,
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
require("dotenv").config();
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
			attributes: [
				"created_at",
				"id",
				"duration",
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

		if (!assign) {
			return res.sendJson(400, false, "Assignment not found");
		}

		let student_taken_assignment = await MaterialEnrolled.findOne({
			attributes: ["created_at"],
			where: {
				id_referrer: assign.id,
				student_id,
			},
		});
		if (!student_taken_assignment) {
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
					const activity_detail = {
						date_submit: date_submit.format("DD/MM/YYYY hh:mm:ss"),
						file_assignment: file_assignment,
						file_assignment_link: linkFile,
					};
					const deadline = new Date(
						new Date(student_taken_assignment.created_at).getTime() +
							assign.duration * 1000
					);
					assign.dataValues.deadline = moment(deadline).format(
						"DD/MM/YYYY hh:mm:ss"
					);
					student_taken_assignment = await MaterialEnrolled.update(
						{
							activity_detail: activity_detail,
							status: moment(date_submit).isAfter(deadline) ? LATE : GRADING,
						},
						{
							where: {
								id_referrer: assign.id,
								student_id,
								type: ASSIGNMENT,
							},
							returning: true,
						}
					);
					student_taken_assignment = student_taken_assignment[1][0];

					await checkDoneSession(
						student_id,
						student_taken_assignment.session_id
					);

					let result = {
						assignment: assign,
						students_work: student_taken_assignment || null,
					};
					return res.sendJson(200, true, "Successfully Submitted", result);
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

		let student_taken_assignment = await MaterialEnrolled.findOne({
			attributes: ["created_at"],
			where: {
				session_id,
				student_id,
				type: ASSIGNMENT,
			},
		});

		//*check for deleta a file
		checkFileIfExistFirebase(
			res,
			student_taken_assignment.activity_detail?.file_assignment
		);
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
							new Date(student_taken_assignment.created_at).getTime() +
								assign.duration * 1000
						)
					);
					assign.dataValues.deadline = moment(deadline).format(
						"DD/MM/YYYY hh:mm:ss"
					);
					const date_submit = moment().tz("Asia/Jakarta");
					const activity_detail = {
						date_submit: date_submit.format("DD/MM/YYYY hh:mm:ss"),
						file_assignment: file_assignment,
						file_assignment_link: linkFile,
					};
					student_taken_assignment = await MaterialEnrolled.update(
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
					student_taken_assignment = student_taken_assignment[1][0];
					await checkDoneSession(
						student_id,
						student_taken_assignment.session_id
					);

					let result = {
						assignment: assign,
						students_work: student_taken_assignment || null,
					};

					return res.sendJson(
						200,
						true,
						"Successfully Updated the File",
						result
					);
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
				"created_at",
				"id",
				"session_id",
				"duration",
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

		const session = await Session.findOne({
			where: {
				id: session_id,
			},
		});

		if (!assign) {
			return res.sendJson(400, false, "No assignment was assigned");
		}

		let student_taken_assignment = await MaterialEnrolled.findOne({
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
			student_taken_assignment = await MaterialEnrolled.create({
				student_id,
				session_id,
				subject_id: session.subject_id,
				description: "Assignment",
				status: ONGOING,
				id_referrer: assign.id,
				type: ASSIGNMENT,
			});
			const deadline = new Date(
				new Date(student_taken_assignment.created_at).getTime() +
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

		if (student_taken_assignment?.activity_detail?.file_assignment)
			student_taken_assignment.activity_detail.file_assignment =
				student_taken_assignment.activity_detail.file_assignment.substr(59);

		let result = {
			assignment: assign,
			students_work: student_taken_assignment || null,
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
		return res.sendJson(200, true, "Success", result);
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

		const assign = await Assignment.findOne({
			attributes: [
				"created_at",
				"id",
				"duration",
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

		if (!assign) {
			return res.sendJson(400, false, "Assignment not found");
		}

		let student_taken_assignment = await MaterialEnrolled.findOne({
			attributes: ["created_at"],
			where: {
				student_id: student_id,
				session_id: session_id,
			},
		});

		if (student_taken_assignment.activity_detail) {
			deleteObject(
				ref(
					storage,
					`document_assignment/${exist.activity_detail.file_assignment}`
				)
			);
		}

		student_taken_assignment = await MaterialEnrolled.update(
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
				returning: true,
			}
		);
		let result = {
			assignment: assign,
			students_work: student_taken_assignment[1][0],
		};

		return res.status(200).json({
			success: true,
			message: "Submission Removed",
			result,
		});
	}),
	/**
	 * @desc      get submission data
	 * @route     GET /api/v1/assignment/submissiondata
	 * @access    Private
	 */
	getAllSubmissionFiltered: asyncHandler(async (req, res) => {
		const student_id = req.student_id;

		let result = await getAllAssignmentSubmissionFiltered(student_id);

		return res.sendJson(200, true, "Success", result);
	}),
	/**
	 * @desc      grade a submission
	 * @route     PUT /api/v1/assignment/lecturer/grade
	 * @access    Private (Admin)
	 */
	gradeSubmission: asyncHandler(async (req, res) => {
		const { material_enrolled_id, student_id, score } = req.body;
		let status;

		let submission_data = await MaterialEnrolled.findOne({
			where: {
				id: material_enrolled_id,
				student_id: student_id,
			},
		});

		if (submission_data.type != ASSIGNMENT) {
			return res.sendJson(
				400,
				false,
				"Submission data is not an Assignment",
				{}
			);
		}

		status = submission_data.status;
		if (status == GRADING) {
			status = FINISHED;
		}

		if (submission_data.type != ASSIGNMENT) {
			return res.sendJson(
				400,
				false,
				"Submission data is not an Assignment",
				{}
			);
		}

		let date_present = moment()
			.tz("Asia/Jakarta")
			.format("DD/MM/YYYY hh:mm:ss");

		submission_data = await MaterialEnrolled.update(
			{
				status,
				score,
				date_present,
			},
			{
				where: {
					id: material_enrolled_id,
					student_id: student_id,
				},
				returning: true,
			}
		);
		let result = submission_data[1][0].dataValues;

		await checkDoneSession(student_id, result.session_id);

		return res.sendJson(200, true, "Successfully graded assignment", result);
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

const getAllAssignmentSubmissionFiltered = async (student_id) => {
	const all_data = await Promise.all([
		await MaterialEnrolled.findAll({
			attributes: {
				include: ["created_at"],
			},
			where: {
				student_id,
				status: ONGOING,
				type: ASSIGNMENT,
			},
			include: [
				{
					model: Assignment,
					attributes: ["content", "duration"],
				},
				{
					model: Session,
					attributes: ["session_no"],
				},
				{
					model: Subject,
					attributes: ["name"],
				},
			],
		}),
		await MaterialEnrolled.findAll({
			attributes: {
				include: ["created_at"],
			},
			where: {
				student_id,
				status: GRADING,
				type: ASSIGNMENT,
			},
			include: [
				{
					model: Assignment,
					attributes: ["content", "duration"],
				},
				{
					model: Session,
					attributes: ["session_no"],
				},
				{
					model: Subject,
					attributes: ["name"],
				},
			],
		}),
		await MaterialEnrolled.findAll({
			attributes: {
				include: ["created_at"],
			},
			where: {
				student_id,
				status: FINISHED,
				type: ASSIGNMENT,
			},
			include: [
				{
					model: Assignment,
					attributes: ["content", "duration"],
				},
				{
					model: Session,
					attributes: ["session_no"],
				},
				{
					model: Subject,
					attributes: ["name"],
				},
			],
		}),
		await MaterialEnrolled.findAll({
			attributes: {
				include: ["created_at"],
			},
			where: {
				student_id,
				status: LATE,
				type: ASSIGNMENT,
			},
			include: [
				{
					model: Assignment,
					attributes: ["content", "duration"],
				},
				{
					model: Session,
					attributes: ["session_no"],
				},
				{
					model: Subject,
					attributes: ["name"],
				},
			],
		}),
	]);

	for (i = 0; i < all_data.length; i++) {
		all_data[i].forEach((element) => {
			const deadline = moment(
				new Date(
					new Date(element.created_at).getTime() +
						element.Assignment.duration * 1000
				)
			).format("DD/MM/YYYY hh:mm:ss");
			element.dataValues.deadline = deadline;
		});
	}

	return {
		ongoing: all_data[0],
		grading: all_data[1],
		finished: all_data[2],
		late: all_data[3],
	};
};
