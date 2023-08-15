const { fromBuffer } = require("pdf2pic");
const {
	Subject,
	Session,
	Module,
	Quiz,
	Assignment,
	Document,
	Video,
	Student,
	Major,
	MaterialEnrolled,
	StudentSubject,
} = require("../models");
require("dotenv").config();
const {
	DRAFT,
	PENDING,
	ONGOING,
	GRADING,
	PASSED,
	FAILED,
	FINISHED,
	ABANDONED,

	MAX_CREDIT,
} = process.env;
const asyncHandler = require("express-async-handler");
const { STATUS_CODES } = require("http");
const { Op } = require("sequelize");

module.exports = {
	/**
	 * @desc      make user student
	 * @route     POST /api/v1/studentmanagement/makeuser/student
	 * @access    Admin
	 */
	makeUserToStudent: asyncHandler(async (req, res) => {
		const { password, user_id } = req.body;

		const stud = await Student.create({
			user_id: user_id,
			semester: 1,
			supervisor: user_id,
		});

		return res.sendJson(200, true, "SUCCESS_MAKE_STUDENT", stud);
	}),

	/**
	 * @desc      grade assignment
	 * @route     PUT /api/v1/studentmanagement/nukeusers
	 * @access    Admin
	 */
	gradeAssignment: asyncHandler(async (req, res) => {
		const { materialenrolled_id, status, score } = req.body;

		let assignment = await MaterialEnrolled.find({
			where: {
				id: materialenrolled_id,
			},
		});

		if (assignment === null || assignment.type != "ASSIGNMENT") {
			return res.sendJson(404, false, "ASSIGNMENT_NOT_FOUND", assignment);
		}

		assignment = await MaterialEnrolled.update(
			{
				status: status,
				score: score,
			},
			{
				where: {
					id: materialenrolled_id,
				},
			}
		);

		return res.sendJson(200, true, "SUCCESS_GRADE_ASSIGNMENT", assignment);
	}),

	/**
	 * @desc      PUT all user
	 * @route     PUT /api/v1/studentmanagement/accept
	 * @access    Admin
	 */
	acceptStudentStudyPlan: asyncHandler(async (req, res) => {
		const { student_id } = req.body;

		let plan = await StudentSubject.findAll({
			where: {
				student_id: student_id,
				status: PENDING,
			},
		});
		if (plan === null) {
			return res.sendJson(404, false, "PENDING_STUDYPLAN_NOT_FOUND", plan);
		}

		plan = await StudentSubject.update(
			{
				status: ONGOING,
			},
			{
				where: {
					student_id: student_id,
					status: PENDING,
				},
			}
		);

		return res.sendJson(200, true, "SUCCESS_ACCEPT_STUDYPLAN", plan);
	}),

	/**
	 * @desc      get pending study plans of students
	 * @route     DELETE /api/v1/studentmanagement/studentsubjects/pending
	 * @access    Admin
	 */
	getStudyPlan: asyncHandler(async (req, res) => {
		const { subject_status } = req.body;

		let whereClause = {};
		if (subject_status !== undefined || subject_status === []) {
			whereClause = {
				status: {
					[Op.or]: statusTagQueryBuilder(subject_status),
				},
			};
		}

		const studentPlans = await Student.findAll({
			include: {
				model: StudentSubject,
				where: whereClause,
			},
		});

		return res.sendJson(200, true, "SUCCESS_GET_STUDYPLAN", studentPlans);
	}),
};

function statusTagQueryBuilder(status_list) {
	let status = [];
	for (let i = 0; i < status_list.length; i++) {
		switch (status_list[i]) {
			case "DRAFT":
				status.push(DRAFT);
			case "PENDING":
				status.push(PENDING);
			case "ONGOING":
				status.push(ONGOING);
			case "GRADING":
				status.push(GRADING);
			case "PASSED":
				status.push(PASSED);
			case "FAILED":
				status.push(FAILED);
			case "FINISHED":
				status.push(FINISHED);
			case "ABANDONED":
				status.push(ABANDONED);
		}
	}
	return status;
}
