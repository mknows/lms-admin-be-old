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
const admin = require("firebase-admin");

module.exports = {
	/**
	 * @desc      delete all user
	 * @route     DELETE /api/v1/auth/nukeusers
	 * @access    Public
	 */
	deleteAllFirebaseUser: asyncHandler(async (req, res) => {
		const { password } = req.body;
		const { users } = await admin.auth().listUsers(1000);
		const actual_password = "lukas123321passworddeleteuserdarifirebase";

		if (password === actual_password) {
			return res.sendJson(401, false, "wrong pass bro");
		}

		users.map(async (user) => {
			// KODE HARAM
			await admin.auth().deleteUser(user.uid);
		});

		return res.json({ users });
	}),

	/**
	 * @desc      delete all user
	 * @route     DELETE /api/v1/auth/nukeusers
	 * @access    Public
	 */
	makeUserToStudent: asyncHandler(async (req, res) => {
		const { password, user_id } = req.body;
		const actual_password = "lukas123321passwordconvertusertostudent";

		// if (password === actual_password) {
		// 	return res.sendJson(401, false, "wrong pass bro");
		// }

		const stud = await Student.create({
			user_id: user_id,
			semester: 1,
			supervisor: user_id,
		});

		return res.sendJson(200, true, "message", stud);
	}),

	/**
	 * @desc      delete all user
	 * @route     DELETE /api/v1/auth/nukeusers
	 * @access    Public
	 */
	gradeAssignment: asyncHandler(async (req, res) => {
		const { materialenrolled_id, status, score } = req.body;

		let assignment = await MaterialEnrolled.find({
			where: {
				id: materialenrolled_id,
			},
		});

		if (assignment === null || assignment.type != "ASSIGNMENT") {
			return res.sendJson(404, false, "No assignment found", assignment);
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

		return res.sendJson(
			200,
			true,
			"Successfully graded assignment",
			assignment
		);
	}),

	/**
	 * @desc      delete all user
	 * @route     DELETE /api/v1/auth/nukeusers
	 * @access    Public
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
			return res.sendJson(404, false, "No PENDING plan found", plan);
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

		return res.sendJson(
			200,
			true,
			"Successfully graded assignment",
			assignment
		);
	}),
};
