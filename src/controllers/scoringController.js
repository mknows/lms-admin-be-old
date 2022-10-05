const {
	Student,
	MajorSubject,
	StudentSubject,
	Materials_Enrolled,
	Subject,
	StudentSession,
} = require("../models");
require("dotenv").config({ path: __dirname + "/controllerconfig.env" });
const {
	WEIGHT_A,
	WEIGHT_A_MINUS,
	WEIGHT_B_PLUS,
	WEIGHT_B,
	WEIGHT_B_MINUS,
	WEIGHT_C_PLUS,
	WEIGHT_C,
	WEIGHT_C_MINUS,
	WEIGHT_D,
	WEIGHT_E,

	DRAFT,
	PENDING,
	ONGOING,
	GRADING,
	PASSED,
	FAILED,
	FINISHED,

	FLOOR_A,
	FLOOR_A_MINUS,
	FLOOR_B_PLUS,
	FLOOR_B,
	FLOOR_B_MINUS,
	FLOOR_C_PLUS,
	FLOOR_C,
	FLOOR_D,
	FLOOR_E,
} = process.env;
const asyncHandler = require("express-async-handler");

module.exports = {
	/**
	 * @desc      calculate final gpa
	 * @access    Private
	 */
	getGPA: asyncHandler(async (student_id) => {
		let score = 0;
		let total_cred = 0;

		let enr = await StudentSubject.findAll({
			where: {
				student_id: student_id,
				status: GRADING,
			},
		});

		for (let i = 0; i < enr.length; i++) {
			let cursub = await Subject.findOne({
				id: enr[i].subject_id,
			});
			score += scoreByLetter(enr[i].final_score, cursub.credit);
			total_cred += cursub.credit;
		}

		return score / total_cred;
	}),

	/**
	 * @desc      calculate progress in a subject
	 * @access    Private
	 */
	getProgress: asyncHandler(async (student_id, subject_id) => {
		let progress = 0;

		let done = await StudentSession.findAll({
			where: {
				student_id: student_id,
				present: true,
			},
		});

		let total = await Session.findAll({
			where: {
				subject_id: subject_id,
			},
		});

		progress = done.length / total.length;

		return progress;
	}),
};

function letterByPercent(percent) {
	if (percent >= parseFloat(FLOOR_A)) {
		return "A";
	} else if (percent >= parseFloat(FLOOR_A_MINUS)) {
		return "A-";
	} else if (percent >= parseFloat(FLOOR_B_PLUS)) {
		return "B+";
	} else if (percent >= parseFloat(FLOOR_B)) {
		return "B";
	} else if (percent >= parseFloat(FLOOR_B_MINUS)) {
		return "B-";
	} else if (percent >= parseFloat(FLOOR_C_PLUS)) {
		return "C+";
	} else if (percent >= parseFloat(FLOOR_C)) {
		return "C";
	} else if (percent >= parseFloat(FLOOR_D)) {
		return "D";
	} else if (percent >= parseFloat(FLOOR_E)) {
		return "E";
	}
	return null;
}

function GPAByLetter(letter, credit) {
	if (letter === "A") {
		return parseFloat(WEIGHT_A) * credit;
	} else if (letter === "A-") {
		return parseFloat(WEIGHT_A_MINUS) * credit;
	} else if (letter === "B+") {
		return parseFloat(WEIGHT_B_PLUS) * credit;
	} else if (letter === "B") {
		return parseFloat(WEIGHT_B) * credit;
	} else if (letter === "B-") {
		return parseFloat(WEIGHT_B_MINUS) * credit;
	} else if (letter === "C+") {
		return parseFloat(WEIGHT_C_PLUS) * credit;
	} else if (letter === "C") {
		return parseFloat(WEIGHT_C) * credit;
	} else if (letter === "C-") {
		return parseFloat(WEIGHT_C_MINUS) * credit;
	} else if (letter === "D") {
		return parseFloat(WEIGHT_D) * credit;
	} else if (letter === "E") {
		return parseFloat(WEIGHT_E) * credit;
	}
	return null;
}
